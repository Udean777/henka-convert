import { ref } from 'vue'
import { defineStore } from 'pinia'
import { FormatRouter } from '../core/router'
import { SUPPORTED_FORMATS } from '../core/registry'
import type { Format } from '../core/types'
import type { ConversionJob } from '../core/domain/job'
import { FileExtractionService } from '../core/application/FileExtractionService'
import { JobExecutionService } from '../core/application/JobExecutionService'

export const useConversionStore = defineStore('conversion', () => {
  const jobs = ref<ConversionJob[]>([])
  const jobService = new JobExecutionService()

  async function addFiles(files: FileList | File[]) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue

      const ext = FormatRouter.getExtension(file.name)

      if (ext === 'zip') {
        const extracted = await FileExtractionService.extractZip(file)
        if (extracted.length > 0) {
          await addFiles(extracted)
        }
        continue
      }

      let availableTargets: Format[] = []
      let targetFormat: Format | null = null

      if (ext) {
        availableTargets = FormatRouter.getAvailableTargets(ext, file.type)
        if (availableTargets.length > 0) {
          targetFormat = availableTargets[0] || null
        }
      }

      jobs.value.push({
        id: crypto.randomUUID(),
        file: file as any,
        status: 'IDLE',
        targetFormat,
        availableTargets,
        progress: 0,
        resultUrl: null,
        error: null,
      })
    }
  }

  function addYouTubeJob(url: string) {
    const dummyFile = new File([url], "video.youtube", { type: "text/plain" })
    const audioTargets = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].map(ext => SUPPORTED_FORMATS[ext])
    const defaultTarget = SUPPORTED_FORMATS['mp3']

    jobs.value.push({
      id: crypto.randomUUID(),
      file: dummyFile,
      status: 'IDLE',
      targetFormat: defaultTarget,
      availableTargets: audioTargets,
      progress: 0,
      resultUrl: null,
      error: null,
    })
  }

  function removeJob(id: string) {
    jobs.value = jobs.value.filter((j) => j.id !== id)
  }

  function setTargetFormat(id: string, format: Format) {
    const job = jobs.value.find((j) => j.id === id)
    if (job) {
      job.targetFormat = format
    }
  }

  function startJob(id: string) {
    const job = jobs.value.find((j) => j.id === id)
    if (!job || !job.targetFormat || job.status === 'PROCESSING') return

    jobService.execute(job, (patch) => {
      // Cari kembali job untuk memastikan kita memperbarui state reaktif yang benar
      const currentJob = jobs.value.find((j) => j.id === id)
      if (currentJob) {
        Object.assign(currentJob, patch)
      }
    })
  }

  function startAll() {
    jobs.value.forEach((job) => {
      if (job.status === 'IDLE' || job.status === 'ERROR') {
        startJob(job.id)
      }
    })
  }

  function clearCompleted() {
    jobs.value = jobs.value.filter((j) => j.status !== 'COMPLETED')
  }

  function clearAll() {
    jobs.value = []
  }

  return {
    jobs,
    addFiles,
    addYouTubeJob,
    removeJob,
    setTargetFormat,
    startJob,
    startAll,
    clearCompleted,
    clearAll,
  }
})
