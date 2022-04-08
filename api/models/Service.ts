import {
	Association,
	CreationOptional,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyGetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	Model,
	NonAttribute,
	Sequelize,
} from '@sequelize/core'
import Flag from './Flag'

class Service extends Model<
	InferAttributes<Service, { omit: 'flags' }>,
	InferCreationAttributes<Service, { omit: 'flags' }>
> {
	declare id: string
	declare name: string

	// declare getFlags: HasManyGetAssociationsMixin<Flag>
	// declare addFlag: HasManyAddAssociationMixin<Flag, number>

	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>

	declare flags?: NonAttribute<Flag[]>

	declare static associations: {
		flags: Association<Service, Flag>
	}
}

export const initializeServices = (sequelize: Sequelize) =>
	Service.init(
		{
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		},
		{ sequelize, tableName: 'services' }
	)

export default Service
