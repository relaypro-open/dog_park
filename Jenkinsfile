#!/usr/bin/env groovy

pipeline {
    agent any

    parameters {
        choice(name: 'env', choices: ['mob_qa', 'mob_pro'], description: 'Build environment')
        choice(name: 'branch', choices: ['origin/master', 'origin/develop'], description: 'Branch to build')
        choice(name: 'host_family', choices: ['dog_trainer'], description: 'Host family for deployment')
        booleanParam(name: 'deploy', defaultValue: false, description: 'Deploy after build')
        choice(name: 'hosts', choices: ['dog-trainer-pro-aws-oh257d61.phonebooth.net', 'dog-trainer-qa-aws-a3ff71.phoneboothdev.info'], description: 'Host to deploy to')
    }

    environment {
        SLACK_CHANNEL = 'dog_trainer'
        BUILD_ENV = "${build_stream}"
        BUILD_ID = "${VersionNumber(projectStartDate: '1970-01-01', versionNumberString: '${BUILD_DATE_FORMATTED, \"yyyy-MM-dd_H-m-s\"}')}"
        API_ENV = "${params.env.split('_')[1]}"
        VITE_DOG_API_HOST = "https://dog-${params.env.split('_')[1]}.relaydev.sh"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '${branch}']],
                    userRemoteConfigs: [[
                        credentialsId: 'admin',
                        url: 'https://github.com/relaypro-open/dog_park.git'
                    ]]
                ])
            }
        }

        stage('Build') {
            steps {
                sh """#!/bin/bash -xe
                docker build --rm \
                    --build-arg VITE_DOG_API_ENV=\$API_ENV \
                    --build-arg VITE_DOG_API_HOST=\$VITE_DOG_API_HOST \
                    --target tar \
                    --output type=local,dest=build \
                    -t dog_park_build \
                    .
                ls -la build/*.tar.gz
                """
            }
        }

        stage('Archive') {
            steps {
                sh """
                cat > build/Makefile << 'EOF'
all: install

install:
\tcp -r ./build/* /usr/share/nginx/html
EOF
                ARCHIVE=${params.env}-${BUILD_ID}.tar.gz
                tar -czf \$ARCHIVE -C build .
                rm -f build/dog_park-*.tar.gz
                """
                archiveArtifacts artifacts: '*.tar.gz', fingerprint: true
            }
        }

        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-iam-user/product-jenkins-artifact-uploads') {
                    s3Upload bucket: 'product-builds', path: 'dog_park/', includePathPattern: '*.tar.gz'
                }
            }
        }

        stage('Deploy') {
            when {
                expression { params.deploy }
            }
            steps {
                build job: '/playbyplay/pbp-common-deploy', parameters: [
                    string(name: 'deployEnv', value: params.deploy_env),
                    string(name: 'app', value: 'dog_park'),
                    string(name: 'target', value: params.hosts),
                    string(name: 'ansibleFlags', value: '')
                ]
            }
        }
    }

    post {
        success {
            script {
                new org.gradiant.jenkins.slack.SlackNotifier().notifyResultWithMessage(
                    "dog_park build ${BUILD_ENV} #${env.BUILD_NUMBER} succeeded"
                )
            }
        }
        changed {
            emailext(
                to: 'dgulino@relaypro.com',
                body: '${DEFAULT_CONTENT}',
                mimeType: 'text/html',
                subject: '${DEFAULT_SUBJECT}',
                replyTo: '$DEFAULT_REPLYTO'
            )
        }
        cleanup {
            deleteDir()
        }
    }
}
