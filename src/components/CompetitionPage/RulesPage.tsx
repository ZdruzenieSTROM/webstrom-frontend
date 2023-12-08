import {FC} from 'react'

import {Markdown} from '@/components/StaticSites/Markdown'
import {Competition} from '@/types/api/generated/competition'
import {BannerContainer} from '@/utils/BannerContainer'
import {formatDateTime} from '@/utils/formatDate'

type RulesPageProps = Pick<Competition, 'rules' | 'upcoming_or_current_event' | 'name'>

export const RulesPage: FC<RulesPageProps> = ({name, rules, upcoming_or_current_event}) => {
  const {setBannerText} = BannerContainer.useContainer()

  const startDate = formatDateTime(upcoming_or_current_event?.start)
  setBannerText(upcoming_or_current_event ? `${name} sa bude konať  ${startDate}` : '')

  return <Markdown content={rules ?? ''} />
}
