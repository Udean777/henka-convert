import type { Format, ConversionPath } from './types'
import { ProcessingTier } from './types'

export const SUPPORTED_FORMATS: Record<string, Format> = {
  // Images
  jpg: { extension: 'jpg', mimeType: 'image/jpeg', label: 'JPEG Image', category: 'Image' },
  png: { extension: 'png', mimeType: 'image/png', label: 'PNG Image', category: 'Image' },
  webp: { extension: 'webp', mimeType: 'image/webp', label: 'WebP Image', category: 'Image' },
  bmp: { extension: 'bmp', mimeType: 'image/bmp', label: 'BMP Image', category: 'Image' },
  tiff: { extension: 'tiff', mimeType: 'image/tiff', label: 'TIFF Image', category: 'Image' },
  ico: { extension: 'ico', mimeType: 'image/x-icon', label: 'ICO Icon', category: 'Image' },
  svg: { extension: 'svg', mimeType: 'image/svg+xml', label: 'SVG Vector', category: 'Image' },
  heic: { extension: 'heic', mimeType: 'image/heic', label: 'HEIC Image', category: 'Image' },
  eps: {
    extension: 'eps',
    mimeType: 'application/postscript',
    label: 'EPS Vector',
    category: 'Image',
  },

  // Documents & Data
  pdf: {
    extension: 'pdf',
    mimeType: 'application/pdf',
    label: 'PDF Document',
    category: 'Document',
  },
  docx: {
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word Document',
    category: 'Document',
  },
  doc: {
    extension: 'doc',
    mimeType: 'application/msword',
    label: 'Word (Legacy)',
    category: 'Document',
  },
  rtf: {
    extension: 'rtf',
    mimeType: 'application/rtf',
    label: 'Rich Text Format',
    category: 'Document',
  },
  txt: { extension: 'txt', mimeType: 'text/plain', label: 'Plain Text', category: 'Document' },
  odt: {
    extension: 'odt',
    mimeType: 'application/vnd.oasis.opendocument.text',
    label: 'OpenDocument Text',
    category: 'Document',
  },
  html: { extension: 'html', mimeType: 'text/html', label: 'HTML Document', category: 'Document' },
  epub: {
    extension: 'epub',
    mimeType: 'application/epub+zip',
    label: 'EPUB eBook',
    category: 'Document',
  },
  xlsx: {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel Spreadsheet',
    category: 'Data',
  },
  xls: {
    extension: 'xls',
    mimeType: 'application/vnd.ms-excel',
    label: 'Excel (Legacy)',
    category: 'Data',
  },
  ods: {
    extension: 'ods',
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet',
    label: 'OpenDocument Spreadsheet',
    category: 'Data',
  },
  csv: { extension: 'csv', mimeType: 'text/csv', label: 'CSV Data', category: 'Data' },
  json: { extension: 'json', mimeType: 'application/json', label: 'JSON Data', category: 'Data' },
  pptx: {
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    label: 'PowerPoint',
    category: 'Document',
  },
  ppt: {
    extension: 'ppt',
    mimeType: 'application/vnd.ms-powerpoint',
    label: 'PowerPoint (Legacy)',
    category: 'Document',
  },
  odp: {
    extension: 'odp',
    mimeType: 'application/vnd.oasis.opendocument.presentation',
    label: 'OpenDocument Presentation',
    category: 'Document',
  },

  // Audio
  mp3: { extension: 'mp3', mimeType: 'audio/mpeg', label: 'MP3 Audio', category: 'Audio' },
  wav: { extension: 'wav', mimeType: 'audio/wav', label: 'WAV Audio', category: 'Audio' },
  flac: { extension: 'flac', mimeType: 'audio/flac', label: 'FLAC Audio', category: 'Audio' },
  aac: { extension: 'aac', mimeType: 'audio/aac', label: 'AAC Audio', category: 'Audio' },
  m4a: { extension: 'm4a', mimeType: 'audio/mp4', label: 'M4A Audio', category: 'Audio' },
  ogg: { extension: 'ogg', mimeType: 'audio/ogg', label: 'OGG Audio', category: 'Audio' },
  wma: { extension: 'wma', mimeType: 'audio/x-ms-wma', label: 'WMA Audio', category: 'Audio' },
  mka: { extension: 'mka', mimeType: 'audio/x-matroska', label: 'MKA Audio', category: 'Audio' },
  ac3: { extension: 'ac3', mimeType: 'audio/ac3', label: 'AC3 Audio', category: 'Audio' },
  opus: { extension: 'opus', mimeType: 'audio/opus', label: 'OPUS Audio', category: 'Audio' },
  aiff: { extension: 'aiff', mimeType: 'audio/aiff', label: 'AIFF Audio', category: 'Audio' },
  amr: { extension: 'amr', mimeType: 'audio/amr', label: 'AMR Audio', category: 'Audio' },
  au: { extension: 'au', mimeType: 'audio/basic', label: 'AU Audio', category: 'Audio' },

  // Video
  mp4: { extension: 'mp4', mimeType: 'video/mp4', label: 'MP4 Video', category: 'Video' },
  webm: { extension: 'webm', mimeType: 'video/webm', label: 'WebM Video', category: 'Video' },
  gif: { extension: 'gif', mimeType: 'image/gif', label: 'GIF Animation', category: 'Video' },
  avi: { extension: 'avi', mimeType: 'video/x-msvideo', label: 'AVI Video', category: 'Video' },
  mov: { extension: 'mov', mimeType: 'video/quicktime', label: 'MOV Video', category: 'Video' },
  mkv: { extension: 'mkv', mimeType: 'video/x-matroska', label: 'MKV Video', category: 'Video' },
  wmv: { extension: 'wmv', mimeType: 'video/x-ms-wmv', label: 'WMV Video', category: 'Video' },
  flv: { extension: 'flv', mimeType: 'video/x-flv', label: 'FLV Video', category: 'Video' },
  m4v: { extension: 'm4v', mimeType: 'video/x-m4v', label: 'M4V Video', category: 'Video' },
  '3gp': { extension: '3gp', mimeType: 'video/3gpp', label: '3GP Video', category: 'Video' },
  ts: { extension: 'ts', mimeType: 'video/mp2t', label: 'TS Video', category: 'Video' },
  vob: { extension: 'vob', mimeType: 'video/x-ms-vob', label: 'VOB Video', category: 'Video' },
}

const allSupportedKeys = Object.keys(SUPPORTED_FORMATS)

export const CONVERSION_PATHS: ConversionPath[] = [
  // Universal Conversions Matrix (Convertio style)
  ...allSupportedKeys.flatMap((from) =>
    allSupportedKeys
      .filter((to) => to !== from)
      .map((to) => {
        // Fast local tier for pure client-side basic image & data converts
        const isBasicImageLocal =
          ['jpg', 'png', 'webp'].includes(from) && ['jpg', 'png', 'webp'].includes(to)
        const isBasicDataLocal =
          ['csv', 'xlsx', 'json'].includes(from) && ['csv', 'xlsx', 'json'].includes(to)

        const tier =
          isBasicImageLocal || isBasicDataLocal ? ProcessingTier.TierA : ProcessingTier.TierB

        return { from, to, tier }
      }),
  ),
]
