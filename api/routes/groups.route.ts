import GroupsHandler from '../controller/groups.handler'

export default [
	{
		method: 'POST',
		url: '/groups',
		handler: GroupsHandler.create,
		schema: {
			body: {
				type: 'object',
				required: ['name', 'style'],
				properties: {
					name: { type: 'string' },
					style: { type: 'string' },
				},
			},
		},
	},
	{
		method: 'PUT',
		url: '/groups/:uid',
		handler: GroupsHandler.update,
		schema: {
			param: {
				type: 'object',
				properties: {
					uid: { type: 'string' },
				},
			},
			body: {
				type: 'object',
				required: ['name', 'style'],
				properties: {
					name: { type: 'string' },
					style: { type: 'string' },
				},
			},
		},
	},
]
