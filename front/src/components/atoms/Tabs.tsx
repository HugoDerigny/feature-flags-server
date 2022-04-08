interface TabsProps {
	choices: Array<{ key: string; label: string }>
	onChange: (key: string) => void
	value: string
}

export default function Tabs({ value, choices, onChange }: TabsProps) {
	return (
		<nav>
			<ul className='tabs'>
				{choices.map(({ key, label }) => (
					<li key={key}>
						<button
							onClick={() => onChange(key)}
							name={label}
							className={value === key ? 'tab tab__active' : 'tab'}
						>
							{label}
						</button>
					</li>
				))}
			</ul>
		</nav>
	)
}
