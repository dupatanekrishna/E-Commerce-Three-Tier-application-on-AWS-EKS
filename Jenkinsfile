// Jenkinsfile in your E-Commerce-Three-Tier-application-on-AWS-EKS repo

pipeline {
    agent any 

    stages {
        stage('Checkout Code') {
            steps {
                echo "Cloning/Checking out ${env.JOB_NAME}..."
                // SCM checkout is already handled by "Pipeline script from SCM"
            }
        }

        stage('Test & Coverage (Non-Java)') {
            steps {
                sh '''
                  set -e

                  echo "========================================"
                  echo " NodeJS / AngularJS (web) coverage"
                  echo "========================================"
                  if [ -d "web" ] && [ -f "web/package.json" ]; then
                    cd web
                    echo "[web] Installing Node dependencies..."
                    if command -v npm >/dev/null 2>&1; then
                      npm install
                      echo "[web] Running tests with coverage..."
                      # Adjust this if your test command is different
                      npm test -- --coverage
                    else
                      echo "[web] npm not found on Jenkins agent"
                    fi
                    cd -
                  else
                    echo "[web] No web/ folder or package.json found, skipping Node coverage"
                  fi

                  echo "========================================"
                  echo " Python (payment) coverage"
                  echo "========================================"
                  if [ -d "payment" ]; then
                    cd payment
                    if [ -f "requirements.txt" ]; then
                      echo "[payment] Installing Python dependencies..."
                      if command -v pip >/dev/null 2>&1; then
                        pip install -r requirements.txt || true
                        echo "[payment] Installing coverage + pytest..."
                        pip install coverage pytest || true
                        echo "[payment] Running tests with coverage..."
                        coverage run -m pytest || true
                        coverage xml -o coverage.xml || true
                      else
                        echo "[payment] pip not found on Jenkins agent"
                      fi
                    else
                      echo "[payment] requirements.txt not found, skipping Python coverage"
                    fi
                    cd -
                  else
                    echo "[payment] payment/ folder not found, skipping Python coverage"
                  fi

                  echo "========================================"
                  echo " Go (shipping) coverage"
                  echo "========================================"
                  if [ -d "shipping" ] && [ -f "shipping/go.mod" ]; then
                    cd shipping
                    if command -v go >/dev/null 2>&1; then
                      echo "[shipping] Running Go tests with coverage..."
                      go test ./... -coverprofile=coverage.out || true
                    else
                      echo "[shipping] go not found on Jenkins agent"
                    fi
                    cd -
                  else
                    echo "[shipping] No shipping/ folder or go.mod, skipping Go coverage"
                  fi

                  echo "========================================"
                  echo " PHP coverage"
                  echo "========================================"
                  if [ -d "php" ] && [ -f "php/composer.json" ]; then
                    cd php
                    if command -v composer >/dev/null 2>&1; then
                      echo "[php] Installing Composer dependencies..."
                      composer install || true
                      if [ -x "vendor/bin/phpunit" ]; then
                        echo "[php] Running phpunit with coverage..."
                        ./vendor/bin/phpunit --coverage-clover coverage.xml || true
                      else
                        echo "[php] phpunit not found under vendor/bin"
                      fi
                    else
                      echo "[php] composer not found on Jenkins agent"
                    fi
                    cd -
                  else
                    echo "[php] No php/ folder or composer.json, skipping PHP coverage"
                  fi

                  echo "=== Test & Coverage stage completed (non-Java) ==="
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
