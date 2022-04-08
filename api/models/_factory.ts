import Service, { initializeServices } from './Service'
import Flag, { initializeFlags } from './Flag'
import { Sequelize } from '@sequelize/core'

export default async function InitializeModels(sequelize: Sequelize): Promise<void> {
	await initializeServices(sequelize)
	await initializeFlags(sequelize)

	Service.hasMany(Flag, { sourceKey: 'id', foreignKey: 'serviceId', as: 'flags' })

	await Service.sync()
	await Flag.sync({ alter: true })
}
