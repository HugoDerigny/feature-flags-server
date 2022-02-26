import axios from 'axios'

export type Runner = {
	name: string
	status: string
	busy: string
}

export type Issue = {
	number: number
	url: string
	title: string
	body: string
	assignee?: {
		avatar_url: string
		login: string
	}
	created_at: string
	updated_at: string
	pull_request?: object
}

export type GithubRun = {
	id: number
	name: string
	repository: Record<string, any>
	status: string
}

export type PullRequest = {
	number: number
	title: string
	user: {
		login: string
		avatar_url: string
	}
}

const GITHUB_API_URL = 'https://api.github.com'

const CONFIG = {
	headers: {
		Authorization: 'token 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',
		Accept: 'application/vnd.github.v3+json',
	},
	maxRedirects: 0,
}

const GithubApi = {
	pulls: {
		getOpensOnDev: async (repository: string): Promise<PullRequest[]> => {
			const { data } = await axios.get(
				GITHUB_API_URL + `/repos/Tabuleo/${repository}/pulls?state=open&base=dev`,
				CONFIG
			)

			const prs = data.filter((pr: any) => !pr.draft)

			return prs.length > 0
				? prs.map(({ number, title, user: { login, avatar_url } }: any) => ({
						number,
						title,
						user: { login, avatar_url },
				  }))
				: []
		},
	},
	runners: {
		getAll: async (): Promise<Runner[]> => {
			const fullRunner = (
				await axios.get(GITHUB_API_URL + '/orgs/Tabuleo/actions/runners', CONFIG)
			).data.runners

			return fullRunner.map(({ name, busy, status }: Runner) => ({ name, busy, status }))
		},
	},
	workflows: {
		run: async (
			repository: string,
			workflowId: number,
			fromBranch: string
			// ): Promise<{ id: number; html_url: string; cancel_url: string }> => {
		): Promise<GithubRun> => {
			// Start run (https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event)
			await axios.post(
				GITHUB_API_URL +
					`/repos/Tabuleo/${repository}/actions/workflows/${workflowId}/dispatches`,
				{ ref: fromBranch },
				CONFIG
			)

			let run = null

			// Waiting for run to start
			do {
				// Get run id (https://docs.github.com/en/rest/reference/actions#list-workflow-runs)
				const { workflow_runs } = (
					await axios.get(
						GITHUB_API_URL +
							`/repos/Tabuleo/${repository}/actions/workflows/${workflowId}/runs?status=in_progress`,
						CONFIG
					)
				).data

				if (workflow_runs.length > 0) {
					run = workflow_runs[0]
				}
			} while (run === null)

			return run
		},
		check: async (
			repository: string,
			runnerId: number
		): Promise<'in_progress' | 'success' | 'failure'> => {
			const { data } = await axios.get(
				GITHUB_API_URL + `/repos/Tabuleo/${repository}/actions/runs/${runnerId}`,
				CONFIG
			)

			return data.status === 'in_progress' ? 'in_progress' : data.conclusion
		},
		cancel: async (cancelUrl: string): Promise<void> => {
			// Cancel run (https://docs.github.com/en/rest/reference/actions#cancel-a-workflow-run)
			await axios.post(cancelUrl, null, CONFIG)
		},
	},
	issues: {
		getAll: async (repository: string): Promise<Issue[]> => {
			const fullIssues = (
				await axios.get(GITHUB_API_URL + `/repos/Tabuleo/${repository}/issues`, CONFIG)
			).data

			return fullIssues
				.filter((issue: Issue) => !issue.pull_request)
				.map(
					({
						number,
						html_url: url,
						title,
						body,
						created_at,
						updated_at,
						assignee,
					}: any) => ({
						number,
						created_at,
						updated_at,
						assignee: assignee
							? { avatar_url: assignee.avatar_url, login: assignee.login }
							: null,
						url,
						title,
						body,
					})
				)
		},
		create: async (repo: string, title: string, body: string) => {
			return (
				await axios.post(
					GITHUB_API_URL + `/repos/Tabuleo/${repo}/issues`,
					{ owner: 'Tabuleo', repo, title, body },
					CONFIG
				)
			).data
		},
	},
}

export default GithubApi
