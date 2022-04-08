import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Services from './components/pages/Services'
import Nav from './components/organisms/Nav'
import ModalWrapper from './components/organisms/ModalWrapper'
import ContextProvider from './components/context/GlobalContext'
import Flags from './components/pages/Flags'

function App() {
	return (
		<ContextProvider>
			<Router>
				<ModalWrapper />
				<Nav />
				<Routes />
			</Router>
		</ContextProvider>
	)
}

function Routes() {
	return (
		<main>
			<Switch>
				<Route exact path='/'>
					<Services />
				</Route>
				<Route exact path='/flags'>
					<Flags />
				</Route>
			</Switch>
		</main>
	)
}

export default App
