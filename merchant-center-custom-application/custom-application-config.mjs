import { PERMISSIONS, entryPointUriPath } from "./src/constants";

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
	name: "Custom Objects",
	entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
	cloudIdentifier: "gcp-eu",
	env: {
		development: {
			initialProjectKey: "music-shop",
		},
		production: {
			applicationId: "${env:CUSTOM_APPLICATION_ID}",
			url: "${env:APPLICATION_URL}",
		},
	},
	oAuthScopes: {
		view: ["view_key_value_documents"],
		manage: ["manage_key_value_documents"],
	},
	icon: "${path:@commercetools-frontend/assets/application-icons/rocket.svg}",
	mainMenuLink: {
		defaultLabel: "custom-objects",
		labelAllLocales: [],
		permissions: [PERMISSIONS.View],
	},
	submenuLinks: [
		{
			uriPath: "custom-objects",
			defaultLabel: "Custom Objects",
			labelAllLocales: [],
			permissions: [PERMISSIONS.View, PERMISSIONS.Manage],
		},
	],
};

export default config;
