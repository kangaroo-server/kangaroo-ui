/**
 * Java build pipeline for the kangaroo-admin-ui project.
 */

pipeline {

    agent { label 'worker' }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        ansiColor('xterm')
    }

    stages {

        /**
         * Get environment statistics.
         */
        stage('Stat') {
            steps {
                sh 'env'
                sh 'node --version'
                sh 'yarn --version'
                sh 'google-chrome --version'
            }
        }

        /**
         * Install && Link.
         */
        stage('Bootstrap') {
            steps {
                // This does a global install of all dependencies.
                sh('yarn install')
                sh('yarn build')
            }
        }

        /**
         * Build the projects in order.
         */
        stage('Test') {
            steps {
                parallel(
                        "pack": {
                            sh('yarn run pack')
                        },
                        "nsp": {
                            sh('yarn nsp')
                        },
                        "lint": {
                            sh('yarn lint.ci')
                        },
                        "test": {
                            sh('yarn test')
                        }
                )
            }
        }

        /**
         * E2E.
         */
        stage('E2E') {
            steps {
                script {
                    docker.image('krotscheck/kangaroo-authz:latest').withRun("-p 8080:8080") {
                        sh('yarn workspace @kangaroo/authz-ui e2e')
                    }
                }
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
            archiveArtifacts([
                    artifacts        : '**/yarn-error.log',
                    allowEmptyArchive: true
            ])

            checkstyle([
                    canComputeNew      : false,
                    canRunOnFailed     : true,
                    defaultEncoding    : '',
                    failedTotalHigh    : '0',
                    failedTotalLow     : '0',
                    failedTotalNormal  : '0',
                    healthy            : '100',
                    pattern            : '**/reports/**/checkstyle-result.xml',
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
