import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import ServiceGroup from '../../model/ServiceGroup'
import { EnumModal } from '../../types/EnumModals'
import Button from '../atoms/Button'
import ServicesGroup from '../organisms/ServicesGroup'

export default function Services() {
	const { services, modal, zenMode } = useContext(GlobalContext)

	return (
		<>
			<header
				className={`flex flex-col md:flex-row justify-between md:place-items-center pb-4 duration-500 transition-all ease-in-out ${
					zenMode.isSet ? '-mt-24 mb-4' : 'mt-0 mb-0'
				}`}
			>
				<h1 className='title'>Services</h1>
				<section className='flex md:self-center space-x-4'>
					<Button
						type='button'
						name='zen-mode'
						color='full'
						onClick={() => zenMode.set(true)}
					>
						Mode zen
					</Button>
					<Button
						type='button'
						name='add-element'
						color='light'
						onClick={() => modal.set(EnumModal.ADD_ELEMENT)}
					>
						<svg
							className='w-6 h-6 mr-2'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						Ajouter
					</Button>
				</section>
			</header>
			{services.length > 0 ? (
				<div className='flex flex-wrap'>
					{services.map((serviceGroup: ServiceGroup, idx: number) => (
						<ServicesGroup key={idx} serviceGroup={serviceGroup} idx={idx} />
					))}
				</div>
			) : (
				<div className='w-full h-96 flex justify-center place-items-center'>
					<p className='text-gray-400'>Aucun service n'a été récupéré.</p>
				</div>
			)}
		</>
	)
}
