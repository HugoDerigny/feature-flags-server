import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Services from './components/pages/Services'
import Nav from './components/organisms/Nav'
import ModalWrapper from './components/organisms/ModalWrapper'
import ContextProvider, { GlobalContext } from './components/context/GlobalContext'
import { useContext, useEffect, useState } from 'react'
import Workflow from './components/pages/Workflows'
import Issues from './components/pages/Issues'
import Flags from './components/pages/Flags'

function App() {
	const [isAuthentified, setIsAuthentified] = useState<boolean>(false)

	useEffect(() => {
		if (!isAuthentified) {
			window.prompt('Saisissez le mot de passe pour accéder à Admineo') === 'azertyui' &&
				setIsAuthentified(true)
		}
	}, [isAuthentified])

	return (
		<ContextProvider>
			<Router>
				{isAuthentified ? (
					<>
						<ModalWrapper />
						<Nav />
						<Routes />
					</>
				) : (
					<section className='w-screen h-screen flex place-items-center justify-center'>
						<svg
							className='w-1/2 h-1/2 text-gray-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
							/>
						</svg>
					</section>
				)}
			</Router>
		</ContextProvider>
	)
}

function Routes() {
	const { zenMode } = useContext(GlobalContext)

	return (
		<main className={zenMode.isSet ? 'ml-0' : ''}>
			<Switch>
				<Route exact path='/'>
					<Services />
				</Route>
				<Route exact path='/workflows'>
					<Workflow />
				</Route>
				<Route exact path='/issues'>
					<Issues />
				</Route>
				<Route exact path='/flags'>
					<Flags />
				</Route>
			</Switch>
		</main>
	)
}

export default App
