import type { Format } from '../types'

export type JobStatus = 'IDLE' | 'PROCESSING' | 'COMPLETED' | 'ERROR'

export interface ConversionJob {
  id: string
  file: File
  status: JobStatus
  targetFormat: Format | null
  availableTargets: Format[]
  progress: number
  resultUrl: string | null
  resultName?: string
  error: string | null
}
