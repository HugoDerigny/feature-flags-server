export interface FlagDto {
	id: number
	serviceId: string
	key: string
	value: string
	summary: string
	enabled: boolean
	enabledForOpera: boolean
	enabledForFirefox: boolean
	enabledForSafari: boolean
	enabledForIE: boolean
	enabledForEdge: boolean
	enabledForChrome: boolean
	updatedAt: string
}

export default class Flag {
	private readonly _id: number
	public serviceId: string
	public key: string
	public value: string
	public summary: string
	public enabled: boolean
	public enabledForOpera: boolean
	public enabledForFirefox: boolean
	public enabledForSafari: boolean
	public enabledForIE: boolean
	public enabledForEdge: boolean
	public enabledForChrome: boolean

	updatedAt: Date

	constructor(
		id: number,
		serviceId: string,
		key: string,
		value: string,
		summary: string,
		enabled: boolean,
		enabledForOpera: boolean,
		enabledForFirefox: boolean,
		enabledForSafari: boolean,
		enabledForIE: boolean,
		enabledForEdge: boolean,
		enabledForChrome: boolean,
		updatedAt: Date
	) {
		this._id = id
		this.serviceId = serviceId
		this.key = key
		this.value = value
		this.summary = summary
		this.enabled = enabled
		this.enabledForOpera = enabledForOpera
		this.enabledForFirefox = enabledForFirefox
		this.enabledForSafari = enabledForSafari
		this.enabledForIE = enabledForIE
		this.enabledForEdge = enabledForEdge
		this.enabledForChrome = enabledForChrome
		this.updatedAt = updatedAt
	}

	public static Deserialize(json: FlagDto): Flag {
		return new Flag(
			json.id,
			json.serviceId,
			json.key,
			json.value,
			json.summary,
			json.enabled,
			json.enabledForOpera,
			json.enabledForFirefox,
			json.enabledForSafari,
			json.enabledForIE,
			json.enabledForEdge,
			json.enabledForChrome,
			new Date(json.updatedAt)
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
				this.enabledForSafari) &&
			!this.isFullyEnabled()
		)
	}

	get id(): number {
		return this._id
	}
}
