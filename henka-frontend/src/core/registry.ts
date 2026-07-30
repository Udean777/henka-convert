import type { Format, ConversionPath } from './types'
import { ProcessingTier } from './types'

export const SUPPORTED_FORMATS: Record<string, Format> = {
  // Images
  jpg: { extension: 'jpg', mimeType: 'image/jpeg', label: 'JPEG Image' },
  png: { extension: 'png', mimeType: 'image/png', label: 'PNG Image' },
  webp: { extension: 'webp', mimeType: 'image/webp', label: 'WebP Image' },

  // Documents
  pdf: { extension: 'pdf', mimeType: 'application/pdf', label: 'PDF Document' },
  docx: {
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word Document',
  },
  xlsx: {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel Spreadsheet',
  },
  csv: { extension: 'csv', mimeType: 'text/csv', label: 'CSV Data' },
  json: { extension: 'json', mimeType: 'application/json', label: 'JSON Data' },

  // Audio
  mp3: { extension: 'mp3', mimeType: 'audio/mpeg', label: 'MP3 Audio' },
  wav: { extension: 'wav', mimeType: 'audio/wav', label: 'WAV Audio' },
  flac: { extension: 'flac', mimeType: 'audio/flac', label: 'FLAC Audio' },
  aac: { extension: 'aac', mimeType: 'audio/aac', label: 'AAC Audio' },
  m4a: { extension: 'm4a', mimeType: 'audio/mp4', label: 'M4A Audio' },
  ogg: { extension: 'ogg', mimeType: 'audio/ogg', label: 'OGG Audio' },

  // Video
  mp4: { extension: 'mp4', mimeType: 'video/mp4', label: 'MP4 Video' },
  webm: { extension: 'webm', mimeType: 'video/webm', label: 'WebM Video' },
  gif: { extension: 'gif', mimeType: 'image/gif', label: 'GIF Animation' },
}

export const CONVERSION_PATHS: ConversionPath[] = [
  // Image Conversions (Tier A - Local WASM)
  { from: 'jpg', to: 'png', tier: ProcessingTier.TierA },
  { from: 'jpg', to: 'webp', tier: ProcessingTier.TierA },
  { from: 'png', to: 'jpg', tier: ProcessingTier.TierA },
  { from: 'png', to: 'webp', tier: ProcessingTier.TierA },
  { from: 'webp', to: 'jpg', tier: ProcessingTier.TierA },
  { from: 'webp', to: 'png', tier: ProcessingTier.TierA },

  // Data Conversions (Tier A - Local JS)
  { from: 'csv', to: 'xlsx', tier: ProcessingTier.TierA },
  { from: 'csv', to: 'json', tier: ProcessingTier.TierA },
  { from: 'xlsx', to: 'csv', tier: ProcessingTier.TierA },
  { from: 'xlsx', to: 'json', tier: ProcessingTier.TierA },
  { from: 'json', to: 'csv', tier: ProcessingTier.TierA },
  { from: 'json', to: 'xlsx', tier: ProcessingTier.TierA },

  // Document Conversions (Tier B - Server LibreOffice)
  { from: 'docx', to: 'pdf', tier: ProcessingTier.TierB },
  { from: 'xlsx', to: 'pdf', tier: ProcessingTier.TierB },

  // Video Conversions (Tier B - Server FFmpeg)
  { from: 'mp4', to: 'webm', tier: ProcessingTier.TierB },
  { from: 'mp4', to: 'gif', tier: ProcessingTier.TierB },
  { from: 'webm', to: 'mp4', tier: ProcessingTier.TierB },
  { from: 'webm', to: 'gif', tier: ProcessingTier.TierB },

  // Audio Conversions (Tier B - Server FFmpeg)
  ...['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].flatMap(from => 
    ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg']
      .filter(to => to !== from)
      .map(to => ({ from, to, tier: ProcessingTier.TierB }))
  ),
]
