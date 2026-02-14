import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { checkinApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'User Code',
		name: 'userCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['cloud'],
				operation: ['realtime'],
			},
		},
		default: '',
		description: 'User checkin code (match with HRM)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cloud'],
				operation: ['realtime'],
			},
		},
		options: [
			{
				displayName: 'Code Type',
				name: 'code_type',
				type: 'string',
				default: '',
				placeholder: 'checkin_code',
				description: 'If value = checkin_code then use checkin_code from HRM instead of user_id',
			},
			{
				displayName: 'Timestamp',
				name: 'ts',
				type: 'number',
				default: 0,
				description: 'Timestamp in seconds (checkin time)',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const userCode = this.getNodeParameter('userCode', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = cleanBody({
		user_code: userCode,
		...additionalFields,
	});

	const response = await checkinApiRequest.call(this, 'POST', '/v1/cloud/realtime', body, true);

	return [{ json: response }];
}
