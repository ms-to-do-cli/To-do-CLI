import { request } from './axios/request';
import { MsDateTime } from './entities/ms-date-time';
import { MsPatternedRecurrence } from './entities/ms-patterned-recurrence';
import { TaskList } from './task-list';

export class Task implements TaskResponseData {
    public static readonly statusOrder:
        ('notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred')[] =
        ['notStarted', 'deferred', 'inProgress', 'waitingOnOthers', 'completed'];

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

    public static async create(taskList: TaskList, task: TaskCreation) {
        return Task.taskResponseDataToTask((await request<TaskResponseData>('POST', `${TaskList.link}/${taskList.id}/tasks`, task)).data);
    }

    public static taskResponseDataToTask(data: TaskResponseData): Task {
        return new Task(data);
    }

    public async edit(taskList: TaskList, data: TaskChange) {
        const res: TaskResponseData = (await request<TaskResponseData>('PATCH', `${TaskList.link}/${taskList.id}/tasks/${this.id}`, data)).data;
        this.id = res.id;
        this.importance = res.importance;
        this.isReminderOn = res.isReminderOn;
        this.status = res.status;
        this.title = res.title;
        this.createdDateTime = res.createdDateTime;
        this.lastModifiedDateTime = res.lastModifiedDateTime;
        this.completedDateTime = res.completedDateTime;
        this.reminderDateTime = res.reminderDateTime;
        this.recurrence = res.recurrence;
        this.body = res.body;
        this.linkedResources = res.linkedResources;

        return this;
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

export interface TaskCreation extends TaskChange {
    'title': string,
}

export interface TaskChange {
    'title'?: string,

    'body'?: {
        'content': string,
        'contentType': 'text' | 'html',
    },

    'importance'?: 'low' | 'normal' | 'high',

    'isReminderOn'?: boolean,
    'reminderDateTime'?: MsDateTime,

    'status'?: 'notStarted' | 'inProgress' | 'completed' | 'waitingOnOthers' | 'deferred',

    'recurrence'?: MsPatternedRecurrence,
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
