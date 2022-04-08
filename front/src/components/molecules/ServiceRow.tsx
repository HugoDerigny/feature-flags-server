import { FC, SyntheticEvent, useContext, useState } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Service from '../../model/Service'
import ModalServiceConfig from './modals/ModalServiceConfig'
import { timeAgo } from '../../utils'

interface Props {
	service: Service
}

export const ServiceRow: FC<Props> = ({ service }) => {
	const { modal } = useContext(GlobalContext)

	const [hasCopiedId, setHasCopiedId] = useState<boolean>(false)

	function copyServiceIdToClipboard(event: SyntheticEvent) {
		event.stopPropagation()

		navigator.clipboard.writeText(service.id).then(() => {
			setHasCopiedId(true)
			setTimeout(() => {
				setHasCopiedId(false)
			}, 5000)
		})
	}

	return (
		<article
			className='row'
			onClick={() => modal.set(<ModalServiceConfig service={service} />)}
		>
			<div className='row__content'>
				<div className='row__start'>
					<p className='row__title'>{service.name}</p>
					<p className='row__text'>{service.id}</p>
					<button
						onClick={copyServiceIdToClipboard}
						type='button'
						className='row__flag-button'
					>
						{hasCopiedId ? (
							<svg
								className='w-4 h-4 text-green-500'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M5 13l4 4L19 7'
								/>
							</svg>
						) : (
							<svg
								className='w-4 h-4 text-gray-400'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
								/>
							</svg>
						)}
					</button>
				</div>
				<div className='row__end'>
					<p className='text-gray-400 text-sm'>
						updated {timeAgo.format(service.updatedAt)}
					</p>
				</div>
			</div>
		</article>
	)
}
