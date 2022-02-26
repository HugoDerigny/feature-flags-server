import { FastifyReply, FastifyRequest } from 'fastify'
import Flag from '../models/Flag'
import Service from '../models/Service'

const FlagsHandler = {
	getAll: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const flags = await Flag.findAll()
			const services = await Service.findAll()

			for (const flag of flags) {
				const correspondingService: Service = services.find(
					(service) => service.getDataValue('id') === flag.getDataValue('serviceId')
				)!!

				flag.setDataValue(
					'_serviceLabel',
					`[${correspondingService
						.getDataValue('environment')
						.toUpperCase()}] ${correspondingService.getDataValue('name')}`
				)
			}

			res.send(flags)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	create: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { serviceId, key, description, enabled, value }: any = req.body

			await Flag.create({
				serviceId,
				key,
				description,
				value,
				enabled,
				enabledForEdge: enabled,
				enabledForChrome: enabled,
				enabledForFirefox: enabled,
				enabledForIE: enabled,
				enabledForOpera: enabled,
				enabledForSafari: enabled,
			})

			res.status(201).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	update: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { id }: any = req.params
			const {
				serviceId,
				key,
				description,
				value,
				enabled,
				enabledForEdge,
				enabledForChrome,
				enabledForFirefox,
				enabledForIE,
				enabledForOpera,
				enabledForSafari,
			}: any = req.body

			const flag: Flag | null = await Flag.findByPk(id)

			if (!flag) {
				res.status(404).send('Flag not found')
			}

			await flag!.update({
				serviceId,
				key,
				description,
				value,
				enabled,
				enabledForEdge,
				enabledForChrome,
				enabledForFirefox,
				enabledForIE,
				enabledForOpera,
				enabledForSafari,
			})
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
