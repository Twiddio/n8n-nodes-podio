import type { INodeProperties } from 'n8n-workflow';
import { itemGetManyDescription } from './getAll';
import { itemGetDescription } from './get';
import { itemCreateDescription } from './create';
import { itemSearchDescription } from './search';

const showOnlyForItems = {
	resource: ['item'],
};

export const itemDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForItems,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many items',
				description: 'Get many items from an application',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an item',
				description: 'Get the data of a single item',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an item',
				description: 'Create a new item',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search items',
				description: 'Search and filter items using advanced criteria',
			},
		],
		default: 'getAll',
	},
	...itemGetManyDescription,
	...itemGetDescription,
	...itemCreateDescription,
	...itemSearchDescription,
];

