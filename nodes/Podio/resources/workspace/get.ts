import type { INodeProperties } from 'n8n-workflow';
import { workspaceSelect } from '../../shared/descriptions';

const showOnlyForWorkspaceGet = {
	operation: ['get'],
	resource: ['workspace'],
};

export const workspaceGetDescription: INodeProperties[] = [
	{
		...workspaceSelect,
		displayOptions: { show: showOnlyForWorkspaceGet },
	},
];

