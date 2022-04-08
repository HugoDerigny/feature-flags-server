import React from 'react'

interface ButtonProps {
	color?: 'light' | 'full'
	variant?: 'default' | 'danger'
	loading?: boolean
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
	title,
	variant,
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
			title={title}
		>
			{!loading ? (
				children
			) : (
				<svg
					className='w-5 h-5 animate-spin'
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
