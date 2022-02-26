import ServicesHandler from '../controller/services.handler'

export default [
	{
		method: 'GET',
		url: '/services',
		handler: ServicesHandler.getAll,
	},
	{
		method: 'POST',
		url: '/services',
		handler: ServicesHandler.create,
		schema: {
			body: {
				type: 'object',
				required: ['name', 'groupId', 'environment', 'displayType'],
				properties: {
					name: { type: 'string' },
					groupId: { type: 'number' },
					environment: { type: 'string', enum: ['test', 'prod', 'pra'] },
					displayType: { type: 'string', enum: ['idle', 'response_time'] },
					gitUrl: { type: ['string', 'null'] },
					accessUrl: { type: ['string', 'null'] },
					runnerName: { type: ['string', 'null'] },
				},
			},
		},
	},
	{
		method: 'PUT',
		url: '/services/:uid',
		handler: ServicesHandler.update,
		schema: {
			param: {
				type: 'object',
				properties: {
					uid: { type: 'string' },
				},
			},
			body: {
				type: 'object',
				required: ['name', 'environment', 'displayType'],
				properties: {
					name: { type: 'string' },
					environment: { type: 'string', enum: ['test', 'prod', 'pra'] },
					displayType: { type: 'string', enum: ['idle', 'response_time'] },
					gitUrl: { type: ['string', 'null'] },
					accessUrl: { type: ['string', 'null'] },
					runnerName: { type: ['string', 'null'] },
				},
			},
		},
	},
	{
		method: 'POST',
		url: '/services/:uid/vitals',
		handler: ServicesHandler.registerVitals,
		schema: {
			param: {
				type: 'object',
				properties: {
					uid: { type: 'string' },
				},
			},
			body: {
				type: 'object',
				required: ['value'],
				properties: {
					value: { type: 'number' },
				},
			},
		},
	},
	{
		method: 'GET',
		url: '/services/:uid/flags',
		handler: ServicesHandler.getFlags,
		schema: {
			params: {
				type: 'object',
				properties: {
					uid: { type: 'string' },
				},
			},
		},
	},
]
