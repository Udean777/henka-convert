import { ref } from 'vue'
import { defineStore } from 'pinia'
import PdfWorker from '../infrastructure/workers/pdf.worker?worker'

export const usePdfStore = defineStore('pdf', () => {
  const files = ref<File[]>([])
  const isProcessing = ref(false)
  const resultUrl = ref<string | null>(null)
  const error = ref<string | null>(null)

  function addFiles(newFiles: FileList | File[]) {
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i]
      if (!file) continue
      if (file.type === 'application/pdf') {
        files.value.push(file as any)
      }
    }
  }

  function removeFile(index: number) {
    files.value.splice(index, 1)
  }

  function clear() {
    files.value = []
    resultUrl.value = null
    error.value = null
  }

  async function mergePdfs() {
    if (files.value.length < 2) {
      error.value = 'Please select at least 2 PDF files to merge.'
      return
    }

    isProcessing.value = true
    error.value = null

    try {
      const fileBuffers = await Promise.all(files.value.map((f) => f.arrayBuffer()))

      const worker = new PdfWorker()

      worker.onmessage = (e) => {
        if (e.data.status === 'success') {
          resultUrl.value = URL.createObjectURL(e.data.blob)
        } else {
          error.value = e.data.error
        }
        isProcessing.value = false
        worker.terminate()
      }

      worker.onerror = (err) => {
        error.value = 'PDF worker failed to start'
        isProcessing.value = false
        worker.terminate()
      }

      worker.postMessage({
        action: 'merge',
        payload: { fileBuffers },
      })
    } catch (err: any) {
      error.value = err.message
      isProcessing.value = false
    }
  }

  async function rotatePdf(angle: number = 90) {
    if (files.value.length === 0) {
      error.value = 'Please select at least 1 PDF file to rotate.'
      return
    }

    isProcessing.value = true
    error.value = null

    try {
      const fileBuffers = await Promise.all(files.value.map((f) => f.arrayBuffer()))
      const worker = new PdfWorker()

      worker.onmessage = (e) => {
        if (e.data.status === 'success') {
          resultUrl.value = URL.createObjectURL(e.data.blob)
        } else {
          error.value = e.data.error
        }
        isProcessing.value = false
        worker.terminate()
      }

      worker.onerror = (err) => {
        error.value = 'PDF worker failed to start'
        isProcessing.value = false
        worker.terminate()
      }

      worker.postMessage({
        action: 'rotate',
        payload: { fileBuffers, angle },
      })
    } catch (err: any) {
      error.value = err.message
      isProcessing.value = false
    }
  }

  return {
    files,
    isProcessing,
    resultUrl,
    error,
    addFiles,
    removeFile,
    clear,
    mergePdfs,
    rotatePdf,
  }
})
