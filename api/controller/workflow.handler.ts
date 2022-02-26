import { FastifyReply, FastifyRequest } from 'fastify'
import GithubApi, { GithubRun } from '../external/github_api'
import Workflow from '../models/Workflow'

const WorkflowHandler = {
	_runsInProgress: <GithubRun[]>[],
	_setRunnerRoutine: (run: GithubRun, sockets: any): void => {
		let runnerStatus: string = 'in_progress'

		const interval = setInterval(async () => {
			runnerStatus = await GithubApi.workflows.check('ws-sync-catalogue', run.id)
			console.log('\x1b[35m[ GITHUB ]\x1b[0m Run', run.id, 'is', runnerStatus)

			checkEnd()
		}, 1000)

		function checkEnd(): void {
			const indexOfRunner: number = WorkflowHandler._runsInProgress.findIndex(
				(inProgress: any) => inProgress.id === run.id
			)

			WorkflowHandler._runsInProgress[indexOfRunner].status = runnerStatus

			sockets.emit('workflows', WorkflowHandler._runsInProgress)

			if (runnerStatus === 'success') {
				clearInterval(interval)

				console.log('\x1b[35m[ GITHUB ]\x1b[0m Run', run.id, 'is \x1b[32mcompleted\x1b[0m')

				WorkflowHandler._runsInProgress.splice(indexOfRunner, 1)
			}
		}
	},
	getWorkflows: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			res.send(await Workflow.findAll())
		} catch (e) {
			res.status(500).send(e)
		}
	},
	getRunsInProgress: async (req: FastifyRequest, res: FastifyReply) => {
		res.send(WorkflowHandler._runsInProgress)
	},
	/**
	 * This method will dispatch an event to Github to start a runner from a specified workflow. In this case it's in the
	 * repository 'ws-sync-catalogue' -> 'CD / Deploy / Production' with branch 'main'.
	 * It'll add the created run in the existing one, and emits to all clients the active runs.
	 * Then, it set up a routine to check the status of the runner every second.
	 * @param req
	 * @param res
	 */
	sync: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { workflow_id }: any = req.body

			const workflow: Workflow | null = await Workflow.findOne({ where: { id: workflow_id } })

			if (!workflow) {
				return res.status(404).send('Workflow not found')
			}

			const sockets = req.server.io

			const run: GithubRun = await GithubApi.workflows.run(
				workflow.getDataValue('repository'),
				workflow.getDataValue('workflowId'),
				workflow.getDataValue('branch')
			)

			console.log('\x1b[35m[ GITHUB ]\x1b[0m Started run on \x1b[4m', run.name, '\x1b[0m')

			WorkflowHandler._runsInProgress.push(run)

			sockets.emit('workflows', WorkflowHandler._runsInProgress)

			WorkflowHandler._setRunnerRoutine(run, sockets)

			res.status(204).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	// cancel: async (req: FastifyRequest, res: FastifyReply) => {
	// 	try {
	// 		const { cancel_url }: any = req.body
	//
	// 		await GithubApi.workflows.cancel(cancel_url)
	//
	// 		res.status(204).send()
	// 	} catch (e) {
	// 		res.status(500).send(e)
	// 	}
	// },
}

export default WorkflowHandler
