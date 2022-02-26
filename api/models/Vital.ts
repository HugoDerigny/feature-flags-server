import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

interface VitalsAttributes {
	id: number
	value: number

	serviceId: string

	createdAt?: Date
	updatedAt?: Date
}

// Some attributes are optional in `User.build` and `User.create` calls
interface VitalsCreationAttributes extends Optional<VitalsAttributes, 'id'> {}

class Vital extends Model<VitalsAttributes, VitalsCreationAttributes> {
	public id!: number
	public value!: number

	public serviceId!: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	static async initialize(instance: Sequelize) {
		Vital.init(
			{
				id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
				},
				value: {
					type: DataTypes.NUMBER,
					allowNull: false,
				},
				serviceId: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{ sequelize: instance }
		)

		await Vital.sync({ force: true })
	}
}

export default Vital
