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
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { KangarooOAuth2Module } from '@kangaroo/angular-authn';
import { ConfigModule } from '../config';
import { KangarooLayoutModule } from '../layout';
import { LoginComponent } from './login.component';
import { ROUTES } from './routes';

/**
 * This module handles the login pages, as well as the route-guards and services necessary
 * to perform a login.
 *
 * @author Michael Krotscheck
 */
@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfigModule,
    KangarooOAuth2Module,
    RouterModule.forChild(ROUTES),

    KangarooLayoutModule,
  ],
  exports: [
    RouterModule,
  ],
})
export class LoginModule {
}
