import { ReactNode, SyntheticEvent } from 'react'

type Props = {
	type: 'button' | 'reset' | 'submit'
	name: string
	children: ReactNode
	className?: string
	color?: 'light' | 'full'
	variant?: 'default' | 'danger'
	loading?: boolean
	onClick?: (event: SyntheticEvent) => void
	disabled?: boolean
}

export default function Button({
	color,
	loading,
	name,
	onClick,
	type,
	disabled,
	children,
	className,
	variant,
}: Props) {
	function getClass() {
		const finalClass = `button ${className ?? ''}`

		const hasVariant = variant && variant !== 'default'

		return `${finalClass} button__${color}${hasVariant ? `__${variant}` : ''}`
	}

	return (
		<button
			disabled={disabled || loading}
			type={type}
			name={name}
			onClick={onClick}
			className={getClass()}
		>
			{!loading ? (
				children
			) : (
				<svg
					className='w-6 h-6 animate-spin'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M20 12H4'
					/>
				</svg>
			)}
		</button>
	)
}
