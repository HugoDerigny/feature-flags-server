import { FastifyReply, FastifyRequest } from 'fastify'
import { app } from '../index'

export function verifyAuthorization(req: FastifyRequest, res: FastifyReply): void {
	const { authorization } = req.headers

	if (!authorization || authorization !== app.config.AUTHORIZATION) {
		res.status(401).send('Invalid authorization.')
		return
	}
}
