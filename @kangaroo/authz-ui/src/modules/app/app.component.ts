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

import { Component } from '@angular/core';
import { KangarooConfigurationSubject } from '../config';
import { Router } from '@angular/router';

/**
 * Our root application component. Upon initialization, it will make sure that the application has been
 * properly configured. If the configuration errors out, then it will replace the entire UI route tree with the
 * cannot-configure routes.
 *
 * @author Michael Krotscheck
 */
@Component({
  selector: 'kng-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  /**
   * On initialization, watch the configuration load. If it fails, redirect
   * to configuration-failed.
   *
   * @param {KangarooConfigurationSubject} configProvider
   * @param {Router} router
   */
  constructor(private configProvider: KangarooConfigurationSubject,
              private router: Router) {
    this.configProvider
      .subscribe(
        null,
        () => router.navigateByUrl('/configuration-failed'));
  }
}
