export type MimeType = string
export type FileExtension = string

export enum ProcessingTier {
  TierA = 'LOCAL',
  TierB = 'SERVER_ASSISTED',
}

export interface Format {
  extension: FileExtension
  mimeType: MimeType
  label: string
}

export interface ConversionPath {
  from: FileExtension
  to: FileExtension
  tier: ProcessingTier
  description?: string
}

export interface ConversionJob {
  id: string
  file: File
  targetFormat: FileExtension
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  resultUrl?: string
  tier: ProcessingTier
}
