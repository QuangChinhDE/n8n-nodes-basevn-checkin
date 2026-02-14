import type { INodeProperties } from 'n8n-workflow';

export * as cloud from './cloud';
export * as log from './log';

const resourceDescription: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Cloud',
			value: 'cloud',
		},
		{
			name: 'Log',
			value: 'log',
		},
	],
	default: 'cloud',
};

export const description: INodeProperties[] = [resourceDescription];
