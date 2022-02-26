import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

interface WorkflowAttributes {
	id: number

	name: string
	repository: string
	workflowId: number
	branch: string

	createdAt?: Date
	updatedAt?: Date
}

// Some attributes are optional in `User.build` and `User.create` calls
interface WorkflowCreationAttributes extends Optional<WorkflowAttributes, 'id'> {}

class Workflow extends Model<WorkflowAttributes, WorkflowCreationAttributes> {
	public id!: number

	public name!: string
	public repository!: string
	public workflowId!: string
	public branch!: string

	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	static async initialize(instance: Sequelize) {
		Workflow.init(
			{
				id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				repository: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				workflowId: {
					type: DataTypes.NUMBER,
					allowNull: false,
				},
				branch: {
					type: DataTypes.STRING,
					allowNull: false,
				},
			},
			{ sequelize: instance }
		)

		await Workflow.sync({ force: true })
	}
}

export default Workflow
