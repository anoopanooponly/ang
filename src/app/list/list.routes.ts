import { ListComponent } from './list.component';
import { ListDetailComponent } from './detail/list.detail.component';
import { ListDetailResolver } from './detail/list.detail.resolver';

export const routes = [
  { path: '', 
    children: [
      { 
        path: '', 
        component: ListComponent 
      },
      { 
        path: 'detail/:id', 
        component: ListDetailComponent, 
        resolve: {
          list: ListDetailResolver
        } 
      },
      { 
        path: 'add', 
        component: ListDetailComponent, 
        resolve: {
          list: ListDetailResolver
        } 
      } 
    ]
  }
];