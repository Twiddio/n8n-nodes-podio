import type { INodeProperties } from 'n8n-workflow';
import { applicationSelect } from '../../shared/descriptions';

const showOnlyForItemGetMany = {
	operation: ['getAll'],
	resource: ['item'],
};

export const itemGetManyDescription: INodeProperties[] = [
	{
		...applicationSelect,
		displayName: 'Application',
		name: 'appId',
		required: true,
		displayOptions: {
			show: showOnlyForItemGetMany,
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForItemGetMany,
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
			show: showOnlyForItemGetMany,
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
						continue: '={{ $response.body.items && $response.body.items.length === 500 }}',
						request: {
							url: '={{ $request.url }}',
							qs: {
								offset: '={{ ($response.body.items || []).length * ($page + 1) }}',
							},
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		typeOptions: {
			multipleValueButtonText: 'Add Filter',
		},
		displayOptions: {
			show: showOnlyForItemGetMany,
		},
		default: {},
		options: [
			{
				displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				options: [
					{
						name: 'Created On',
						value: 'created_on',
					},
					{
						name: 'Last Edit',
						value: 'last_edit',
					},
					{
						name: 'Rank',
						value: 'rank',
					},
				],
				default: 'created_on',
				description: 'Field to sort by',
				routing: {
					request: {
						qs: {
							sort_by: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sort_desc',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: false,
					},
					{
						name: 'Descending',
						value: true,
					},
				],
				default: false,
				description: 'Sort order',
				routing: {
					request: {
						qs: {
							sort_desc: '={{$value}}',
						},
					},
				},
			},
		],
	},
];

