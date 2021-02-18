export type RESTType = 'get' | 'post' | 'put' | 'delete' | 'patch';
const AJAX_TIMEOUT = 90000;

export function determineAjax<V,R>(
    url: string,
    body: any,
    type: RESTType
) {
    // TODO: allow more customizations here, especially headers
    return {
        url,
        body,
        method: type,
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'json',
        timeout: AJAX_TIMEOUT
    };
}