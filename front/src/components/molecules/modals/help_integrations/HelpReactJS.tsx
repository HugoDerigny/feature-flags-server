import Service from '../../../../model/Service'

const code = `
import reportWebVitals from './reportWebVitals';

reportWebVitals((metric) => {			
	const body = JSON.stringify(metric)
	const url = \`\${ADMINEO_URL}/services/\${ADMINEO_TOKEN}/vitals\`
	
	if (metric.name === 'LCP') {
		axios.post(url, body, {headers: {'Content-type': 'application/json'}})
	}
})
`

export default function HelpReactJs({ service }: { service: Service }) {
	function copyCodeToClipboard(): void {
		const pre: HTMLPreElement = document.querySelector('pre')!!

		const selection = window.getSelection()!!
		const range = document.createRange()
		range.selectNodeContents(pre)
		selection.removeAllRanges()
		selection.addRange(range)

		document.execCommand('copy')
	}

	return (
		<article className='py-4 space-y-4'>
			<figure className='w-full'>
				<img
					src='https://www.ubidreams.fr/wp-content/uploads/2020/06/logo-react-js.png'
					alt='React.JS'
					className='w-24 h-auto mx-auto'
				/>
				<figcaption className='sr-only'>Intégration avec React.JS</figcaption>
			</figure>
			<p>Dans votre projet React.JS,</p>
			<p>
				allez dans le fichier <code>index.js</code> et ajoutez la fonction suivante dans
				celui-ci.
			</p>
			<div className='bg-gray-100 rounded-xl px-8 pb-4 pt-8 w-full overflow-auto relative'>
				<button
					className='absolute top-2 left-2 bg-gray-200 p-2 rounded-xl hover:bg-gray-300 transition duration-75'
					onClick={copyCodeToClipboard}
				>
					<svg
						className='w-6 h-6'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
						/>
					</svg>
				</button>
				<pre>{code}</pre>
			</div>
			<p>
				Il suffit par la suite de changer les valeurs <code>ADMINEO_URL</code> et{' '}
				<code>ADMINEO_TOKEN</code> par les valeurs correspondantes.
			</p>
			<hr />
			<p className='font-bold'>Pour votre service :</p>
			<p>
				<code>
					<span className='text-purple-600 italic'>ADMINEO_URL</span>=
					<span className='text-emerald-600'>{process.env.REACT_APP_API_URL}</span>
				</code>
				<br />
				<code>
					<span className='text-purple-600 italic'>ADMINEO_TOKEN</span>=
					<span className='text-emerald-600'>{service.token}</span>
				</code>
			</p>
		</article>
	)
}
