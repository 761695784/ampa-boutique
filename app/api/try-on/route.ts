import { NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'

type TryOnSuccess = {
  imageDataUrl: string
  engine: 'gemini' | 'idm-vton'
}

/**
 * Helper: Call a public Gradio Virtual Try-On Space (IDM-VTON) via standard HTTP + SSE.
 * Works 100% free without requiring Google Cloud paid billing.
 */
async function runFreeIdmVton(params: {
  spaceBaseUrl: string
  userBuffer: Buffer
  userMime: string
  suitBuffer: Buffer
  suitMime: string
  garmentDescription: string
  hfToken?: string
}): Promise<string | null> {
  const {
    spaceBaseUrl,
    userBuffer,
    userMime,
    suitBuffer,
    suitMime,
    garmentDescription,
    hfToken,
  } = params

  const authHeaders: Record<string, string> = hfToken
    ? { Authorization: `Bearer ${hfToken}` }
    : {}

  // Detect whether Space uses Gradio 5 (/gradio_api) or Gradio 4 root paths
  let apiPrefix = `${spaceBaseUrl}/gradio_api`
  const probe = await fetch(`${apiPrefix}/info`, {
    method: 'GET',
    headers: authHeaders,
    signal: AbortSignal.timeout(8000),
  }).catch(() => null)

  if (!probe || !probe.ok) {
    apiPrefix = spaceBaseUrl
  }

  const uploadSingle = async (buf: Buffer, mime: string, filename: string): Promise<string> => {
    const fd = new FormData()
    const blob = new Blob([new Uint8Array(buf)], { type: mime })
    fd.append('files', blob, filename)

    const upRes = await fetch(`${apiPrefix}/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: fd,
      signal: AbortSignal.timeout(20000),
    })
    if (!upRes.ok) {
      throw new Error(`Upload failed (${upRes.status})`)
    }
    const paths = (await upRes.json()) as string[]
    if (!Array.isArray(paths) || !paths[0]) {
      throw new Error('Empty upload path')
    }
    return paths[0]
  }

  const [humanServerPath, garmentServerPath] = await Promise.all([
    uploadSingle(userBuffer, userMime, 'client.jpg'),
    uploadSingle(suitBuffer, suitMime, 'ampa-suit.png'),
  ])

  const makeFileData = (p: string, mime: string) => ({
    path: p,
    meta: { _type: 'gradio.FileData' },
    mime_type: mime,
  })

  const callRes = await fetch(`${apiPrefix}/call/tryon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({
      data: [
        {
          background: makeFileData(humanServerPath, userMime),
          layers: [],
          composite: null,
        },
        makeFileData(garmentServerPath, suitMime),
        garmentDescription,
        true, // auto-masking
        true, // auto-crop & paste back
        30,   // denoise steps
        42,   // seed
      ],
    }),
    signal: AbortSignal.timeout(20000),
  })

  if (!callRes.ok) {
    throw new Error(`Queue call failed (${callRes.status})`)
  }

  const callJson = (await callRes.json()) as { event_id?: string }
  if (!callJson?.event_id) {
    throw new Error('Missing Gradio event_id')
  }

  // Stream SSE result (allow up to 90s for GPU queue + diffusion steps)
  const sseRes = await fetch(`${apiPrefix}/call/tryon/${callJson.event_id}`, {
    method: 'GET',
    headers: authHeaders,
    signal: AbortSignal.timeout(95000),
  })

  if (!sseRes.ok || !sseRes.body) {
    throw new Error(`SSE stream failed (${sseRes.status})`)
  }

  const sseText = await sseRes.text()
  const lines = sseText.split('\n')
  let lastEvent = ''

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('event:')) {
      lastEvent = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      const payloadStr = line.slice(5).trim()
      if (lastEvent === 'error') {
        throw new Error(payloadStr || 'Erreur GPU distante')
      }
      if (lastEvent === 'complete') {
        const parsed = JSON.parse(payloadStr)
        const firstOutput = Array.isArray(parsed) ? parsed[0] : parsed
        const remoteUrl: string | undefined =
          firstOutput?.url ||
          (firstOutput?.path
            ? `${apiPrefix}/file=${firstOutput.path}`
            : undefined)

        if (remoteUrl) {
          const imgRes = await fetch(remoteUrl, {
            headers: authHeaders,
            signal: AbortSignal.timeout(20000),
          })
          if (imgRes.ok) {
            const arr = await imgRes.arrayBuffer()
            const outMime = imgRes.headers.get('content-type') || 'image/webp'
            return `data:${outMime};base64,${Buffer.from(arr).toString('base64')}`
          }
        }
      }
    }
  }

  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      userPhotoDataUrl,
      suitImagePath,
      productName,
      colorName,
      fabric,
      cut,
      adminApiKey,
      hfToken: clientHfToken,
    } = body as {
      userPhotoDataUrl?: string
      suitImagePath?: string
      productName?: string
      colorName?: string
      fabric?: string
      cut?: string
      adminApiKey?: string
      hfToken?: string
    }

    if (!userPhotoDataUrl || !userPhotoDataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'INVALID_USER_PHOTO', message: 'Veuillez d’abord importer votre photo.' },
        { status: 400 }
      )
    }

    const match = userPhotoDataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
    if (!match) {
      return NextResponse.json(
        { error: 'INVALID_BASE64', message: 'Format de photo non reconnu.' },
        { status: 400 }
      )
    }
    const userMimeType = match[1]
    const userBase64 = match[2]
    const userBuffer = Buffer.from(userBase64, 'base64')

    // Read reference suit image from public/
    let suitBase64 = ''
    let suitMimeType = 'image/jpeg'
    let suitBuffer: Buffer = Buffer.alloc(0)

    if (suitImagePath && suitImagePath.startsWith('data:image/')) {
      const sMatch = suitImagePath.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
      if (sMatch) {
        suitMimeType = sMatch[1]
        suitBase64 = sMatch[2]
        suitBuffer = Buffer.from(suitBase64, 'base64')
      }
    } else if (suitImagePath) {
      const cleanRel = suitImagePath.replace(/^\//, '')
      const absSuitPath = path.join(process.cwd(), 'public', cleanRel)
      suitBuffer = await readFile(absSuitPath)
      suitBase64 = suitBuffer.toString('base64')
      if (suitBuffer[0] === 0x89 && suitBuffer[1] === 0x50) {
        suitMimeType = 'image/png'
      } else {
        suitMimeType = 'image/jpeg'
      }
    }

    const apiKey = (adminApiKey || process.env.GEMINI_API_KEY || '').trim()
    const hfToken = (clientHfToken || process.env.HF_TOKEN || '').trim()
    let geminiQuotaBlocked = false

    // ------------------------------------------------------------------
    // 1. PRIMARY ENGINE: Gemini Multimodal Image (if API key has quota)
    // ------------------------------------------------------------------
    if (apiKey) {
      const prompt = [
        'Photorealistic luxury menswear Virtual Try-On:',
        'Image 1 is the client. Image 2 is the reference tailored suit from Maison AMPA Dakar.',
        `Dress the exact person from Image 1 in the exact garment from Image 2 (${productName || 'Luxury tailored suit'}, color: ${colorName || 'classic'}, fabric: ${fabric || "Super 200's wool"}, cut: ${cut || 'tailored'}).`,
        'Preserve 100% of the client identity from Image 1 (exact face, skin tone, hair, expression, proportions).',
        'Reproduce the exact suit color, lapel, shirt, and tie from Image 2 in a warm sunlit luxury showroom in Dakar. Clean 3:4 portrait photograph, no text.',
      ].join('\n')

      const parts: Array<Record<string, unknown>> = [
        { inlineData: { mimeType: userMimeType, data: userBase64 } },
      ]
      if (suitBase64) {
        parts.push({ inlineData: { mimeType: suitMimeType, data: suitBase64 } })
      }
      parts.push({ text: prompt })

      for (const modelId of [
        'gemini-3.1-flash-image-preview',
        'gemini-3.1-flash-lite-image-preview',
      ]) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${encodeURIComponent(apiKey)}`
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          }),
        }).catch(() => null)

        if (response && response.ok) {
          const data = await response.json()
          const candidateParts = data?.candidates?.[0]?.content?.parts || []
          const imagePart = candidateParts.find(
            (p: { inlineData?: { mimeType?: string; data?: string } }) => p?.inlineData?.data
          )
          if (imagePart?.inlineData?.data) {
            const outMime = imagePart.inlineData.mimeType || 'image/png'
            const resPayload: TryOnSuccess = {
              imageDataUrl: `data:${outMime};base64,${imagePart.inlineData.data}`,
              engine: 'gemini',
            }
            return NextResponse.json(resPayload)
          }
        } else if (response && response.status === 429) {
          geminiQuotaBlocked = true
        }
      }
    }

    // ------------------------------------------------------------------
    // 2. AUTOMATIC FREE FALLBACK ENGINE: IDM-VTON (Hugging Face Spaces)
    //    Triggered automatically when GEMINI_API_KEY is on Free Tier (limit: 0)
    //    or not configured at all!
    // ------------------------------------------------------------------
    if (suitBuffer.length > 0) {
      const garmentDescription = `${productName || 'Luxury tailored men suit jacket'}, ${colorName || ''} ${fabric || 'wool bespoke blazer and shirt'}`.trim()

      const vtonSpaces = [
        'https://yisol-idm-vton.hf.space',
        'https://nymbo-virtual-try-on.hf.space',
      ]

      let lastVtonErr = ''
      for (const spaceUrl of vtonSpaces) {
        try {
          const vtonDataUrl = await runFreeIdmVton({
            spaceBaseUrl: spaceUrl,
            userBuffer,
            userMime: userMimeType,
            suitBuffer,
            suitMime: suitMimeType,
            garmentDescription,
            hfToken: hfToken || undefined,
          })
          if (vtonDataUrl) {
            const resPayload: TryOnSuccess = {
              imageDataUrl: vtonDataUrl,
              engine: 'idm-vton',
            }
            return NextResponse.json(resPayload)
          }
        } catch (vErr) {
          lastVtonErr = vErr instanceof Error ? vErr.message : String(vErr)
        }
      }

      // Friendly, non-technical French guidance if both engines hit free-tier limits
      const needsHfTokenHint =
        lastVtonErr.toLowerCase().includes('quota') ||
        lastVtonErr.toLowerCase().includes('zerogpu') ||
        lastVtonErr.includes('429')

      return NextResponse.json(
        {
          error: needsHfTokenHint ? 'FREE_GPU_QUOTA' : 'UPSTREAM_BUSY',
          message: geminiQuotaBlocked
            ? 'Votre clé Google AI Studio est sur le forfait Gratuit (« limit: 0 » : Google bloque la génération d’images sans facturation activée), et le serveur d’essayage gratuit de secours (IDM-VTON) est momentanément saturé. Ajoutez un jeton gratuit Hugging Face (HF_TOKEN, sans carte bancaire) ci-dessous ou réessayez dans 1 minute.'
            : 'Le moteur d’essayage gratuit (IDM-VTON) est momentanément très sollicité. Ajoutez un jeton gratuit Hugging Face (HF_TOKEN, 100 % gratuit sans carte bancaire) pour un accès prioritaire, ou réessayez dans un instant.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: 'NO_SUIT_IMAGE',
        message: 'Impossible de charger le visuel du costume sélectionné.',
      },
      { status: 400 }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error: 'INTERNAL_ERROR',
        message:
          err instanceof Error
            ? err.message
            : 'Erreur interne lors de la préparation de l’essayage.',
      },
      { status: 500 }
    )
  }
}
