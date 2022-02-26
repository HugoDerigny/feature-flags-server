import { RawRunner } from '../types/RawService'

export default class Runner {
	private readonly _name: string
	private readonly _status: string
	private readonly _busy: boolean

	constructor(name: string, status: string, busy: boolean) {
		this._name = name
		this._status = status
		this._busy = busy
	}

	static fromJson(object: RawRunner): Runner {
		return new Runner(object.name, object.status, object.busy)
	}

	public isOnline(): boolean {
		return this._status === 'online'
	}

	get name(): string {
		return this._name
	}

	get status(): string {
		return this._status
	}

	get busy(): boolean {
		return this._busy
	}
}
