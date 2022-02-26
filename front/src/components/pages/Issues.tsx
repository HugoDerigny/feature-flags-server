import { useEffect, useState } from 'react'
import axios from 'axios'
import { RawIssue } from '../../types/RawService'
import Issue from '../../model/Issue'
import IssuesList from '../organisms/IssuesList'

export default function Issues() {
	const [issues, setIssues] = useState<Array<[string, Issue[]]> | undefined>([])

	const [loadingIssues, setLoadingIssues] = useState<boolean>(true)

	useEffect(() => {
		fetchIssues()
	}, [])

	async function fetchIssues(): Promise<void> {
		setLoadingIssues(true)

		axios
			.get(process.env.REACT_APP_API_URL + '/issues')
			.then(({ data }) => {
				const issues: Record<string, RawIssue[]> = data

				// Transform all rawIssues to issues
				const parsedIssues: Array<[string, Issue[]]> = Object.entries(issues).map(
					([repository, rawIssues]: [string, RawIssue[]]) => [
						repository,
						rawIssues.map((rawIssue: RawIssue) => Issue.fromJson(rawIssue)),
					]
				)
				setIssues(parsedIssues)
				setLoadingIssues(false)
			})
			.catch((error) => {
				setIssues(undefined)
				setLoadingIssues(false)
			})
	}

	return (
		<>
			<header className='pb-4'>
				<h1 className='title'>Issues</h1>
			</header>
			<IssuesList loading={loadingIssues} fetchIssues={fetchIssues} issues={issues} />
		</>
	)
}
