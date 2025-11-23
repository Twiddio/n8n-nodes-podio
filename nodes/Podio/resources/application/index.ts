import type { INodeProperties } from 'n8n-workflow';
import { applicationGetManyDescription } from './getAll';
import { applicationGetDescription } from './get';

const showOnlyForApplications = {
	resource: ['application'],
};

export const applicationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForApplications,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many applications',
				description: 'Get all apps for the active user',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an application',
				description: 'Get the data of a single application',
			},
		],
		default: 'getAll',
	},
	...applicationGetManyDescription,
	...applicationGetDescription,
];
