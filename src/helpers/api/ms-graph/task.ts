import { MsDateTime } from './entities/ms-date-time';
import { MsPatternedRecurrence } from './entities/ms-patterned-recurrence';

export class Task implements TaskResponseData {
    public '@odata.etag'?: string;
    public id: string;
    public importance: 'low' | 'normal' | 'high';
    public isReminderOn: boolean;
    public status: 'notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred';
    public title: string;
    public createdDateTime: Date | string;
    public lastModifiedDateTime: Date | string;
    public completedDateTime?: MsDateTime;
    public reminderDateTime?: MsDateTime;
    public recurrence?: MsPatternedRecurrence;
    public 'linkedResources@odata.context'?: string;

    public body: {
        content: string;
        contentType: 'text' | 'html';
    };

    public linkedResources?: [
        {
            applicationName: string;
            displayName: string;
            externalId: string;
            id: string
        }
    ];

    constructor(taskData: TaskResponseData) {
        this['@odata.etag'] = taskData['@odata.etag'];
        this.id = taskData.id;
        this.importance = taskData.importance;
        this.isReminderOn = taskData.isReminderOn;
        this.status = taskData.status;
        this.title = taskData.title;
        this.createdDateTime = taskData.createdDateTime;
        this.lastModifiedDateTime = taskData.lastModifiedDateTime;
        this.completedDateTime = taskData.completedDateTime;
        this.reminderDateTime = taskData.reminderDateTime;
        this.recurrence = taskData.recurrence;
        this.body = taskData.body;
        this['linkedResources@odata.context'] = taskData['linkedResources@odata.context'];
        this.linkedResources = taskData.linkedResources;
    }

    public static taskResponseDataToTask(data: TaskResponseData): Task {
        return new Task(data);
    }
}

export interface TaskResponseData {
    '@odata.etag'?: string,
    'id': string,
    'importance': 'low' | 'normal' | 'high',
    'isReminderOn': boolean,
    'status': 'notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred',
    'title': string,
    'createdDateTime': Date | string,
    'lastModifiedDateTime': Date | string,
    'completedDateTime'?: MsDateTime,
    'reminderDateTime'?: MsDateTime,
    'recurrence'?: MsPatternedRecurrence,
    'body': {
        'content': string,
        'contentType': 'text' | 'html',
    },
    'linkedResources@odata.context'?: string,
    'linkedResources'?: [
        {
            'applicationName': string,
            'displayName': string,
            'externalId': string,
            'id': string
        }
    ]
}

export interface ListTasksResponse {
    '@odata.context'?: string,
    '@odata.nextLink'?: string,
    value: TaskResponseData[],
}
