import type { INodeProperties } from 'n8n-workflow';
import { itemSelect } from '../../shared/descriptions';

const showOnlyForItemDelete = {
	operation: ['delete'],
	resource: ['item'],
};

export const itemDeleteDescription: INodeProperties[] = [
	{
		...itemSelect,
		displayName: 'Item',
		name: 'itemId',
		required: true,
		displayOptions: {
			show: showOnlyForItemDelete,
		},
	},
];

