import { Worker } from './worker.model';
export class AbstractWorkerList {
    _id?: string;
    name: string;
    type: string;//imported/timesaved
    imported?: Array<ImportedWorker>;
};
export class WorkerList extends AbstractWorkerList{
    workers?: Array<Worker>;
};

class ImportedWorker
{
    _id?: string;
    name: string;
    location: string;
    phone: string;
    skills: Array<string>;
}

export class WorkerResponse extends AbstractWorkerList{
    workers?: Array<string>;
};