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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClrNavigationModule } from '@clr/angular';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header.component';
import { AppComponent } from './app.component';
import { ROUTES } from './routes';
import { RouterOutletComponent } from './router-outlet.component';
import { ConfigurationFailedGuard } from './configuration-failed/configuration-failed.guard';
import { ConfigurationSucceededGuard } from './configuration-failed/configuration-succeeded.guard';
import { CannotConfigureComponent } from './configuration-failed/cannot-configure.component';

import { ConfigModule } from '../config';
import { ErrorModule } from '../error';
import { KangarooPlatformModule } from '@kangaroo/angular-platform';

/**
 * This module contains all the components of the application shell, including header, configuration error cases,
 * and generic utility classes.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  imports: [
    KangarooPlatformModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ClrNavigationModule,

    ConfigModule,
    ErrorModule
  ],
  providers: [
    ConfigurationFailedGuard,
    ConfigurationSucceededGuard
  ],
  declarations: [
    HeaderComponent,
    AppComponent,
    RouterOutletComponent,
    CannotConfigureComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class ApplicationModule {
}
