import { config } from '../../config/config';
import { request } from './axios/request';
import { ListTasksResponse, Task, TaskCreation } from './task';

export class TaskList implements TaskListResponseData {
    public static readonly link = `${config.microsoftGraph.url.default}/me/todo/lists`;
    public '@odata.etag'?: string;
    public '@odata.type'?: string;
    public displayName: string;
    public id: string;
    public isOwner: boolean;
    public isShared: boolean;
    public wellknownListName: 'none' | 'defaultList' | 'flaggedEmails' | 'unknownFutureValue';

    constructor(taskListData: TaskListResponseData) {
        this['@odata.etag'] = taskListData['@odata.etag'];
        this['@odata.type'] = taskListData['@odata.type'];
        this.displayName = taskListData.displayName;
        this.id = taskListData.id;
        this.isOwner = taskListData.isOwner;
        this.isShared = taskListData.isShared;
        this.wellknownListName = taskListData.wellknownListName;
    }

    public static async getTaskLists(): Promise<TaskList[]> {
        return (await request<{ '@odata.context': string, value: TaskListResponseData[] }>('GET', TaskList.link)).data.value
            .map<TaskList>(TaskList.taskListReponseDatatoTaskList);
    }

    public static async create(title: string): Promise<TaskList> {
        return new TaskList((await request<TaskListResponseData>('POST', TaskList.link, {
            displayName: title,
        })).data);
    }

    public static async getTaskListByNameOrId(name = 'defaultList'): Promise<TaskList | undefined> {
        return (await this.getTaskLists())
            .find(taskList =>
                taskList.displayName.toLowerCase().includes(name.toLowerCase()) ||
                taskList.wellknownListName.toLowerCase().includes(name.toLowerCase()) ||
                taskList.id === name,
            );
    }

    private static taskListReponseDatatoTaskList(data: TaskListResponseData): TaskList {
        return new TaskList(data);
    }

    public async getTasks(): Promise<Task[]> {
        return (await request<ListTasksResponse>('GET', `${TaskList.link}/${this.id}/tasks`))
            .data.value.map<Task>(Task.taskResponseDataToTask);
    }

    public async editDisplayName(newDisplayName: string): Promise<TaskList> {
        const res: TaskListResponseData = (await request<TaskListResponseData>('PATCH', `${TaskList.link}/${this.id}`, { displayName: newDisplayName })).data;
        this.displayName = res.displayName;
        this.id = res.id;
        this.isOwner = res.isOwner;
        this.isShared = res.isShared;
        this.wellknownListName = res.wellknownListName;

        return this;
    }

    public createTask(task: TaskCreation): Promise<Task> {
        return Task.create(this, task);
    }
}

export interface TaskListResponseData {
    '@odata.etag'?: string,
    '@odata.type'?: string,
    'displayName': string,
    'isOwner': boolean,
    'isShared': boolean,
    'wellknownListName': 'none' | 'defaultList' | 'flaggedEmails' | 'unknownFutureValue',
    'id': string,
}
