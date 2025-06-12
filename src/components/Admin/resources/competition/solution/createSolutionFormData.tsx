import {Solution} from '@/types/api/competition'

export const createSolutionFormData = ({
  solution,
  ...data
}: Omit<Solution, 'solution' | 'late_tag'> & {
  solution?: {rawFile: File}
  // `late_tag` pri create/update je len IDcko tagu, nie objekt
  late_tag?: number
}) => {
  const formData = new FormData()
  // vzdy appendneme kazdy kluc, aj tieto fily, len null sa tu neda pouzit. null znamena, ze file odstranujeme
  formData.append('solution', solution?.rawFile ?? '')
  Object.entries(data).forEach(([key, value]) => {
    // dolezity explicitny check, kedze `if (value)` by zabranil updatnut boolean na `false`
    if (value != null) formData.append(key, value.toString())
  })

  return formData
}
