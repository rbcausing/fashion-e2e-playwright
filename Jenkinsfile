pipeline {
    agent any
    
    environment {
        NODE_VERSION = '20'
        BASE_URL = 'https://www.demoblaze.com'
        CI = 'true'
    }
    
    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        skipDefaultCheckout(false)
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    echo '🔧 Installing Node.js dependencies and Playwright browsers...'
                }
                sh '''
                    npm ci
                    npx playwright install --with-deps
                '''
            }
            post {
                success {
                    echo '✅ Dependencies installed successfully'
                }
                failure {
                    echo '❌ Failed to install dependencies'
                }
            }
        }
        
        stage('Smoke Tests') {
            parallel {
                stage('Chromium Smoke Tests') {
                    steps {
                        script {
                            echo '🧪 Running smoke tests on Chromium...'
                        }
                        sh '''
                            npx playwright test --project=chromium --grep="@smoke" --reporter=html,junit
                        '''
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        }
                    }
                }
                
                stage('Firefox Smoke Tests') {
                    steps {
                        script {
                            echo '🧪 Running smoke tests on Firefox...'
                        }
                        sh '''
                            npx playwright test --project=firefox --grep="@smoke" --reporter=html,junit
                        '''
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        }
                    }
                }
                
                stage('WebKit Smoke Tests') {
                    steps {
                        script {
                            echo '🧪 Running smoke tests on WebKit...'
                        }
                        sh '''
                            npx playwright test --project=webkit --grep="@smoke" --reporter=html,junit
                        '''
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        }
                    }
                }
            }
            post {
                success {
                    echo '✅ All smoke tests passed'
                }
                failure {
                    echo '❌ Some smoke tests failed'
                }
            }
        }
        
        stage('Full Test Suite') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
                }
            }
            parallel {
                stage('Chromium Full Tests') {
                    steps {
                        script {
                            echo '🧪 Running full test suite on Chromium...'
                        }
                        sh '''
                            npx playwright test --project=chromium --reporter=html,junit
                        '''
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        }
                    }
                }
                
                stage('Firefox Full Tests') {
                    steps {
                        script {
                            echo '🧪 Running full test suite on Firefox...'
                        }
                        sh '''
                            npx playwright test --project=firefox --reporter=html,junit
                        '''
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        }
                    }
                }
            }
            post {
                success {
                    echo '✅ Full test suite completed successfully'
                }
                failure {
                    echo '❌ Full test suite failed'
                }
            }
        }
        
        stage('Regression Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
                }
            }
            steps {
                script {
                    echo '🔄 Running regression tests with retries...'
                }
                sh '''
                    npx playwright test --retries=2 --reporter=html,junit
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/results.xml'
                }
            }
        }
        
        stage('Mobile Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' }
                }
            }
            steps {
                script {
                    echo '📱 Running mobile tests...'
                }
                sh '''
                    npx playwright test --project="Mobile Chrome" --reporter=html,junit
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/results.xml'
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo '📊 Archiving test artifacts...'
            }
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            
            script {
                echo '📈 Publishing HTML reports...'
            }
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
        
        success {
            script {
                echo '🎉 Pipeline completed successfully!'
                echo '✅ All tests passed'
                echo '📊 Test reports available in Jenkins'
            }
        }
        
        failure {
            script {
                echo '❌ Pipeline failed'
                echo '🔍 Check test reports for details'
            }
        }
        
        cleanup {
            script {
                echo '🧹 Cleaning up workspace...'
            }
            sh '''
                rm -rf test-results/playwright-report/
                rm -rf node_modules/.cache/
            '''
        }
    }
}
