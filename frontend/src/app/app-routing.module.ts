import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { LoginComponent } from './view/login/login.component';

const routes: Routes = [
  {
    path: "login",
    title: "Login — MTL",
    component: LoginComponent
  },
  {
    path: "",
    title: "Home — MTL",
    component: HomeComponent
  },
  {
    path: "**",
    redirectTo: "/"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
