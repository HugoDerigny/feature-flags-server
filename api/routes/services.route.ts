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
				required: ['name'],
				properties: {
					name: { type: 'string' },
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
				required: ['name'],
				properties: {
					name: { type: 'string' },
				},
			},
		},
	},
	{
		method: 'DELETE',
		url: '/services/:uid',
		handler: ServicesHandler.delete,
		schema: {
			param: {
				type: 'object',
				properties: {
					uid: { type: 'string' },
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
