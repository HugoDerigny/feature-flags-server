enum DisplayType {
	// Nothing
	IDLE = 'idle' as any,
	// Display graph of response time
	RESPONSE_TIME = 'response_time' as any,
}

enum ServiceStatus {
	ONLINE,
	IN_BUILD,
	OFFLINE,
}

declare type Environment = 'test' | 'pra' | 'prod'

declare type RawVitals = {
	averageResponseTime: number
	history: Array<{ x: string; y: number }>
}

declare type RawRunner = {
	name: string
	status: string
	busy: boolean
}

declare type RawPr = {
	number: number
	title: string
	user: {
		login: string
		avatar_url: string
	}
}

declare type RawService = {
	id: string
	environment: string
	name: string
	displayType: string
	gitUrl: string
	accessUrl: string
	status: ServiceStatus
	_vital: RawVitals
	_runner: RawRunner
	_prs?: RawPr[]
}

declare type RawServiceGroup = {
	id: number
	style: string
	name: string
	services: RawService[]
}

declare type RawBug = {
	id: number
	group: string
	environment: Environment
	title: string
	content: string
	createdAt: string
}

declare type RawIssue = {
	number: number
	url: string
	title: string
	body: string
	assignee: {
		avatar_url: string
		login: string
	}
	created_at: string
	updated_at: string
}

declare type RawFlag = {
	id: number
	serviceId: string
	key: string
	value?: string
	description?: string
	enabled: boolean
	enabledForOpera: boolean
	enabledForFirefox: boolean
	enabledForSafari: boolean
	enabledForIE: boolean
	enabledForEdge: boolean
	enabledForChrome: boolean
	updatedAt: string

	_serviceLabel: string
}

export { DisplayType, ServiceStatus }
export type {
	RawServiceGroup,
	RawService,
	RawFlag,
	RawVitals,
	RawRunner,
	RawPr,
	RawBug,
	Environment,
	RawIssue,
}
