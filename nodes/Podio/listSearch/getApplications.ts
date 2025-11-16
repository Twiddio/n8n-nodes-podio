import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';

type Application = {
	app_id: number;
	name: string;
};

export async function getApplications(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const workspaceId = this.getCurrentNodeParameter('workspaceId', { extractValue: true }) as
		| string
		| number;
	if (!workspaceId) {
		return { results: [] };
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'podioOAuth2Api',
		{
			method: 'GET',
			url: `https://api.podio.com/app/space/${workspaceId}/`,
		},
	);

	let applications: Application[] = response || [];

	if (filter) {
		applications = applications.filter((app: Application) =>
			app.name.toLowerCase().includes(filter.toLowerCase()),
		);
	}

	const results: INodeListSearchItems[] = applications.map((app: Application) => ({
		name: app.name,
		value: app.app_id.toString(),
	}));

	return { results };
}

