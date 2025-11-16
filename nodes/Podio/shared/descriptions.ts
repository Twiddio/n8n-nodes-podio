import type { INodeProperties } from 'n8n-workflow';

export const workspaceSelect: INodeProperties = {
	displayName: 'Workspace',
	name: 'workspaceId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	modes: [
		{
			displayName: 'Workspace',
			name: 'list',
			type: 'list',
			placeholder: 'Select a workspace...',
			typeOptions: {
				searchListMethod: 'getWorkspaces',
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
						errorMessage: 'Not a valid Workspace ID',
					},
				},
			],
		},
	],
};

export const applicationSelect: INodeProperties = {
	displayName: 'Application',
	name: 'applicationId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	modes: [
		{
			displayName: 'Application',
			name: 'list',
			type: 'list',
			placeholder: 'Select an application...',
			typeOptions: {
				searchListMethod: 'getApplications',
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
						errorMessage: 'Not a valid Application ID',
					},
				},
			],
		},
	],
};

export const itemSelect: INodeProperties = {
	displayName: 'Item',
	name: 'itemId',
	type: 'resourceLocator',
	default: { mode: 'list', value: '' },
	required: true,
	modes: [
		{
			displayName: 'Item',
			name: 'list',
			type: 'list',
			placeholder: 'Select an item...',
			typeOptions: {
				searchListMethod: 'getItems',
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
						errorMessage: 'Not a valid Item ID',
					},
				},
			],
		},
	],
};

