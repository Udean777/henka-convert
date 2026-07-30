export interface ConverterContext {
  file: File
  sourceExt: string
  targetExt: string
  options?: Record<string, any>
  onProgress: (progress: number) => void
  onSuccess: (resultUrl: string, resultName?: string, resultSize?: number) => void
  onError: (error: string) => void
}

export interface ConverterPort {
  canHandle(sourceExt: string, targetExt: string): boolean
  convert(context: ConverterContext): void
}
