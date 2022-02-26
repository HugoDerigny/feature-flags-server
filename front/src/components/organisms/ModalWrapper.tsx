import { Fragment, useContext, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { GlobalContext } from '../context/GlobalContext'
import { EnumModal } from '../../types/EnumModals'
import ModalServiceConfig from '../molecules/modals/ModalServiceConfig'
import ModalAddElement from '../molecules/modals/ModalAddElement'
import ModalGroupConfig from '../molecules/modals/ModalGroupConfig'
import ModalHelpIntegration from '../molecules/modals/ModalHelpIntegration'
import ModalInDevBranches from '../molecules/modals/ModalInDevBranches'
import ModalFlagConfig from '../molecules/modals/ModalFlagConfig'

export default function ModalWrapper() {
	const { modal } = useContext(GlobalContext)
	const cancelButtonRef = useRef(null)

	function getComponent() {
		switch (modal.node) {
			case EnumModal.SERVICE_CONFIG:
				return <ModalServiceConfig {...modal.props} />

			case EnumModal.ADD_ELEMENT:
				return <ModalAddElement />

			case EnumModal.GROUP_CONFIG:
				return <ModalGroupConfig {...modal.props} />

			case EnumModal.HELP_INTEGRATION:
				return <ModalHelpIntegration service={modal.props!.service} />

			case EnumModal.IN_DEV_BRANCHES:
				return <ModalInDevBranches service={modal.props!.service} />

			case EnumModal.FLAG_CONFIG:
				return <ModalFlagConfig {...modal.props} />

			default:
				return null
		}
	}

	return (
		<Transition.Root show={modal.node !== undefined} as={Fragment}>
			<Dialog
				as='div'
				auto-reopen='true'
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				onClose={modal.close}
			>
				<div className='modal'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Dialog.Overlay className='modal__background' />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className='hidden sm:inline-block sm:align-middle sm:h-screen'
						aria-hidden='true'
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div ref={cancelButtonRef} className='modal__parent'>
							{getComponent()}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
