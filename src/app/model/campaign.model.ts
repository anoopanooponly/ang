import { Worker } from './worker.model';
import { WorkerList } from './list.model';
export class BaseCampaign {
    _id?: string;
    name: string;
    messageType: string;
    autoReply: string;
};
export class Campaign extends BaseCampaign {
    workers?: Array<Worker>;
    lists?: Array<WorkerList>;
};
export class CampaignResponse extends BaseCampaign {
    workers?: Array<string>;
    lists?: Array<string>;
};