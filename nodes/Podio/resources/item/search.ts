import type { INodeProperties } from 'n8n-workflow';
import { applicationSelect } from '../../shared/descriptions';

const showOnlyForItemSearch = {
	operation: ['search'],
	resource: ['item'],
};

export const itemSearchDescription: INodeProperties[] = [
	{
		...applicationSelect,
		displayName: 'Application',
		name: 'appId',
		required: true,
		displayOptions: {
			show: showOnlyForItemSearch,
		},
	},
	{
		displayName: 'Field Filters',
		name: 'fieldFilters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForItemSearch,
		},
		default: {},
		placeholder: 'Add Field Filter',
		description: 'Filter items by field values',
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				values: [
					{
						displayName: 'Field',
						name: 'field_id',
						type: 'resourceLocator',
						default: { mode: 'list', value: '' },
						required: true,
						modes: [
							{
								displayName: 'Field',
								name: 'list',
								type: 'list',
								placeholder: 'Select a field...',
								typeOptions: {
									searchListMethod: 'getFields',
									searchable: true,
									searchFilterRequired: false,
								},
							},
							{
								displayName: 'By ID',
								name: 'id',
								type: 'string',
								placeholder: 'e.g. 123456',
								validation: [
									{
										type: 'regex',
										properties: {
											regex: '[0-9]+',
											errorMessage: 'Not a valid Field ID',
										},
									},
								],
							},
						],
						description: 'The field to filter by',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						required: true,
						description: 'The value to filter by (equals match)',
					},
				],
			},
		],
	},
	{
		displayName: 'Sort Options',
		name: 'sortOptions',
		type: 'collection',
		displayOptions: {
			show: showOnlyForItemSearch,
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
					{
						name: 'Field',
						value: 'field',
						description: 'Sort by a specific field',
					},
				],
				default: 'created_on',
				description: 'Field to sort by',
			},
			{
				displayName: 'Field ID',
				name: 'sort_field_id',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				displayOptions: {
					show: {
						sort_by: ['field'],
					},
				},
				modes: [
					{
						displayName: 'Field',
						name: 'list',
						type: 'list',
						placeholder: 'Select a field...',
						typeOptions: {
							searchListMethod: 'getFields',
							searchable: true,
							searchFilterRequired: false,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'e.g. 123456',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[0-9]+',
									errorMessage: 'Not a valid Field ID',
								},
							},
						],
					},
				],
				description: 'The field to sort by (when Sort By is set to Field)',
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
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForItemSearch,
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForItemSearch,
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
];

