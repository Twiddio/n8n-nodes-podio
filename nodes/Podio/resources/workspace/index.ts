import type { INodeProperties } from 'n8n-workflow';
import { workspaceGetManyDescription } from './getAll';
import { workspaceGetDescription } from './get';

const showOnlyForWorkspaces = {
	resource: ['workspace'],
};

export const workspaceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWorkspaces,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many workspaces',
				description: 'Get many workspaces',
				routing: {
					request: {
						method: 'GET',
						url: '/workspace/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a workspace',
				description: 'Get the data of a single workspace',
				routing: {
					request: {
						method: 'GET',
						url: '=/workspace/{{$parameter.workspaceId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	...workspaceGetManyDescription,
	...workspaceGetDescription,
];

