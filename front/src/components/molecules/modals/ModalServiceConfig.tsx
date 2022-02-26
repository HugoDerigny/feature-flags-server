import { Dialog } from '@headlessui/react'
import ServiceGroup, { ServiceGroupFactory } from '../../../model/ServiceGroup'
import Button from '../../atoms/Button'
import Service from '../../../model/Service'
import { FormEvent, useContext, useReducer, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { DisplayType } from '../../../types/RawService'
import axios from 'axios'
import { EnumModal } from '../../../types/EnumModals'

type Props = {
	service?: Service
}

type ReducerType = {
	name: string
	groupId: number
	environment: string
	displayType: DisplayType
	gitUrl?: string
	accessUrl?: string
	runnerName?: string
}

type ReducerAction = {
	key: string
	value: string | number | DisplayType
}

export default function ModalServiceConfig({ service }: Props) {
	const { services, setServices, modal } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)

	const [state, dispatch] = useReducer(_reducer, {
		name: service?.name || '',
		groupId: service?.groupId || services[0].id,
		environment: service?.environment || 'test',
		displayType: service?.displayType || DisplayType.IDLE,
		gitUrl: service?.gitUrl || '',
		accessUrl: service?.accessUrl || '',
		runnerName: service?.runner?.name || '',
	})

	function _reducer(state: ReducerType, action: ReducerAction): ReducerType {
		const { key, value } = action

		function formatValue() {
			switch (key) {
				case 'groupId':
					return Number(value)

				default:
					return value
			}
		}

		return { ...state, [key]: formatValue() }
	}

	function handleSubmit(event: FormEvent): void {
		event.preventDefault()

		setLoading(true)

		service ? updateService() : createService()
	}

	function createService(): void {
		axios
			.post(process.env.REACT_APP_API_URL + '/services', state)
			.then(({ data }) => {
				setServices(ServiceGroupFactory.fromJson(data))
				setLoading(false)
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	function updateService(): void {
		axios
			.put(process.env.REACT_APP_API_URL + '/services/' + service!.token, state)
			.then(({ data }) => {
				setServices(ServiceGroupFactory.fromJson(data))
				setLoading(false)
				modal.close()
			})
			.catch(({ response }) => {
				console.error(response)
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{service?.name
							? `Modifier le service ${service.name}`
							: 'Ajouter un service'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								1. Groupe du service
							</legend>
							<label htmlFor='group'>Groupe</label>
							<select
								id='group'
								name='group'
								className='form-select input'
								onChange={(e) =>
									dispatch({ key: 'groupId', value: e.target.value })
								}
							>
								{services.map((group: ServiceGroup) => (
									<option
										selected={state.groupId === group.id}
										key={group.identifier}
										value={group.id}
									>
										{group.identifier}
									</option>
								))}
							</select>
							<label>
								Environnement
								<select
									name='response-type'
									className='form-select input'
									onChange={(e) =>
										dispatch({ key: 'environment', value: e.target.value })
									}
								>
									<option value='test' selected={'test' === state.environment}>
										Test
									</option>
									<option value='pra' selected={'pra' === state.environment}>
										Pra
									</option>
									<option value='prod' selected={'prod' === state.environment}>
										Prod
									</option>
								</select>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								2. Dénomination du service
							</legend>
							<label>
								<input
									name='name'
									className='form-input input'
									type='text'
									placeholder='api'
									required
									onChange={(e) =>
										dispatch({ key: 'name', value: e.target.value })
									}
									value={state.name}
									defaultValue={service?.name}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								3. Détail du service
							</legend>
							<label>
								URL d'accès (autorisation)
								<input
									name='access-url'
									className='form-input input'
									type='text'
									placeholder='https://...'
									value={state.accessUrl}
									onChange={(e) =>
										dispatch({ key: 'accessUrl', value: e.target.value })
									}
									defaultValue={service?.accessUrl}
								/>
							</label>

							<label>
								Répertoire Git{' '}
								<span className='text-gray-600 italic text-sm'>(optionnel)</span>
								<input
									name='git-url'
									className='form-input input'
									type='text'
									placeholder='https://github.com/...'
									value={state.gitUrl}
									onChange={(e) =>
										dispatch({ key: 'gitUrl', value: e.target.value })
									}
									defaultValue={service?.gitUrl}
								/>
							</label>

							<label>
								Nom du runner Git{' '}
								<span className='text-gray-600 italic text-sm'>(optionnel)</span>
								<input
									name='runner'
									className='form-input input'
									type='text'
									placeholder='prod-front'
									value={state.runnerName}
									onChange={(e) =>
										dispatch({ key: 'runnerName', value: e.target.value })
									}
									defaultValue={service?.runner?.name}
								/>
							</label>
						</fieldset>
						{service?.token && (
							<section className='flex flex-col space-y-2'>
								<h4 className='text-indigo-600 font-semibold'>4. Autorisation</h4>
								<p>Token d'accès pour reporter les vitaux:</p>
								<pre className='select-all font-mono p-2 border-indigo-300 border-2 rounded-lg'>
									{service!.token}
								</pre>
								<button
									type='button'
									name='show-integration'
									className='self-start text-xs text-indigo-600 hover:underline cursor-pointer'
									onClick={() =>
										modal.set(EnumModal.HELP_INTEGRATION, { service })
									}
								>
									Intégrer ce service
								</button>
							</section>
						)}
					</div>
				</div>
			</div>
			<div className='modal__footer'>
				<Button type='submit' name='add' color='full' disabled={loading} loading={loading}>
					{service ? 'Modifier' : 'Ajouter'}
				</Button>
				<Button type='button' name='cancel' onClick={modal.close} disabled={loading}>
					Annuler
				</Button>
			</div>
		</form>
	)
}
