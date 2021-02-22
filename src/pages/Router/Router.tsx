import React from 'react'
import {Route, Switch, useRouteMatch} from 'react-router-dom'

import {LatexExample} from '../../components/Latex/LatexExample'
import {PageLayout} from '../../components/PageLayout/PageLayout'
import {Admin} from '../Admin/Admin'
import {PagePlaceholder} from '../PagePlaceholder'

export const Router: React.FC<{seminarId: number}> = ({seminarId}) => {
  return (
    <div id="main-content">
      <Switch>
        <Route path={'/admin'} component={AdminRouter} />
        {/* aby sme mohli pouzit PageLayout len pre niektore stranky (vsetky okrem admina), musi to byt takto zabalene
          vo vlastnej Route, ktora vie, ktore stranky matchuje (a potom hlada hlbsie dalsie Routes) */}
        <Route path={['/strom/', '/matik/', '/malynar/', '/zdruzenie/', '/']}>
          <PageLayout seminarId={seminarId}>
            <Route path={'/strom/'} component={StromRouter} />
            <Route path={'/matik/'} component={MatikRouter} />
            <Route path={'/malynar/'} component={MalynarRouter} />
            <Route path={'/zdruzenie/'} component={ZdruzenieRouter} />
            <Route path={'/example/'} component={ExampleRouter}></Route>
          </PageLayout>
        </Route>
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
        <Admin />
      </Route>
    </>
  )
}

const ExampleRouter: React.FC = () => {
  const {path} = useRouteMatch()
  return (
    <>
      <Route exact path={path}>
        <PagePlaceholder title="Examples" />
      </Route>
      <Route exact path={path + 'latex/'}>
        <LatexExample />
      </Route>
    </>
  )
}
