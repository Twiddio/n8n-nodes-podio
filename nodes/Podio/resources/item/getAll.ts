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
			},
		],
	},
];

