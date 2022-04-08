import { FC, SyntheticEvent, useContext, useState } from 'react'
import Flag from '../../model/Flag'
import { GlobalContext } from '../context/GlobalContext'
import ModalFlagConfig from './modals/ModalFlagConfig'
import { http, timeAgo } from '../../utils'

interface Props {
	flag: Flag
	fetchFlags: Function
}

export const FlagRow: FC<Props> = ({ flag, fetchFlags }) => {
	const { modal } = useContext(GlobalContext)
	const [hasCopiedKey, setHasCopiedKey] = useState<boolean>(false)

	function toggleActive(e: SyntheticEvent) {
		const initialStatus = flag.enabled
		flag.enabled = !initialStatus

		e.stopPropagation()

		http.put('/flags/' + flag!.id, flag)
			.then(() => {
				fetchFlags()
			})
			.catch(() => {
				flag.enabled = initialStatus
			})
	}

	function copyFlagKeyToClipboard(event: SyntheticEvent) {
		event.stopPropagation()

		navigator.clipboard.writeText(flag.key).then(() => {
			setHasCopiedKey(true)
			setTimeout(() => {
				setHasCopiedKey(false)
			}, 5000)
		})
	}

	return (
		<article
			className='row'
			onClick={() => modal.set(<ModalFlagConfig flag={flag} fetchFlags={fetchFlags} />)}
		>
			<div className='row__content'>
				<div className='row__start'>
					<button onClick={toggleActive} type='button' className='row__flag-button'>
						<svg
							className={
								'w-6 h-6 transition ' +
								(flag.isFullyEnabled()
									? 'text-primary-600'
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
					<p className='row__title'>{flag.key}</p>
					{flag.value && (
						<>
							<svg
								className='w-4 h-4 row__text'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M17 8l4 4m0 0l-4 4m4-4H3'
								/>
							</svg>
							<p className='row__subtitle'>{flag.value}</p>
						</>
					)}
					<button
						onClick={copyFlagKeyToClipboard}
						type='button'
						className='row__flag-button'
					>
						{hasCopiedKey ? (
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
				<p className='row__text row__end'>updated {timeAgo.format(flag.updatedAt)}</p>
			</div>
			{flag.summary && (
				<div className='row__content'>
					<div className='row__start ml-2'>
						<svg
							className='w-4 h-4 row__text'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
							/>
						</svg>
						<p className='row__text'>{flag.summary}</p>
					</div>
				</div>
			)}
		</article>
	)
}
