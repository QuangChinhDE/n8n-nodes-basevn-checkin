import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class CheckinTrigger implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Checkin Trigger',
		name: 'checkinTrigger',
		icon: 'file:../../icons/checkin.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when BaseVN Checkin webhook events occur',
		defaults: {
			name: 'BaseVN Checkin Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["path"]}}',
			},
		],
		properties: [
			{
				displayName: 'Webhook Path',
				name: 'path',
				type: 'string',
				default: 'webhook',
				required: true,
				placeholder: 'webhook',
				description: 'The path for the webhook URL. Leave as default or customize it.',
			},
			{
				displayName: 'Response Selector',
				name: 'responseSelector',
				type: 'options',
				options: [
					{
						name: 'Full Payload',
						value: '',
						description: 'Return complete webhook payload',
					},
					{
						name: 'Body Only',
						value: 'body',
						description: 'Return only the body data',
					},
					{
						name: 'Checkin Info',
						value: 'checkinInfo',
						description: 'Return simplified checkin information',
					},
				],
				default: 'body',
				description: 'Select which data to return from webhook',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const responseSelector = this.getNodeParameter('responseSelector', '') as string;

		// Process response based on selector
		let returnData: IDataObject = bodyData;

		if (responseSelector === 'checkinInfo') {
			// Return simplified checkin information
			returnData = {
				id: bodyData.id,
				user_id: bodyData.user_id,
				username: bodyData.username,
				checkin_time: bodyData.checkin_time,
				checkin_type: bodyData.checkin_type,
				location: bodyData.location,
				latitude: bodyData.latitude,
				longitude: bodyData.longitude,
				device_info: bodyData.device_info,
				photo_url: bodyData.photo_url,
				note: bodyData.note,
				status: bodyData.status,
				created_at: bodyData.created_at,
				link: bodyData.link,
			};
		} else if (responseSelector === '') {
			// Return full payload including headers
			const headerData = this.getHeaderData();
			returnData = {
				headers: headerData,
				body: bodyData,
			};
		}
		// else: Return body only (default) - returnData is already bodyData

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
