import type { FileExtension, Format } from './types'
import { ProcessingTier } from './types'
import { CONVERSION_PATHS as registryPaths, SUPPORTED_FORMATS } from './registry'

export class FormatRouter {
  /**
   * Dapatkan daftar format tujuan yang tersedia untuk suatu ekstensi input.
   */
  static getAvailableTargets(inputExt: FileExtension, fileMimeType?: string): Format[] {
    let cleanExt = inputExt.toLowerCase().replace('.', '')
    if (cleanExt === 'jpeg') cleanExt = 'jpg'

    const targetExts = registryPaths.filter((path) => path.from === cleanExt).map((path) => path.to)

    return targetExts.map((ext) => SUPPORTED_FORMATS[ext]).filter((format) => format !== undefined)
  }

  /**
   * Tentukan rute pemrosesan (Lokal atau Server) untuk konversi yang diminta.
   */
  static getProcessingTier(
    inputExt: FileExtension,
    targetExt: FileExtension,
  ): ProcessingTier | null {
    const cleanIn = inputExt.toLowerCase().replace('.', '')
    const cleanOut = targetExt.toLowerCase().replace('.', '')

    const path = registryPaths.find((p) => p.from === cleanIn && p.to === cleanOut)

    return path ? path.tier : null
  }

  /**
   * Mengekstrak ekstensi dari nama file
   */
  static getExtension(filename: string): FileExtension | null {
    const parts = filename.split('.')
    if (parts.length < 2) return null
    let ext = parts[parts.length - 1]?.toLowerCase() ?? null
    if (ext === 'jpeg') ext = 'jpg'
    return ext
  }
}
