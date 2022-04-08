import Flag, { FlagDto } from './Flag'

export interface ServiceDto {
	id: string
	name: string
	flags: FlagDto[]
	updatedAt: string
}

export default class Service {
	private readonly _id: string
	public name: string
	public flags: Flag[]
	public updatedAt: Date

	constructor(id: string, name: string, flags: Flag[], updatedAt: Date) {
		this._id = id
		this.name = name
		this.flags = flags
		this.updatedAt = updatedAt
	}

	static Deserialize(json: ServiceDto): Service {
		return new Service(
			json.id,
			json.name,
			json.flags.map(Flag.Deserialize),
			new Date(json.updatedAt)
		)
	}

	get id(): string {
		return this._id
	}
}
