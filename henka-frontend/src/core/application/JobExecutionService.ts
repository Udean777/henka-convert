import type { ConverterPort } from '../ports/ConverterPort'
import type { ConversionJob } from '../domain/job'
import { FormatRouter } from '../router'
import { ServerConverterAdapter } from '../../infrastructure/adapters/ServerConverterAdapter'
import { LocalWorkerAdapter } from '../../infrastructure/adapters/LocalWorkerAdapter'
import { YouTubeAdapter } from '../../infrastructure/adapters/YouTubeAdapter'
import { ProcessingTier } from '../types'

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

    const tier = FormatRouter.getProcessingTier(sourceExt as any, targetExt as any)

    let adapter = this.adapters[0] // YouTubeAdapter is checked first if applicable
    if (job.file.name.endsWith('.youtube')) {
      adapter = this.adapters[0]
    } else if (tier === ProcessingTier.TierA) {
      adapter = this.adapters[2] // LocalWorker
    } else if (tier === ProcessingTier.TierB) {
      adapter = this.adapters[1] // Server
    } else {
      adapter = this.adapters.find((a) => a.canHandle(sourceExt, targetExt))
    }

    if (!adapter) {
      updateJob({ status: 'ERROR', progress: 0, error: 'No converter available for this format' })
      return
    }

    adapter.convert({
      file: job.file,
      sourceExt,
      targetExt,
      options: job.options,
      onProgress: (p) => updateJob({ progress: p }),
      onSuccess: (url, name, size) =>
        updateJob({
          status: 'COMPLETED',
          progress: 100,
          resultUrl: url,
          resultName: name,
          resultSize: size,
        }),
      onError: (err) => updateJob({ status: 'ERROR', progress: 0, error: err }),
    })
  }
}
