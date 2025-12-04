// Jenkinsfile in your E-Commerce-Three-Tier-application-on-AWS-EKS repo

pipeline {
    agent any 

    tools {
    nodejs 'NodeJS'   // <-- MUST match the tool name you configured
  }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Cloning/Checking out ${env.JOB_NAME}..."
                // SCM checkout is already handled by "Pipeline script from SCM"
            }
        }

        stage('Test & Coverage (cart)') {
    steps {
        sh '''
          set -e

          echo "========================================"
          echo " cart (NodeJS) tests + coverage"
          echo "========================================"

          if [ -d cart ] && [ -f cart/package.json ]; then
            cd cart
            if command -v npm >/dev/null 2>&1; then
              echo "[cart] Installing dependencies..."
              # use npm ci if you have package-lock.json
              if [ -f package-lock.json ]; then
                npm ci
              else
                npm install
              fi

              echo "[cart] Running Jest tests with coverage..."
              npm test    # will create cart/coverage/lcov.info
            else
              echo "[cart] npm not found on Jenkins agent, skipping tests"
            fi
            cd ..
          else
            echo "[cart] cart/ folder or package.json not found, skipping"
          fi
        '''
    }
}
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    // Name must match "Manage Jenkins → Global Tool Configuration → SonarQube Scanner"
                    def scannerHome = tool 'SonarScannerCLI'

                    // Name must match "Manage Jenkins → Configure System → SonarQube servers"
                    withSonarQubeEnv('SonarQube') {
                        // Inject the SonarQube token stored in Jenkins credentials
                        withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN_SECRET')]) {

                            // Use sonar.token (sonar.login is deprecated)
                            // Use shell expansion for the secret (no Groovy interpolation with ${})
                            sh """
                                "${scannerHome}/bin/sonar-scanner" \
                                  -Dsonar.token=\$SONAR_TOKEN_SECRET
                            """
                        }
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    // Wait for SonarQube to process the analysis & return Quality Gate result
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
