pipeline {
    agent { label 'docker' }

    stages {
        stage('Build') {
            steps {
                sh 'BUILD_ID="${BUILD_ID}" REACT_APP_DOG_API_HOST="${BUILD_ENV}" BUILD_ENV="${BUILD_ENV}" make build'
            }

            post {
                success {
                    archiveArtifacts '*.tar.gz'
                }
            }
        }
        stage('Upload artifact to S3') {
            steps {
                withAWS(profile: 'default') {
                    s3Upload bucket:'product-builds', path: 'dog_park/', workingDir: 'dist', includePathPattern: '*.tar.gz'
                }
            }
        }
    }
}
