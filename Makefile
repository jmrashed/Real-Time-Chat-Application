.PHONY: dev client-dev server-dev

# Change these paths if needed
CLIENT_DIR = client
SERVER_DIR = server

SERVER_DOCKER_COMPOSE=./client/docker-compose.yaml
SERVER_APP_SERVICE_NAME=./server/foodie_app

CLIENT_DOCKER_COMPOSE=docker-compose.yaml
CLIENT_APP_SERVICE_NAME=chat-frontend


# Targets for running the client and server
client-dev:
	cd $(CLIENT_DIR) && npm run dev

server-dev:
	cd $(SERVER_DIR) && npm run dev

# Combined target to run both client and server
dev: server-dev client-dev



.PHONY: server-deploy
server-deploy:

docker-compose-up:
	docker-compose -f docker-compose.yaml up -d


.PHONY: build-no-deps
build-no-deps:
	docker-compose up --no-deps --build -d $(APP_SERVICE_NAME)

# Restart the app service without rebuilding
.PHONY: restart
restart:
	docker-compose -f $(DOCKER_COMPOSE) restart $(APP_SERVICE_NAME)




