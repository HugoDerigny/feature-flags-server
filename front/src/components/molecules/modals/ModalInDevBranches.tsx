import { Dialog } from '@headlessui/react'
import Button from '../../atoms/Button'
import { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import Service from '../../../model/Service'
import PullRequest from '../../../model/PullRequest'

export default function ModalInDevBranches({ service }: { service: Service }) {
	const { modal } = useContext(GlobalContext)
	const availablePrs: PullRequest[] = service.prs as PullRequest[]

	return (
		<>
			<div className='modal__card'>
				<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
					<Dialog.Title as='h3' className='modal__title'>
						Versions de test disponibles
					</Dialog.Title>
					<section className='divide-y'>
						{availablePrs.length === 0 ? (
							<p className='py-8 text-gray-400'>Aucune version</p>
						) : (
							availablePrs.map((pr: PullRequest) => (
								<article className='py-4 flex space-x-4'>
									<figure className='w-16 h-16 relative'>
										<img
											src={pr.user.avatarUrl}
											alt='User Github Avatar'
											className='w-full h-full rounded-xl'
										/>
									</figure>
									<div>
										<h4 className='font-bold'>
											<a
												href={pr.getAccessUrl(service)}
												rel='noopener noreferrer'
												target='_blank'
												className='hover:underline'
											>
												<span className='uppercase font-thin font-mono text-gray-400 mr-1'>
													#{pr.number}
												</span>
												&bull; {pr.title}
											</a>
										</h4>
										<p className='text-xs text-gray-500 italic'>
											par {pr.user.name}
										</p>
									</div>
								</article>
							))
						)}
					</section>
				</div>
			</div>
			<div className='modal__footer'>
				<Button type='button' name='cancel' onClick={modal.close}>
					Fermer
				</Button>
			</div>
		</>
	)
}
