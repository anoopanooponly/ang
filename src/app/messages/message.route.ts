import { MessageComponent } from './message/message.component';



export const routes = [
  { path: '', 
    children: [
      { path: '', component: MessageComponent }
     
    ]
  }
];