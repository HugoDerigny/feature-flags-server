import { FC } from 'react'
import Flag from '../../model/Flag'
import { FlagRow } from '../molecules/FlagRow'

type Props = {
	flags: Flag[]
	fetchFlags: Function
}

export const FlagsList: FC<Props> = ({ flags, fetchFlags }) => {
	return (
		<section className='bg-white rounded-2xl shadow-lg mt-4'>
			<div className='flex flex-col divide-y'>
				{flags.map((flag) => (
					<FlagRow key={flag.key} flag={flag} fetchFlags={fetchFlags} />
				))}
			</div>
		</section>
	)
}
