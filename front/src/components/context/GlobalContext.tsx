import * as React from 'react'
import { ReactNode, useEffect, useState } from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import ServiceGroup, { ServiceGroupFactory } from '../../model/ServiceGroup'
import { EnumModal } from '../../types/EnumModals'
import { io, Socket } from 'socket.io-client'
import Service from '../../model/Service'

type Props = {
	children: ReactNode
}

type GlobalContextType = {
	services: Array<ServiceGroup>
	getServicesId: () => Array<{ id: string; label: string }>
	setServices: (services: Array<ServiceGroup>) => void
	fetchServices: () => Promise<void>
	socket: Socket | undefined
	zenMode: {
		isSet: boolean
		set: (setZenMode: boolean) => void
	}
	modal: {
		node: EnumModal | undefined
		props: Record<string, any> | undefined
		set: (modal: EnumModal, props?: Record<string, any>) => void
		close: () => void
	}
}

const GlobalContext = React.createContext({} as GlobalContextType)

function ContextProvider({ children }: Props) {
	const [services, setServices] = useState<Array<ServiceGroup>>([])
	const [activeModal, setActiveModal] = useState<EnumModal>()
	const [modalProps, setModalProps] = useState<Record<string, any>>()
	const [zenMode, setZenMode] = useState<boolean>(false)
	const [socket, setSocket] = useState<Socket>()

	useEffect(() => {
		const socket: Socket = io(process.env.REACT_APP_WS_URL as string, {
			reconnectionAttempts: 2,
			reconnectionDelayMax: 3000,
			path: process.env.NODE_ENV === 'production' ? '/api/socket.io' : '/socket.io',
		})

		setSocket(socket)

		socket.on('services_update', (services) => {
			setServices(
				ServiceGroupFactory.fromJson(
					typeof services === 'string' ? JSON.parse(services) : services
				)
			)
		})
	}, [])

	useEffect(() => {
		fetchServices()
	}, [])

	/**
	 * ZenMode event handler
	 */
	useEffect(() => {
		function toggleZenMode(e: KeyboardEvent) {
			if (e.code === 'KeyW' && e.altKey && !zenMode) {
				setZenMode(true)
			}

			if (e.code === 'Escape' && zenMode) {
				setZenMode(false)
			}
		}

		window.addEventListener('keyup', toggleZenMode)

		return () => {
			window.removeEventListener('keyup', toggleZenMode)
		}
	}, [zenMode])

	async function fetchServices(): Promise<void> {
		try {
			const response: AxiosResponse = await axios.get(
				process.env.REACT_APP_API_URL + '/services'
			)

			setServices(ServiceGroupFactory.fromJson(response.data))
		} catch (e) {
			const error = e as AxiosError

			console.error(error.response)
		}
	}

	function getServicesId(): Array<{ id: string; label: string }> {
		const allServices: { id: string; label: string }[] = []

		services.forEach((group: ServiceGroup) =>
			group.getEnvs().forEach((env: string) =>
				group.getFromEnv(env).forEach((service: Service) =>
					allServices.push({
						id: service.token,
						label: `[${group.identifier.toUpperCase()} ${env.toUpperCase()}] ${
							service.name
						}`,
					})
				)
			)
		)

		return allServices.sort()
	}

	return (
		<GlobalContext.Provider
			value={{
				services,
				setServices,
				fetchServices,
				socket: socket,
				getServicesId,
				zenMode: {
					isSet: zenMode,
					set: setZenMode,
				},
				modal: {
					node: activeModal,
					props: modalProps,
					set: (modal: EnumModal, props?: Record<string, any>) => {
						setActiveModal(modal)
						setModalProps(props)
					},
					close: () => {
						setActiveModal(undefined)
						setModalProps(undefined)
					},
				},
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}

export { GlobalContext }
export default ContextProvider
