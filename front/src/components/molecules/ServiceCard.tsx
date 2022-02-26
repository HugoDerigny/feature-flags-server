import Service from '../../model/Service'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import { EnumModal } from '../../types/EnumModals'
import LineChart from '../atoms/LineChart'
import { ServiceStatus } from '../../types/RawService'

export default function ServiceCard({ service }: { service: Service }) {
	const { modal, zenMode } = useContext(GlobalContext)

	const stats = service.vitals

	return (
		<article className='rounded-2xl bg-gray-50 overflow-hidden'>
			<header
				className={`py-2 place-items-center px-6 ${
					service.status === ServiceStatus.ONLINE
						? 'bg-emerald-400'
						: service.status === ServiceStatus.IN_BUILD
						? 'bg-orange-400 animate-bounce'
						: 'bg-red-500 animate-pulse'
				} text-white flex justify-between relative place-items-start`}
			>
				<h3 className='font-bold tracking-tight'>{service.name}</h3>
				{!zenMode.isSet && (
					<button
						onClick={() => modal.set(EnumModal.SERVICE_CONFIG, { service })}
						className='rounded-full transition p-2 bg-white bg-opacity-30 hover:rotate-90 duration-400'
						type='button'
					>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
							/>
						</svg>
					</button>
				)}
			</header>
			<div className='mt-4 w-full'>
				<p
					className={`px-4 text-xs font-mono ${
						stats.averageResponseTime > 800
							? 'text-red-500'
							: stats.averageResponseTime > 400
							? 'text-orange-400'
							: 'text-emerald-500'
					} font-semibold flex place-items-center`}
				>
					<svg
						className='w-4 h-4 mr-2'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					{Math.floor(stats.averageResponseTime)} ms (
					{stats.history.reduce((prev, curr) => (prev += curr.y), 0)} req)
				</p>
				<div className='w-full h-48'>
					<LineChart
						style={service.status === ServiceStatus.ONLINE ? 'ok' : 'ko'}
						data={[
							{
								id: 'Nombre de requêtes',
								color: 'hsl(94, 70%, 50%)',
								data: stats.history,
							},
						]}
					/>
				</div>
			</div>
			{!zenMode.isSet && (
				<footer className='py-4 px-6 flex place-items-center justify-between space-x-4'>
					<section className='flex place-items-center space-x-4'>
						<a
							href={service.gitUrl}
							rel='noopener noreferrer'
							target='_blank'
							className='hover:text-indigo-600'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5'
								viewBox='0 0 24 24'
								strokeWidth='2'
								stroke='currentColor'
								fill='none'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<path d='M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5' />
							</svg>
						</a>
						<a
							href={service.gitUrl + '/wiki'}
							rel='noopener noreferrer'
							target='_blank'
							className='hover:text-indigo-600'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5'
								viewBox='0 0 24 24'
								strokeWidth='2'
								stroke='currentColor'
								fill='none'
							>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<path d='M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18' />
								<line x1='13' y1='8' x2='15' y2='8' />
								<line x1='13' y1='12' x2='15' y2='12' />
							</svg>
						</a>
						<a
							href={service.accessUrl}
							className='hover:text-indigo-600'
							rel='noopener noreferrer'
							target='_blank'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5'
								viewBox='0 0 24 24'
								strokeWidth='2'
								stroke='currentColor'
								fill='none'
							>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<path d='M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5' />
								<line x1='10' y1='14' x2='20' y2='4' />
								<polyline points='15 4 20 4 20 9' />
							</svg>
						</a>
						{service.prs && (
							<a
								href='/'
								onClick={(e) => {
									e.preventDefault()

									modal.set(EnumModal.IN_DEV_BRANCHES, { service })
								}}
								className='text-indigo-600 flex place-items-center space-x-2 bg-indigo-100 py-1 px-2 rounded-full hover:bg-indigo-200 transition'
								rel='noreferrer noopenner'
								target='_blank'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='w-5 h-5'
									width='44'
									height='44'
									viewBox='0 0 24 24'
									strokeWidth='2'
									stroke='currentColor'
									fill='none'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path stroke='none' d='M0 0h24v24H0z' fill='none' />
									<circle cx='7' cy='18' r='2' />
									<circle cx='7' cy='6' r='2' />
									<circle cx='17' cy='6' r='2' />
									<line x1='7' y1='8' x2='7' y2='16' />
									<path d='M9 18h6a2 2 0 0 0 2 -2v-5' />
									<polyline points='14 14 17 11 20 14' />
								</svg>
								<span className='text-xs font-semibold'>
									{service.prs.length} prs
								</span>
							</a>
						)}
					</section>
					{service.runner ? (
						<p
							className={`${
								service.runner.isOnline()
									? 'bg-emerald-200 text-emerald-600'
									: 'bg-red-200 text-red-600'
							} text-xs py-1 px-2 rounded-full`}
						>
							{service!.runner.name}
						</p>
					) : (
						<p className='bg-gray-200 text-xs py-1 px-2 rounded-full text-gray-600'>
							Aucun runner
						</p>
					)}
				</footer>
			)}
		</article>
	)
}
