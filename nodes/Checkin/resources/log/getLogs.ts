import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { checkinApiRequest } from '../../shared/transport';

export const description: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getLogs'],
			},
		},
		default: 0,
		description: 'Start timestamp',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getLogs'],
			},
		},
		default: 0,
		description: 'End timestamp',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const startDate = this.getNodeParameter('startDate', index) as number;
	const endDate = this.getNodeParameter('endDate', index) as number;

	const body: IDataObject = {
		start_date: startDate,
		end_date: endDate,
	};

	const response = await checkinApiRequest.call(this, 'POST', '/extapi/v1/getlogs', body, false);

	const data = Array.isArray(response) ? response : [response];
	return data.map((item) => ({ json: item }));
}
