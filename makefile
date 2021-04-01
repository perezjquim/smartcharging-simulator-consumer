# > CONSTANTS
PATTERN_BEGIN=»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
PATTERN_END=«««««««««««««««««««««««««««««««««««««««««««««

BUILDPACK_BUILDER=heroku/buildpacks:18

CLIENT_PACK_NAME=pack_energysim_client
CLIENT_CONTAINER_NAME=cont_energysim_client
CLIENT_FLASK_HOST=0.0.0.0
CLIENT_FLASK_PORT=9090
CLIENT_FLASK_PORT_EXTERNAL=9091:9090
# < CONSTANTS

main: check-dependencies stop-docker-client run-docker-client

check-dependencies:
	@echo '$(PATTERN_BEGIN) CHECKING DEPENDENCIES...'

	@if ( pip3 list | grep -F pipreqs > /dev/null 2>&1 ) ; then \
		echo "pipreqs already installed!" ; \
	else \
		echo "pipreqs not installed! installing..." && pip3 install pipreqs; \
	fi	

	@if ( dpkg -l pack-cli > /dev/null 2>&1 ) ; then \
		echo "pack already installed!" ; \
	else \
		echo "pack not installed! please install..."; \
		exit 1; \
	fi			

	@bash -c 'source ~/.profile'		

	@echo '$(PATTERN_END) DEPENDENCIES CHECKED!'

# > DOCKER-CLIENT
run-docker-client: build-docker-client start-docker-client

build-docker-client:
	@echo '$(PATTERN_BEGIN) BUILDING CLIENT PACK...'

	@pipreqs --force --savepath requirements.txt.tmp
	@sort -r requirements.txt.tmp > requirements.txt.tmp.sorted
	@if cmp -s requirements.txt.tmp.sorted requirements.txt; then :;\
	else cp -f requirements.txt.tmp.sorted requirements.txt; fi
	@rm -f requirements.txt.tmp
	@rm -f requirements.txt.tmp.sorted
	
	@pack build $(CLIENT_PACK_NAME) \
	--builder $(BUILDPACK_BUILDER) \
	--pull-policy if-not-present \
	--verbose

	@echo '$(PATTERN_END) CLIENT PACK BUILT!'

start-docker-client:
	@echo '$(PATTERN_BEGIN) STARTING CLIENT PACK...'

	@docker run -d \
	--name $(CLIENT_CONTAINER_NAME) \
	-p $(CLIENT_FLASK_PORT_EXTERNAL) \
	$(CLIENT_PACK_NAME)
	
	@echo '$(PATTERN_END) CLIENT PACK STARTED!'

stop-docker-client:
	@echo '$(PATTERN_BEGIN) STOPPING CLIENT PACK...'

	@( docker rm -f $(CLIENT_CONTAINER_NAME) ) || true

	@echo '$(PATTERN_END) CLIENT PACK STOPPED!'	
# < DOCKER-CLIENT

# > CLIENT
run-client: start-client

start-client:
	@FLASK_APP=client/main.py \
	python3 -m flask run \
	--host=$(CLIENT_FLASK_HOST) \
	--port=$(CLIENT_FLASK_PORT)
# < CLIENT