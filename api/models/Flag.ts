import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
	Sequelize,
} from '@sequelize/core'
import Service from './Service'

export type BrowsersFlags =
	| 'enabled'
	| 'enabledForSafari'
	| 'enabledForEdge'
	| 'enabledForOpera'
	| 'enabledForFirefox'
	| 'enabledForChrome'
	| 'enabledForIE'

// These are all the attributes in the User model
class Flag extends Model<InferAttributes<Flag>, InferCreationAttributes<Flag>> {
	declare id: CreationOptional<number>
	declare key: string
	declare value: string
	declare summary: string

	declare enabled: boolean
	declare enabledForOpera: boolean
	declare enabledForFirefox: boolean
	declare enabledForSafari: boolean
	declare enabledForIE: boolean
	declare enabledForEdge: boolean
	declare enabledForChrome: boolean

	declare serviceId: string
	declare service: NonAttribute<Service>

	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

export const initializeFlags = (sequelize: Sequelize) =>
	Flag.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			serviceId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
			key: {
				type: DataTypes.STRING(128),
				allowNull: false,
				unique: true,
			},
			value: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			summary: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			enabled: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForOpera: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForFirefox: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForSafari: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForIE: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForEdge: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			enabledForChrome: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
		{ sequelize, tableName: 'flags' }
	)

export default Flag
