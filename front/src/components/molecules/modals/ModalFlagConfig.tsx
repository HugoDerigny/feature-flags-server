import { Dialog } from '@headlessui/react'
import ServiceGroup, { ServiceGroupFactory } from '../../../model/ServiceGroup'
import Button from '../../atoms/Button'
import { FormEvent, useContext, useReducer, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { DisplayType } from '../../../types/RawService'
import axios from 'axios'
import { EnumModal } from '../../../types/EnumModals'
import Flag from '../../../model/Flag'
import safari from '../../../img/browsers/safari.png'
import firefox from '../../../img/browsers/firefox.png'
import chrome from '../../../img/browsers/chrome.png'
import ie from '../../../img/browsers/ie.png'
import edge from '../../../img/browsers/edge.png'
import opera from '../../../img/browsers/opera.png'

type Props = {
	flag?: Flag
	fetchFlags?: Function
}

type ReducerType = {
	serviceId: string
	key: string
	description?: string
	value?: string

	enabled: boolean
	enabledForOpera: boolean
	enabledForFirefox: boolean
	enabledForSafari: boolean
	enabledForIE: boolean
	enabledForEdge: boolean
	enabledForChrome: boolean
}

type ReducerAction = {
	key: string
	value: string | boolean
}

export default function ModalFlagConfig({ flag, fetchFlags }: Props) {
	const { modal, getServicesId } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)

	const [state, dispatch] = useReducer(_reducer, {
		key: flag?.key ?? '',
		description: flag?.description ?? '',
		value: flag?.value ?? '',
		serviceId: flag?.serviceId ?? getServicesId()[0].id,
		enabled: flag?.enabled ?? false,
		enabledForOpera: flag?.enabledForOpera ?? false,
		enabledForFirefox: flag?.enabledForFirefox ?? false,
		enabledForSafari: flag?.enabledForSafari ?? false,
		enabledForIE: flag?.enabledForIE ?? false,
		enabledForEdge: flag?.enabledForEdge ?? false,
		enabledForChrome: flag?.enabledForChrome ?? false,
	})

	function _reducer(state: ReducerType, action: ReducerAction): ReducerType {
		const { key, value } = action

		function formatValue() {
			if (key === 'key') {
				// kebab-casing the key
				return (value as string)
					.replace(/\s+/g, '-')
					.replace(/[^a-z-]/, '')
					.toLowerCase()
			}

			return value
		}

		return { ...state, [key]: formatValue() }
	}

	function handleSubmit(event: FormEvent): void {
		event.preventDefault()

		setLoading(true)

		flag ? updateFlag() : createFlag()
	}

	function createFlag(): void {
		axios
			.post(process.env.REACT_APP_API_URL + '/flags', state)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	function updateFlag(): void {
		axios
			.put(process.env.REACT_APP_API_URL + '/flags/' + flag!.id, state)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	function deleteFlag(): void {
		axios
			.delete(process.env.REACT_APP_API_URL + '/flags/' + flag!.id)
			.then(() => {
				setLoading(false)
				fetchFlags!()
				modal.close()
			})
			.catch(({ response }) => {
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{flag ? `Modifier le flag ${flag.key}` : 'Ajouter un flag'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								1. Service et key du Flag
							</legend>
							<label htmlFor='group'>Service</label>
							<select
								id='serviceId'
								name='serviceId'
								className='form-select input'
								onChange={(e) =>
									dispatch({ key: 'serviceId', value: e.target.value })
								}
							>
								{getServicesId().map((service) => (
									<option
										value={service.id}
										key={service.id}
										selected={service.id === state.serviceId}
									>
										{service.label}
									</option>
								))}
							</select>
							<label>
								Key
								<input
									name='flag-key'
									className='form-input input'
									type='text'
									placeholder='admin-dashboard'
									required
									onChange={(e) =>
										dispatch({ key: 'key', value: e.target.value })
									}
									value={state.key}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								2. Plus d'options
							</legend>
							<label>
								Description{' '}
								<span className='text-gray-600 italic text-sm'>(optionnel)</span>
								<input
									name='flag-description'
									className='form-input input'
									type='text'
									placeholder='Lorem ipsum...'
									value={state.description}
									onChange={(e) =>
										dispatch({ key: 'description', value: e.target.value })
									}
								/>
							</label>
							<label>
								Valeur affichée{' '}
								<span className='text-gray-600 italic text-sm'>(optionnel)</span>
								<input
									name='flag-value'
									className='form-input input'
									type='text'
									placeholder='Lorem ipsum...'
									value={state.value}
									onChange={(e) =>
										dispatch({ key: 'value', value: e.target.value })
									}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								3. Navigateurs
							</legend>
							<label className='relative flex flex-col group text-base'>
								Actif pour tous
								<input
									name='flag-enabled'
									className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
									type='checkbox'
									checked={state.enabled}
									onChange={(e) =>
										dispatch({ key: 'enabled', value: e.target.checked })
									}
								/>
								<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-green-600 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
							</label>
							<div className='flex flex-wrap space-x-4 mt-8'>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={safari} alt='Safari' className='w-16 h-16' />
									<input
										name='flag-enabledForSafari'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForSafari}
										onChange={(e) =>
											dispatch({
												key: 'enabledForSafari',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={firefox} alt='Firefox' className='w-16 h-16' />
									<input
										name='flag-enabledForFirefox'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForFirefox}
										onChange={(e) =>
											dispatch({
												key: 'enabledForFirefox',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={chrome} alt='Chrome' className='w-16 h-16' />
									<input
										name='flag-enabledForChrome'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForChrome}
										onChange={(e) =>
											dispatch({
												key: 'enabledForChrome',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={edge} alt='Edge' className='w-16 h-16' />
									<input
										name='flag-enabledForEdge'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForEdge}
										onChange={(e) =>
											dispatch({
												key: 'enabledForEdge',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={ie} alt='IE' className='w-16 h-16' />
									<input
										name='flag-enabledForIE'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForIE}
										onChange={(e) =>
											dispatch({
												key: 'enabledForIE',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
								<label className='relative flex flex-col place-items-center group text-base'>
									<img src={opera} alt='Opera' className='w-16 h-16' />
									<input
										name='flag-enabledForOpera'
										className='absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md'
										type='checkbox'
										disabled={!state.enabled}
										checked={state.enabledForOpera}
										onChange={(e) =>
											dispatch({
												key: 'enabledForOpera',
												value: e.target.checked,
											})
										}
									/>
									<span className='w-12 h-6 flex items-center flex-shrink-0 my-2 p-1 bg-gray-200 rounded-full duration-300 ease-in-out peer-checked:bg-indigo-600 peer-disabled:opacity-30 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1' />
								</label>
							</div>
						</fieldset>
					</div>
				</div>
			</div>
			<footer className='modal__footer justify-between'>
				<div>
					<Button
						type='submit'
						name='add'
						color='full'
						disabled={loading}
						loading={loading}
					>
						{flag ? 'Modifier' : 'Ajouter'}
					</Button>
					<Button type='button' name='cancel' onClick={modal.close} disabled={loading}>
						Annuler
					</Button>
				</div>
				{flag && (
					<Button
						type='button'
						name='remove'
						color='full'
						variant='danger'
						onClick={deleteFlag}
						disabled={loading}
					>
						Supprimer
					</Button>
				)}
			</footer>
		</form>
	)
}
