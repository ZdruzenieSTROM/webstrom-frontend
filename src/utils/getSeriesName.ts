import {Series} from '@/types/api/competition'

export const getSeriesName = (series: Pick<Series, 'order'>) => `${series.order}. séria`
