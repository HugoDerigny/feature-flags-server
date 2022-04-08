import { FastifyReply, FastifyRequest } from 'fastify'
import Service from '../models/Service'
import Flag, { BrowsersFlags } from '../models/Flag'
import { v4 } from 'uuid'
import { verifyAuthorization } from '../middlewares/verify-auth.middleware'

const ServicesHandler = {
	getAll: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		try {
			res.send(await Service.findAll({ include: 'flags' }))
		} catch (e) {
			res.code(500).send(e)
		}
	},
	update: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		const { uid }: any = req.params
		const { name }: any = req.body

		try {
			const service: Service | null = await Service.findByPk(uid)

			if (!service) {
				res.status(404).send('Service not found.')
			}

			await service!.update({
				name,
			})
			await service!.save()

			res.status(204).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	create: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		const { name }: any = req.body
		const id = v4()

		try {
			const service = await Service.create({ id, name })

			res.status(201).send(service)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	delete: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		const { uid }: any = req.params

		try {
			const service: Service | null = await Service.findByPk(uid, { include: 'flags' })

			if (!service) {
				res.status(404).send('Service not found.')
			}

			if (service!.flags!.length > 0) {
				res.status(400).send('Service has flags.')
			}

			await service!.destroy()
			await service!.save()

			res.status(204).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	getFlags: async (req: FastifyRequest, res: FastifyReply) => {
		verifyAuthorization(req, res)

		try {
			const { uid: serviceId } = req.params as any

			const { 'user-agent': userAgent }: any = req.headers

			function isEnabledForUserAgent({
				enabled,
				enabledForSafari,
				enabledForFirefox,
				enabledForChrome,
				enabledForIE,
				enabledForEdge,
				enabledForOpera,
			}: Pick<Flag, BrowsersFlags>): boolean {
				const isSafari: boolean = /Safari/i.test(userAgent)
				const isFirefox: boolean = /Firefox/i.test(userAgent)
				const isEdge: boolean = /Edg/i.test(userAgent)
				const isOpera: boolean = /OPR|Opera/i.test(userAgent)
				const isIE: boolean = /MSIE/i.test(userAgent)
				const isChrome: boolean = /Chrome|chromium|crios/i.test(userAgent)

				return (
					enabled &&
					((isSafari && enabledForSafari) ||
						(isFirefox && enabledForFirefox) ||
						(isEdge && enabledForEdge) ||
						(isOpera && enabledForOpera) ||
						(isIE && enabledForIE) ||
						(isChrome && enabledForChrome))
				)
			}

			const flags = await Flag.findAll({
				attributes: [
					'key',
					'value',
					'enabled',
					'enabledForSafari',
					'enabledForFirefox',
					'enabledForChrome',
					'enabledForOpera',
					'enabledForIE',
					'enabledForEdge',
				],
				where: { serviceId },
			})

			const flagsForUserAgent = flags.map(
				// @ts-ignore
				({ dataValues: { key, value, ...enabledForBrowsers } }) => ({
					key,
					value,
					enabled: isEnabledForUserAgent(enabledForBrowsers),
				})
			)

			res.status(200).send(flagsForUserAgent)
		} catch (e) {
			res.status(500).send(e)
		}
	},
}

export default ServicesHandler
