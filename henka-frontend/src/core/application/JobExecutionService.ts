import type { ConverterPort } from '../ports/ConverterPort'
import type { ConversionJob } from '../domain/job'
import { FormatRouter } from '../router'
import { ServerConverterAdapter } from '../../infrastructure/adapters/ServerConverterAdapter'
import { LocalWorkerAdapter } from '../../infrastructure/adapters/LocalWorkerAdapter'
import { YouTubeAdapter } from '../../infrastructure/adapters/YouTubeAdapter'

export class JobExecutionService {
  // Chain of Responsibility pattern: Cek dari yang paling spesifik (YouTube & Server) ke paling umum (Local Worker)
  private adapters: ConverterPort[] = [
    new YouTubeAdapter(),
    new ServerConverterAdapter(),
    new LocalWorkerAdapter(),
  ]

  execute(job: ConversionJob, updateJob: (patch: Partial<ConversionJob>) => void) {
    if (!job.targetFormat) return

    const sourceExt = FormatRouter.getExtension(job.file.name) || ''
    const targetExt = job.targetFormat.extension

    updateJob({ status: 'PROCESSING', progress: 10, error: null })

    const adapter = this.adapters.find((a) => a.canHandle(sourceExt, targetExt))
    if (!adapter) {
      updateJob({ status: 'ERROR', progress: 0, error: 'No converter available for this format' })
      return
    }

    adapter.convert({
      file: job.file,
      sourceExt,
      targetExt,
      onProgress: (p) => updateJob({ progress: p }),
      onSuccess: (url, name) =>
        updateJob({ status: 'COMPLETED', progress: 100, resultUrl: url, resultName: name }),
      onError: (err) => updateJob({ status: 'ERROR', progress: 0, error: err }),
    })
  }
}
