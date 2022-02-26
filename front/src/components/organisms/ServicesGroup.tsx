import ServiceGroup from '../../model/ServiceGroup'
import { useContext, useState } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Segmented from '../atoms/Segmented'
import { EnumModal } from '../../types/EnumModals'
import Service from '../../model/Service'
import ServiceCard from '../molecules/ServiceCard'

export default function ServicesGroup({
	serviceGroup,
}: {
	serviceGroup: ServiceGroup
	idx: number
}) {
	const { modal, zenMode } = useContext(GlobalContext)
	const [env, setEnv] = useState<string>(serviceGroup.getEnvs()[0])

	return (
		<div className='xl:px-4 py-4 w-full xl:w-1/2'>
			<section
				className={`border-l-8 border-${serviceGroup.style} bg-${serviceGroup.style} bg-opacity-10 shadow-lg p-4 rounded-2xl overflow-hidden`}
			>
				<header
					className={`flex flex-col md:flex-row justify-between md:place-items-center bg-${serviceGroup.style} bg-opacity-25 rounded-2xl py-2 px-4 pl-6`}
				>
					<h2 className='text-2xl text-white font-bold tracking-wide'>
						{serviceGroup.identifier}
					</h2>
					<section className='flex place-items-center justify-between space-x-4'>
						<Segmented
							choices={serviceGroup.getEnvs()}
							onChange={(newTab) => setEnv(newTab)}
						/>
						{!zenMode.isSet && (
							<button
								onClick={() =>
									modal.set(EnumModal.GROUP_CONFIG, { group: serviceGroup })
								}
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
					</section>
				</header>

				<div className='flex flex-wrap mt-4 -mx-2'>
					{serviceGroup.getFromEnv(env).map((service: Service) => (
						<div
							key={service.token}
							className={`${
								serviceGroup.getFromEnv(env).length === 1
									? 'w-full'
									: 'w-full md:w-1/2'
							} p-2`}
						>
							<ServiceCard service={service} />
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
