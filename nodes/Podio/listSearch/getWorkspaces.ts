import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { podioApiRequest } from '../shared/authentication';

type Workspace = {
	workspace_id: number;
	name: string;
};

export async function getWorkspaces(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await podioApiRequest.call(this, {
		method: 'GET',
		url: 'https://api.podio.com/workspace/',
	});

	let workspaces: Workspace[] = response || [];

	if (filter) {
		workspaces = workspaces.filter((workspace: Workspace) =>
			workspace.name.toLowerCase().includes(filter.toLowerCase()),
		);
	}

	const results: INodeListSearchItems[] = workspaces.map((workspace: Workspace) => ({
		name: workspace.name,
		value: workspace.workspace_id.toString(),
	}));

	return { results };
}

