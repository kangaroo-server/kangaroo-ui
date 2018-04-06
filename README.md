# Kangaroo UI
[![Build Status](https://jenkins.krotscheck.net/buildStatus/icon?job=Kangaroo/kangaroo-ui/develop)](https://jenkins.krotscheck.net/job/Kangaroo/job/kangaroo-ui/job/develop)
[![Jenkins tests](https://img.shields.io/jenkins/t/https/jenkins.krotscheck.net/job/Kangaroo/job/kangaroo-ui/job/develop.svg)](https://jenkins.krotscheck.net/job/Kangaroo/job/kangaroo-ui/job/develop/)
[![Jenkins coverage](https://img.shields.io/jenkins/c/https/jenkins.krotscheck.net/job/Kangaroo/job/kangaroo-ui/job/develop.svg)](https://jenkins.krotscheck.net/job/Kangaroo/job/kangaroo-ui/job/develop/)
[![Known Vulnerabilities](https://snyk.io/test/github/kangaroo-server/kangaroo-ui/badge.svg)](https://snyk.io/test/github/kangaroo-server/kangaroo-ui)
[![NSP Status](https://nodesecurity.io/orgs/kangaroo/projects/f49588b5-f0c3-4a5f-aa2f-0f5a0c4d56ed/badge)](https://nodesecurity.io/orgs/kangaroo/projects/f49588b5-f0c3-4a5f-aa2f-0f5a0c4d56ed)

This project contains a variety of javascript libraries, helpful in building UI's on top of the Kangaroo
microservice ecosystem. As a monorepo, each project lives in the appropriately named `@kangaroo/<project>`
subdirectory. All adhere to the same development tooling contract, here's how you get started:

## Developer quickstart

In the root project directory, run `yarn install` and `yarn build`. This will install all dependencies, and build/link
all cross-project dependencies.

## Tests & Sundry

Each project responds to the following commands:

- `yarn test`
- `yarn lint`
- `yarn build`
- `yarn nsp`

Projects that include a full UI, also respond to:

- `yarn start`
- `yarn e2e`
