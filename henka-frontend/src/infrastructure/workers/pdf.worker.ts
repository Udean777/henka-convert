import { PDFDocument, degrees } from 'pdf-lib'

self.onmessage = async (e: MessageEvent) => {
  try {
    const { action, payload } = e.data

    if (action === 'rotate') {
      const { fileBuffers, angle } = payload
      const outPdf = await PDFDocument.create()

      for (const buffer of fileBuffers) {
        const pdfDoc = await PDFDocument.load(buffer)
        const copiedPages = await outPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach((page) => {
          const currentRotation = page.getRotation().angle
          page.setRotation(degrees(currentRotation + angle))
          outPdf.addPage(page)
        })
      }

      const pdfBytes = await outPdf.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      self.postMessage({ status: 'success', blob })
    } else if (action === 'merge') {
      const { fileBuffers } = payload
      const mergedPdf = await PDFDocument.create()

      for (const buffer of fileBuffers) {
        const pdf = await PDFDocument.load(buffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      self.postMessage({ status: 'success', blob })
    } else if (action === 'split') {
      // Placeholder for split logic
      throw new Error('Split action not yet fully implemented')
    } else {
      throw new Error(`Unknown action: ${action}`)
    }
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message })
  }
}
