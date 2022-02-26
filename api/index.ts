import fastify, { FastifyInstance } from 'fastify'
import envOptions from './config/env_options.json'
import router from './routes/_router'
import { Sequelize } from 'sequelize'
import Service from './models/Service'
import Group from './models/Group'
import InitializeModels from './models/_factory'
import SetupServicesCheckRoutine from './controller/routine.controller'

import defaultGroups from './config/groups.json'
import defaultServices from './config/services.json'
import defaultWorkflows from './config/workflows.json'
import Workflow from './models/Workflow'

declare module 'fastify' {
	interface FastifyInstance {
		config: any
		sequelize: Sequelize
		io: any
	}
}

const app: FastifyInstance = fastify({
	logger: true,
})

app.register(require('fastify-env'), envOptions).ready((err: Error) => {
	if (err) {
		console.log('could not setup env', err.message)
		process.exit(1)
	}

	console.log('Env', app.config)
})

app.after(async () => {
	await app.register(require('fastify-cors'), { origin: '*' })
	await app.register(require('fastify-socket.io'), { cors: '*' })

	const sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: app.config.DB_PATH,
		logging: false,
	})

	try {
		await InitializeModels(sequelize)
		await GenerateServices()
	} catch (e) {
		console.log('error - could not setup sequelize', e)
	}

	// Defining all routes
	router.forEach((route: any) => app.route(route))

	await app.ready((err) => {
		err
			? console.log('\x1b[33m[ WS ]\x1b[0m Error during socket.io setup :', err)
			: console.log('\x1b[33m[ WS ]\x1b[0m socket.io initialized successfulyl')

		app.io.on('connect', (socket: any) =>
			console.info(
				'\x1b[33m[ WS ]\x1b[0m Socket connected from',
				socket.handshake.address,
				'as',
				socket.id
			)
		)
	})

	app.listen(app.config.PORT || 3000, '0.0.0.0', (err: Error, address: string) => {
		if (err) {
			app.log.error(err.message)
			process.exit(1)
		}

		console.log(`Server listening at ${address}`)

		SetupServicesCheckRoutine(app, app.config.ROUTINE_INTEVAL)
	})
})

async function GenerateServices() {
	for (const { name, style } of defaultGroups) {
		await Group.create({ name, style })
	}

	const existingGroups: Array<Group> = await Group.findAll()

	for (const rawService of defaultServices) {
		const serviceGroup: Group | undefined = existingGroups.find(
			(group: Group) => group.getDataValue('name') === rawService.group
		)

		const formattedService = { ...rawService, groupId: serviceGroup!.getDataValue('id') }

		await Service.create(formattedService)
	}

	for (const workflow of defaultWorkflows) {
		await Workflow.create(workflow)
	}
}
