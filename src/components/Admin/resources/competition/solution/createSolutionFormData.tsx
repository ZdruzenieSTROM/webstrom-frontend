import {Solution} from '@/types/api/competition'

export const createSolutionFormData = ({
  solution,
  ...data
}: Omit<Solution, 'solution'> & {
  solution?: {rawFile: File}
}) => {
  const formData = new FormData()
  // vzdy appendneme kazdy kluc, aj tieto fily, len null sa tu neda pouzit. null znamena, ze file odstranujeme
  formData.append('solution', solution?.rawFile ?? '')
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value.toString())
  })

  return formData
}
