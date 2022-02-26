import { Dialog } from '@headlessui/react'
import ServiceGroup, { ServiceGroupFactory } from '../../../model/ServiceGroup'
import Button from '../../atoms/Button'
import { FormEvent, useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { ColorStyles } from '../../../types/ColorStyles'
import axios from 'axios'

type Props = {
	group?: ServiceGroup
}

export default function ModalGroupConfig({ group }: Props) {
	const { modal, setServices } = useContext(GlobalContext)

	const [name, setName] = useState<string>(group?.identifier || '')
	const [style, setStyle] = useState<string>(group?.style || ColorStyles.BLUE)

	const [loading, setLoading] = useState<boolean>(false)

	function handleSubmit(event: FormEvent) {
		event.preventDefault()

		setLoading(true)

		group ? updateGroup() : createGroup()
	}

	function createGroup() {
		axios
			.post(process.env.REACT_APP_API_URL + '/groups', { name, style: style.split('-')[0] })
			.then(({ data }) => {
				setServices(ServiceGroupFactory.fromJson(data))
				setLoading(false)
				modal.close()
			})
			.catch((err) => {
				console.log(err)
				setLoading(false)
			})
	}

	function updateGroup() {
		axios
			.put(process.env.REACT_APP_API_URL + '/groups/' + group!.id, {
				name,
				style: style.split('-')[0],
			})
			.then(({ data }) => {
				setServices(ServiceGroupFactory.fromJson(data))
				setLoading(false)
				modal.close()
			})
			.catch((err) => {
				console.log(err)
				setLoading(false)
			})
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						{group?.identifier
							? `Modifier le groupe ${group.identifier}`
							: 'Ajouter un groupe'}
					</Dialog.Title>
					<div className='mt-8 space-y-8'>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>
								1. Nom du groupe
							</legend>
							<label>
								<input
									name='name'
									className='form-input input'
									type='text'
									placeholder='catalogue'
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									defaultValue={group?.identifier}
								/>
							</label>
						</fieldset>
						<fieldset className='flex flex-col space-y-2'>
							<legend className='text-indigo-600 font-semibold'>2. Style</legend>
							<label className='flex justify-evenly pt-4 mx-16'>
								{Object.values(ColorStyles).map((color: string) => (
									<input
										required
										checked={color === style}
										type='radio'
										name='style'
										value={color}
										onChange={(e) => setStyle(e.target.value)}
										className={`w-6 h-6 rounded-full bg-${color} text-${color} border-none`}
									/>
								))}
							</label>
						</fieldset>
					</div>
				</div>
			</div>
			<div className='modal__footer'>
				<Button type='submit' name='add' color='full' loading={loading} disabled={loading}>
					{group ? 'Modifier' : 'Ajouter'}
				</Button>
				<Button type='button' name='cancel' onClick={modal.close} disabled={loading}>
					Annuler
				</Button>
			</div>
		</form>
	)
}
