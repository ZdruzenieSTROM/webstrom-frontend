import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'

import {apiAxios} from '@/api/apiAxios'
import {Publication, PublicationTypes, SemesterWithProblems} from '@/types/api/competition'
import {renderWithProviders} from '@/utils/testUtils'

import {PublicationUploader} from './PublicationUploader'

const makeSemesterData = (publications: Publication[]) =>
  ({id: 10, publication_set: publications}) as unknown as SemesterWithProblems

const uploadPdf = async (container: HTMLElement) => {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error('file input not found')
  await userEvent.setup().upload(input, new File(['x'], 'casopis.pdf', {type: 'application/pdf'}))
}

describe('PublicationUploader', () => {
  it('should create a leaflet publication for the semester when none exists for the order', async () => {
    vi.mocked(apiAxios.post).mockResolvedValue({data: {}})
    const {container} = renderWithProviders(
      <PublicationUploader semesterId={10} order={2} semesterData={makeSemesterData([])} />,
    )

    await uploadPdf(container)

    await waitFor(() => expect(apiAxios.post).toHaveBeenCalledTimes(1))
    const [url, formData] = vi.mocked(apiAxios.post).mock.calls[0] as [string, FormData]
    expect(url).toBe('/competition/publication/')
    expect(formData.get('publication_type')).toBe(String(PublicationTypes.LEAFLET.id))
    expect(formData.get('event')).toBe('10')
    expect(formData.get('order')).toBe('2')
    expect(formData.get('file')).toBeInstanceOf(File)
    expect(apiAxios.patch).not.toHaveBeenCalled()
  })

  it('should replace the existing publication and refetch the semester when one exists for the order', async () => {
    vi.mocked(apiAxios.patch).mockResolvedValue({data: {}})
    const existing: Publication = {
      id: 7,
      name: 'casopis-2.pdf',
      file: '/media/casopis-2.pdf',
      publication_type: PublicationTypes.LEAFLET.id,
      event: 10,
      order: 2,
    }
    const {container, queryClient} = renderWithProviders(
      <PublicationUploader semesterId={10} order={2} semesterData={makeSemesterData([existing])} />,
    )
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    expect(within(container).getByText('casopis-2.pdf')).toBeInTheDocument()
    await uploadPdf(container)

    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({queryKey: ['competition', 'semester', 10]}))
    expect(apiAxios.patch).toHaveBeenCalledWith('/competition/publication/7/', expect.any(FormData))
    expect(apiAxios.post).not.toHaveBeenCalled()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
