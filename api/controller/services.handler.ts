import { FastifyReply, FastifyRequest } from 'fastify'
import Service, { ServiceDto } from '../models/Service'
import Group from '../models/Group'
import { v4 as uuidv4 } from 'uuid'
import Vital from '../models/Vital'
import { Op } from 'sequelize'
import axios from 'axios'
import GithubApi, { PullRequest } from '../external/github_api'
import ConfigController from './config.controller'
import Flag from '../models/Flag'

type VitalFormattedType = {
	averageResponseTime: number
	history: Array<{ x: string | number; y: number }>
}

const ServicesHandler = {
	_getAndFormatAllServices: async (): Promise<Group[]> => {
		const groups: Group[] | null = await Group.findAll({ include: 'services' })
		let runners: any[]

		try {
			runners = await GithubApi.runners.getAll()
		} catch (e) {
			runners = []
		}
		if (!groups) {
			return []
		}

		for (const group of groups) {
			const services: Service[] | undefined = group.getDataValue('services')
			if (!services) {
				continue
			}
			for (const service of services) {
				const vitals = await ServicesHandler._getVitals(service.getDataValue('id'))
				service.setDataValue('_vital', vitals)

				if (
					service.getDataValue('environment') === 'test' &&
					service.getDataValue('gitUrl')
				) {
					const repository: string = service.getDataValue('gitUrl')!.split('/').pop()!!

					try {
						const openPullsRequest: PullRequest[] = await GithubApi.pulls.getOpensOnDev(
							repository
						)

						service.setDataValue('_prs', openPullsRequest)
					} catch (e) {
						service.setDataValue('_prs', [])
					}
				}

				const serviceRunner = runners.find(
					(obj: any) => obj.name === service.getDataValue('runnerName')
				)
				service.setDataValue('_runner', serviceRunner)
			}
		}

		return groups
	},
	_getVitals: async (serviceId: string): Promise<VitalFormattedType> => {
		const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

		const vitals: Vital[] = await Vital.findAll({
			where: {
				[Op.and]: [
					{
						serviceId,
					},
					{
						createdAt: {
							[Op.gt]: yesterday,
						},
					},
				],
			},
		})

		const vitalsResponse: VitalFormattedType = {
			averageResponseTime: 0,
			history: [],
		}

		let sum: number = 0
		let history: Array<{ x: string | number; y: number }> = []

		// Get the past 24 hours ordered, x is for hour, y is for number of requests per hour.
		const currentHour = new Date().getHours()
		for (let hour = currentHour + 1; hour < 24; hour++) {
			history.push({
				x: hour,
				y: 0,
			})
		}

		for (let hourNewDay = 0; hourNewDay < currentHour; hourNewDay++) {
			history.push({
				x: hourNewDay,
				y: 0,
			})
		}

		history.push({
			x: currentHour,
			y: 0,
		})
		// Finished creating empty history

		// Building statistics
		for (const vital of vitals) {
			sum += vital.getDataValue('value')

			// @ts-ignore
			const hour = new Date(vital.getDataValue('createdAt')).getHours()

			history.find((h) => h.x === hour)!.y++
		}

		vitalsResponse.averageResponseTime = sum / vitals.length
		vitalsResponse.history = history

		return vitalsResponse
	},
	/**
	 * Fetch all services and group them belonging to their group.
	 * @param req
	 * @param res
	 */
	getAll: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			res.send(await ServicesHandler._getAndFormatAllServices())
		} catch (e) {
			res.code(500).send(e)
		}
	},
	/**
	 * Create a service and send them back all
	 * @param req
	 * @param res
	 */
	create: async (req: FastifyRequest, res: FastifyReply) => {
		const { groupId, environment, name, displayType, gitUrl, accessUrl, runnerName }: any =
			req.body

		const serviceGroup: Group | null = await Group.findByPk(groupId)

		if (!serviceGroup) {
			res.code(400).send(`Aucun groupe ne correspond à ${groupId}`)
		}

		const service: ServiceDto = {
			id: uuidv4(),
			environment,
			name,
			displayType,
			gitUrl,
			accessUrl,
			runnerName,
			group: serviceGroup!.getDataValue('name'),
		}

		try {
			await Service.create({ ...service, groupId })

			ConfigController.services.add(service)

			const services = await ServicesHandler._getAndFormatAllServices()
			// req.server.io.emit('services_update', services)

			res.status(201).send(services)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	/**
	 * Update a service properties according to its UID
	 * @param req
	 * @param res
	 */
	update: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { uid }: any = req.params
			const { environment, name, displayType, gitUrl, accessUrl, runnerName }: any = req.body

			const service: Service | null = await Service.findByPk(uid)

			if (!service) {
				res.status(404).send('Service not found')
			}

			const groupService = await Group.findByPk(service!.getDataValue('groupId'))
			const updatedService: ServiceDto = {
				group: groupService!.getDataValue('name'),
				id: service!.getDataValue('id'),
				environment,
				name,
				displayType,
				gitUrl,
				accessUrl,
				runnerName,
			}

			await service!.update(updatedService)
			await service!.save()

			ConfigController.services.update(updatedService)

			const services = await ServicesHandler._getAndFormatAllServices()
			// req.server.io.emit('services_update', JSON.stringify(services))

			res.send(services)
		} catch (e) {
			res.status(500).send(e)
		}
	},
	registerVitals: async (req: FastifyRequest, res: FastifyReply) => {
		try {
			const { uid }: any = req.params
			const { value }: any = req.body

			const service: Service | null = await Service.findByPk(uid)

			if (!service) {
				return res.status(404).send('Service not found')
			}

			// if (req.headers.origin !== service.getDataValue('accessUrl')) {
			// 	return res.status(401).send('Origin does not match service URL access')
			// }

			await Vital.create({
				serviceId: service.getDataValue('id'),
				value,
			})

			const services = await ServicesHandler._getAndFormatAllServices()
			req.server.io.emit('services_update', JSON.stringify(services))

			res.status(201).send()
		} catch (e) {
			res.status(500).send(e)
		}
	},
	getFlags: async (req: FastifyRequest, res: FastifyReply) => {
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
			}: Pick<
				Flag,
				| 'enabled'
				| 'enabledForSafari'
				| 'enabledForEdge'
				| 'enabledForOpera'
				| 'enabledForFirefox'
				| 'enabledForChrome'
				| 'enabledForIE'
			>): boolean {
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
				({ dataValues: { key, ...enabledForBrowsers } }) => ({
					key,
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
