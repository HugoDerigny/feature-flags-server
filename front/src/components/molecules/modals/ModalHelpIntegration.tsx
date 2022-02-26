import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import { useContext, useState } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import Service from '../../../model/Service'
import HelpNextJS from './help_integrations/HelpNextJS'
import HelpReactJs from './help_integrations/HelpReactJS'
import HelpExpressJS from './help_integrations/HelpExpressJS'

export default function ModalHelpIntegration({ service }: { service: Service }) {
	const { modal } = useContext(GlobalContext)

	enum IntegrationType {
		NEXTJS = 'nextjs',
		REACTJS = 'reactjs',
		EXPRESSJS = 'expressjs',
	}

	const [integrationType, setIntegrationType] = useState<IntegrationType | null>(null)

	const intregrationComponent = {
		nextjs: <HelpNextJS service={service} />,
		reactjs: <HelpReactJs service={service} />,
		expressjs: <HelpExpressJS service={service} />,
	}

	return (
		<>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						Intégrer le service
					</Dialog.Title>
					{integrationType ? (
						intregrationComponent[integrationType]
					) : (
						<>
							<h4 className='text-sm text-gray-800 mt-8 mb-8'>
								Sous quelle plateforme est le service ?
							</h4>
							<section className='mb-8'>
								<h5 className='uppercase text-indigo-600 tracking-wide font-semibold text-sm'>
									Web
								</h5>
								<article className='flex flex-wrap mt-2'>
									<div className='w-1/3'>
										<button
											name={IntegrationType.REACTJS}
											onClick={() =>
												setIntegrationType(IntegrationType.REACTJS)
											}
											className='border h-32 w-full flex rounded-l-lg place-items-center justify-center relative p-8 hover:border-gray-500'
										>
											<img
												className='w-auto h-auto'
												src='https://www.ubidreams.fr/wp-content/uploads/2020/06/logo-react-js.png'
												alt='React.JS'
											/>
										</button>
									</div>
									<div className='w-1/3'>
										<button
											type='button'
											name={IntegrationType.NEXTJS}
											onClick={() =>
												setIntegrationType(IntegrationType.NEXTJS)
											}
											className='border h-32 w-full flex place-items-center justify-center relative p-8 hover:border-gray-500'
										>
											<img
												className='w-auto h-auto'
												src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/1200px-Nextjs-logo.svg.png'
												alt='Next.JS'
											/>
										</button>
									</div>
									<div className='w-1/3'>
										<button
											type='button'
											name={IntegrationType.EXPRESSJS}
											onClick={() =>
												setIntegrationType(IntegrationType.EXPRESSJS)
											}
											className='border h-32 w-full rounded-r-lg flex place-items-center justify-center relative p-8 hover:border-gray-500'
										>
											<img
												className='w-auto h-auto'
												src='https://assets.website-files.com/60b9fdcaf8c317a1cfdb2bd9/60d5df5a051d8765f7027878_expressjs.png'
												alt='Express.JS'
											/>
										</button>
									</div>
								</article>
							</section>
						</>
					)}
				</div>
			</div>
			<div className='modal__footer'>
				<Button type='button' name='cancel' onClick={modal.close}>
					Fermer
				</Button>
				{integrationType && (
					<Button
						type='button'
						color='full'
						name='back'
						onClick={() => setIntegrationType(null)}
					>
						Retour
					</Button>
				)}
			</div>
		</>
	)
}
