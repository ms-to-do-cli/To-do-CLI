import { TaskResponseData } from '../../../../src/helpers/api/ms-graph/task';

const taskMocks: { taskResponseData: TaskResponseData[] } = {
    taskResponseData: [
        {
            '@odata.etag': 'odata.etag',
            id: '1111111111',
            completedDateTime: {
                dateTime: '2020-01-30T00:00:00',
                timeZone: 'UTC',
            },
            createdDateTime: '2020-01-29T00:00:00',
            lastModifiedDateTime: '2020-01-29T00:00:00',
            importance: 'low',
            title: 'Buy bread',
            isReminderOn: false,
            status: 'completed',
            body: {
                content: '',
                contentType: 'text',
            },
        },
        {
            '@odata.etag': 'odata.etag',
            id: '2222222222',
            createdDateTime: '2020-02-29T00:00:00',
            lastModifiedDateTime: '2020-02-29T00:00:00',
            importance: 'low',
            title: 'Antivirus',
            isReminderOn: false,
            status: 'notStarted',
            body: {
                content: 'Download antivirus',
                contentType: 'text',
            },
        },
    ],
};

export default taskMocks;
