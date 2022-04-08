import { FC, useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Button from '../atoms/Button'
import ModalServiceConfig from '../molecules/modals/ModalServiceConfig'
import ServicesList from '../organisms/ServicesList'

const Services: FC<any> = () => {
	const { modal } = useContext(GlobalContext)

	return (
		<>
			<header className='pb-4 flex justify-between place-items-center'>
				<h1 className='title'>Services</h1>
				<Button
					name='add'
					color='full'
					type='button'
					onClick={() => modal.set(<ModalServiceConfig />)}
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
					Add
				</Button>
			</header>
			<ServicesList />
		</>
	)
}

export default Services
