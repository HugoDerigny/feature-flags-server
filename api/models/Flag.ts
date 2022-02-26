import { Association, DataTypes, Model, Optional, Sequelize } from 'sequelize'
import Service from './Service'

// These are all the attributes in the User model
interface FlagAttributes {
	id: number
	key: string
	value: string
	description: string

	enabled: boolean
	enabledForOpera: boolean
	enabledForFirefox: boolean
	enabledForSafari: boolean
	enabledForIE: boolean
	enabledForEdge: boolean
	enabledForChrome: boolean

	serviceId: string

	_serviceLabel?: string
}

// Some attributes are optional in `User.build` and `User.create` calls
interface FlagCreationAttributes extends Optional<FlagAttributes, 'id'> {}

class Flag extends Model<FlagAttributes, FlagCreationAttributes> {
	public id!: number
	public key!: string
	public value!: string
	public description!: string

	public enabled!: boolean
	public enabledForOpera!: boolean
	public enabledForFirefox!: boolean
	public enabledForSafari!: boolean
	public enabledForIE!: boolean
	public enabledForEdge!: boolean
	public enabledForChrome!: boolean

	public readonly serviceId!: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	/**
	 * /!\ custom fields
	 */
	public _serviceLabel?: string

	static async initialize(instance: Sequelize) {
		Flag.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
					unique: true,
				},
				key: {
					type: DataTypes.STRING(128),
					allowNull: false,
					unique: true,
				},
				value: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				description: {
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
				serviceId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{ sequelize: instance }
		)

		await Flag.sync({ alter: true })
	}
}

export default Flag
