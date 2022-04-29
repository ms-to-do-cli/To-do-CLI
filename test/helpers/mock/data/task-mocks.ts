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
        {
            '@odata.etag': 'odata.etag',
            id: '2222222222',
            createdDateTime: '2020-02-29T00:00:00',
            lastModifiedDateTime: '2020-02-29T00:00:00',
            importance: 'low',
            title: 'Lorem ipsum',
            isReminderOn: false,
            status: 'notStarted',
            body: {
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel tellus eget felis dapibus condimentum non ut eros. Nam sodales ornare bibendum. Etiam molestie ut nisl sit amet blandit. Morbi pretium consectetur quam, id ornare arcu. Nulla ornare, sem vitae rhoncus feugiat, odio est tristique magna, nec volutpat elit enim id tellus. Donec venenatis sollicitudin tellus, et maximus dui semper vitae. Maecenas laoreet lectus vitae ex sagittis vestibulum. Mauris posuere metus eget erat egestas, quis viverra tortor porta. Fusce egestas aliquet justo, in tempus ligula rutrum at. Sed aliquet ornare lorem et ultricies. Mauris quis orci viverra, mattis arcu quis, gravida nisl. Aliquam semper sapien nunc, et lacinia lectus sollicitudin in.',
                contentType: 'text',
            },
        },
    ],
};

export default taskMocks;
