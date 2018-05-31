/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { KangarooAuthorizationAdminModule, KangarooOAuth2Module } from '@kangaroo/ng-authn';
import { KangarooPlatformModule } from '@kangaroo/ng-platform';
import { ConfigModule } from '../config';
import { ErrorModule } from '../error';
import { KangarooLayoutModule } from '../layout';
import { LoginModule } from '../login';

import { AppComponent } from './app.component';
import { ApplicationCreateComponent } from './application/application-create.component';
import { CannotConfigureComponent } from './configuration-failed/cannot-configure.component';
import { ConfigurationFailedGuard } from './configuration-failed/configuration-failed.guard';
import { ConfigurationSucceededGuard } from './configuration-failed/configuration-succeeded.guard';
import { PrimaryMenuComponent } from './menu/primary-menu.component';
import { RouterOutletComponent } from './router-outlet.component';
import { ROUTES } from './routes';

/**
 * This module contains all the components of the application shell, including header, configuration error cases,
 * and generic utility classes.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,

    KangarooPlatformModule,

    KangarooLayoutModule,
    KangarooOAuth2Module,
    KangarooAuthorizationAdminModule,
    ConfigModule,
    ErrorModule,
    LoginModule,
  ],
  providers: [
    ConfigurationFailedGuard,
    ConfigurationSucceededGuard,
  ],
  declarations: [
    AppComponent,
    RouterOutletComponent,
    CannotConfigureComponent,
    PrimaryMenuComponent,

    ApplicationCreateComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class ApplicationModule {
}
