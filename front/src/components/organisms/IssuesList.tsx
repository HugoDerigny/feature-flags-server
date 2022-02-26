import TimeAgo from 'javascript-time-ago'
import fr from 'javascript-time-ago/locale/fr.json'
import ReactMarkdown from 'react-markdown'
import Issue from '../../model/Issue'

TimeAgo.addDefaultLocale(fr)

type Props = {
	loading: boolean
	issues: Array<[string, Issue[]]> | undefined
	fetchIssues: () => void
}

export default function IssuesList({ issues, loading, fetchIssues }: Props) {
	const timeAgo = new TimeAgo('fr-FR')

	return (
		<section>
			{loading ? (
				<div className='w-full h-48 flex place-items-center justify-center'>
					<svg
						className='w-16 h-16 animate-spin text-gray-400'
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
				</div>
			) : issues ? (
				<div className='bg-white rounded-2xl shadow-lg p-6 mt-4'>
					{issues.map(([repository, issues]) => (
						<section className='divide-y mt-4'>
							<h3 className='text-xl font-bold tracking-tight text-indigo-600 pb-2'>
								{repository}{' '}
								<span className='text-gray-400 font-thin tracking-wide text-xs'>
									({issues.length})
								</span>
							</h3>
							{issues.map((issue: Issue) => (
								<article className='p-6'>
									<header className='flex place-items-center space-x-2'>
										{issue.assigneeUser && (
											<figure className='w-12 h-12 rounded-lg relative'>
												<img
													src={issue.assigneeAvatarUrl}
													alt='Avatar URL'
													className='w-full h-full rounded-lg'
												/>
											</figure>
										)}
										<h3 className='text-lg font-bold'>
											<span className='text-gray-400 font-light font-mono'>
												#{issue.number}
											</span>{' '}
											<a
												className='hover:underline'
												href={issue.url}
												rel='noreferrer noopener'
												target='_blank'
											>
												{issue.title}
											</a>
											<p className='text-xs text-gray-600 font-normal italic'>
												{issue.assigneeUser
													? `Géré par ${issue.assigneeUser}`
													: 'Non géré'}
												. Créé {timeAgo.format(issue.createdAt)}
												{issue.createdAt.toString() !==
													issue.updatedAt.toString() &&
													`, mis à jour 
											${timeAgo.format(issue.updatedAt)}`}
											</p>
										</h3>
									</header>

									<details className='mt-2 w-full break-words'>
										<summary className='text-gray-600 text-sm cursor-pointer'>
											Voir la description
										</summary>
										<ReactMarkdown className='mt-2 bg-gray-50 py-2 px-4 rounded-lg font-mono'>
											{issue.body}
										</ReactMarkdown>
									</details>
								</article>
							))}
						</section>
					))}
				</div>
			) : (
				<article className='w-full h-96 flex flex-col place-items-center justify-center space-y-4'>
					<p className='text-red-400'>Une erreur est survenue.</p>
					<p
						className='text-red-400 hover:underline cursor-pointer'
						onClick={fetchIssues}
					>
						Réessayer
					</p>
				</article>
			)}
		</section>
	)
}
