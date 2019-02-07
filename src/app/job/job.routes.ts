import { JobComponent } from './job/job.component';
import { JobWorkerComponent } from './job-worker/job.worker.component';
import { JobSummaryComponent } from './job-summary/job.summary.component';

export const routes = [
  { path: '', 
    children: [
      { path: '', component: JobComponent },
      { path: 'worker', component: JobWorkerComponent },
      { path: 'summary', component: JobSummaryComponent }   
    ]
  }
];