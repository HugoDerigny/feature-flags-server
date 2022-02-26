import Button from '../atoms/Button'
import { useContext, useEffect, useState } from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { GlobalContext } from '../context/GlobalContext'

type WorkflowStatus = null | 'stale' | 'in_progress' | 'success' | 'failure'

type Workflow = {
	id: number
	name: string
	workflowId: number
	repository: string
	branch: string
	status: WorkflowStatus
	updated_at?: string
}

export default function Workflows() {
	const { socket } = useContext(GlobalContext)
	const [workflows, setWorkflows] = useState<Workflow[] | null | false>(false)

	useEffect(() => {
		fetchWorkflows()
	}, [])

	useEffect(() => {
		function updateWorkflows(
			workflowsInProgress: Array<{ workflow_id: number; status: string; updated_at: string }>
		) {
			const updatedWorkflows = workflows as Workflow[]

			for (const inProgress of workflowsInProgress) {
				const workflow = updatedWorkflows.find(
					(workflow: Workflow) => workflow.workflowId === inProgress.workflow_id
				)

				workflow!.status = inProgress.status as WorkflowStatus
				workflow!.updated_at = inProgress.updated_at
			}

			setWorkflows([...updatedWorkflows])
		}

		if (socket) {
			socket.on('workflows', updateWorkflows)
		}

		return () => {
			socket?.off('workflows', updateWorkflows)
		}
	}, [socket, workflows])

	function fetchWorkflows() {
		setWorkflows(null)
		axios
			.get(process.env.REACT_APP_API_URL + '/workflow')
			.then((res: AxiosResponse) => setWorkflows(res.data))
			.catch((err: AxiosError) => setWorkflows(false))
	}

	async function startRun(workflow_id: number) {
		try {
			const updatedWorkflows: Workflow[] = workflows as Workflow[]
			const workflow = (workflows as Workflow[]).find(
				(workflow: Workflow) => workflow.id === workflow_id
			)
			workflow!.status = 'stale'
			workflow!.updated_at = new Date().toISOString()

			setWorkflows([...updatedWorkflows])

			await axios.post(process.env.REACT_APP_API_URL + '/workflow/sync', { workflow_id })
		} catch (e) {
			const axiosError = e as AxiosError
			window.alert(
				`Une erreur est survenue lors du lancement du run ${workflow_id} :\n\n${JSON.stringify(
					axiosError.response?.data
				)}`
			)
		}
	}

	return (
		<>
			<header className='pb-4'>
				<h1 className='title'>Workflows</h1>
			</header>
			<article className='xl:mx-4 my-4 border-l-8 border-purple-600 bg-purple-600 bg-opacity-10 shadow-lg p-4 rounded-2xl overflow-hidden'>
				<header className='bg-purple-600 bg-opacity-25 rounded-2xl py-2 px-4 pl-6'>
					<h2 className='text-2xl text-white font-bold tracking-wide'>
						Liste des workflows disponibles
					</h2>
				</header>
				<div className='mt-4'>
					{workflows === null ? (
						<section className='w-full h-48 flex place-items-center justify-center'>
							<svg
								className='w-16 h-16 animate-spin text-purple-400'
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
						</section>
					) : workflows === false ? (
						<section className='w-full h-96 flex flex-col place-items-center justify-center space-y-4'>
							<p className='text-red-400'>Une erreur est survenue.</p>
							<p
								className='text-red-400 hover:underline cursor-pointer'
								onClick={fetchWorkflows}
							>
								Réessayer
							</p>
						</section>
					) : (
						<section className='flex flex-wrap -mx-2'>
							{workflows.map(
								({
									id,
									branch,
									name,
									repository,
									status,
									updated_at,
								}: Workflow) => (
									<div className='md:px-4 px-2 py-4 w-full lg:w-1/2 xl:w-1/4'>
										<article className='bg-gray-50 rounded-xl py-4 px-6'>
											<header className='flex justify-between'>
												<div>
													<h2 className='text-xl font-bold tracking-tight text-gray-700 leading-8'>
														{name}
													</h2>
													<h3 className='text-sm text-gray-400'>
														<a
															className='hover:underline'
															target='_blank'
															rel='noreferrer noopener'
															href={`https://github.com/Tabuleo/${repository}/tree/${branch}`}
														>
															{repository}/{branch}
														</a>
													</h3>
												</div>
												{getStatusLabel(status)}
											</header>
											<p className='my-4 text-xs text-gray-100 bg-gray-800 py-2 px-4 rounded-lg font-mono'>
												<span
													className={
														status === 'in_progress' ||
														status === 'stale'
															? 'animate-ping'
															: ''
													}
												>
													&gt;
												</span>{' '}
												{getStatusText(status)}
											</p>
											<footer className='flex justify-between place-items-end'>
												<small className='text-xs text-gray-400'>
													{updated_at &&
														`Dernière mise à jour le ${new Date(
															updated_at
														).toLocaleString()}`}
												</small>
												<Button
													type='submit'
													name='sync'
													color='full'
													className='mt-1 rounded-lg'
													loading={
														status === 'in_progress' ||
														status === 'stale'
													}
													onClick={() => startRun(id)}
												>
													<svg
														className='w-5 h-5'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z'
														/>
													</svg>
													<span className='ml-2'>Lancer</span>
												</Button>
											</footer>
										</article>
									</div>
								)
							)}
						</section>
					)}
				</div>
			</article>
		</>
	)
}

function getStatusLabel(status: WorkflowStatus): JSX.Element {
	switch (status) {
		case 'failure':
			return (
				<small className='text-xs text-red-400 uppercase font-thin flex place-items-center self-start bg-red-100 py-1 px-2 rounded-full'>
					<span className='block w-1 h-1 rounded-full bg-red-400 mr-1' />
					failure
				</small>
			)
		case 'success':
			return (
				<small className='text-xs text-emerald-400 uppercase font-thin flex place-items-center self-start bg-emerald-100 py-1 px-2 rounded-full'>
					<span className='block w-1 h-1 rounded-full bg-emerald-400 mr-1' />
					success
				</small>
			)
		case 'in_progress':
			return (
				<small className='text-xs text-yellow-500 uppercase font-thin flex place-items-center self-start bg-yellow-100 py-1 px-2 rounded-full animate-pulse'>
					<span className='block w-1 h-1 rounded-full bg-yellow-400 mr-1' />
					in_progress
				</small>
			)
		case 'stale':
			return (
				<small className='text-xs text-gray-400 uppercase font-thin flex place-items-center self-start bg-gray-100 py-1 px-2 rounded-full animate-pulse'>
					<span className='block w-1 h-1 rounded-full bg-gray-400 mr-1' />
					stale
				</small>
			)
		default:
			return (
				<small className='text-xs text-gray-400 uppercase font-thin flex place-items-center self-start bg-gray-100 py-1 px-2 rounded-full'>
					<span className='block w-1 h-1 rounded-full bg-gray-400 mr-1' />
					Off
				</small>
			)
	}
}

function getStatusText(status: WorkflowStatus): string {
	switch (status) {
		case 'stale':
			return "L'action va démarrer dans quelques instants..."

		case 'in_progress':
			return 'Action en cours...'

		case 'success':
			return 'Action terminé avec succès'

		case 'failure':
			return 'Une erreur est survenue'

		default:
			return 'Aucune action en cours'
	}
}
