import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { FeaturesComponent } from './features/features.component';
import { ResultsComponent } from './results/results.component';
import { ServiceInvokerComponent } from './service-invoker/service-invoker.component';
import { ApiUrls } from './api-urls';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DataSharingService } from './data-sharing.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfilesComponent,
    FeaturesComponent,
    ResultsComponent,
    ServiceInvokerComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ListboxModule,
    TreeModule,
    TableModule,
    DataTablesModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    ServiceInvokerComponent,
    ApiUrls,
    DataSharingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
