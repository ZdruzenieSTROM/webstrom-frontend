// approach based on: https://marmelab.com/react-admin/DataProviders.html#handling-file-uploads

import {Publication} from '@/types/api/competition'

// takisto urobene zmeny v RA dataProvideri
export const createPublicationFormData = ({
  file,
  ...data
}: Omit<Publication, 'file'> & {
  file?: {rawFile: File}
}) => {
  const formData = new FormData()
  // vzdy appendneme kazdy kluc, aj tieto fily, len null sa tu neda pouzit. null znamena, ze file odstranujeme
  formData.append('file', file?.rawFile ?? '')
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value.toString())
  })

  return formData
}
