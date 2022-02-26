import { Association, DataTypes, Model, Optional, Sequelize } from 'sequelize'
import Vital from './Vital'
import { PullRequest, Runner } from '../external/github_api'
import Flag from './Flag'

interface ServiceDto {
	id: string
	group: string
	environment: string
	name: string
	displayType: string
	gitUrl: string
	accessUrl: string
	runnerName: string
}

// These are all the attributes in the User model
interface ServiceAttributes {
	id: string
	name: string
	displayType: string
	accessUrl: string
	gitUrl: string | null
	environment: string
	groupId: number
	status?: ServiceStatus
	runnerName: string | null

	_vital?: any
	_runner?: Runner
	_prs?: PullRequest[]
	_flags?: any
}

enum ServiceStatus {
	ONLINE,
	IN_BUILD,
	OFFLINE,
}

// Some attributes are optional in `User.build` and `User.create` calls
interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> {
	public id!: string
	public name!: string
	public displayType!: string
	public accessUrl!: string
	public gitUrl?: string
	public environment!: string
	public status!: ServiceStatus
	public runnerName?: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public readonly vitals?: Vital[]
	public readonly flags?: Flag[]

	/**
	 * [WARNING] Custom formatted fields
	 */
	public _vital?: any
	public _runner?: Runner
	public _prs?: PullRequest[]
	public _flags?: any

	static async initialize(instance: Sequelize) {
		Service.init(
			{
				id: {
					type: DataTypes.TEXT,
					allowNull: false,
					primaryKey: true,
				},
				name: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				displayType: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				gitUrl: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				accessUrl: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				environment: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				groupId: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				status: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: ServiceStatus.OFFLINE,
				},
				runnerName: {
					type: DataTypes.STRING,
					allowNull: true,
				},
			},
			{ sequelize: instance }
		)

		await Service.sync({ force: true })
	}

	public static associations: {
		vitals: Association<Service, Vital>
		flags: Association<Service, Flag>
	}
}

export { ServiceStatus, ServiceDto }
export default Service
