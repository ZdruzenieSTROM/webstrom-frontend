// approach based on: https://marmelab.com/react-admin/DataProviders.html#handling-file-uploads

import {Problem} from '@/types/api/competition'

// takisto urobene zmeny v RA dataProvideri
export const createProblemFormData = ({
  image,
  solution_pdf,
  ...data
}: Omit<Problem, 'image' | 'solution'> & {
  image?: {rawFile: File}
  solution_pdf?: {rawFile: File}
}) => {
  const formData = new FormData()
  // vzdy appendneme kazdy kluc, aj tieto fily, len null sa tu neda pouzit. null znamena, ze file odstranujeme
  formData.append('image', image?.rawFile ?? '')
  formData.append('solution_pdf', solution_pdf?.rawFile ?? '')
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value.toString())
  })

  return formData
}
