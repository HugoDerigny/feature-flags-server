import { GroupDto } from '../models/Group'
import path from 'path'
import fs from 'fs'
import { ServiceDto } from '../models/Service'

const ConfigController = {
	groups: {
		path: path.resolve('config', 'groups.json'),
		getAll: (): GroupDto[] => {
			return JSON.parse(fs.readFileSync(ConfigController.groups.path, { encoding: 'utf-8' }))
		},
		save: (groups: GroupDto[]): void => {
			fs.writeFileSync(ConfigController.groups.path, JSON.stringify(groups))
		},
		add: (group: GroupDto): void => {
			const groups: GroupDto[] = ConfigController.groups.getAll()

			groups.push(group)

			ConfigController.groups.save(groups)
		},
		update: (updatedGroup: GroupDto): void => {
			const groups: GroupDto[] = ConfigController.groups.getAll()

			groups.splice(
				groups.findIndex((group) => group.name === updatedGroup.name),
				1,
				updatedGroup
			)

			ConfigController.groups.save(groups)
		},
		remove: (name: string): void => {
			const groups: GroupDto[] = ConfigController.groups.getAll()

			groups.splice(
				groups.findIndex((group) => group.name === name),
				1
			)

			ConfigController.groups.save(groups)
		},
	},
	services: {
		path: path.resolve('config', 'services.json'),
		getAll: (): ServiceDto[] => {
			return JSON.parse(
				fs.readFileSync(ConfigController.services.path, { encoding: 'utf-8' })
			)
		},
		save: (services: ServiceDto[]): void => {
			fs.writeFileSync(ConfigController.services.path, JSON.stringify(services))
		},
		add: (service: ServiceDto): void => {
			const services: ServiceDto[] = ConfigController.services.getAll()

			services.push(service)

			ConfigController.services.save(services)
		},
		update: (updatedService: ServiceDto): void => {
			const services: ServiceDto[] = ConfigController.services.getAll()

			services.splice(
				services.findIndex((service) => service.name === updatedService.name),
				1,
				updatedService
			)

			ConfigController.services.save(services)
		},
		remove: (name: string): void => {
			let services: ServiceDto[] = ConfigController.services.getAll()

			services = services.splice(
				services.findIndex((service) => service.name === name),
				1
			)

			ConfigController.services.save(services)
		},
	},
}

export default ConfigController
