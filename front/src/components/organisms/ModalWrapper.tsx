import { Fragment, useContext, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { GlobalContext } from '../context/GlobalContext'

export default function ModalWrapper() {
	const { modal } = useContext(GlobalContext)
	const cancelButtonRef = useRef(null)

	return (
		<Transition.Root show={modal.node !== undefined} as={Fragment}>
			<Dialog
				as='div'
				auto-reopen='true'
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				onClose={() => modal.close()}
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
							{modal.node}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
