pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ap-south-1"
        ACCOUNT_ID = "246773436668"
        REPO_NAME = "tripez-app"
        ECR_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${REPO_NAME}"
        CLUSTER = "tripez-cluster"
        DEPLOYMENT = "tripez-frontend"
        SERVICE = "tripez-frontend-service"
    }

    options {
        timestamps()
    }

    stages {
        // 1️⃣ Clone Repository
        stage('Clone Repository') {
            steps {
                echo "📦 Cloning GitHub repository..."
                sh '''
                rm -rf tripez
                git clone https://github.com/burhanuddin-bohra-robomq/tripez.git
                cd tripez
                echo "✅ Repository cloned successfully!"
                '''
            }
        }

        // 2️⃣ Build Frontend (React/Vite)
        stage('Build Frontend') {
            steps {
                echo "⚙️ Installing dependencies and building Vite React app..."
                sh '''
                cd tripez
                npm install
                npm run build
                echo "✅ Frontend build complete!"
                '''
            }
        }

        // 3️⃣ Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    def commitHash = sh(returnStdout: true, script: "cd tripez && git rev-parse --short HEAD").trim()
                    env.IMAGE_TAG = "build-${BUILD_NUMBER}-${commitHash}"

                    sh '''
                    cd tripez
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                    docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REPO}:latest
                    echo "✅ Docker image built and tagged: ${ECR_REPO}:${IMAGE_TAG} and :latest"
                    '''
                }
            }
        }

        // 4️⃣ Push Docker image to AWS ECR
        stage('Push to ECR') {
            steps {
                echo "🚀 Logging into AWS ECR..."
                withAWS(credentials: 'aws-creds', region: "${AWS_DEFAULT_REGION}") {
                    sh '''
                    set -euxo pipefail

                    echo "🔐 Authenticating to ECR..."
                    aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | \
                    docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com

                    echo "🛰️ Pushing versioned image to ECR..."
                    docker push ${ECR_REPO}:${IMAGE_TAG}

                    echo "🛰️ Pushing 'latest' tag to ECR..."
                    docker push ${ECR_REPO}:latest

                    echo "✅ Image push complete!"
                    '''
                }
            }
        }

        // 5️⃣ Deploy to EKS (auto-create if not exists)
pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ap-south-1"
        ACCOUNT_ID = "246773436668"
        REPO_NAME = "tripez-app"
        ECR_REPO = "${ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${REPO_NAME}"
        CLUSTER = "tripez-cluster"
        DEPLOYMENT = "tripez-frontend"
        SERVICE = "tripez-frontend-service"
    }

    options {
        timestamps()
    }

    stages {
        // 1️⃣ Clone Repository
        stage('Clone Repository') {
            steps {
                echo "📦 Cloning GitHub repository..."
                sh '''
                rm -rf tripez
                git clone https://github.com/burhanuddin-bohra-robomq/tripez.git
                cd tripez
                echo "✅ Repository cloned successfully!"
                '''
            }
        }

        // 2️⃣ Build Frontend (React/Vite)
        stage('Build Frontend') {
            steps {
                echo "⚙️ Installing dependencies and building Vite React app..."
                sh '''
                cd tripez
                npm install
                npm run build
                echo "✅ Frontend build complete!"
                '''
            }
        }

        // 3️⃣ Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    def commitHash = sh(returnStdout: true, script: "cd tripez && git rev-parse --short HEAD").trim()
                    env.IMAGE_TAG = "build-${BUILD_NUMBER}-${commitHash}"

                    sh '''
                    cd tripez
                    docker build -t ${ECR_REPO}:${IMAGE_TAG} .
                    docker tag ${ECR_REPO}:${IMAGE_TAG} ${ECR_REPO}:latest
                    echo "✅ Docker image built and tagged: ${ECR_REPO}:${IMAGE_TAG} and :latest"
                    '''
                }
            }
        }

        // 4️⃣ Push Docker image to AWS ECR
        stage('Push to ECR') {
            steps {
                echo "🚀 Logging into AWS ECR..."
                withAWS(credentials: 'aws-creds', region: "${AWS_DEFAULT_REGION}") {
                    sh '''
                    set -euxo pipefail

                    echo "🔐 Authenticating to ECR..."
                    aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | \
                    docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com

                    echo "🛰️ Pushing versioned image to ECR..."
                    docker push ${ECR_REPO}:${IMAGE_TAG}

                    echo "🛰️ Pushing 'latest' tag to ECR..."
                    docker push ${ECR_REPO}:latest

                    echo "✅ Image push complete!"
                    '''
                }
            }
        }

        // 5️⃣ Deploy to EKS (auto-create if not exists)
        stage('Deploy to EKS') {
    steps {
        echo "☸ Deploying image to EKS cluster..."
        withAWS(credentials: 'aws-creds', region: "${AWS_DEFAULT_REGION}") {
            sh '''
            set -euxo pipefail
            aws eks update-kubeconfig --region ${AWS_DEFAULT_REGION} --name ${CLUSTER}

            if ! kubectl get deployment ${DEPLOYMENT} >/dev/null 2>&1; then
                echo "📦 Creating new deployment..."
                kubectl create deployment ${DEPLOYMENT} --image=${ECR_REPO}:latest
                kubectl expose deployment ${DEPLOYMENT} --port=80 --type=LoadBalancer --name=${SERVICE}
            else
                echo "🔄 Updating existing deployment..."
                kubectl set image deployment/${DEPLOYMENT} ${DEPLOYMENT}=${ECR_REPO}:latest --record
            fi

            echo "🕒 Waiting for rollout to complete (up to 10 minutes)..."
            if ! kubectl rollout status deployment/${DEPLOYMENT} --timeout=600s; then
              echo "⚠️ Rollout failed or timed out. Printing debug info..."
              kubectl get pods -l app=${DEPLOYMENT} -o wide
              echo "----------------------"
              kubectl describe pods -l app=${DEPLOYMENT} | tail -n 50
              echo "----------------------"
              kubectl logs -l app=${DEPLOYMENT} --tail=30 || true
              exit 1
            fi
            '''
        }
    }
}


        // 6️⃣ Fetch and Display Live URL
        stage('Get Live URL') {
            steps {
                script {
                    def url = sh(
                        script: "kubectl get svc ${SERVICE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
                        returnStdout: true
                    ).trim()

                    if (url) {
                        echo "🌍 Your app is live at: http://${url}"
                    } else {
                        echo "⚠️ LoadBalancer URL not ready yet — check AWS console after 1–2 minutes."
                    }
                }
            }
        }
    }

    post {
        success {
            echo """
            ✅ Build & Deployment Successful!
            📦 ECR Image: ${ECR_REPO}:${IMAGE_TAG}
            ☸ Cluster: ${CLUSTER}
            🌍 Service: ${SERVICE}
            🚀 Region: ${AWS_DEFAULT_REGION}
            """
        }
        failure {
            echo "❌ Pipeline failed. Check logs above for details."
        }
    }
}


        // 6️⃣ Fetch and Display Live URL
        stage('Get Live URL') {
            steps {
                script {
                    def url = sh(
                        script: "kubectl get svc ${SERVICE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'",
                        returnStdout: true
                    ).trim()

                    if (url) {
                        echo "🌍 Your app is live at: http://${url}"
                    } else {
                        echo "⚠️ LoadBalancer URL not ready yet — check AWS console after 1–2 minutes."
                    }
                }
            }
        }
    }

    post {
        success {
            echo """
            ✅ Build & Deployment Successful!
            📦 ECR Image: ${ECR_REPO}:${IMAGE_TAG}
            ☸ Cluster: ${CLUSTER}
            🌍 Service: ${SERVICE}
            🚀 Region: ${AWS_DEFAULT_REGION}
            """
        }
        failure {
            echo "❌ Pipeline failed. Check logs above for details."
        }
    }
}
