import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { FeaturesComponent } from './features/features.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profiles',
    component: ProfilesComponent
  },
  {
    path: 'features',
    component: FeaturesComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
