import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {useState} from 'react'
import {AdminContext, Form, FormDataConsumer, Notification} from 'react-admin'
import {afterEach, describe, expect, it, vi} from 'vitest'

import {renderPdfAsPng} from '@/utils/renderPdfAsPng'

import {ProblemImageInput} from './ProblemImageInput'

vi.mock('@/utils/renderPdfAsPng', () => ({renderPdfAsPng: vi.fn()}))

const existingImage = '/media/existing.png'

const TestForm = () => {
  const [converting, setConverting] = useState(false)
  return (
    <AdminContext>
      <Form record={{image: existingImage}}>
        <ProblemImageInput converting={converting} setConverting={setConverting} />
        <button disabled={converting}>Save</button>
        <FormDataConsumer>
          {({formData}) => <output>{String(formData.image?.rawFile?.name ?? formData.image)}</output>}
        </FormDataConsumer>
      </Form>
      <Notification />
    </AdminContext>
  )
}

const selectFile = (file: File) => {
  const input = screen.getByTestId('dropzone').querySelector('input')!
  fireEvent.change(input, {target: {files: [file]}})
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.mocked(renderPdfAsPng).mockReset()
})

describe(ProblemImageInput, () => {
  it('waits for PDF conversion and stores the resulting PNG as the raw file', async () => {
    const pdf = new File(['pdf'], 'diagram.pdf', {type: 'application/pdf'})
    const png = new File(['png'], 'diagram.png', {type: 'image/png'})
    const conversion = Promise.withResolvers<File>()
    vi.mocked(renderPdfAsPng).mockReturnValueOnce(conversion.promise)
    const createObjectURL = vi.fn().mockReturnValue('blob:diagram')
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = createObjectURL
      },
    )
    render(<TestForm />)

    selectFile(pdf)
    await waitFor(() => expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled())
    expect(screen.getByRole('status')).toHaveTextContent(existingImage)
    await waitFor(() => expect(renderPdfAsPng).toHaveBeenCalledWith(pdf))

    await act(() => {
      conversion.resolve(png)
      return conversion.promise
    })
    expect(screen.getByRole('status')).toHaveTextContent(png.name)
    expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled()
    expect(createObjectURL).toHaveBeenCalledWith(png)
  })

  it('keeps the existing image when the PDF has multiple pages', async () => {
    vi.mocked(renderPdfAsPng).mockResolvedValueOnce(null)
    render(<TestForm />)

    selectFile(new File(['pdf'], 'pages.pdf', {type: 'application/pdf'}))
    await waitFor(() => expect(renderPdfAsPng).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled())
    expect(screen.getByRole('status')).toHaveTextContent(existingImage)
  })

  it('shows a Slovak notification when a dropped file cannot be read', async () => {
    render(<TestForm />)

    fireEvent.drop(screen.getByTestId('dropzone'), {
      dataTransfer: {types: ['Files'], items: [{kind: 'file', getAsFile: () => null}]},
    })

    expect(await screen.findByText('Súbor sa nepodarilo načítať. Skús ho vybrať znova.')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent(existingImage)
    expect(renderPdfAsPng).not.toHaveBeenCalled()
  })
})
