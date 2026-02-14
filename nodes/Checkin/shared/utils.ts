import type { IDataObject } from 'n8n-workflow';

export function cleanBody(body: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	for (const key in body) {
		if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
			cleaned[key] = body[key];
		}
	}
	return cleaned;
}

export function processResponse(response: IDataObject): IDataObject | IDataObject[] {
	if (response.code === 1 && response.data) {
		return response.data as IDataObject | IDataObject[];
	}
	return response;
}
