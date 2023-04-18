pipeline {
    agent { 
        dockerfile {
            filename 'Dockerfile'
            args '-i --entrypoint='
        }
    }

    stages {
        stage('Upload artifact to S3') {
            steps {
                withAWS(profile: 'default') {
                    s3Upload bucket:'product-builds', path: 'dog_park/', workingDir: 'dist', includePathPattern: '*.tar.gz'
                }
            }
        }
    }
}
