import * as XLSX from 'xlsx'

self.onmessage = async (e: MessageEvent) => {
  try {
    const { file, sourceFormat, targetFormat } = e.data

    const arrayBuffer = await file.arrayBuffer()

    let workbook: XLSX.WorkBook

    if (sourceFormat === 'json') {
      const text = new TextDecoder().decode(arrayBuffer)
      const jsonArray = JSON.parse(text)
      const worksheet = XLSX.utils.json_to_sheet(Array.isArray(jsonArray) ? jsonArray : [jsonArray])
      workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    } else {
      workbook = XLSX.read(arrayBuffer, { type: 'array' })
    }

    let outputBlob: Blob

    if (targetFormat === 'json') {
      const firstSheetName = workbook.SheetNames[0]
      if (!firstSheetName) throw new Error('No sheets found in document')
      const worksheet = workbook.Sheets[firstSheetName]
      if (!worksheet) throw new Error('Worksheet not found')
      const json = XLSX.utils.sheet_to_json(worksheet)
      const text = JSON.stringify(json, null, 2)
      outputBlob = new Blob([text], { type: 'application/json' })
    } else if (targetFormat === 'csv') {
      const firstSheetName = workbook.SheetNames[0]
      if (!firstSheetName) throw new Error('No sheets found in document')
      const worksheet = workbook.Sheets[firstSheetName]
      if (!worksheet) throw new Error('Worksheet not found')
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      outputBlob = new Blob([csv], { type: 'text/csv' })
    } else if (targetFormat === 'xlsx') {
      const outArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      outputBlob = new Blob([outArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    } else {
      throw new Error(`Unsupported target format: ${targetFormat}`)
    }

    self.postMessage({ status: 'success', blob: outputBlob })
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message || 'Data conversion failed' })
  }
}
