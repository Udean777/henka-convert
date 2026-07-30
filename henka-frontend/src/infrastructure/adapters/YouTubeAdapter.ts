import type { ConverterContext, ConverterPort } from '../../core/ports/ConverterPort'
import { createSmoothProgress } from '../../core/utils/progress'

export class YouTubeAdapter implements ConverterPort {
  canHandle(sourceExt: string, targetExt: string): boolean {
    return (
      sourceExt === 'youtube' && ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(targetExt)
    )
  }

  convert(context: ConverterContext): void {
    // Baca URL dari dalam file dummy yang kita buat di store
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      this.executeXHR(url, context)
    }
    reader.onerror = () => {
      context.onError('Gagal membaca URL dari memori')
    }
    reader.readAsText(context.file)
  }

  private executeXHR(url: string, context: ConverterContext) {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:8080/api/convert/youtube`, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'blob'

    const smoothProgress = createSmoothProgress(context.onProgress, context.onSuccess)

    xhr.onload = () => {
      if (xhr.status === 200) {
        let fileName = undefined
        const disposition = xhr.getResponseHeader('Content-Disposition')
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '')
          }
        }
        smoothProgress.finish(URL.createObjectURL(xhr.response), fileName)
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
      context.onError('Koneksi terputus')
    }

    xhr.send(JSON.stringify({ url, format: context.targetExt }))
  }
}
