export interface ConverterContext {
  file: File
  sourceExt: string
  targetExt: string
  onProgress: (progress: number) => void
  onSuccess: (resultUrl: string, resultName?: string) => void
  onError: (error: string) => void
}

export interface ConverterPort {
  canHandle(sourceExt: string, targetExt: string): boolean
  convert(context: ConverterContext): void
}
