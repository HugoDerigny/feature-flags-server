import { FastifyReply, FastifyRequest } from 'fastify'
import Flag from '../models/Flag'
import { verifyAuthorization } from '../middlewares/verify-auth.middleware'

const FlagsHandler = {
	getAll: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		try {
			const flags = await Flag.findAll()

			res.status(200).send(flags)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	create: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		try {
			const flag = await Flag.create(req.body as any)

			res.status(201).send(flag)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	update: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		try {
			const { id }: any = req.params
			const flag: Flag | null = await Flag.findByPk(id)

			if (!flag) {
				res.status(404).send('Flag not found')
			}

			await flag!.update(req.body as any)
			await flag!.save()

			res.status(204).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	delete: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { id }: any = req.params

			const flag: Flag | null = await Flag.findByPk(id)

			if (!flag) {
				res.status(404).send('Flag not found.')
			}

			await flag!.destroy()
			await flag!.save()

			res.status(204).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
}

export default FlagsHandler
