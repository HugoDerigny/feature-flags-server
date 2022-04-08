import { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import Flag from '../../model/Flag'
import { FlagRow } from '../molecules/FlagRow'
import { GlobalContext } from '../context/GlobalContext'
import Tabs from '../atoms/Tabs'
import { log } from 'util'
import Button from '../atoms/Button'

interface Props {
	flags: Flag[]
	fetchFlags: Function
}

interface FlagsFilter {
	type: 'ALL' | 'ENABLED' | 'PARTIALLY_ENABLED' | 'DISABLED'
	value: string
}

const initialFilter: FlagsFilter = {
	type: 'ALL',
	value: '',
}

const FlagsList: FC<Props> = ({ flags, fetchFlags }) => {
	const { services } = useContext(GlobalContext)

	const [selectedServiceId, setSelectedServiceId] = useState<string>()
	const [flagsFilter, setFlagsFilter] = useState<FlagsFilter>(initialFilter)

	useEffect(() => {
		if (services && services.length > 0) {
			setSelectedServiceId(getFirstServiceIdWhoHasFlags())
		}
	}, [services])

	function getFirstServiceIdWhoHasFlags(): string {
		for (const { id } of services!) {
			if (getFlagsByServiceId(id).length > 0) {
				return id
			}
		}

		return services![0].id
	}

	function getFlagsByServiceId(serviceId: string): Flag[] {
		return flags.filter((flag: Flag) => flag.serviceId === serviceId)
	}

	function filterFlags(flag: Flag): boolean {
		const { key, value, summary, enabled } = flag
		const { type, value: filterValue } = flagsFilter

		function filterWithValue(): boolean {
			if (filterValue.trim() === '') {
				return true
			}

			return [key, value, summary].some((value) =>
				new RegExp(filterValue, 'gi').test(value || '')
			)
		}

		const map = {
			ALL: true,
			DISABLED: !enabled,
			ENABLED: flag.isFullyEnabled(),
			PARTIALLY_ENABLED: flag.isPartiallyEnabled(),
		}

		return map[type] && filterWithValue()
	}

	function isDefaultFilter(): boolean {
		return JSON.stringify(initialFilter) === JSON.stringify(flagsFilter)
	}

	return selectedServiceId && services ? (
		flags.length === 0 ? (
			<p className='text-gray-400 mt-8'>
				Start by adding a flag, click on the "+ Add" button.
			</p>
		) : (
			<>
				<Tabs
					value={selectedServiceId}
					choices={services.map(({ id: key, name: label }) => ({
						key,
						label: `${label} (${getFlagsByServiceId(key).length})`,
					}))}
					onChange={setSelectedServiceId}
				/>
				<fieldset className='py-2 space-x-2 flex place-items-center'>
					<Button
						type='reset'
						name='flag-filter-reset'
						className='ml-0 mt-1 self-stretch'
						color='full'
						disabled={isDefaultFilter()}
						onClick={() => setFlagsFilter(initialFilter)}
					>
						Reset
					</Button>
					<div>
						<label htmlFor='flag-filter-type' className='sr-only'>
							Service
						</label>
						<select
							id='flag-filter-type'
							name='flag-filter-type'
							className='form-select input'
							value={flagsFilter.type}
							onChange={(e: ChangeEvent<HTMLSelectElement>) =>
								// @ts-ignore
								setFlagsFilter((filter) => ({
									...filter,
									type: e.target.value,
								}))
							}
						>
							<option value='ALL'>All flags</option>
							<option value='ENABLED'>Flags Enabled</option>
							<option value='PARTIALLY_ENABLED'>Flags Partially enabled</option>
							<option value='DISABLED'>Flags Disabled</option>
						</select>
					</div>
					<label className='flex-1'>
						<span className='sr-only'>Filter</span>
						<input
							name='flag-filter'
							className='form-input input'
							type='text'
							placeholder='Filter flags by key, value, summary'
							required
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setFlagsFilter((filter) => ({
									...filter,
									value: e.target.value,
								}))
							}
							value={flagsFilter.value}
						/>
					</label>
				</fieldset>
				<section className='row-wrapper'>
					{(() => {
						const flagsForSelectedService = getFlagsByServiceId(selectedServiceId!)

						if (flagsForSelectedService.length === 0) {
							return (
								<p className='text-gray-400 py-4 px-6'>
									No flags set up for this service.
								</p>
							)
						}

						return flagsForSelectedService
							.filter(filterFlags)
							.map((flag) => (
								<FlagRow key={flag.key} flag={flag} fetchFlags={fetchFlags} />
							))
					})()}
				</section>
			</>
		)
	) : (
		<p className='text-gray-400 mt-8'>You must add a service to add a flag.</p>
	)
}

export default FlagsList
