import * as jpeg from '@jsquash/jpeg'
import * as png from '@jsquash/png'
import * as webp from '@jsquash/webp'

self.onmessage = async (e: MessageEvent) => {
  try {
    const { file, targetFormat } = e.data
    const arrayBuffer = await file.arrayBuffer()
    let imageData

    // 1. Decode
    if (file.type === 'image/jpeg') {
      imageData = await jpeg.decode(arrayBuffer)
    } else if (file.type === 'image/png') {
      imageData = await png.decode(arrayBuffer)
    } else if (file.type === 'image/webp') {
      imageData = await webp.decode(arrayBuffer)
    } else {
      throw new Error('Unsupported input format')
    }

    // 2. Encode
    let outBuffer: ArrayBuffer
    let mime: string

    if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
      outBuffer = await jpeg.encode(imageData)
      mime = 'image/jpeg'
    } else if (targetFormat === 'png') {
      outBuffer = await png.encode(imageData)
      mime = 'image/png'
    } else if (targetFormat === 'webp') {
      outBuffer = await webp.encode(imageData)
      mime = 'image/webp'
    } else {
      throw new Error('Unsupported output format')
    }

    const blob = new Blob([outBuffer], { type: mime })
    self.postMessage({ status: 'success', blob })
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message })
  }
}
