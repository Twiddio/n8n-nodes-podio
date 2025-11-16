import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { workspaceDescription } from './resources/workspace';
import { applicationDescription } from './resources/application';
import { itemDescription } from './resources/item';
import { getWorkspaces } from './listSearch/getWorkspaces';
import { getApplications } from './listSearch/getApplications';
import { getItems } from './listSearch/getItems';

export class Podio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Podio',
		name: 'podio',
		icon: { light: 'file:../../icons/podio.svg', dark: 'file:../../icons/podio.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Podio API',
		defaults: {
			name: 'Podio',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'podioOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.podio.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Item',
						value: 'item',
					},
					{
						name: 'Application',
						value: 'application',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
				],
				default: 'item',
			},
			...workspaceDescription,
			...applicationDescription,
			...itemDescription,
		],
	};

	methods = {
		listSearch: {
			getWorkspaces,
			getApplications,
			getItems,
		},
	};
}

