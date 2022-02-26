import FlagsHandler from '../controller/flags.handler'

export default [
	{
		method: 'GET',
		url: '/flags',
		handler: FlagsHandler.getAll,
	},
	{
		method: 'POST',
		url: '/flags',
		handler: FlagsHandler.create,
		schema: {
			body: {
				type: 'object',
				required: ['serviceId', 'key', 'enabled'],
				properties: {
					serviceId: { type: 'string' },
					key: { type: 'string' },
					value: { type: 'string' },
					description: { type: 'string' },
					enabled: { type: 'boolean' },
				},
			},
		},
	},
	{
		method: 'PUT',
		url: '/flags/:id',
		handler: FlagsHandler.update,
		schema: {
			param: {
				type: 'object',
				properties: {
					id: { type: 'number' },
				},
			},
			body: {
				type: 'object',
				required: ['serviceId', 'key', 'enabled'],
				properties: {
					serviceId: { type: 'string' },
					key: { type: 'string' },
					value: { type: 'string' },
					description: { type: 'string' },
					enabled: { type: 'boolean' },
					enabledForEdge: { type: 'boolean' },
					enabledForChrome: { type: 'boolean' },
					enabledForFirefox: { type: 'boolean' },
					enabledForIE: { type: 'boolean' },
					enabledForOpera: { type: 'boolean' },
					enabledForSafari: { type: 'boolean' },
				},
			},
		},
	},
	{
		method: 'DELETE',
		url: '/flags/:id',
		handler: FlagsHandler.delete,
		schema: {
			param: {
				type: 'object',
				properties: {
					id: { type: 'number' },
				},
			},
		},
	},
]
