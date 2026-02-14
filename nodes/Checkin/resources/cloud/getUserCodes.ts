import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { checkinApiRequest } from '../../shared/transport';

export const description: INodeProperties[] = [
	{
		displayName: 'Code Type',
		name: 'codeType',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['cloud'],
				operation: ['getUserCodes'],
			},
		},
		default: '',
		placeholder: 'checkin_code',
		description: 'Type of code to retrieve',
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const codeType = this.getNodeParameter('codeType', index, '') as string;

	const body: IDataObject = {};
	if (codeType) {
		body.code_type = codeType;
	}

	const response = await checkinApiRequest.call(this, 'POST', '/v1/cloud/checkin_codes', body, true);

	return [{ json: response }];
}
