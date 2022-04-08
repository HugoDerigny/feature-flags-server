import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import Service from '../../../model/Service'
import { FC, FormEvent, useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { http } from '../../../utils'

interface Props {
	service?: Service
}

const ModalServiceConfig: FC<Props> = ({ service }) => {
	const { fetchServices, modal } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)

	const [name, setName] = useState<string>(service?.name ?? '')

	function handleSubmit(event: FormEvent): void {
		event.preventDefault()

		setLoading(true)

		service ? updateService() : createService()
	}

	function createService(): void {
		http.post('/services', { name })
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function updateService(): void {
		http.put(`/services/${service!.id}`, { name })
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function deleteService(): void {
		setLoading(true)

		http.delete(`/services/${service!.id}`)
			.then(() => {
				fetchServices()
				modal.close()
			})
			.catch((e) => {
				// TODO: better error handling
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{service ? `Update ${service!.name}` : 'Add a service'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-primary-600 font-semibold'>
								Service's label
							</legend>
							<label>
								<input
									name='service-name'
									className='form-input input'
									type='text'
									placeholder='my-front-end'
									required
									onChange={(e) => setName(e.target.value)}
									value={name}
								/>
							</label>
						</fieldset>
					</div>
				</div>
			</div>
			<div className='modal__footer justify-between'>
				<div>
					<Button
						type='submit'
						name='add'
						color='full'
						disabled={loading}
						loading={loading}
					>
						{service ? 'Update' : 'Add'}
					</Button>
					<Button
						type='button'
						name='cancel'
						onClick={() => modal.close()}
						disabled={loading}
					>
						Close
					</Button>
				</div>
				{service && (
					<Button
						type='button'
						name='remove'
						color='full'
						variant='danger'
						onClick={() => deleteService()}
						disabled={loading || service.flags.length > 0}
						title={
							service.flags.length > 0
								? "You can't remove this service because there is at least one flag linked to it."
								: ''
						}
					>
						Delete
					</Button>
				)}
			</div>
		</form>
	)
}

export default ModalServiceConfig
