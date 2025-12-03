// Jenkinsfile in your E-Commerce-Three-Tier-application-on-AWS-EKS repo

pipeline {
    agent any 

    stages {
        stage('Checkout Code') {
            steps {
                echo "Cloning/Checking out ${env.JOB_NAME}..."
                // SCM checkout is already done by "Pipeline script from SCM"
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

                            // Use shell expansion for the secret (no Groovy interpolation with ${})
                            sh """
                                "${scannerHome}/bin/sonar-scanner" \
                                  -Dsonar.login=\$SONAR_TOKEN_SECRET
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
