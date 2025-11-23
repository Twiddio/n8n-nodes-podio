import type { INodeProperties } from 'n8n-workflow';

const showOnlyForApplicationGetMany = {
	operation: ['getAll'],
	resource: ['application'],
};

export const applicationGetManyDescription: INodeProperties[] = [
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
		},
		default: 4,
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
		description: 'The maximum number of apps to return. Default: 4',
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
						continue: '={{ $response.body && Array.isArray($response.body) && $response.body.length === 500 }}',
						request: {
							url: '={{ $request.url }}',
							qs: {
								limit: '={{ 500 }}',
							},
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForApplicationGetMany,
		},
		options: [
			{
				displayName: 'Exclude App IDs',
				name: 'exclude_app_ids',
				type: 'string',
				default: '',
				description: 'Comma separated list of app IDs to exclude from the returned list',
				routing: {
					send: {
						type: 'query',
						property: 'exclude_app_ids',
					},
				},
			},
			{
				displayName: 'Exclude Demo',
				name: 'exclude_demo',
				type: 'boolean',
				default: false,
				description: 'Whether to exclude apps from demo workspace',
				routing: {
					send: {
						type: 'query',
						property: 'exclude_demo',
					},
				},
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{
						name: 'Score',
						value: 'score',
						description: 'Order by the score of the app for the active user',
					},
					{
						name: 'Name',
						value: 'name',
						description: 'Order by the name of the app',
					},
				],
				default: 'score',
				description: 'The order to return the apps in',
				routing: {
					send: {
						type: 'query',
						property: 'order',
					},
				},
			},
			{
				displayName: 'Referenceable in Organization',
				name: 'referenceable_in_org',
				type: 'string',
				default: '',
				description: 'ID of the Organization to filter apps by. Returns only apps the user can reference in that Organization',
				routing: {
					send: {
						type: 'query',
						property: 'referenceable_in_org',
					},
				},
			},
			{
				displayName: 'Right',
				name: 'right',
				type: 'string',
				default: '',
				description: 'The right the user must have on the returned apps',
				routing: {
					send: {
						type: 'query',
						property: 'right',
					},
				},
			},
			{
				displayName: 'Target Space ID',
				name: 'target_space_id',
				type: 'string',
				default: '',
				description: 'The ID of the space we prefer the apps to come from. This will usually be the users current workspace',
				routing: {
					send: {
						type: 'query',
						property: 'target_space_id',
					},
				},
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				description: 'Search term that should match the name of the app, the name of items in the app, or the name of the workspace the app is in',
				routing: {
					send: {
						type: 'query',
						property: 'text',
					},
				},
			},
		],
	},
];

