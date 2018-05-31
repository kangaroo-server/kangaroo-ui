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
import { HttpParams } from '@angular/common/http';

/**
 * A class of http request helpers.
 *
 * @author Michael Krotscheck
 */
export class HttpUtil {

  /**
   * Convert a list of key/value maps into an HttpParam instance.
   *
   * @param  paramsList The params
   * @return The constructed Http Params, null safe.
   */
  public static buildHttpParams(...paramsList: Array<{ [ key: string ]: number | string }>): HttpParams {

    let result: HttpParams = new HttpParams();

    paramsList = paramsList.filter((k) => !!k);
    paramsList.forEach((params) => {
      Object.keys(params).forEach((key) => {
        const value = params[ key ];
        if (value) {
          result = result.append(key, value.toString());
        }
      });
    });

    return result;
  }
}
