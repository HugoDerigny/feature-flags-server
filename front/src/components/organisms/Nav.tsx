import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'

export default function Nav() {
	const { zenMode } = useContext(GlobalContext)
	const { pathname } = useLocation()

	return (
		<nav
			className='nav'
			style={{ transform: zenMode.isSet ? 'translateX(-1000px)' : 'translateX(0)' }}
		>
			<p className='nav__title'>Panneau d'accès</p>
			<ul className='nav__list'>
				<li className={pathname === '/' ? 'nav__list-item-active' : 'nav__list-item'}>
					<Link to='/'>
						<svg
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
							/>
						</svg>
						<span>Services</span>
					</Link>
				</li>
				<li
					className={
						pathname === '/workflows' ? 'nav__list-item-active' : 'nav__list-item'
					}
				>
					<Link to='/workflows'>
						<svg
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
							/>
						</svg>
						<span>Workflows</span>
					</Link>
				</li>
				<li className={pathname === '/issues' ? 'nav__list-item-active' : 'nav__list-item'}>
					<Link to='/issues'>
						<svg
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
							/>
						</svg>
						<span>Issues</span>
					</Link>
				</li>
				<li className={pathname === '/flags' ? 'nav__list-item-active' : 'nav__list-item'}>
					<Link to='/flags'>
						<svg
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
							/>
						</svg>
						<span>Flags</span>
					</Link>
				</li>
				<hr />
				<li className='nav__list-item'>
					<a
						href='https://tabuleo.atlassian.net/'
						rel='noopener noreferrer'
						target='_blank'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='96'
							height='96'
							viewBox='0 0 24 24'
							strokeWidth='1.5'
							stroke='currentColor'
							fill='none'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path stroke='none' d='M0 0h24v24H0z' fill='none' />
							<rect x='8' y='8' width='8' height='8' rx='1' />
							<line x1='3' y1='8' x2='4' y2='8' />
							<line x1='3' y1='16' x2='4' y2='16' />
							<line x1='8' y1='3' x2='8' y2='4' />
							<line x1='16' y1='3' x2='16' y2='4' />
							<line x1='20' y1='8' x2='21' y2='8' />
							<line x1='20' y1='16' x2='21' y2='16' />
							<line x1='8' y1='20' x2='8' y2='21' />
							<line x1='16' y1='20' x2='16' y2='21' />
						</svg>
						<span>Atlassian</span>
					</a>
				</li>
				<li className='nav__list-item'>
					<a
						href='https://drive.google.com/drive/shared-drives'
						rel='noopener noreferrer'
						target='_blank'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth='1.5'
							fill='none'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path stroke='none' d='M0 0h24v24H0z' fill='none' />
							<path d='M12 10l-6 10l-3 -5l6 -10z' />
							<path d='M9 15h12l-3 5h-12' />
							<path d='M15 15l-6 -10h6l6 10z' />
						</svg>
						<span>Drive</span>
					</a>
				</li>
				<li className='nav__list-item'>
					<a href='https://vault.tabuleo.fr/ui' target='_blank' rel='noreferrer noopener'>
						<svg
							className='w-8 h-8'
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
						<span>Vault</span>
					</a>
				</li>
			</ul>
		</nav>
	)
}
