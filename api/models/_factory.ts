import { Sequelize } from 'sequelize'
import Group from './Group'
import Service from './Service'
import Vital from './Vital'
import Workflow from './Workflow'
import Flag from './Flag'

export default async function InitializeModels(sequelize: Sequelize): Promise<void> {
	// Services and groups
	await Group.initialize(sequelize)
	await Service.initialize(sequelize)
	await Vital.initialize(sequelize)
	await Flag.initialize(sequelize)

	Group.hasMany(Service, { foreignKey: 'groupId', as: 'services' })
	Service.belongsTo(Group)

	Service.hasMany(Vital, { foreignKey: 'serviceId', as: 'vitals' })
	Vital.belongsTo(Service)

	Service.hasMany(Flag, { foreignKey: 'serviceId', as: 'flags' })
	Flag.belongsTo(Service)

	// Workflows with runs
	await Workflow.initialize(sequelize)
}
