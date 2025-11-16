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
		routing: {
			send: {
				type: 'body',
				property: 'fields',
				value: '={{$value.field.map((f: any) => ({ field_id: f.field_id, values: [f.value] }))}}',
			},
		},
		options: [
			{
				displayName: 'Field',
				name: 'field',
				values: [
					{
						displayName: 'Field ID',
						name: 'field_id',
						type: 'number',
						default: 0,
						description: 'The field ID',
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

