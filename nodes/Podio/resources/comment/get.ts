import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCommentGet = {
	operation: ['get'],
	resource: ['comment'],
};

export const commentGetDescription: INodeProperties[] = [
	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'string',
		displayOptions: {
			show: showOnlyForCommentGet,
		},
		default: '',
		required: true,
		description: 'The ID of the comment to retrieve',
	},
];

