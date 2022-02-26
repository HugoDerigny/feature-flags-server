import { FC, SyntheticEvent, useContext, useState } from 'react'
import Flag from '../../model/Flag'
import { EnumModal } from '../../types/EnumModals'
import { GlobalContext } from '../context/GlobalContext'
import axios from 'axios'

type Props = {
	flag: Flag
	fetchFlags: Function
}

export const FlagRow: FC<Props> = ({ flag, fetchFlags }) => {
	const { modal } = useContext(GlobalContext)

	const [loading, setLoading] = useState<boolean>(false)

	function toggleActive(e: SyntheticEvent) {
		const initialStatus = flag.enabled
		flag.enabled = !initialStatus

		setLoading(true)
		e.stopPropagation()

		axios
			.put(process.env.REACT_APP_API_URL + '/flags/' + flag!.id, flag)
			.then(() => {
				fetchFlags()
				setLoading(false)
			})
			.catch(({ response }) => {
				flag.enabled = initialStatus
				setLoading(false)
			})
	}

	return (
		<article
			className='p-6 flex place-items-center justify-between cursor-pointer'
			onClick={() => modal.set(EnumModal.FLAG_CONFIG, { flag, fetchFlags })}
		>
			<div className='flex space-x-4 place-items-center'>
				<button
					onClick={toggleActive}
					type='button'
					className='transition pointer-events-auto bg-transparent hover:bg-gray-100 rounded-full p-2'
				>
					<svg
						className={
							'w-6 h-6 transition ' +
							(flag.isFullyEnabled()
								? 'text-indigo-600'
								: flag.isPartiallyEnabled()
								? 'text-orange-300'
								: 'text-gray-300')
						}
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							fillRule='evenodd'
							d='M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
				<p className='font-bold'>{flag.key}</p>
				<p className='text-sm text-gray-400'>{flag.description}</p>
			</div>
			<div className='flex space-x-4 place-items-center'>
				<p className='text-gray-400 text-sm'>Màj le {flag.updatedAt.toLocaleString()}</p>
				<p className='text-xs text-indigo-500 bg-indigo-100 px-2 py-1 rounded-full font-semibold font-mono'>
					{flag._serviceLabel}
				</p>
			</div>
		</article>
	)
}
