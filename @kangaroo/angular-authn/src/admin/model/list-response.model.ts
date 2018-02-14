/*
 * Copyright (c) 2017 Michael Krotscheck
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

import { CommonModel } from './common.model';
import { SortOrder } from '../';

/**
 * This interface describes a list response from a browse or search query.
 *
 * @author Michael Krotscheck
 */
export interface ListResponse<T extends CommonModel> {

  /**
   * The total number of available records.
   */
  total: number;

  /**
   * The record offset.
   */
  offset: number;

  /**
   * The limit of records returned.
   */
  limit: number;

  /**
   * The sort field.
   */
  sort: string;

  /**
   * The sort order.
   */
  order: SortOrder;

  /**
   * The request result.
   */
  results: T[];

}
