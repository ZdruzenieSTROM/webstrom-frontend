import {FC, PropsWithChildren} from 'react'
import {List, ListProps} from 'react-admin'

/**
 * Custom List wrapper that disables sort persistence globally.
 * Since our sorts are mostly unstable (allowing sorting on columns where BE doesn't support it),
 * we disable localStorage persistence to prevent users from getting stuck with unsupported sorts.
 */
export const MyList: FC<PropsWithChildren<ListProps>> = ({storeKey, ...rest}) => (
  <List storeKey={storeKey ?? false} {...rest} />
)
