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

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KangarooConfigurationSubject } from '../../config';

/**
 * This route guard only permits access if the configuration has failed.
 *
 * @author Michael Krotscheck
 */
@Injectable()
export class ConfigurationFailedGuard implements CanActivate {

  /**
   * Create a new instance.
   *
   * @param {KangarooConfigurationSubject} configProvider
   */
  constructor(private configProvider: KangarooConfigurationSubject) {
  }

  /**
   * Return true if the config provider throws an error, otherwise return false.
   *
   * @param route The route, not used.
   * @param state Router snapshot, not used.
   * @returns A boolean observable.
   */
  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> {
    return this.configProvider
      .pipe(
        map(() => false),
        catchError(() => [ true ]),
      );
  }
}
