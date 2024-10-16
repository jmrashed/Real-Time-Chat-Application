.PHONY: dev client-dev server-dev

# Change these paths if needed
CLIENT_DIR = client
SERVER_DIR = server

# Targets for running the client and server
client-dev:
	cd $(CLIENT_DIR) && npm run dev

server-dev:
	cd $(SERVER_DIR) && npm run dev

# Combined target to run both client and server
dev: server-dev client-dev
