import { describe, it, expect, vi } from 'vitest'
import { CONVERSION_PATHS, SUPPORTED_FORMATS } from '../core/registry'
import { FormatRouter } from '../core/router'
import { JobExecutionService } from '../core/application/JobExecutionService'
import { LocalWorkerAdapter } from '../infrastructure/adapters/LocalWorkerAdapter'
import { ServerConverterAdapter } from '../infrastructure/adapters/ServerConverterAdapter'
import { YouTubeAdapter } from '../infrastructure/adapters/YouTubeAdapter'
import { ProcessingTier } from '../core/types'

describe('Comprehensive Conversion Paths Test', () => {
  // 1. Uji integritas Registry (Semua format terdaftar)
  describe('Registry Integrity', () => {
    it.each(CONVERSION_PATHS)(
      'should have valid metadata in SUPPORTED_FORMATS for path $from -> $to',
      ({ from, to }) => {
        expect(SUPPORTED_FORMATS[from]).toBeDefined()
        expect(SUPPORTED_FORMATS[to]).toBeDefined()
      },
    )
  })

  // 2. Uji FormatRouter untuk pencarian opsi konversi
  describe('FormatRouter Target Mapping', () => {
    const uniqueFromFormats = Array.from(new Set(CONVERSION_PATHS.map((p) => p.from)))

    it.each(uniqueFromFormats)(
      'should return non-empty available targets for source format: %s',
      (fromExt) => {
        const targets = FormatRouter.getAvailableTargets(fromExt as any)
        expect(targets.length).toBeGreaterThan(0)
      },
    )

    it('should correctly extract extension from filename', () => {
      expect(FormatRouter.getExtension('document.pdf')).toBe('pdf')
      expect(FormatRouter.getExtension('photo.JPEG')).toBe('jpg')
      expect(FormatRouter.getExtension('archive.tar.gz')).toBe('gz')
      expect(FormatRouter.getExtension('nofileextension')).toBeNull()
    })
  })

  // 3. Uji penetapan ProcessingTier (TierA/TierB)
  describe('Processing Tier Routing', () => {
    it.each(CONVERSION_PATHS)(
      'should correctly assign processing tier for $from -> $to ($tier)',
      ({ from, to, tier }) => {
        const detectedTier = FormatRouter.getProcessingTier(from as any, to as any)
        expect(detectedTier).toBe(tier)
      },
    )
  })

  // 4. Uji Adapter Matching pada JobExecutionService
  describe('JobExecutionService Adapter Matching', () => {
    const service = new JobExecutionService()

    it.each(CONVERSION_PATHS)(
      'should assign correct tier for job $from -> $to',
      ({ from, to, tier }) => {
        const dummyFile = new File(['test content'], `sample.${from}`, { type: 'text/plain' })
        const targetFormat = SUPPORTED_FORMATS[to]

        const updateJob = vi.fn()

        const job = {
          id: 'test-job-1',
          file: dummyFile,
          targetFormat,
          status: 'IDLE' as const,
          progress: 0,
          error: null,
        }

        const expectedTier = FormatRouter.getProcessingTier(from as any, to as any)
        expect(expectedTier).toBe(tier)
      },
    )
  })

  // 5. Uji canHandle() pada semua Adapters
  describe('Adapter canHandle Methods', () => {
    const localAdapter = new LocalWorkerAdapter()
    const serverAdapter = new ServerConverterAdapter()
    const youtubeAdapter = new YouTubeAdapter()

    it('YouTubeAdapter should only handle youtube source with audio/video targets', () => {
      expect(youtubeAdapter.canHandle('youtube', 'mp3')).toBe(true)
      expect(youtubeAdapter.canHandle('youtube', 'mp4')).toBe(true)
      expect(youtubeAdapter.canHandle('pdf', 'docx')).toBe(false)
      expect(youtubeAdapter.canHandle('jpg', 'png')).toBe(false)
    })

    it('LocalWorkerAdapter & ServerConverterAdapter canHandle check', () => {
      CONVERSION_PATHS.forEach(({ from, to }) => {
        expect(localAdapter.canHandle(from, to)).toBe(true)
        expect(serverAdapter.canHandle(from, to)).toBe(true)
      })
    })
  })
})
