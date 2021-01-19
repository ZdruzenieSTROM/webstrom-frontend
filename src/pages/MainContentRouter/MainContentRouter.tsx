import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import {PagePlaceholder} from '../PagePlaceholder'

export const MainContentRouter: React.FC<{seminarId: number}> = ({seminarId}) => {
  return (
    <div id="main-content">
      <Switch>
        <Route path={'/strom/'} component={StromRouter}></Route>
        <Route path={'/matik/'} component={MatikRouter}></Route>
        <Route path={'/malynar/'} component={MalynarRouter}></Route>
        <Route path={'/zdruzenie/'} component={ZdruzenieRouter}></Route>
        <Route path={'/admin/'} component={AdminRouter}></Route>
      </Switch>
    </div>
  )
}

const MalynarRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Malynár home" />
      </Route>
      <Route exact path={path + 'zadania/'}>
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path={path + 'vysledky/'}>
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path={path + 'mamut/'}>
        <PagePlaceholder title="Mamut" />
      </Route>
      <Route exact path={path + 'tmm/'}>
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path={path + 'minisustredenia/'}>
        <PagePlaceholder title="Minisústredenia" />
      </Route>
      <Route exact path={path + 'gdpr/'}>
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const MatikRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Matik home" />
      </Route>
      <Route exact path={path + 'zadania/'}>
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path={path + 'vysledky/'}>
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path={path + 'lomihlav/'}>
        <PagePlaceholder title="Lomihlav" />
      </Route>
      <Route exact path={path + 'tmm/'}>
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path={path + 'minisustredenia/'}>
        <PagePlaceholder title="Minisústredenia" />
      </Route>
      <Route exact path={path + 'gdpr/'}>
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const StromRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Strom home" />
      </Route>
      <Route exact path={path + 'zadania/'}>
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path={path + 'vysledky/'}>
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path={path + 'matboj/'}>
        <PagePlaceholder title="Matboj" />
      </Route>
      <Route exact path={path + 'tmm/'}>
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path={path + 'gdpr/'}>
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const ZdruzenieRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Združenie home" />
      </Route>
    </>
  )
}

const AdminRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Admin home" />
      </Route>
    </>
  )
}
