import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {PagePlaceholder} from '../PagePlaceholder'

export const MainContentRouter: React.FC<{seminarId: number}> = ({seminarId}) => {
  const renderRouter = (seminarId: number) => {
    switch (seminarId) {
      case 1:
        return <StromRouter />
      case 2:
        return <MatikRouter />
      case 3:
        return <MalynarRouter />
      case 4:
        return <ZdruzenieRouter />
      default:
        return <StromRouter />
    }
  }

  return (
    <div id="main-content">
      <Switch>{renderRouter(seminarId)}</Switch>
    </div>
  )
}

const MalynarRouter: React.FC = () => {
  return (
    <>
      <Route exact path="/">
        <PagePlaceholder title="Malynár home" />
      </Route>
      <Route exact path="/zadania/">
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path="/vysledky/">
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path="/mamut/">
        <PagePlaceholder title="Mamut" />
      </Route>
      <Route exact path="/tmm/">
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path="/minisustredenia/">
        <PagePlaceholder title="Minisústredenia" />
      </Route>
      <Route exact path="/gdpr/">
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const MatikRouter: React.FC = () => {
  return (
    <>
      <Route exact path="/">
        <PagePlaceholder title="Matik home" />
      </Route>
      <Route exact path="/zadania/">
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path="/vysledky/">
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path="/lomihlav/">
        <PagePlaceholder title="Lomihlav" />
      </Route>
      <Route exact path="/tmm/">
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path="/minisustredenia/">
        <PagePlaceholder title="Minisústredenia" />
      </Route>
      <Route exact path="/gdpr/">
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const StromRouter: React.FC = () => {
  return (
    <>
      <Route exact path="/">
        <PagePlaceholder title="Strom home" />
      </Route>
      <Route exact path="/zadania/">
        <PagePlaceholder title="Zadania" />
      </Route>
      <Route exact path="/vysledky/">
        <PagePlaceholder title="Výsledky" />
      </Route>
      <Route exact path="/matboj/">
        <PagePlaceholder title="Matboj" />
      </Route>
      <Route exact path="/tmm/">
        <PagePlaceholder title="TMM" />
      </Route>
      <Route exact path="/gdpr/">
        <PagePlaceholder title="Ochrana osobných údajov" />
      </Route>
    </>
  )
}

const ZdruzenieRouter: React.FC = () => {
  return (
    <>
      <Route exact path="/">
        <PagePlaceholder title="Združenie home" />
      </Route>
    </>
  )
}
