import type { Icon, ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class PodioUsernamePasswordApi implements ICredentialType {
	name = 'podioUsernamePasswordApi';

	displayName = 'Podio Username & Password API';

	icon: Icon = { light: 'file:../icons/podio.svg', dark: 'file:../icons/podio.dark.svg' };

	documentationUrl = 'https://developers.podio.com/authentication/username_password';

	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'Your Podio App Client ID. Get this from Settings → Developer → API in your Podio account',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'Your Podio App Client Secret',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
			description: 'Your Podio username (email address)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
			description: 'Your Podio password',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			url: 'https://api.podio.com/oauth/token/v2',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				grant_type: 'password',
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
				client_id: '={{$credentials.clientId}}',
				client_secret: '={{$credentials.clientSecret}}',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'access_token',
					value: '{{$response.body.access_token}}',
					message: 'Connection successful! Credentials are valid.',
				},
			},
		],
	};
}

export default PodioUsernamePasswordApi;
