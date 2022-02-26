import WorkflowHandler from '../controller/workflow.handler'

export default [
	{
		method: 'POST',
		url: '/workflow/sync',
		handler: WorkflowHandler.sync,
		schema: {
			body: {
				type: 'object',
				required: ['workflow_id'],
				properties: {
					workflow_id: { type: 'number' },
				},
			},
		},
	},
	{
		method: 'GET',
		url: '/workflow/runs',
		handler: WorkflowHandler.getRunsInProgress,
	},
	{
		method: 'GET',
		url: '/workflow',
		handler: WorkflowHandler.getWorkflows,
	},
	// {
	// 	method: 'POST',
	// 	url: '/dolibarr/cancel',
	// 	handler: WorkflowHandler.cancel,
	// 	schema: {
	// 		body: {
	// 			type: 'object',
	// 			required: ['cancel_url'],
	// 			properties: {
	// 				cancel_url: { type: 'string' },
	// 			},
	// 		},
	// 	},
	// },
]
