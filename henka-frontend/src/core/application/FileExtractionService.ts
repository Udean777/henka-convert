import JSZip from 'jszip'

export class FileExtractionService {
  static async extractZip(file: File): Promise<File[]> {
    const extractedFiles: File[] = []
    try {
      const zip = new JSZip()
      const loadedZip = await zip.loadAsync(file)

      for (const [filename, zipEntry] of Object.entries(loadedZip.files)) {
        if (zipEntry.dir) continue
        if (filename.includes('__MACOSX/') || filename.split('/').pop()?.startsWith('.')) continue

        const blob = await zipEntry.async('blob')
        const cleanName = filename.split('/').pop() || filename
        extractedFiles.push(new File([blob], cleanName))
      }
    } catch (e) {
      console.error('Failed to extract zip:', e)
    }
    return extractedFiles
  }
}
