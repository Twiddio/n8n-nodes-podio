import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { podioApiRequest } from '../shared/authentication';

type Field = {
	field_id: number;
	label: string;
	type?: string;
};

type ApplicationResponse = {
	fields?: Field[];
};

export async function getFields(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		// Get the appId from the current node parameters
		let appId: string | number | undefined;
		try {
			const appIdParam = this.getCurrentNodeParameter('appId', { extractValue: true }) as
				| string
				| number
				| { __rl?: boolean; value?: string | number; mode?: string }
				| null
				| undefined;

			// Handle resourceLocator format
			if (appIdParam === null || appIdParam === undefined) {
				return { results: [] };
			} else if (typeof appIdParam === 'object' && appIdParam !== null) {
				if ('value' in appIdParam && appIdParam.value !== null && appIdParam.value !== undefined) {
					appId = appIdParam.value as string | number;
				} else {
					return { results: [] };
				}
			} else {
				appId = appIdParam;
			}
		} catch (error) {
			// Parameter doesn't exist or can't be extracted
			return { results: [] };
		}

		if (!appId) {
			return { results: [] };
		}

		// Convert to string and validate
		const appIdStr = String(appId).trim();
		if (!appIdStr || !/^\d+$/.test(appIdStr)) {
			return { results: [] };
		}

		// Fetch application details which includes fields
		const response = await podioApiRequest.call(this, {
			method: 'GET',
			url: `https://api.podio.com/app/${appIdStr}`,
		});

		const appResponse: ApplicationResponse = response || {};
		let fields: Field[] = appResponse.fields || [];

		// Filter fields if needed
		if (filter) {
			fields = fields.filter((field: Field) => {
				const label = field.label || `Field ${field.field_id}`;
				return label.toLowerCase().includes(filter.toLowerCase());
			});
		}

		// Map to results
		const results: INodeListSearchItems[] = fields.map((field: Field) => ({
			name: field.label || `Field ${field.field_id}`,
			value: field.field_id.toString(),
		}));

		return { results };
	} catch (error: any) {
		// Return empty results on error rather than throwing
		// This prevents the dropdown from breaking completely
		const errorMessage = error.message || String(error);
		if (!errorMessage.includes('posthog')) {
			console.error('Error fetching fields:', errorMessage);
		}
		return { results: [] };
	}
}

