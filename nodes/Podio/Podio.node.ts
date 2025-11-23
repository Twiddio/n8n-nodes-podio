import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { workspaceDescription } from './resources/workspace';
import { applicationDescription } from './resources/application';
import { itemDescription } from './resources/item';
import { commentDescription } from './resources/comment';
import { getWorkspaces } from './listSearch/getWorkspaces';
import { getApplications } from './listSearch/getApplications';
import { getItems } from './listSearch/getItems';
import { getFields } from './listSearch/getFields';

export class Podio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Podio',
		name: 'podio',
		icon: { light: 'file:../../icons/podio.svg', dark: 'file:../../icons/podio.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Podio API',
		defaults: {
			name: 'Podio',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'podioUsernamePasswordApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.podio.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Item',
						value: 'item',
					},
					{
						name: 'Application',
						value: 'application',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
					{
						name: 'Comment',
						value: 'comment',
					},
				],
				default: 'item',
			},
			...workspaceDescription,
			...applicationDescription,
			...itemDescription,
			...commentDescription,
		],
	};

	methods = {
		listSearch: {
			getWorkspaces,
			getApplications,
			getItems,
			getFields,
		},
	};

	async execute(this: IExecuteFunctions) {
		// Import podioApiRequest which handles authentication automatically
		const { podioApiRequest } = await import('./shared/authentication');
		
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData: any[] = [];

		// Handle getAll applications operation with authentication
		if (resource === 'application' && operation === 'getAll') {
			const response = await podioApiRequest.call(this, {
				method: 'GET',
				url: 'https://api.podio.com/app/',
				qs: this.getNodeParameter('additionalFields', 0, {}) as any,
			});

			const returnAll = this.getNodeParameter('returnAll', 0, false) as boolean;
			const limit = this.getNodeParameter('limit', 0, 4) as number;

			let applications = Array.isArray(response) ? response : [];

			if (!returnAll && limit) {
				applications = applications.slice(0, limit);
			}

			for (const application of applications) {
				returnData.push({ json: application });
			}

			return [returnData];
		}

		// Handle get application operation with authentication
		if (resource === 'application' && operation === 'get') {
			// Get the applicationId parameter - it may be a resourceLocator object
			const applicationIdParam = this.getNodeParameter('applicationId', 0) as
				| string
				| number
				| { __rl?: boolean; value?: string | number; mode?: string }
				| undefined;

			// Extract the actual ID value from resourceLocator format
			let applicationId: string | number | undefined;
			if (typeof applicationIdParam === 'object' && applicationIdParam !== null) {
				// Handle resourceLocator format: { __rl: true, value: "123", mode: "list" }
				if ('value' in applicationIdParam) {
					applicationId = applicationIdParam.value as string | number;
				} else {
					// If it's an object but no value property, it's invalid
					throw new Error(
						`Application ID is required and must be a valid number. Received: ${JSON.stringify(applicationIdParam)}`,
					);
				}
			} else {
				// It's already a string or number
				applicationId = applicationIdParam;
			}

			// Convert to string and validate
			const applicationIdStr = applicationId ? String(applicationId).trim() : '';
			if (!applicationIdStr || !/^\d+$/.test(applicationIdStr)) {
				throw new Error(
					`Application ID is required and must be a valid number. Received: ${JSON.stringify(applicationIdParam)}`,
				);
			}

			const response = await podioApiRequest.call(this, {
				method: 'GET',
				url: `https://api.podio.com/app/${applicationIdStr}`,
			});

			returnData.push({ json: response });

			return [returnData];
		}

		// Handle getAll items operation with authentication
		if (resource === 'item' && operation === 'getAll') {
			// Get the appId parameter - it may be a resourceLocator object
			const appIdParam = this.getNodeParameter('appId', 0, { extractValue: true }) as
				| string
				| number
				| { __rl?: boolean; value?: string | number; mode?: string }
				| undefined;

			// Extract the actual ID value from resourceLocator format
			let appId: string | number | undefined;
			if (typeof appIdParam === 'object' && appIdParam !== null) {
				// Handle resourceLocator format: { __rl: true, value: "123", mode: "list" }
				if ('value' in appIdParam) {
					appId = appIdParam.value as string | number;
				} else {
					// If it's an object but no value property, it's invalid
					throw new Error(
						`Application ID is required and must be a valid number. Received: ${JSON.stringify(appIdParam)}`,
					);
				}
			} else {
				// It's already a string or number
				appId = appIdParam;
			}

			// Convert to string and validate
			const appIdStr = appId ? String(appId).trim() : '';
			if (!appIdStr || !/^\d+$/.test(appIdStr)) {
				throw new Error(
					`Application ID is required and must be a valid number. Received: ${JSON.stringify(appIdParam)}`,
				);
			}

			const returnAll = this.getNodeParameter('returnAll', 0, false) as boolean;
			const limit = this.getNodeParameter('limit', 0, 50) as number;
			const filters = this.getNodeParameter('filters', 0, {}) as {
				sort_by?: string;
				sort_desc?: boolean;
			};

			// Build query parameters
			const qs: any = {};
			if (!returnAll) {
				qs.limit = limit;
			} else {
				qs.limit = 500; // Use max limit for pagination
			}

			if (filters.sort_by) {
				qs.sort_by = filters.sort_by;
			}
			if (filters.sort_desc !== undefined) {
				qs.sort_desc = filters.sort_desc;
			}

			let allItems: any[] = [];
			let offset = 0;
			let hasMore = true;

			// Fetch items with pagination if returnAll is true
			while (hasMore) {
				const currentQs = { ...qs };
				if (returnAll && offset > 0) {
					currentQs.offset = offset;
				}

				const response = await podioApiRequest.call(this, {
					method: 'GET',
					url: `https://api.podio.com/item/app/${appIdStr}/`,
					qs: currentQs,
				});

				// Handle different response formats
				let items: any[] = [];
				if (Array.isArray(response)) {
					items = response;
				} else if (response && typeof response === 'object') {
					if (Array.isArray(response.items)) {
						items = response.items;
					} else if (Array.isArray(response.data)) {
						items = response.data;
					}
				}

				allItems = allItems.concat(items);

				if (returnAll) {
					// Continue pagination if we got a full page
					hasMore = items.length === 500;
					offset += items.length;
				} else {
					hasMore = false;
				}
			}

			// Format and return items
			for (const item of allItems) {
				returnData.push({ json: item });
			}

			return [returnData];
		}

		// Handle get item operation with authentication
		if (resource === 'item' && operation === 'get') {
			// Get the itemId parameter - it may be a resourceLocator object
			const itemIdParam = this.getNodeParameter('itemId', 0, { extractValue: true }) as
				| string
				| number
				| { __rl?: boolean; value?: string | number; mode?: string }
				| undefined;

			// Extract the actual ID value from resourceLocator format
			let itemId: string | number | undefined;
			if (typeof itemIdParam === 'object' && itemIdParam !== null) {
				// Handle resourceLocator format: { __rl: true, value: "123", mode: "list" }
				if ('value' in itemIdParam) {
					itemId = itemIdParam.value as string | number;
				} else {
					// If it's an object but no value property, it's invalid
					throw new Error(
						`Item ID is required and must be a valid number. Received: ${JSON.stringify(itemIdParam)}`,
					);
				}
			} else {
				// It's already a string or number
				itemId = itemIdParam;
			}

			// Convert to string and validate
			const itemIdStr = itemId ? String(itemId).trim() : '';
			if (!itemIdStr || !/^\d+$/.test(itemIdStr)) {
				throw new Error(
					`Item ID is required and must be a valid number. Received: ${JSON.stringify(itemIdParam)}`,
				);
			}

			const response = await podioApiRequest.call(this, {
				method: 'GET',
				url: `https://api.podio.com/item/${itemIdStr}`,
			});

			returnData.push({ json: response });

			return [returnData];
		}

		// Handle create item operation with authentication
		if (resource === 'item' && operation === 'create') {
			// Get the appId parameter - it may be a resourceLocator object
			const appIdParam = this.getNodeParameter('appId', 0, { extractValue: true }) as
				| string
				| number
				| { __rl?: boolean; value?: string | number; mode?: string }
				| undefined;

			// Extract the actual ID value from resourceLocator format
			let appId: string | number | undefined;
			if (typeof appIdParam === 'object' && appIdParam !== null) {
				// Handle resourceLocator format: { __rl: true, value: "123", mode: "list" }
				if ('value' in appIdParam) {
					appId = appIdParam.value as string | number;
				} else {
					// If it's an object but no value property, it's invalid
					throw new Error(
						`Application ID is required and must be a valid number. Received: ${JSON.stringify(appIdParam)}`,
					);
				}
			} else {
				// It's already a string or number
				appId = appIdParam;
			}

			// Convert to string and validate
			const appIdStr = appId ? String(appId).trim() : '';
			if (!appIdStr || !/^\d+$/.test(appIdStr)) {
				throw new Error(
					`Application ID is required and must be a valid number. Received: ${JSON.stringify(appIdParam)}`,
				);
			}

			// Fetch application to get field type information
			let fieldTypes: Map<number, string> = new Map();
			try {
				const appResponse = await podioApiRequest.call(this, {
					method: 'GET',
					url: `https://api.podio.com/app/${appIdStr}`,
				});
				if (appResponse && appResponse.fields && Array.isArray(appResponse.fields)) {
					for (const field of appResponse.fields) {
						if (field.field_id && field.type) {
							fieldTypes.set(field.field_id, field.type);
						}
					}
				}
			} catch (error) {
				// If we can't fetch field types, continue without them
				// We'll use default formatting
			}

			// Get the fields parameter - routing has already processed it
			const fieldsParam = this.getNodeParameter('fields', 0, {}) as any;
			
			// Build the request body
			const body: any = {};
			if (fieldsParam && fieldsParam.field && Array.isArray(fieldsParam.field)) {
				// Process fields - we need to handle embed fields specially
				const processedFields = await Promise.all(
					fieldsParam.field.map(async (f: any) => {
						// Handle resourceLocator format for field_id
						let fieldId: string | number;
						if (typeof f.field_id === 'object' && f.field_id !== null && 'value' in f.field_id) {
							fieldId = parseInt(String(f.field_id.value));
						} else {
							fieldId = parseInt(String(f.field_id));
						}

						// Get field type to format value correctly
						const fieldType = fieldTypes.get(fieldId);
						let fieldValue: any = f.value;

						// Format domain/URL fields (embed type) - they require creating an embed first
						if (fieldType === 'embed') {
							try {
								// Ensure URL has protocol
								let urlValue = String(f.value).trim();
								if (!urlValue.match(/^https?:\/\//i)) {
									urlValue = 'https://' + urlValue;
								}

								// Call "Add an embed" operation to get embed_id and file_id
								const embedResponse = await podioApiRequest.call(this, {
									method: 'POST',
									url: 'https://api.podio.com/embed/',
									body: {
										url: urlValue,
									},
								});

								// Extract embed_id and file_id from response
								if (embedResponse && embedResponse.embed_id) {
									const embedId = embedResponse.embed_id;
									// Get the first thumbnail file_id if available
									const fileId = embedResponse.files && embedResponse.files.length > 0 
										? embedResponse.files[0].file_id 
										: null;

									// Format as required by Podio API
									if (fileId) {
										fieldValue = {
											embed: embedId,
											file: fileId,
										};
									} else {
										fieldValue = {
											embed: embedId,
										};
									}
								} else {
									// Fallback: try sending URL directly if embed creation fails
									fieldValue = f.value;
								}
							} catch (embedError: any) {
								// If embed creation fails, log error but continue with original value
								console.error('Failed to create embed for URL:', f.value, embedError);
								// Try sending as string value as fallback
								fieldValue = f.value;
							}
						} else {
							// For other field types, use the value as-is (string, number, etc.)
							fieldValue = f.value;
						}

						return {
							field_id: fieldId,
							values: [fieldValue],
						};
					})
				);

				body.fields = processedFields;
			}

			const response = await podioApiRequest.call(this, {
				method: 'POST',
				url: `https://api.podio.com/item/app/${appIdStr}/`,
				body,
			});

			returnData.push({ json: response });

			return [returnData];
		}

		// Handle create comment operation with authentication
		if (resource === 'comment' && operation === 'create') {
			const refType = this.getNodeParameter('refType', 0) as string;
			const refIdParam = this.getNodeParameter('refId', 0) as string | number | undefined;
			const value = this.getNodeParameter('value', 0) as string;
			const additionalFields = this.getNodeParameter('additionalFields', 0, {}) as {
				external_id?: string;
				file_ids?: string;
				embed_id?: string;
				embed_url?: string;
			};

			// Validate refId
			const refIdStr = refIdParam ? String(refIdParam).trim() : '';
			if (!refIdStr || !/^\d+$/.test(refIdStr)) {
				throw new Error(
					`Object ID is required and must be a valid number. Received: ${JSON.stringify(refIdParam)}`,
				);
			}

			// Build request body
			const body: any = {
				value,
			};

			if (additionalFields.external_id) {
				body.external_id = additionalFields.external_id;
			}

			if (additionalFields.file_ids) {
				// Parse comma-separated file IDs
				const fileIds = additionalFields.file_ids
					.split(',')
					.map((id) => parseInt(id.trim()))
					.filter((id) => !isNaN(id));
				if (fileIds.length > 0) {
					body.file_ids = fileIds;
				}
			}

			if (additionalFields.embed_id) {
				body.embed_id = parseInt(additionalFields.embed_id);
			}

			if (additionalFields.embed_url) {
				body.embed_url = additionalFields.embed_url;
			}

			const response = await podioApiRequest.call(this, {
				method: 'POST',
				url: `https://api.podio.com/comment/${refType}/${refIdStr}/`,
				body,
			});

			returnData.push({ json: response });

			return [returnData];
		}

		// Handle get comment operation with authentication
		if (resource === 'comment' && operation === 'get') {
			const commentIdParam = this.getNodeParameter('commentId', 0) as string | number | undefined;

			// Validate commentId
			const commentIdStr = commentIdParam ? String(commentIdParam).trim() : '';
			if (!commentIdStr || !/^\d+$/.test(commentIdStr)) {
				throw new Error(
					`Comment ID is required and must be a valid number. Received: ${JSON.stringify(commentIdParam)}`,
				);
			}

			const response = await podioApiRequest.call(this, {
				method: 'GET',
				url: `https://api.podio.com/comment/${commentIdStr}`,
			});

			returnData.push({ json: response });

			return [returnData];
		}

		// For other operations, use podioApiRequest with routing configuration
		// We need to build the request based on the routing config
		// For now, let routing handle it - but it will fail with 401 for other operations
		// until we add authentication to all routing configs or handle them here
		return [];
	}
}

export default Podio;

