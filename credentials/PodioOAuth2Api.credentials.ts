import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class PodioOAuth2Api implements ICredentialType {
	name = 'podioOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Podio OAuth2 API';

	icon: Icon = { light: 'file:../icons/podio.svg', dark: 'file:../icons/podio.dark.svg' };

	documentationUrl = 'https://developers.podio.com/doc/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://podio.com/oauth/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://podio.com/oauth/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'app.read:app app.write:app item.read:app item.write:app task.read:task task.write:task',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}

