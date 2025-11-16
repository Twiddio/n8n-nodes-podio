import type { INodeProperties } from 'n8n-workflow';
import { itemSelect } from '../../shared/descriptions';

const showOnlyForItemUpdate = {
	operation: ['update'],
	resource: ['item'],
};

export const itemUpdateDescription: INodeProperties[] = [
	{
		...itemSelect,
		displayName: 'Item',
		name: 'itemId',
		required: true,
		displayOptions: {
			show: showOnlyForItemUpdate,
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
			show: showOnlyForItemUpdate,
		},
		default: {},
		placeholder: 'Add Field',
		description: 'Fields to update for the item',
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

