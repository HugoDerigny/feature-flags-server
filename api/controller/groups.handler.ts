import { FastifyReply, FastifyRequest } from 'fastify'
import Group, { GroupDto } from '../models/Group'
import Service from '../models/Service'
import ServicesHandler from './services.handler'
import * as fs from 'fs'
import path from 'path'
import ConfigController from './config.controller'

const GroupsHandler = {
	/**
	 * Create group and send them all with their services
	 * @param req
	 * @param res
	 */
	create: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { name, style }: any = req.body

			const newGroup: GroupDto = { name, style }

			await Group.create(newGroup)

			ConfigController.groups.add(newGroup)

			res.status(201).send(await ServicesHandler._getAndFormatAllServices())
		} catch (e) {
			res.status(500).send(e)
		}
	},
	/**
	 * Update a group properties according to its UID
	 * @param req
	 * @param res
	 */
	update: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { uid }: any = req.params
			const { name, style }: any = req.body

			const group: Group | null = await Group.findByPk(uid)

			if (!group) {
				res.status(404).send('Group not found')
			}

			const updatedGroup: GroupDto = { name, style }

			await group!.update(updatedGroup)
			await group!.save()

			ConfigController.groups.update(updatedGroup)

			const services = await ServicesHandler._getAndFormatAllServices()

			res.send(services)
		} catch (e) {
			res.status(500).send(e)
		}
	},
}

export default GroupsHandler
