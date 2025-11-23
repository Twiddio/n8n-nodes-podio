import type { INodeProperties } from 'n8n-workflow';
import { applicationSelect } from '../../shared/descriptions';

const showOnlyForItemCreate = {
	operation: ['create'],
	resource: ['item'],
};

export const itemCreateDescription: INodeProperties[] = [
	{
		...applicationSelect,
		displayName: 'Application',
		name: 'appId',
		required: true,
		displayOptions: {
			show: showOnlyForItemCreate,
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForItemCreate,
		},
		default: {},
		placeholder: 'Add Field',
		description: 'Fields to set for the item',
		options: [
			{
				displayName: 'Field',
				name: 'field',
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
						description: 'The field to set',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The field value',
					},
				],
			},
		],
	},
];

