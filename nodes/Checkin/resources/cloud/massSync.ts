import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { checkinApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Logs JSON',
		name: 'logsJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['cloud'],
				operation: ['massSync'],
			},
		},
		default: '[\n  {\n    "user_code": "1",\n    "dates": [\n      {\n        "date": 1594141200,\n        "logs": [\n          {\n            "id": "159410687000050",\n            "deviceUserId": 50,\n            "time": 1594178626,\n            "ip": "10.20.0.9"\n          }\n        ]\n      }\n    ]\n  }\n]',
		description: 'Collection of checkin logs in JSON format',
	},
	{
		displayName: 'Code Type',
		name: 'codeType',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['cloud'],
				operation: ['massSync'],
			},
		},
		default: '',
		placeholder: 'checkin_code',
		description: 'If value = checkin_code use checkin_code mapping',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const logsJson = this.getNodeParameter('logsJson', index) as string;
	const codeType = this.getNodeParameter('codeType', index, '') as string;

	const logs = typeof logsJson === 'string' ? JSON.parse(logsJson) : logsJson;

	const body = cleanBody({
		logs: JSON.stringify(logs),
		code_type: codeType,
	});

	const response = await checkinApiRequest.call(this, 'POST', '/v1/cloud/mass_sync', body, true);

	return [{ json: response }];
}
