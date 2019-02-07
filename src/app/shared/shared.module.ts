import { NgModule } from '@angular/core';
import { EnabledPipe } from "./enabled.filter";

@NgModule({
  declarations: [
    EnabledPipe
  ],
  imports: [   
  ],
  exports: [
    EnabledPipe
  ]  
})
export class SharedModule {
  
}