import fastify, { FastifyInstance } from 'fastify'
import envOptions from './env_config.json'
import router from './routes/_router'
import InitializeModels from './models/_factory'
import { Sequelize } from '@sequelize/core'

declare module 'fastify' {
	interface FastifyInstance {
		config: any
		sequelize: Sequelize
	}
}

const app: FastifyInstance = fastify({
	logger: true,
})

app.register(require('fastify-env'), envOptions).ready((err: Error) => {
	if (err) {
		process.exit(1)
	}
})

app.after(async () => {
	await app.register(require('fastify-cors'), { origin: '*' })

	const sequelize: Sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: app.config.DB_PATH ?? './db/feature_flags.db',
		logging: false,
	})

	try {
		await InitializeModels(sequelize)
	} catch (e) {
		console.log('error - could not setup sequelize', e)
		process.exit(1)
	}

	router.forEach((route: any) => app.route(route))

	app.listen(app.config.PORT || 3001, '0.0.0.0', (err: Error, address: string) => {
		if (err) {
			app.log.error(err.message)
			process.exit(1)
		}

		console.log(`Server listening at ${address}`)
	})
})

export { app }
