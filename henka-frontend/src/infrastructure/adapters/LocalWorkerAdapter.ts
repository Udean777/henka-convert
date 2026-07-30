import type { ConverterContext, ConverterPort } from '../../core/ports/ConverterPort'
import { createSmoothProgress } from '../../core/utils/progress'
import ImageWorker from '../workers/imageConverter.worker?worker'
import DataWorker from '../workers/dataConverter.worker?worker'

export class LocalWorkerAdapter implements ConverterPort {
  canHandle(sourceExt: string, targetExt: string): boolean {
    // Karena ini diletakkan terakhir di list service, ia akan menangani sisa tipe file.
    // Atau bisa dicek spesifik: ['jpg', 'png', 'webp', 'csv', 'xlsx', 'json']
    return true
  }

  convert(context: ConverterContext): void {
    const isData = ['csv', 'xlsx', 'json'].includes(context.sourceExt)
    const worker = isData ? new DataWorker() : new ImageWorker()

    const smoothProgress = createSmoothProgress(context.onProgress, context.onSuccess)

    worker.onmessage = (e) => {
      if (e.data.status === 'success') {
        smoothProgress.finish(URL.createObjectURL(e.data.blob))
      } else {
        smoothProgress.error()
        context.onError(e.data.error)
      }
      worker.terminate()
    }

    worker.onerror = () => {
      smoothProgress.error()
      context.onError('Worker initialization failed')
      worker.terminate()
    }

    worker.postMessage({
      file: context.file,
      sourceFormat: context.sourceExt,
      targetFormat: context.targetExt,
    })
  }
}
