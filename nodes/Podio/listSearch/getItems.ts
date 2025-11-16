import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';

type Item = {
	item_id: number;
	title?: string;
};

type ItemsResponse = {
	items: Item[];
};

export async function getItems(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const appId = this.getCurrentNodeParameter('appId', { extractValue: true }) as string | number;
	if (!appId) {
		return { results: [] };
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'podioOAuth2Api',
		{
			method: 'GET',
			url: `https://api.podio.com/item/app/${appId}/`,
			qs: {
				limit: 100,
			},
		},
	);

	const itemsResponse: ItemsResponse = response || { items: [] };
	let items: Item[] = itemsResponse.items || [];

	if (filter) {
		items = items.filter((item: Item) => {
			const title = item.title || `Item ${item.item_id}`;
			return title.toLowerCase().includes(filter.toLowerCase());
		});
	}

	const results: INodeListSearchItems[] = items.map((item: Item) => ({
		name: item.title || `Item ${item.item_id}`,
		value: item.item_id.toString(),
	}));

	return { results };
}

