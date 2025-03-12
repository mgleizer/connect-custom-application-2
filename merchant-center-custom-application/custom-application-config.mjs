import { PERMISSIONS, entryPointUriPath } from "./src/constants";

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
	name: "Custom Objects",
	entryPointUriPath,
	cloudIdentifier: "gcp-eu",
	env: {
		development: {
			initialProjectKey: "music-shop",
		},
		production: {
			applicationId: "cm0pgzuxk003i1067ttiav3qh",
			url: "https://your_app_hostname.com",
		},
	},
	oAuthScopes: {
		view: ["view_key_value_documents"],
		manage: ["manage_key_value_documents"],
	},
	icon: "${path:@commercetools-frontend/assets/application-icons/rocket.svg}",
	mainMenuLink: {
		defaultLabel: "Template starter",
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
