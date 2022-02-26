import Service, { ServiceStatus } from '../models/Service'
import axios from 'axios'
import { FastifyInstance } from 'fastify'
import ServicesHandler from './services.handler'

function SetupServicesCheckRoutine(fastify: FastifyInstance, checkInterval: number = 1000 * 60) {
	setInterval(async () => {
		const services: Service[] = await Service.findAll()

		console.log('\x1b[36m[ ROUTINE ] \x1b[0m Starting ...')

		for (const service of services) {
			try {
				await axios.get(service.getDataValue('accessUrl'))
				await updateServiceStatus(service, ServiceStatus.ONLINE)
			} catch (e) {
				await updateServiceStatus(service, ServiceStatus.OFFLINE)
			}
		}

		console.log('\x1b[36m[ ROUTINE ] \x1b[0m Emitting results...')

		const updatedServices = await ServicesHandler._getAndFormatAllServices()
		fastify.io.emit('services_update', updatedServices)

		console.log('\x1b[36m[ ROUTINE ] \x1b[0m Ended')
	}, checkInterval)
}

async function updateServiceStatus(service: Service, status: ServiceStatus) {
	console.log(
		'\x1b[36m[ ROUTINE ] \x1b[0m',
		service.getDataValue('name'),
		'is',
		status === ServiceStatus.ONLINE
			? '\x1b[32mONLINE'
			: status === ServiceStatus.IN_BUILD
			? '\x1b[33mIN_BUILD'
			: '\x1b[31mOFFLINE'
	)

	service.setDataValue('status', status)

	await service.save()
}

export default SetupServicesCheckRoutine
