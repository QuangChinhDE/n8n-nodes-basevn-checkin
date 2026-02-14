import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as resources from './resources';

export class Checkin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Checkin',
		name: 'checkin',
		icon: 'file:../../icons/checkin.svg',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN Checkin API',
		defaults: {
			name: 'BaseVN - App Checkin',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'checkinApi',
				required: true,
			},
		],
		properties: [
			...resources.description,
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cloud'],
					},
				},
				options: [
					{
						name: 'Get User Codes',
						value: 'getUserCodes',
						description: 'Retrieve user checkin codes for cloud integration',
						action: 'Get user codes',
					},
					{
						name: 'Mass Sync',
						value: 'massSync',
						description: 'Sync large batches of checkin logs',
						action: 'Mass sync logs',
					},
					{
						name: 'Real Time Checkin',
						value: 'realtime',
						description: 'Push real-time checkin log to Base HRM',
						action: 'Real time checkin',
					},
				],
				default: 'realtime',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['log'],
					},
				},
				options: [
					{
						name: 'Get Logs',
						value: 'getLogs',
						description: 'Retrieve checkin logs within a timestamp range',
						action: 'Get logs',
					},
				],
				default: 'getLogs',
			},
			...resources.cloud.description,
			...resources.log.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'cloud') {
					if (operation === 'realtime') {
						responseData = await resources.cloud.realtime.execute.call(this, i);
					} else if (operation === 'getUserCodes') {
						responseData = await resources.cloud.getUserCodes.execute.call(this, i);
					} else if (operation === 'massSync') {
						responseData = await resources.cloud.massSync.execute.call(this, i);
					}
				} else if (resource === 'log') {
					if (operation === 'getLogs') {
						responseData = await resources.log.getLogs.execute.call(this, i);
					}
				}

				if (responseData) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				}
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
