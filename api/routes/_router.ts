import ServicesRoutes from './services.route'
import GroupsRoutes from './groups.route'
import WorkflowRoutes from './workflow.route'
import IssuesRoutes from './issues.route'
import FlagsRoute from './flags.route'

export default [
	...ServicesRoutes,
	...GroupsRoutes,
	...WorkflowRoutes,
	...IssuesRoutes,
	...FlagsRoute,
]
