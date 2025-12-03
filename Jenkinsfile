// In file: /Users/dupatane/E-Commerce-Three-Tier-application-on-AWS-EKS/Jenkinsfile

pipeline {
    agent any 
    tools {
        // Name must match what you configured in Global Tool Configuration
        sonarScanner 'SonarScannerCLI' 
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                // This step is automatically handled by "Pipeline script from SCM" 
                // in Jenkins, which clones the project into the workspace.
                echo "Cloning/Checking out ${env.JOB_NAME}..."
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                // 'SonarQube' must match the server name configured in Configure System
                withSonarQubeEnv('SonarQube') { 
                    // Set the token login explicitly using the specific token ID
                    // This uses the Project Analysis Token you created.
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN_SECRET')]) {
                        sh "sonar-scanner -Dsonar.login=${SONAR_TOKEN_SECRET}" 
                    }
                }
            }
        }
        
        stage('Quality Gate Check') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    // Waits for the analysis to be processed by SonarQube
                    waitForQualityGate abortPipeline: true 
                }
            }
        }
    }
}