import {Solution} from '@/types/api/competition'

export const createSolutionFormData = ({
  solution,
  corrected_solution,
  ...data
}: Omit<Solution, 'solution' | 'corrected_solution' | 'late_tag'> & {
  solution?: {rawFile: File}
  corrected_solution?: {rawFile: File}
  // `late_tag` pri create/update je len IDcko tagu, nie objekt
  late_tag?: number
}) => {
  const formData = new FormData()
  // vzdy appendneme kazdy kluc, aj tieto fily, len null sa tu neda pouzit. null znamena, ze file odstranujeme
  formData.append('solution', solution?.rawFile ?? '')
  formData.append('corrected_solution', corrected_solution?.rawFile ?? '')
  for (const [key, value] of Object.entries(data)) {
    // dolezity explicitny check, kedze `if (value)` by zabranil updatnut boolean na `false`
    if (value != null) formData.append(key, value.toString())
  }

  return formData
}
