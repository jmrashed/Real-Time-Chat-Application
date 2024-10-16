.PHONY: client-up client-down server-up server-down up down

# Change these paths if needed
CLIENT_DIR = client
SERVER_DIR = server

# Targets for running the client
client-up:
	cd $(CLIENT_DIR) && docker-compose up --build

client-down:
	cd $(CLIENT_DIR) && docker-compose down

# Targets for running the server
server-up:
	cd $(SERVER_DIR) && docker-compose up --build

server-down:
	cd $(SERVER_DIR) && docker-compose down

# Combined target to run both client and server
up-all: client-up server-up

# Stop and remove containers for both client and server
down-all: client-down server-down
