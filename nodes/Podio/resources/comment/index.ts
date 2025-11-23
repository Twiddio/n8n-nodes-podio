import type { INodeProperties } from 'n8n-workflow';
import { commentCreateDescription } from './create';
import { commentGetDescription } from './get';

const showOnlyForComments = {
	resource: ['comment'],
};

export const commentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForComments,
		},
		options: [
			{
				name: 'Add Comment to Object',
				value: 'create',
				action: 'Add a comment to an object',
				description: 'Add a comment to an item, task, status, or space',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a comment',
				description: 'Get the data of a single comment',
			},
		],
		default: 'create',
	},
	...commentCreateDescription,
	...commentGetDescription,
];

