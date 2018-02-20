/**
 * Java build pipeline for the kangaroo-admin-ui project.
 */

pipeline {

    agent { label 'worker' }

    stages {

        /**
         * Get environment statistics.
         */
        stage('Stat') {
            steps {
                sh 'env'
                sh 'node --version'
                sh 'yarn --version'
                sh 'chromium-browser --version'
            }
        }

        /**
         * Install && Link.
         */
        stage('Bootstrap') {
            steps {
                // This does a global install of all dependencies.
                sh('yarn install')
            }
        }

        /**
         * Build the projects in order.
         */
        stage('Build') {
            steps {
                sh('yarn workspace @kangaroo/jwt build')
                sh('yarn workspace @kangaroo/angular-logger build')
                sh('yarn workspace @kangaroo/angular-browser-storage build')
                sh('yarn workspace @kangaroo/angular-oauth2 build')
                sh('yarn workspace @kangaroo/authz-ui build')
            }
        }

        /**
         * Lint everything
         */
        stage('Lint') {
            steps {
                parallel(
                        "root": {
                            sh('yarn run lint')
                        },
                        "@kangaroo/angular-logger": {
                            sh('yarn --silent workspace @kangaroo/angular-logger -- --silent lint --format checkstyle --force > @kangaroo/angular-logger/reports/checkstyle-result.xml')
                        },
                        "@kangaroo/angular-browser-storage": {
                            sh('yarn --silent workspace @kangaroo/angular-browser-storage -- --silent lint --format checkstyle --force > @kangaroo/angular-browser-storage/reports/checkstyle-result.xml')
                        },
                        "@kangaroo/angular-oauth2": {
                            sh('yarn --silent workspace @kangaroo/angular-oauth2 -- --silent lint --format checkstyle --force > @kangaroo/angular-oauth2/reports/checkstyle-result.xml')
                        },
                        "@kangaroo/authz-ui": {
                            sh('yarn --silent workspace @kangaroo/authz-ui -- --silent lint --format checkstyle --force > @kangaroo/authz-ui/reports/checkstyle-result.xml')
                        },
                        "@kangaroo/jwt": {
                            sh('yarn --silent workspace @kangaroo/jwt -- --silent lint --format checkstyle --force > @kangaroo/jwt/reports/checkstyle-result.xml')
                        }
                )
            }
        }

        /**
         * NSP everything
         */
        stage('nsp') {
            steps {
                parallel(
                        "@kangaroo/angular-logger": {
                            sh('yarn workspace @kangaroo/angular-logger nsp')
                        },
                        "@kangaroo/angular-browser-storage": {
                            sh('yarn workspace @kangaroo/angular-browser-storage nsp')
                        },
                        "@kangaroo/angular-oauth2": {
                            sh('yarn workspace @kangaroo/angular-oauth2 nsp')
                        },
                        "@kangaroo/authz-ui": {
                            sh('yarn workspace @kangaroo/authz-ui nsp')
                        },
                        "@kangaroo/jwt": {
                            sh('yarn workspace @kangaroo/jwt nsp')
                        }
                )
            }
        }

        /**
         * Unit.
         */
        stage('Unit') {
            steps {
                parallel(
                        "@kangaroo/angular-logger": {
                            sh('yarn workspace @kangaroo/angular-logger test -- -w false')
                        },
                        "@kangaroo/angular-browser-storage": {
                            sh('yarn workspace @kangaroo/angular-browser-storage test -- -w false')
                        },
                        "@kangaroo/angular-oauth2": {
                            sh('yarn workspace @kangaroo/angular-oauth2 test -- --single-run')
                        },
                        "@kangaroo/authz-ui": {
                            sh('yarn workspace @kangaroo/authz-ui test -- -w false')
                        },
                        "@kangaroo/jwt": {
                            sh('yarn workspace @kangaroo/jwt test -- --single-run')
                        }
                )
            }
        }

        /**
         * E2E.
         */
        stage('E2E') {
            steps {
                sh('yarn workspace @kangaroo/authz-ui e2e')
            }
        }

        /**
         * Pack.
         */
        stage('Pack') {
            steps {
                parallel(
                        "@kangaroo/angular-logger": {
                            sh('yarn workspace @kangaroo/angular-logger pack')
                        },
                        "@kangaroo/angular-browser-storage": {
                            sh('yarn workspace @kangaroo/angular-browser-storage pack')
                        },
                        "@kangaroo/angular-oauth2": {
                            sh('yarn workspace @kangaroo/angular-oauth2 pack')
                        },
                        "@kangaroo/authz-ui": {
                            sh('yarn workspace @kangaroo/authz-ui pack')
                        },
                        "@kangaroo/jwt": {
                            sh('yarn workspace @kangaroo/jwt pack')
                        }
                )
            }
        }
    }

    post {

        /**
         * When the build status changed, send the result.
         */
        changed {
            script {
                notifySlack(currentBuild.currentResult)
            }
        }

        /**
         * Actions always to run at the end of a pipeline.
         */
        always {

            checkstyle([
                    canComputeNew      : false,
                    canRunOnFailed     : true,
                    defaultEncoding    : '',
                    failedTotalHigh    : '0',
                    failedTotalLow     : '0',
                    failedTotalNormal  : '0',
                    healthy            : '100',
                    pattern            : '**/reports/checkstyle-result.xml',
                    unHealthy          : '99',
                    unstableTotalAll   : '0',
                    unstableTotalHigh  : '0',
                    unstableTotalLow   : '0',
                    unstableTotalNormal: '0'
            ])

            junit '**/reports/junit/*.xml'

            cobertura([
                    classCoverageTargets      : '100, 0, 0',
                    coberturaReportFile       : '**/reports/**/cobertura.xml',
                    conditionalCoverageTargets: '100, 0, 0',
                    fileCoverageTargets       : '100, 0, 0',
                    lineCoverageTargets       : '100, 0, 0',
                    maxNumberOfBuilds         : 0,
                    methodCoverageTargets     : '100, 0, 0',
                    onlyStable                : true,
                    packageCoverageTargets    : '100, 0, 0',
                    sourceEncoding            : 'ASCII',
                    zoomCoverageChart         : false
            ])

            /**
             * Release any resources created for this tests.
             */
            cleanWs(deleteDirs: true)
        }
    }
}
