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

import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ClrNavigationModule } from '@clr/angular';

/**
 * Unit tests for the Header component.
 */
describe('HeaderComponent', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ],
      imports: [
        ClrNavigationModule,
        RouterTestingModule
      ]
    });
  });

  it('should construct', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture).toBeDefined();
  });

  it('should contain the application title', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const titleSpan = fixture.debugElement.query(By.css('.header .branding a .title'));
    expect(titleSpan).toBeDefined();
    expect(titleSpan.nativeElement.textContent).toContain('Kangaroo: Administration');
  });
});