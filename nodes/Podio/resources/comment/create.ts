import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCommentCreate = {
	operation: ['create'],
	resource: ['comment'],
};

export const commentCreateDescription: INodeProperties[] = [
	{
		displayName: 'Object Type',
		name: 'refType',
		type: 'options',
		displayOptions: {
			show: showOnlyForCommentCreate,
		},
		options: [
			{
				name: 'Item',
				value: 'item',
			},
			{
				name: 'Status',
				value: 'status',
			},
			{
				name: 'Task',
				value: 'task',
			},
			{
				name: 'Space',
				value: 'space',
			},
		],
		default: 'item',
		required: true,
		description: 'The type of object to add a comment to',
	},
	{
		displayName: 'Object ID',
		name: 'refId',
		type: 'string',
		displayOptions: {
			show: showOnlyForCommentCreate,
		},
		default: '',
		required: true,
		description: 'The ID of the object to add a comment to',
	},
	{
		displayName: 'Comment',
		name: 'value',
		type: 'string',
		displayOptions: {
			show: showOnlyForCommentCreate,
		},
		default: '',
		required: true,
		description: 'The content of the comment',
		typeOptions: {
			rows: 4,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: showOnlyForCommentCreate,
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'External ID',
				name: 'external_id',
				type: 'string',
				default: '',
				description: 'An external identifier for the comment',
			},
			{
				displayName: 'File IDs',
				name: 'file_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of file IDs to attach to the comment',
			},
			{
				displayName: 'Embed ID',
				name: 'embed_id',
				type: 'string',
				default: '',
				description: 'ID of an embedded link',
			},
			{
				displayName: 'Embed URL',
				name: 'embed_url',
				type: 'string',
				default: '',
				description: 'URL to be attached as an embed',
			},
		],
	},
];

