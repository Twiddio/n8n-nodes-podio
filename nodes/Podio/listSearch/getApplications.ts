import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { authenticateWithUsernamePassword } from '../shared/authentication';

type Application = {
	app_id: number;
	name: string;
};

export async function getApplications(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		// For "Get an Application", we don't need workspaceId - just get all apps
		// Try to get workspaceId only if it exists (for other operations that might use this function)
		let workspaceId: string | number | undefined;
		try {
			// Only try to get workspaceId if the parameter exists
			const node = this.getNode();
			if (node?.parameters && 'workspaceId' in node.parameters) {
				workspaceId = this.getCurrentNodeParameter('workspaceId', { extractValue: true }) as
					| string
					| number
					| undefined;
			}
		} catch (error) {
			// workspaceId parameter doesn't exist - that's fine, we'll use /app/ endpoint
			workspaceId = undefined;
		}

		// Use workspace-specific endpoint if workspaceId is available, otherwise get all apps
		const url = workspaceId
			? `https://api.podio.com/app/space/${workspaceId}/`
			: 'https://api.podio.com/app/';

		// Get authenticated bearer token
		let accessToken: string;
		try {
			accessToken = await authenticateWithUsernamePassword.call(this);
			if (!accessToken) {
				return { results: [] };
			}
		} catch (error: any) {
			// Authentication failed - return empty results instead of throwing
			return { results: [] };
		}

		// Make authenticated request with bearer token
		let response: any;
		try {
			response = await this.helpers.httpRequest({
				method: 'GET',
				url,
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: 'application/json',
				},
				json: true,
				timeout: 30000, // 30 second timeout
			});
		} catch (error: any) {
			// API request failed - return empty results instead of throwing
			return { results: [] };
		}

		// Handle different response formats
		let applications: Application[] = [];
		
		if (Array.isArray(response)) {
			// Direct array response
			applications = response;
		} else if (response && typeof response === 'object') {
			// Check if response has a nested array (e.g., { items: [...] })
			if (Array.isArray(response.items)) {
				applications = response.items;
			} else if (Array.isArray(response.apps)) {
				applications = response.apps;
			} else if (Array.isArray(response.data)) {
				applications = response.data;
			} else {
				// Try to find any array property
				const arrayKeys = Object.keys(response).filter(key => Array.isArray(response[key]));
				if (arrayKeys.length > 0) {
					applications = response[arrayKeys[0]];
				}
			}
		}

		// Filter applications if needed
		if (filter) {
			applications = applications.filter((app: any) => {
				// Try multiple ways to get the application name
				const appName =
					app.config?.name ||
					app.name ||
					app.title ||
					app.app_name ||
					app.config?.title ||
					'';
				return appName.toLowerCase().includes(filter.toLowerCase());
			});
		}

		// Map to results, handling different property names
		const results: INodeListSearchItems[] = applications
			.filter((app: any) => {
				// Ensure we have an ID
				const id = app.app_id || app.appId || app.id || app.application_id;
				return id !== undefined && id !== null;
			})
			.map((app: any) => {
				const id = app.app_id || app.appId || app.id || app.application_id;
				// Podio API stores the name in app.config.name
				const name =
					app.config?.name ||
					app.config?.title ||
					app.name ||
					app.title ||
					app.app_name ||
					`Application ${id}`;
				return {
					name: String(name),
					value: String(id),
				};
			});

		return { results };
	} catch (error: any) {
		// Return empty results on error rather than throwing
		// This prevents the dropdown from breaking completely
		const errorMessage = error.message || String(error);
		if (!errorMessage.includes('posthog')) {
			// Only log non-PostHog errors (PostHog errors are just analytics and can be ignored)
			console.error('Error fetching applications:', errorMessage);
		}
		return { results: [] };
	}
}

