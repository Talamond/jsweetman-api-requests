import { Action } from 'jsweetman-redux-typed';
import { AjaxResponse } from 'rxjs';
import { v4 } from 'uuid';

export const REQUEST_SUF = 'API_REQUEST__';
export const SUCCESS_SUF = 'API_SUCCESS__';
export const FAILURE_SUF = 'API_FAILURE__';
export const CANCELED_SUF = 'API_CANCELED__';

export interface RequestOptions<V, R> {
    onSuccess?: (requestAction?: APIRequest<V,R>, data?: V, payload?: AjaxResponse) => Action | Action[];
    onFailure?: (requestAction?: APIRequest<V,R>, data?: V, payload?: AjaxResponse) => Action | Action[];
    finishCondition?: (requestAction?: APIRequest<V,R>, data?: V, payload?: AjaxResponse) => boolean;
}

export interface APIRequest<V, R> {
    type: string;
    requestID: string;
    value: V;
    body?: any;
    options?: RequestOptions<V,R>;
}

export interface APISuccess<V, R> {
    type: string;
    requestID: string;
    requestAction: APIRequest<V, R>;

    response: AjaxResponse;
    data: R;
}

export interface APIFailure<V, R> {
    type: string;
    requestID: string;
    requestAction: APIRequest<V, R>;

    response: AjaxResponse;
}

export interface APICanceled<V, R> {
    type: string;
    requestID: string;
    requestAction: APIRequest<V, R>;
}

export interface APIRequestActions<V,R> {
    request: (value?: V, body?: any, options?: RequestOptions<V,R>) => APIRequest<V,R>;
    success: (requestID: string, response: AjaxResponse, requestAction: APIRequest<V,R>, data: R) => APISuccess<V,R>;
    failure: (requestID: string, response: AjaxResponse, requestAction: APIRequest<V,R>) => APIFailure<V,R>;
    canceled: (requestID: string, requestAction: APIRequest<V,R>) => APICanceled<V,R>;
    
    requestType: string;
    successType: string;
    failureType: string;
    canceledType: string;
}

const makeRequestType = (suffix: string) => `${REQUEST_SUF}${suffix}`;
const makeSuccessType = (suffix: string) => `${SUCCESS_SUF}${suffix}`;
const makeFailureType = (suffix: string) => `${FAILURE_SUF}${suffix}`;
const makeCanceledType = (suffix: string) => `${CANCELED_SUF}${suffix}`;

export function createRequestActions<V,R>(suffix: string): APIRequestActions<V,R> {
    return {
        requestType: makeRequestType(suffix),
        successType: makeSuccessType(suffix),
        failureType: makeFailureType(suffix),
        canceledType: makeCanceledType(suffix),
        request: (value: V, body?: any, options?: RequestOptions<V,R>): APIRequest<V,R> => {
            return {
                value,
                body,
                options,
                requestID: v4(),
                type: makeRequestType(suffix)
            };
        },
        success: (requestID: string, response: AjaxResponse, requestAction: APIRequest<V,R>, data: R): APISuccess<V,R> => {
            return {
                requestID,
                response,
                requestAction,
                data,
                type: makeSuccessType(suffix)
            };
        },
        failure: (requestID: string, response: AjaxResponse, requestAction: APIRequest<V,R>): APIFailure<V,R> => {
            return {
                requestID,
                requestAction,
                response,
                type: makeFailureType(suffix)
            };
        },
        canceled: (requestID: string, requestAction: APIRequest<V,R>): APICanceled<V,R> => {
            return {
                requestID,
                requestAction,
                type: makeCanceledType(suffix)
            };
        }
    };
}