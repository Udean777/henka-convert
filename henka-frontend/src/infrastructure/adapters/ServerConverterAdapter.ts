import type { ConverterContext, ConverterPort } from '../../core/ports/ConverterPort'
import { createSmoothProgress } from '../../core/utils/progress'

export class ServerConverterAdapter implements ConverterPort {
  canHandle(sourceExt: string, targetExt: string): boolean {
    const isDoc = targetExt === 'pdf' && (sourceExt === 'docx' || sourceExt === 'xlsx')
    const isMedia = ['mp4', 'webm', 'gif', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(sourceExt) && ['mp4', 'webm', 'gif', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(targetExt)
    return isDoc || isMedia
  }

  convert(context: ConverterContext): void {
    const formData = new FormData()
    formData.append('file', context.file)
    formData.append('targetFormat', context.targetExt)

    const isMedia = ['mp4', 'webm', 'gif', 'mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(context.sourceExt)
    const endpoint = isMedia ? '/api/convert/video' : '/api/convert/document'

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:8080${endpoint}`, true)
    xhr.responseType = 'blob'

    const smoothProgress = createSmoothProgress(context.onProgress, context.onSuccess)

    xhr.onload = () => {
      if (xhr.status === 200) {
        smoothProgress.finish(URL.createObjectURL(xhr.response))
      } else {
        smoothProgress.error()
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const err = JSON.parse(reader.result as string)
            context.onError(err.error || 'Server conversion failed')
          } catch {
            context.onError('Server conversion failed')
          }
        }
        reader.readAsText(xhr.response)
      }
    }

    xhr.onerror = () => {
      smoothProgress.error()
      context.onError('Gagal terhubung ke server backend')
    }

    try {
      xhr.send(formData)
    } catch (err: any) {
      context.onError('Gagal menginisialisasi konversi')
    }
  }
}
