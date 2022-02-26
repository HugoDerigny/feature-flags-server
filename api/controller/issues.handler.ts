import { FastifyReply, FastifyRequest } from 'fastify'
import GithubApi, { Issue } from '../external/github_api'
import Service from '../models/Service'

const IssuesHandler = {
	/**
	 * Fetch all Issues per Services
	 */
	_getAllReposIssues: async () => {
		const repositories: string[] = []
		const issues: Record<string, Issue[]> = {}

		const services: Service[] | undefined = await Service.findAll()

		if (!services) {
			return issues
		}

		for (const service of services) {
			if (service.getDataValue('gitUrl')) {
				const repository: string = service.getDataValue('gitUrl')!.split('/').pop()!!

				!repositories.includes(repository) && repositories.push(repository)
			}
		}

		for (const repo of repositories) {
			issues[repo] = await GithubApi.issues.getAll(repo)
		}

		return issues
	},

	getAll: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			res.send(await IssuesHandler._getAllReposIssues())
		} catch (e) {
			res.code(500).send(e)
		}
	},
}

export default IssuesHandler
