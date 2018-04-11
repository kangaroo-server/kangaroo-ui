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

const {lstatSync, readdirSync, existsSync} = require('fs');
const {join, normalize, resolve} = require('path');

describe('project dependencies', () => {

    // Read all the project directories.
    const source = resolve('../');
    const projects = readdirSync(source); //.map(name => join(source, name));

    projects.forEach((project) => {
        describe(project, () => {

            const path = join(source, project);
            const pkg = require(join(path, 'package.json'));
            const ngPackage = join(path, 'ng-package.json');
            const peer = pkg.peerDependencies || {};
            const dev = pkg.devDependencies || {};

            it('should reflect all peerDependencies in devDependencies', () => {
                // Peer needs to match dev.
                Object.keys(peer)
                    .forEach((key) => {
                        expect(dev[key]).toBeDefined(`Peer dependency "${key}" is not a devDependency`);
                        expect(dev[key]).toEqual(peer[key], `Version mismatch between peer & dev: ${key}`);
                    });
            });

            if (existsSync(ngPackage)) {
                it('should reflect all @kangaroo dependencies in umdModuleIds', () => {
                    const ngPkg = require(ngPackage);
                    const moduleIds = ngPkg && ngPkg.lib && ngPkg.lib.umdModuleIds || {};
                    const kangarooDeps = Object.keys(peer)
                        .filter((key) => key.indexOf('@kangaroo') === 0)
                        .reduce((previousValue, currentValue) => {
                            const val = currentValue.toString().replace('@', '').replace('/', '.');
                            previousValue[currentValue] = val;
                            return previousValue;
                        }, {});
                    expect(moduleIds)
                        .toEqual(kangarooDeps, 'moduleIds must be set for all @kangaroo/angular dependencies');
                });
            }
        });
    });
});