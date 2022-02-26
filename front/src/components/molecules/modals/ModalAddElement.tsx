import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { EnumModal } from '../../../types/EnumModals'

export default function ModalAddElement() {
	const { modal } = useContext(GlobalContext)

	return (
		<>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						Ajouter un élement
					</Dialog.Title>
					<section className='flex flex-col space-y-4 mt-8'>
						<Button
							type='button'
							name='add-group'
							color='light'
							onClick={() => modal.set(EnumModal.GROUP_CONFIG)}
						>
							Groupe
						</Button>
						<Button
							type='button'
							name='add-service'
							color='full'
							onClick={() => modal.set(EnumModal.SERVICE_CONFIG)}
						>
							Service
						</Button>
					</section>
				</div>
			</div>
			<div className='modal__footer'>
				<Button type='button' name='cancel' onClick={modal.close}>
					Annuler
				</Button>
			</div>
		</>
	)
}
