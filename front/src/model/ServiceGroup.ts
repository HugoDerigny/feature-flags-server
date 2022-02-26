import Service from './Service'
import { RawServiceGroup } from '../types/RawService'
import { ColorStyles } from '../types/ColorStyles'

class ServiceGroup {
	private readonly _id: number
	private readonly _identifier: string
	private readonly _style: string
	private readonly _services: Record<string, Array<Service>>

	constructor(
		id: number,
		identifier: string,
		style: string,
		services: Record<string, Array<Service>>
	) {
		this._id = id
		this._identifier = identifier
		this._services = services
		this._style = style
	}

	static fromJson(object: RawServiceGroup): ServiceGroup {
		const { services, style, name, id } = object
		const formattedServices: Record<string, Service[]> = {}

		function getColorStyle(): ColorStyles {
			switch (style) {
				case 'blue':
					return ColorStyles.BLUE

				case 'purple':
					return ColorStyles.PURPLE

				case 'pink':
					return ColorStyles.PINK

				case 'orange':
					return ColorStyles.ORANGE

				default:
					return ColorStyles.BLUE
			}
		}

		for (const service of services) {
			formattedServices[service.environment]
				? formattedServices[service.environment].push(Service.fromJson(service, id))
				: (formattedServices[service.environment] = [Service.fromJson(service, id)])
		}

		return new ServiceGroup(id, name, getColorStyle(), formattedServices)
	}

	public getFromEnv(env: string): Array<Service> {
		const servicesFromEnv: [string, Array<Service>] | undefined = Object.entries(
			this._services
		).find(([servicesEnv, _]: [string, Array<Service>]) => servicesEnv === env)

		return servicesFromEnv ? servicesFromEnv[1] : []
	}

	public getAllRepositories(): Array<string> {
		const repositories: Array<string> = []

		const servicesByEnv: Array<Service[]> = Object.values(this._services)
		const allServices = servicesByEnv.flat()

		for (const service of allServices) {
			const repo: string = service.gitUrl.split('/').pop()!!

			if (!repositories.includes(repo)) {
				repositories.push(repo)
			}
		}

		return repositories
	}

	get id(): number {
		return this._id
	}

	public getEnvs(): Array<string> {
		return ['prod', 'pra', 'test'].filter((env) => Object.keys(this._services).includes(env))
	}

	get identifier(): string {
		return this._identifier
	}

	get style(): string {
		return this._style
	}

	get services(): Record<string, Array<Service>> {
		return this._services
	}
}

class ServiceGroupFactory {
	static fromJson(objects: Array<RawServiceGroup>): Array<ServiceGroup> {
		const servicesGroups: Array<ServiceGroup> = []

		for (const object of objects) {
			servicesGroups.push(ServiceGroup.fromJson(object))
		}

		return servicesGroups
	}
}

export { ServiceGroupFactory }
export default ServiceGroup
