import { Action } from "jsweetman-redux-typed";
import { determineAjax, RESTType } from "./ajaxHelper";
import { APIRequest, APIRequestActions } from "./createRequestActions";

interface EpicRequestOptions<V,R> {
    shouldCancel?: (action: Action) => boolean;
}

interface AfterRequest<V,R> {
    action$: any;
    action: APIRequest<V,R>;
    actions: APIRequestActions<V,R>;
    state: any;
    ajax: any;
    restType: RESTType;
    url: (value: V) => string;
    clazz: Function | null;
    options?: EpicRequestOptions<V,R>;
}

function canceler<V,R>(
    action$,
    actions: APIRequestActions<V,R>,
    options: EpicRequestOptions<V,R>,
    requestAction: APIRequest<V,R>
) {
    return action$
        .filter(a => {
            let shouldCancel: boolean = false;
            if (options.shouldCancel) {
                shouldCancel = options.shouldCancel(a);
            }
            return shouldCancel;
        })
        .map(cancelAction => {
            return actions.canceled(requestAction.requestID, requestAction);
        })
        .take(1);
}

function afterRequest<V,R>(params: AfterRequest<V,R>) {
    return (payload: any) => {
        const {action$, clazz, actions} = params;
        const obs: any[] = [];
        // todo: hmm a common way to deserialize?
        // let data: R | undefined;
        // if (clazz) {
        //     try {
        //         data = JSON.parse()
        //     } catch (e) {
        //         console.warn(`Unable to deserialize response from ${actions.requestType}.`);
        //     }
        // }
        if (options) {
            
        }
    }
}

function doRetryWhen<V,R>() {

}

function catchRefreshFail<V,R>() {

}

function doCatch<V,R>() {

}

function makeRequestEpic<V,R>(
    actions: APIRequestActions<V,R>,
    restType: RESTType,
    url: (value: V) => string,
    serializer: Function | null
) {
    return (action$, state, { ajax }) => {
        return action$
            .filter(action => action.type === actions.requestType)
            .mergeMap((action: APIRequest<V,R>) => 
                ajax(determineAjax(url(action.value), action.body, restType))
                .race(canceller<V,R>())    
            );
    };
}