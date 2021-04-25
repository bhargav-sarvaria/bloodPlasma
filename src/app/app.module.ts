import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DonorComponent } from './donor/donor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { MatDialogModule } from '@angular/material/dialog';
import { DonorInformationDialogComponent } from './donor-information-dialog/donor-information-dialog.component';
import { RequesterComponent } from './requester/requester.component';
import { RequestsComponent } from './requests/requests.component';

import { AgmCoreModule } from '@agm/core';
import { DonorBanksComponent } from './donor-banks/donor-banks.component';

@NgModule({
  declarations: [
    AppComponent,
    DonorComponent,
    DonorInformationDialogComponent,
    RequesterComponent,
    RequestsComponent,
    DonorBanksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    HttpClientModule,
    MatDialogModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1FEYohX4TO33nCtREo4--jcdeVKmWDtA',
      libraries: ['geometry']
    })
  ],
  providers: [
    MatDatepickerModule,
    CookieService,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
