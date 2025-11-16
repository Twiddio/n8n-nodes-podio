import type { INodeProperties } from 'n8n-workflow';
import { workspaceSelect } from '../../shared/descriptions';

const showOnlyForApplicationGetMany = {
	operation: ['getAll'],
	resource: ['application'],
};

export const applicationGetManyDescription: INodeProperties[] = [
	{
		...workspaceSelect,
		displayName: 'Workspace',
		name: 'workspaceId',
		required: true,
		displayOptions: {
			show: showOnlyForApplicationGetMany,
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForApplicationGetMany,
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForApplicationGetMany,
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
				type: 'query',
				property: 'limit',
				value: '500',
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ $response.body.length === 500 }}',
						request: {
							url: '={{ $request.url }}',
							qs: {
								offset: '={{ $response.body.length * ($page + 1) }}',
							},
						},
					},
				},
			},
		},
	},
];

