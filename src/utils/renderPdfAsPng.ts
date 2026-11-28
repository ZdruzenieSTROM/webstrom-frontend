import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export const renderPdfAsPng = async (file: File): Promise<File | null> => {
  const task = getDocument({data: await file.arrayBuffer(), useWasm: false, stopAtErrors: true})
  const canvas = document.createElement('canvas')

  try {
    const pdf = await task.promise
    if (pdf.numPages !== 1) return null

    const page = await pdf.getPage(1)
    const {width, height} = page.getViewport({scale: 1})
    const viewport = page.getViewport({scale: Math.min(3, 2400 / Math.max(width, height))})
    canvas.width = Math.max(1, Math.ceil(viewport.width))
    canvas.height = Math.max(1, Math.ceil(viewport.height))

    await page.render({canvas, viewport}).promise
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Could not encode the PDF page as PNG')

    return new File([blob], file.name.replace(/(?:\.pdf)?$/i, '.png'), {type: 'image/png'})
  } finally {
    canvas.width = 0
    canvas.height = 0
    await task.destroy()
  }
}
