import { useState } from 'react'

type Props = {
	choices: Array<string>
	onChange: (newTab: string) => void
}

export default function Segmented({ choices, onChange }: Props) {
	// Limiting max tabs length of 6
	const tabs = choices.slice(0, 6)

	// Index of selected choice
	const [selectedTab, setSelectedTab] = useState<number>(0)

	const width = tabs.length === 1 ? 'w-full' : `w-1/${tabs.length}`

	function onTabChange(newTab: string, idx: number) {
		onChange(newTab)
		setSelectedTab(idx)
	}

	return (
		<div className='bg-gray-200 bg-opacity-50 rounded-lg p-0.5 w-min'>
			<div className='relative flex items-center'>
				{/*<div className='absolute w-full'>*/}
				{/*	<div className={`${width} flex justify-between m-auto`}>*/}
				{/*		<div className='h-3 w-px bg-gray-400  rounded-full opacity-100 transition-opacity duration-100 ease-in-out' />*/}
				{/*		<div className='h-3 w-px bg-gray-400 rounded-full opacity-100 transition-opacity duration-100 ease-in-out' />*/}
				{/*	</div>*/}
				{/*</div>*/}

				<div
					className={`absolute left-0 inset-y-0 ${width} flex bg-white bg-opacity-50 transition-all ease-in-out duration-200 rounded-md shadow`}
					style={{
						transform: `translate(${selectedTab * 100}%)`,
					}}
				/>

				{tabs.map((choice: string, idx: number) => (
					<div
						key={idx}
						onClick={() => onTabChange(choice, idx)}
						className='relative flex-1 flex text-sm font-semibold px-3 md:px-4 lg:px-6 items-center justify-center cursor-pointer m-px p-px'
					>
						{choice}
					</div>
				))}
			</div>
		</div>
	)
}
