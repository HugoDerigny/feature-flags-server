import { FC, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext'
import Service from '../../model/Service'
import { ServiceRow } from '../molecules/ServiceRow'

const ServicesList: FC<any> = () => {
	const { services, fetchServices } = useContext(GlobalContext)

	useEffect(() => {
		fetchServices()
	}, [])

	return services ? (
		services.length === 0 ? (
			<p className='text-gray-400 mt-8'>
				Start by adding a service, click on the "+ Add" button.
			</p>
		) : (
			<section className='row-wrapper'>
				{services.map((service: Service) => (
					<ServiceRow key={service.id} service={service} />
				))}
			</section>
		)
	) : (
		<p className='text-gray-400 mt-8'>Fetching services...</p>
	)
}

export default ServicesList
