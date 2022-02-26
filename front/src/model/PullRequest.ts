import Service from './Service'
import { RawPr } from '../types/RawService'

type PrUser = {
	name: string
	avatarUrl: string
}

export default class PullRequest {
	private readonly _number: number
	private readonly _title: string
	private readonly _user: PrUser

	constructor(number: number, name: string, user: PrUser) {
		this._number = number
		this._title = name
		this._user = user
	}

	static fromJson(pr: RawPr): PullRequest {
		return new PullRequest(pr.number, pr.title, {
			name: pr.user.login,
			avatarUrl: pr.user.avatar_url,
		})
	}

	get number(): number {
		return this._number
	}

	get title(): string {
		return this._title
	}

	get user(): PrUser {
		return this._user
	}

	getAccessUrl(service: Service): string {
		return `${service.accessUrl}/pull-request/${this._number}/`
	}
}
