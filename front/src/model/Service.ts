import { DisplayType, RawService, RawPr, ServiceStatus } from '../types/RawService'
import Vitals from './Vitals'
import Runner from './Runner'
import PullRequest from './PullRequest'

class Service {
	private readonly _name: string
	private readonly _token: string
	private readonly _displayType: DisplayType
	private readonly _gitUrl: string
	private readonly _accessUrl: string
	private readonly _groupId: number
	private readonly _environment: string
	private readonly _status: ServiceStatus
	private readonly _vitals: Vitals
	private readonly _runner: Runner | undefined
	private readonly _prs: PullRequest[] | undefined

	constructor(
		name: string,
		token: string,
		displayType: DisplayType,
		gitUrl: string,
		accessUrl: string,
		groupId: number,
		environment: string,
		vitals: Vitals,
		status: ServiceStatus,
		runner: Runner | undefined,
		prs: PullRequest[] | undefined
	) {
		this._name = name
		this._token = token
		this._displayType = displayType
		this._gitUrl = gitUrl
		this._accessUrl = accessUrl
		this._groupId = groupId
		this._environment = environment
		this._vitals = vitals
		this._status = status
		this._runner = runner
		this._prs = prs
	}

	static fromJson(object: RawService, groupId: number): Service {
		function getDisplayType(type: string): DisplayType {
			switch (type) {
				case 'responseTime':
					return DisplayType.RESPONSE_TIME

				case 'idle':
				default:
					return DisplayType.IDLE
			}
		}

		return new Service(
			object.name,
			object.id,
			getDisplayType(object.displayType),
			object.gitUrl,
			object.accessUrl,
			groupId,
			object.environment,
			Vitals.fromJson(object._vital),
			object.status,
			object._runner ? Runner.fromJson(object._runner) : undefined,
			object._prs ? object._prs.map((pr: RawPr) => PullRequest.fromJson(pr)) : undefined
		)
	}

	get environment(): string {
		return this._environment
	}

	get groupId(): number {
		return this._groupId
	}

	get name(): string {
		return this._name
	}

	get token(): string {
		return this._token
	}

	get displayType(): DisplayType {
		return this._displayType
	}

	get gitUrl(): string {
		return this._gitUrl
	}

	get accessUrl(): string {
		return this._accessUrl
	}

	get vitals(): Vitals {
		return this._vitals
	}

	get status(): ServiceStatus {
		if (this._runner) {
			return this._runner.busy ? ServiceStatus.IN_BUILD : this._status
		}

		return this._status
	}

	get runner(): Runner | undefined {
		return this?._runner
	}

	get prs(): PullRequest[] | undefined {
		return this._prs
	}
}

export default Service
