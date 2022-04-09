import { config } from '../../config/config';
import { request } from './axios/request';

export class TaskList implements TaskListResponseData {
    private static readonly link = `${config.microsoftGraph.url.default}/me/todo/lists`;
    public '@odata.etag': string;
    public displayName: string;
    public id: string;
    public isOwner: boolean;
    public isShared: boolean;
    public wellknownListName: string;

    constructor(_odataEtag: string, displayName: string, id: string, isOwner: boolean, isShared: boolean, wellknownListName: string) {
        this['@odata.etag'] = _odataEtag;
        this.displayName = displayName;
        this.id = id;
        this.isOwner = isOwner;
        this.isShared = isShared;
        this.wellknownListName = wellknownListName;
    }

    public static async getTaskLists(): Promise<TaskList[]> {
        return (await request<{ '@odata.context': string, value: TaskListResponseData[] }>('GET', TaskList.link)).data.value
            .map<TaskList>(TaskList.taskListReponseDatatoTaskList);
    }

    private static taskListReponseDatatoTaskList(data: TaskListResponseData): TaskList {
        return new TaskList(data['@odata.etag'], data.displayName, data.id, data.isOwner, data.isShared, data.wellknownListName);
    }
}

export interface TaskListResponseData {
    '@odata.etag': string,
    'displayName': string,
    'isOwner': boolean,
    'isShared': boolean,
    'wellknownListName': string,
    'id': string,
}
