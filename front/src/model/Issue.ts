import { RawIssue } from '../types/RawService'

export default class Issue {
	private readonly _number: number
	private readonly _url: string
	private readonly _title: string
	private readonly _body: string
	private readonly _createdAt: Date
	private readonly _updatedAt: Date
	private readonly _assigneeUser?: string
	private readonly _assigneeAvatarUrl?: string

	constructor(
		number: number,
		url: string,
		title: string,
		body: string,
		createdAt: string,
		updatedAt: string,
		assigneeUser: string,
		assigneeAvatarUrl: string
	) {
		this._number = number
		this._url = url
		this._title = title
		this._body = body
		this._createdAt = new Date(createdAt)
		this._updatedAt = new Date(updatedAt)
		this._assigneeUser = assigneeUser
		this._assigneeAvatarUrl = assigneeAvatarUrl
	}

	static fromJson(object: RawIssue): Issue {
		return new Issue(
			object.number,
			object.url,
			object.title,
			object.body,
			object.created_at,
			object.updated_at,
			object.assignee?.login,
			object.assignee?.avatar_url
		)
	}

	get number(): number {
		return this._number
	}

	get url(): string {
		return this._url
	}

	get title(): string {
		return this._title
	}

	get body(): string {
		return this._body
	}

	get createdAt(): Date {
		return this._createdAt
	}

	get updatedAt(): Date {
		return this._updatedAt
	}

	get assigneeUser(): string | undefined {
		return this._assigneeUser
	}

	get assigneeAvatarUrl(): string | undefined {
		return this._assigneeAvatarUrl
	}
}
