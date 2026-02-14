AWS_REGION = ap-south-1
ACCOUNT_ID = 246773436668
ECR = $(ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
APP = tripez-app
CLUSTER = tripez-cluster
DEPLOYMENT = tripez-frontend

build:
	npm install
	npm run build

docker-build:
	docker build -t $(APP) .

ecr-login:
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR)

docker-push:
	docker tag $(APP):latest $(ECR)/$(APP):latest
	docker push $(ECR)/$(APP):latest

deploy:
	aws eks update-kubeconfig --region $(AWS_REGION) --name $(CLUSTER)
	kubectl set image deployment/$(DEPLOYMENT) $(DEPLOYMENT)=$(ECR)/$(APP):latest --record

all: build docker-build ecr-login docker-push deploy
