pipeline {
    agent { 
        dockerfile {
            filename 'Dockerfile'
            args '-i --entrypoint='
    	    additionalBuildArgs '-t dog_park_build'
        }
    }

    stages {
        stage('Upload artifact to S3') {
            steps {
                sh 'docker cp dog_park_build:*.tar.gz .'
                withAWS(profile: 'default') {
                    s3Upload bucket:'product-builds', path: 'dog_park/', workingDir: '.', includePathPattern: '*.tar.gz'
                }
            }
        }
    }
}
