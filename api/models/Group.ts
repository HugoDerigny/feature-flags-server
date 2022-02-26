import { Association, DataTypes, Model, Optional, Sequelize } from 'sequelize'
import Service from './Service'

interface GroupDto {
	name: string
	style: string
}

// These are all the attributes in the User model
interface GroupAttributes {
	id: number
	name: string
	style: string

	services?: Service[]
}

// Some attributes are optional in `User.build` and `User.create` calls
interface GroupCreationAttributes extends Optional<GroupAttributes, 'id'> {}

class Group extends Model<GroupAttributes, GroupCreationAttributes> {
	public id!: number
	public name!: string
	public style!: string

	public readonly services?: Service[]

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	static async initialize(instance: Sequelize) {
		Group.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
					unique: true,
				},
				name: {
					type: DataTypes.STRING(128),
					allowNull: false,
				},
				style: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{ sequelize: instance }
		)

		await Group.sync({ force: true })
	}

	public static associations: {
		services: Association<Group, Service>
	}
}

export { GroupDto }
export default Group
