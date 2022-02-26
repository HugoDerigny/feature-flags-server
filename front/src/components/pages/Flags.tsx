import { FC, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Button from '../atoms/Button'
import { EnumModal } from '../../types/EnumModals'
import { FlagsList } from '../organisms/FlagsList'
import Flag from '../../model/Flag'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ServiceGroupFactory } from '../../model/ServiceGroup'

const Flags: FC<any> = () => {
	const { modal } = useContext(GlobalContext)

	const [flags, setFlags] = useState<Flag[]>([])

	useEffect(() => {
		fetchFlags()
	}, [])

	async function fetchFlags(): Promise<void> {
		try {
			const response: AxiosResponse = await axios.get(
				process.env.REACT_APP_API_URL + '/flags'
			)

			setFlags(response.data.map(Flag.fromJson))
		} catch (e) {
			const error = e as AxiosError

			console.error(error.response)
		}
	}

	return (
		<>
			<header className='pb-4 flex justify-between place-items-center'>
				<h1 className='title'>Flags</h1>
				<Button
					name='add'
					color='full'
					type='button'
					onClick={() => modal.set(EnumModal.FLAG_CONFIG, { fetchFlags })}
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
			</header>
			<FlagsList flags={flags} fetchFlags={fetchFlags} />
		</>
	)
}

export default Flags
