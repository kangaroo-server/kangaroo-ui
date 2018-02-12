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
                sh 'lerna --version'
                sh 'chromium-browser --version'
            }
        }

        /**
         * Build dependencies.
         */
        stage('Bootstrap') {
            steps {
                sh('lerna bootstrap')
                sh('lerna run build')
            }
        }

        /**
         * Lint everything
         */
        stage('Lint') {
            steps {
                parallel(
                        "root": {
                            sh("""
                                yarn run lint
                            """)
                        },
                        "kangaroo-angular-oauth2": {
                            sh("""
                                cd kangaroo-angular-oauth2
                                yarn --silent lint --format checkstyle --force > ./reports/checkstyle-result.xml
                            """)
                        },
                        "kangaroo-authz-ui": {
                            sh("""
                                cd kangaroo-authz-ui
                                yarn --silent lint --format checkstyle --force > ./reports/checkstyle-result.xml
                            """)
                        },
                        "kangaroo-jwt-util": {
                            sh("""
                                cd kangaroo-jwt-util
                                yarn --silent lint --format checkstyle --force > ./reports/checkstyle-result.xml
                            """)
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
                        "kangaroo-angular-oauth2": {
                            sh("""
                                cd kangaroo-angular-oauth2
                                yarn nsp
                            """)
                        },
                        "kangaroo-authz-ui": {
                            sh("""
                                cd kangaroo-authz-ui
                                yarn nsp
                            """)
                        },
                        "kangaroo-jwt-util": {
                            sh("""
                                cd kangaroo-jwt-util
                                yarn nsp
                            """)
                        }
                )
            }
        }

        /**
         * Test.
         */
        stage('Test') {
            steps {
                parallel(
                        "kangaroo-angular-oauth2": {
                            sh("""
                                cd kangaroo-angular-oauth2
                                yarn test --single-run
                            """)
                        },
                        "kangaroo-authz-ui": {
                            sh("""
                                cd kangaroo-authz-ui
                                yarn test -w false --progress=false --code-coverage --reporters=coverage-istanbul,junit,spec
                            """)
                        },
                        "kangaroo-jwt-util": {
                            sh("""
                                cd kangaroo-jwt-util
                                yarn test --single-run
                            """)
                        }
                )
            }
        }
    }

    post {
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
                    pattern            : '*/reports/checkstyle-result.xml',
                    unHealthy          : '99',
                    unstableTotalAll   : '0',
                    unstableTotalHigh  : '0',
                    unstableTotalLow   : '0',
                    unstableTotalNormal: '0'
            ])

            junit '*/reports/junit/*.xml'

            cobertura([
                    classCoverageTargets      : '100, 0, 0',
                    coberturaReportFile       : '**/reports/**/cobertura.xml',
                    conditionalCoverageTargets: '100, 0, 0',
                    fileCoverageTargets       : '100, 0, 0',
                    lineCoverageTargets       : '100, 0, 0',
                    maxNumberOfBuilds         : 0,
                    methodCoverageTargets     : '100, 0, 0',
                    onlyStable                : false,
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
