import type { INodeProperties } from 'n8n-workflow';
import { itemSelect } from '../../shared/descriptions';

const showOnlyForItemGet = {
	operation: ['get'],
	resource: ['item'],
};

export const itemGetDescription: INodeProperties[] = [
	{
		...itemSelect,
		displayOptions: { show: showOnlyForItemGet },
	},
];

