enum EnumModal {
	/**
	 * ServiceConfig modal is for editing the properties of a service. If there is no service passed
	 * as props, then it can be used to add a service.
	 */
	SERVICE_CONFIG,
	/**
	 * Edit the properties of a group or create a group if there is no group props.
	 */
	GROUP_CONFIG,
	/**
	 * Let the user choose between adding a service, or creating a new group.
	 */
	ADD_ELEMENT,
	/**
	 * Show the user how to integrate vitals in a project.
	 */
	HELP_INTEGRATION,
	/**
	 * Display the availble branch tests for a specific service
	 */
	IN_DEV_BRANCHES,
	/**
	 * Feature flag config.
	 */
	FLAG_CONFIG,
}

export { EnumModal }
