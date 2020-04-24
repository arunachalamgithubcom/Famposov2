import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './home/pages/main/main.component';
import { JoinfreeComponent } from './home/pages/joinfree/joinfree.component';
import { RfqformComponent } from './home/pages/requestforquote/rfqform.component';
import { LoginComponent } from './home/pages/login/login.component';

const routes: Routes = [
  {path:'',redirectTo : '/home',pathMatch:'full'},
  {path:'home' ,component: MainComponent},
  {path:'register' ,component:JoinfreeComponent},
  {path:'login' ,component:LoginComponent},
  {path:'requestforquote' ,component: RfqformComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingHomeComponents=[MainComponent,JoinfreeComponent,RfqformComponent,LoginComponent];