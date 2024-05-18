import {FC} from 'react'

import {Markdown} from '@/components/StaticSites/Markdown'
import {Competition} from '@/types/api/generated/competition'

type RulesPageProps = Pick<Competition, 'rules' | 'upcoming_or_current_event' | 'name'>

export const RulesPage: FC<RulesPageProps> = ({rules}) => {
  return <Markdown content={rules ?? ''} />
}
