import { Environment, RawBug } from '../types/RawService'

export default class Bug {
	private readonly _id: number
	private readonly _group: string
	private readonly _environment: Environment
	private readonly _title: string
	private readonly _content: string

	private readonly _createdAt: Date

	constructor(
		id: number,
		group: string,
		environment: Environment,
		title: string,
		content: string,
		createdAt?: string
	) {
		this._id = id
		this._group = group
		this._environment = environment
		this._title = title
		this._content = content
		this._createdAt = createdAt ? new Date(createdAt) : new Date()
	}

	static fromJson(object: RawBug): Bug {
		return new Bug(
			object.id,
			object.group,
			object.environment,
			object.title,
			object.content,
			object.createdAt
		)
	}

	toJson(): any {
		return {
			id: this._id,
			group: this._group,
			environment: this._environment,
			title: this._title,
			content: this._content,
		}
	}

	get id(): number {
		return this._id
	}

	get createdAt(): Date {
		return this._createdAt
	}

	get environment(): Environment {
		return this._environment
	}

	get group(): string {
		return this._group
	}

	get title(): string {
		return this._title
	}

	get content(): string {
		return this._content
	}
}
