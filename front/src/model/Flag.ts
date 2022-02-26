import { RawFlag } from '../types/RawService'

class Flag {
	id: number
	serviceId: string
	key: string
	value: string
	description: string
	enabled: boolean
	enabledForOpera: boolean
	enabledForFirefox: boolean
	enabledForSafari: boolean
	enabledForIE: boolean
	enabledForEdge: boolean
	enabledForChrome: boolean

	updatedAt: Date

	_serviceLabel: string

	constructor(
		id: number,
		serviceId: string,
		key: string,
		value: string,
		description: string,
		enabled: boolean,
		enabledForOpera: boolean,
		enabledForFirefox: boolean,
		enabledForSafari: boolean,
		enabledForIE: boolean,
		enabledForEdge: boolean,
		enabledForChrome: boolean,
		updatedAt: Date,
		serviceLabel: string
	) {
		this.id = id
		this.serviceId = serviceId
		this.key = key
		this.value = value
		this.description = description
		this.enabled = enabled
		this.enabledForOpera = enabledForOpera
		this.enabledForFirefox = enabledForFirefox
		this.enabledForSafari = enabledForSafari
		this.enabledForIE = enabledForIE
		this.enabledForEdge = enabledForEdge
		this.enabledForChrome = enabledForChrome
		this.updatedAt = updatedAt
		this._serviceLabel = serviceLabel
	}

	static fromJson(json: RawFlag): Flag {
		return new Flag(
			json.id,
			json.serviceId,
			json.key,
			json.value ?? '',
			json.description ?? '',
			json.enabled,
			json.enabledForOpera,
			json.enabledForFirefox,
			json.enabledForSafari,
			json.enabledForIE,
			json.enabledForEdge,
			json.enabledForChrome,
			new Date(json.updatedAt),
			json._serviceLabel
		)
	}

	public isFullyEnabled(): boolean {
		return (
			this.enabled &&
			this.enabledForSafari &&
			this.enabledForIE &&
			this.enabledForEdge &&
			this.enabledForChrome &&
			this.enabledForFirefox &&
			this.enabledForOpera
		)
	}

	public isPartiallyEnabled(): boolean {
		return (
			this.enabled &&
			(this.enabledForChrome ||
				this.enabledForEdge ||
				this.enabledForIE ||
				this.enabledForFirefox ||
				this.enabledForOpera ||
				this.enabledForSafari)
		)
	}
}

export default Flag
