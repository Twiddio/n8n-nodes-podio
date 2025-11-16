import type { INodeProperties } from 'n8n-workflow';
import { applicationSelect } from '../../shared/descriptions';

const showOnlyForApplicationGet = {
	operation: ['get'],
	resource: ['application'],
};

export const applicationGetDescription: INodeProperties[] = [
	{
		...applicationSelect,
		displayOptions: { show: showOnlyForApplicationGet },
	},
];

