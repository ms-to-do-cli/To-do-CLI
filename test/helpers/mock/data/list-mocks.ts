import { MsGraphErrorResponse } from '../../../../src/helpers/api/ms-graph/axios/axios-microsoft-graph-error';
import { TaskListResponseData } from '../../../../src/helpers/api/ms-graph/task-list';

const listMocks: { taskListResponseData: TaskListResponseData[], badTokensResponse: MsGraphErrorResponse[] } = {
    taskListResponseData: [{
        '@odata.etag': 'ODATA_ETAG',
        id: 'AAAAAAAAAA',
        wellknownListName: 'defaultList',
        displayName: 'Taken',
        isOwner: true,
        isShared: false,
    }, {
        '@odata.etag': 'ODATA_ETAG',
        id: 'BBBBBBBBBB',
        displayName: 'Shopping list',
        wellknownListName: 'none',
        isOwner: true,
        isShared: false,
    }, {
        '@odata.etag': 'ODATA_ETAG',
        id: 'CCCCCCCCCC',
        displayName: 'SCHOOL',
        wellknownListName: 'none',
        isOwner: false,
        isShared: true,
    }],
    badTokensResponse: [
        {
            error: {
                code: 'InvalidAuthenticationToken',
                message: 'CompactToken validation failed with reason code: CODE.',
                innerError: {
                    date: 'DATE',
                    'request-id': 'REQUEST_ID',
                    'client-request-id': 'CLIENT_REQUEST_ID',
                },
            },
        },
        {
            error: {
                code: 'invalidRequest',
                message: 'The property \'displayName\' is required when creating the taskList entity',
                innerError: {
                    code: 'InvalidModel',
                    date: 'DATE',
                    'request-id': 'REQUEST_ID',
                    'client-request-id': 'CLIENT_REQUEST_ID',
                },
            },
        },
    ],
};

export default listMocks;
