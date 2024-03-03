%:
	@:

up:
# 1 - Check if pip3 is installed
	@if ! type pip3 > /dev/null 2>&1; then \
		echo "Error: pip3 is not installed. Please install it."; \
		exit 1; \
		else echo "pip3 is installed"; \
	fi

# 4 - Install npm dependencies if node_modules is missing
	@if [ ! -d "node_modules" ]; then \
		echo "Running 'npm install'..."; \
		npm install; \
		else echo "Dependencies already installed.."; \
	fi

# 5 - Build if needed
	@if [ ! -d "dist" ]; then \
		echo "Building..."; \
		npm run build; \
		else echo ""; \
	fi

	@if ! type docker > /dev/null 2>&1; then \
		echo "Error: Docker is not installed. Please install it."; \
		exit 1; \
	fi

# 6 - Start docker compose
	docker compose up -d --remove-orphans;

stop:
	docker compose stop;

down:
	docker compose down;

s3:
	@if [ "$(filter ls,$(MAKECMDGOALS))" = "ls" ]; then \
		aws s3 ls fastmatic --endpoint-url http://localhost:4566; \
	fi

	@if [ "$(filter sync,$(MAKECMDGOALS))" = "sync" ]; then \
		aws s3 sync --endpoint-url http://localhost:4566 s3://fastmatic ./stubs/s3/fastmatic; \
	fi

# aws s3 cp --endpoint-url http://localhost:4566/ s3://fastmatic/arroz.png .
# aws s3 rm s3://fastmatic/arroz.png --endpoint-url http://localhost:4566

clean: down
	@docker volume rm server_localstack_data;
	@docker volume rm server_node_modules;
	@docker volume rm server_postgres;
	@docker volume rm server_postgres_data;

	make -C ../baileys clean;

	@docker network rm fastmatic_api;

	@if [ "$(filter rmi,$(MAKECMDGOALS))" = "rmi" ]; then \
		docker rmi fastmatic-dev:latest; \
		docker rmi baileys-dev:latest; \
	fi

build-prod:
	docker build -t fastmatic:latest --target production .

client:
	@chmod +x ../scripts/start-local.sh;
	@../scripts/start-local.sh client;

create-stack:
	@export AWS_ACCESS_KEY_ID="test"
	@export AWS_SECRET_ACCESS_KEY="test"
	@export AWS_DEFAULT_REGION="us-east-1"
	@aws configure set region us-east-1 --profile localstack;
	@aws configure set aws_access_key_id test --profile localstack;
	@aws configure set aws_secret_access_key test --profile localstack;
	@aws configure set output json --profile localstack;

	@# start all services needed by API
	@docker compose up -d --scale api=0

	@awslocal s3api create-bucket --bucket fastmatic;
	@awslocal s3api create-bucket --bucket message-files;
	@awslocal s3 sync ./stubs/s3/fastmatic s3://fastmatic;
	@awslocal s3 sync ./stubs/s3/message-files s3://message-files;

	@# start baileys db
	@make -C ../baileys create-stack

local: create-stack
	@chmod +x ../scripts/start-local.sh;

	@# start baileys db
	@make -C ../baileys local

	@if [ "$(filter server,$(MAKECMDGOALS))" = "server" ]; then \
		../scripts/start-local.sh server; \
	fi
	
	@if [ "$(filter baileys,$(MAKECMDGOALS))" = "baileys" ]; then \
		../scripts/start-local.sh baileys; \
	fi
