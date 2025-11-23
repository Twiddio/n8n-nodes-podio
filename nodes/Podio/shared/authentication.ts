import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

interface PodioTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token?: string;
	ref?: {
		type: string;
		id: number;
	};
}

/**
 * Authenticate using username and password flow
 * Returns the access token
 */
export async function authenticateWithUsernamePassword(
	this: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('podioUsernamePasswordApi');

	if (!credentials) {
		throw new Error('Podio Username & Password credentials not found');
	}

	const { clientId, clientSecret, username, password } = credentials as {
		clientId: string;
		clientSecret: string;
		username: string;
		password: string;
	};

	const response = await this.helpers.httpRequest({
		method: 'POST',
		url: 'https://api.podio.com/oauth/token/v2',
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			grant_type: 'password',
			username,
			password,
			client_id: clientId,
			client_secret: clientSecret,
		},
		json: true,
	});

	const tokenResponse = response as PodioTokenResponse;

	if (!tokenResponse.access_token) {
		throw new Error('Failed to obtain access token from Podio');
	}

	return tokenResponse.access_token;
}

/**
 * Make an authenticated request to Podio API
 * Uses username/password authentication
 */
export async function podioApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	options: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		url: string;
		body?: any;
		qs?: any;
		headers?: any;
	},
): Promise<any> {
	// Use username/password authentication
	const accessToken = await authenticateWithUsernamePassword.call(this);
	return await this.helpers.httpRequest({
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

