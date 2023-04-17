#!/usr/bin/env/groovy

pipeline {
   
    agent { dockerfile true }

    environment {
        // job environment variables
        BUILD_ENV = "${build_stream}"
        // this is a result of a backwards-incompatible change from JENKINS-24380
        BUILD_ID = "${VersionNumber(projectStartDate: '1970-01-01', versionNumberString: '${BUILD_DATE_FORMATTED, \"yyyy-MM-dd_H-m-s\"}')}"
    }

    stages {
        stage ('dog_trainer - Checkout') {
			steps {
				checkout([$class: 'GitSCM', branches: [[name: '${branch}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'admin', url: 'git@github.com:relaypro-open/dog_park.git']]]) 
			}
		}
        stage('Build') {
            steps {
                sh """#!/bin/bash -x
                cd $HOME
                echo "HOME: $HOME"
                echo "USER: $USER"
                echo "PWD: $PWD"
                rm -f *.tar.gz
                export BUILD_ENV=\$env
                ./build-\$env.sh
                """
            }
            
            post {
                success {
                    archiveArtifacts 'dog_park-*.tar.gz'
                }
            }
        }
        
        stage('Upload artifact to S3') {
            steps {
                sh 'mv _build/*/rel/dog_park/dog_park-\$dog_env-\$BUILD_TIMESTAMP.tar.gz \$dog_env-\$BUILD_TIMESTAMP.tar.gz'
                withAWS(credentials: 'aws-iam-user/product-jenkins-artifact-uploads') {
                    s3Upload bucket:'product-builds', path: 'dog_park/', includePathPattern: '*.tar.gz'
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.deploy == 'true' }
            }
            steps {
                build job: '/playbyplay/pbp-common-deploy', parameters: [
                    string(name: 'deployEnv', value: "${params.env}"),
                    string(name: 'app', value: 'dog_park'),
                    string(name: 'target', value: "${params.hosts}"),
                    string(name: 'ansibleFlags', value: '')
                ]
                
            }
        }
    }
        post {
    	    changed {
                emailext(
                    to: 'dgulino@relaypro.com',
                    body: '${DEFAULT_CONTENT}', 
                    mimeType: 'text/html',
                    subject: '${DEFAULT_SUBJECT}',
                    replyTo: '$DEFAULT_REPLYTO'    
                    )
            }
    	}
}
