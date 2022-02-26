import IssueHandler from '../controller/issues.handler'

export default [
	{
		method: 'GET',
		url: '/issues',
		handler: IssueHandler.getAll,
	},
]
