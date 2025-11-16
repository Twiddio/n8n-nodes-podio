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
				description: 'Get many applications',
				routing: {
					request: {
						method: 'GET',
						url: '=/app/space/{{$parameter.workspaceId}}/',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an application',
				description: 'Get the data of a single application',
				routing: {
					request: {
						method: 'GET',
						url: '=/app/{{$parameter.applicationId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	...applicationGetManyDescription,
	...applicationGetDescription,
];

