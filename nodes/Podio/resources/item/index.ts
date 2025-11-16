import type { INodeProperties } from 'n8n-workflow';
import { itemGetManyDescription } from './getAll';
import { itemGetDescription } from './get';
import { itemCreateDescription } from './create';
import { itemUpdateDescription } from './update';
import { itemDeleteDescription } from './delete';

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
				routing: {
					request: {
						method: 'GET',
						url: '=/item/app/{{$parameter.appId}}/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an item',
				description: 'Get the data of a single item',
				routing: {
					request: {
						method: 'GET',
						url: '=/item/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an item',
				description: 'Create a new item',
				routing: {
					request: {
						method: 'POST',
						url: '=/item/app/{{$parameter.appId}}/',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an item',
				description: 'Update an existing item',
				routing: {
					request: {
						method: 'PUT',
						url: '=/item/{{$parameter.itemId}}',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an item',
				description: 'Delete an item',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/item/{{$parameter.itemId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	...itemGetManyDescription,
	...itemGetDescription,
	...itemCreateDescription,
	...itemUpdateDescription,
	...itemDeleteDescription,
];

