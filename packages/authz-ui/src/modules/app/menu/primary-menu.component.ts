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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Application, ApplicationService } from '@kangaroo/angular-authn';
import { SortOrder } from '@kangaroo/angular-platform';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

/**
 * The primary menu on the left side.
 *
 * @author Michael Krotscheck
 */
@Component({
  selector: 'kng-primary-menu',
  templateUrl: './primary-menu.component.html',
  styleUrls: [ 'primary-menu.component.scss' ],
})
export class PrimaryMenuComponent implements OnInit, OnDestroy {

  /**
   * Subscription for the current application list.
   */
  public applications$: Observable<Application[]>;

  /**
   * Constructor.
   */
  constructor(private apps: ApplicationService) {

  }

  /**
   * When the component initializes, create a subscription for the application list.
   */
  public ngOnInit(): void {
    this.applications$ = this.apps
      .browse(null, 'name', SortOrder.Ascending)
      .pipe(
        map((response) => response.results),
      );
  }

  /**
   * On destroy, unsubscribe.
   */
  public ngOnDestroy(): void {
  }

}
