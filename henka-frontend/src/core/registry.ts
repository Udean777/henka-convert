import type { Format, ConversionPath } from './types'
import { ProcessingTier } from './types'

export const SUPPORTED_FORMATS: Record<string, Format> = {
  // Images
  jpg: { extension: 'jpg', mimeType: 'image/jpeg', label: 'JPEG Image' },
  png: { extension: 'png', mimeType: 'image/png', label: 'PNG Image' },
  webp: { extension: 'webp', mimeType: 'image/webp', label: 'WebP Image' },
  bmp: { extension: 'bmp', mimeType: 'image/bmp', label: 'BMP Image' },
  tiff: { extension: 'tiff', mimeType: 'image/tiff', label: 'TIFF Image' },
  ico: { extension: 'ico', mimeType: 'image/x-icon', label: 'ICO Icon' },
  svg: { extension: 'svg', mimeType: 'image/svg+xml', label: 'SVG Vector' },
  heic: { extension: 'heic', mimeType: 'image/heic', label: 'HEIC Image' },
  eps: { extension: 'eps', mimeType: 'application/postscript', label: 'EPS Vector' },

  // Documents
  pdf: { extension: 'pdf', mimeType: 'application/pdf', label: 'PDF Document' },
  docx: {
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word Document',
  },
  doc: { extension: 'doc', mimeType: 'application/msword', label: 'Word (Legacy)' },
  rtf: { extension: 'rtf', mimeType: 'application/rtf', label: 'Rich Text Format' },
  txt: { extension: 'txt', mimeType: 'text/plain', label: 'Plain Text' },
  odt: {
    extension: 'odt',
    mimeType: 'application/vnd.oasis.opendocument.text',
    label: 'OpenDocument Text',
  },
  html: { extension: 'html', mimeType: 'text/html', label: 'HTML Document' },
  epub: { extension: 'epub', mimeType: 'application/epub+zip', label: 'EPUB eBook' },
  xlsx: {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel Spreadsheet',
  },
  xls: { extension: 'xls', mimeType: 'application/vnd.ms-excel', label: 'Excel (Legacy)' },
  ods: {
    extension: 'ods',
    mimeType: 'application/vnd.oasis.opendocument.spreadsheet',
    label: 'OpenDocument Spreadsheet',
  },
  csv: { extension: 'csv', mimeType: 'text/csv', label: 'CSV Data' },
  json: { extension: 'json', mimeType: 'application/json', label: 'JSON Data' },
  pptx: {
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    label: 'PowerPoint',
  },
  ppt: {
    extension: 'ppt',
    mimeType: 'application/vnd.ms-powerpoint',
    label: 'PowerPoint (Legacy)',
  },
  odp: {
    extension: 'odp',
    mimeType: 'application/vnd.oasis.opendocument.presentation',
    label: 'OpenDocument Presentation',
  },

  // Audio
  mp3: { extension: 'mp3', mimeType: 'audio/mpeg', label: 'MP3 Audio' },
  wav: { extension: 'wav', mimeType: 'audio/wav', label: 'WAV Audio' },
  flac: { extension: 'flac', mimeType: 'audio/flac', label: 'FLAC Audio' },
  aac: { extension: 'aac', mimeType: 'audio/aac', label: 'AAC Audio' },
  m4a: { extension: 'm4a', mimeType: 'audio/mp4', label: 'M4A Audio' },
  ogg: { extension: 'ogg', mimeType: 'audio/ogg', label: 'OGG Audio' },
  wma: { extension: 'wma', mimeType: 'audio/x-ms-wma', label: 'WMA Audio' },
  mka: { extension: 'mka', mimeType: 'audio/x-matroska', label: 'MKA Audio' },
  ac3: { extension: 'ac3', mimeType: 'audio/ac3', label: 'AC3 Audio' },
  opus: { extension: 'opus', mimeType: 'audio/opus', label: 'OPUS Audio' },
  aiff: { extension: 'aiff', mimeType: 'audio/aiff', label: 'AIFF Audio' },
  amr: { extension: 'amr', mimeType: 'audio/amr', label: 'AMR Audio' },
  au: { extension: 'au', mimeType: 'audio/basic', label: 'AU Audio' },

  // Video
  mp4: { extension: 'mp4', mimeType: 'video/mp4', label: 'MP4 Video' },
  webm: { extension: 'webm', mimeType: 'video/webm', label: 'WebM Video' },
  gif: { extension: 'gif', mimeType: 'image/gif', label: 'GIF Animation' },
  avi: { extension: 'avi', mimeType: 'video/x-msvideo', label: 'AVI Video' },
  mov: { extension: 'mov', mimeType: 'video/quicktime', label: 'MOV Video' },
  mkv: { extension: 'mkv', mimeType: 'video/x-matroska', label: 'MKV Video' },
  wmv: { extension: 'wmv', mimeType: 'video/x-ms-wmv', label: 'WMV Video' },
  flv: { extension: 'flv', mimeType: 'video/x-flv', label: 'FLV Video' },
  m4v: { extension: 'm4v', mimeType: 'video/x-m4v', label: 'M4V Video' },
  '3gp': { extension: '3gp', mimeType: 'video/3gpp', label: '3GP Video' },
  ts: { extension: 'ts', mimeType: 'video/mp2t', label: 'TS Video' },
  vob: { extension: 'vob', mimeType: 'video/x-ms-vob', label: 'VOB Video' },
}

export const CONVERSION_PATHS: ConversionPath[] = [
  // Image Conversions (Tier A - Local WASM for basic)
  ...['jpg', 'png', 'webp'].flatMap((from) =>
    ['jpg', 'png', 'webp']
      .filter((to) => to !== from)
      .map((to) => ({ from, to, tier: ProcessingTier.TierA })),
  ),

  // Extended Image Conversions (Tier B - Server ImageMagick)
  ...['jpg', 'png', 'webp', 'bmp', 'tiff', 'ico', 'svg', 'heic', 'eps'].flatMap((from) =>
    ['jpg', 'png', 'webp', 'bmp', 'tiff', 'ico', 'pdf']
      .filter((to) => {
        // Skip if same format
        if (to === from) return false
        // Skip basic to basic because TierA already covers it
        const isBasicToBasic =
          ['jpg', 'png', 'webp'].includes(from) && ['jpg', 'png', 'webp'].includes(to)
        return !isBasicToBasic
      })
      .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),

  // Data Conversions (Tier A - Local JS)
  { from: 'csv', to: 'xlsx', tier: ProcessingTier.TierA },
  { from: 'csv', to: 'json', tier: ProcessingTier.TierA },
  { from: 'xlsx', to: 'csv', tier: ProcessingTier.TierA },
  { from: 'xlsx', to: 'json', tier: ProcessingTier.TierA },
  { from: 'json', to: 'csv', tier: ProcessingTier.TierA },
  { from: 'json', to: 'xlsx', tier: ProcessingTier.TierA },

  // Document Conversions (Tier B - Server LibreOffice)
  // Text Docs
  ...['docx', 'doc', 'rtf', 'txt', 'odt', 'html'].flatMap((from) =>
    ['pdf', 'docx', 'doc', 'rtf', 'txt', 'odt', 'html']
      .filter((to) => to !== from)
      .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),
  // Spreadsheets
  ...['xlsx', 'xls', 'ods', 'csv'].flatMap((from) =>
    ['pdf', 'xlsx', 'xls', 'ods', 'csv']
      .filter((to) => {
        if (to === from) return false
        // Skip csv <-> xlsx as Tier A handles it
        if ((from === 'csv' && to === 'xlsx') || (from === 'xlsx' && to === 'csv')) return false
        return true
      })
      .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),
  // Presentations
  ...['pptx', 'ppt', 'odp'].flatMap((from) =>
    ['pdf', 'pptx', 'ppt', 'odp']
      .filter((to) => to !== from)
      .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),

  // Video Conversions (Tier B - Server FFmpeg)
  ...['mp4', 'webm', 'gif', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'm4v', '3gp', 'ts', 'vob'].flatMap(
    (from) =>
      ['mp4', 'webm', 'gif', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'm4v', '3gp', 'ts', 'vob', 'mp3']
        .filter((to) => to !== from)
        .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),

  // Audio Conversions (Tier B - Server FFmpeg)
  ...[
    'mp3',
    'wav',
    'flac',
    'aac',
    'm4a',
    'ogg',
    'wma',
    'mka',
    'ac3',
    'opus',
    'aiff',
    'amr',
    'au',
  ].flatMap((from) =>
    ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma', 'mka', 'ac3', 'opus', 'aiff', 'amr', 'au']
      .filter((to) => to !== from)
      .map((to) => ({ from, to, tier: ProcessingTier.TierB })),
  ),
]
