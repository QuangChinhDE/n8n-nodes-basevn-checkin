import type {
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class CheckinApi implements ICredentialType {
	name = 'checkinApi';

	displayName = 'BaseVN - App Checkin API';

	icon: Icon = 'file:../icons/checkin.svg';

	documentationUrl = 'https://checkin.base.vn';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Access token for ExtAPI operations (from account.base.vn/tokens)',
		},
		{
			displayName: 'Client Token',
			name: 'clientToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Client token for Cloud integration operations',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://checkin.base.vn',
			url: '/v1/cloud/checkin_codes',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				client_token: '={{$credentials.clientToken}}',
			},
		},
	};
}
