import type { IExecuteFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';

export async function checkinApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	useClientToken = false,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('checkinApi');
	
	const requestBody: IDataObject = { ...body };

	if (useClientToken) {
		requestBody.client_token = credentials.clientToken as string;
	} else {
		requestBody.access_token_v2 = credentials.accessToken as string;
	}

	const options = {
		method,
		url: `https://checkin.base.vn${endpoint}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: requestBody,
	};

	return await this.helpers.httpRequest(options);
}
