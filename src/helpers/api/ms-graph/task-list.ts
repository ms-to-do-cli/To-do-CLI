import { config } from '../../config/config';
import { request } from './axios/request';

export class TaskList implements TaskListResponseData {
    private static readonly link = `${config.microsoftGraph.url.default}/me/todo/lists`;
    public '@odata.etag'?: string;
    public '@odata.type'?: string;
    public displayName: string;
    public id: string;
    public isOwner: boolean;
    public isShared: boolean;
    public wellknownListName: string;

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

    private static taskListReponseDatatoTaskList(data: TaskListResponseData): TaskList {
        return new TaskList(data);
    }
}

export interface TaskListResponseData {
    '@odata.etag'?: string,
    '@odata.type'?: string,
    'displayName': string,
    'isOwner': boolean,
    'isShared': boolean,
    'wellknownListName': string,
    'id': string,
}
