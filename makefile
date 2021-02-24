# > CONSTANTS
PATTERN_BEGIN=»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
PATTERN_END=«««««««««««««««««««««««««««««««««««««««««««««

BUILDPACK_BUILDER=heroku/buildpacks:18

CONSUMER_NETWORK_NAME=net_energysim

CONSUMER_PACK_NAME=pack_energysim_consumer
CONSUMER_CONTAINER_NAME=cont_energysim_consumer
CONSUMER_PORT=9001:9000
CONSUMER_FLASK_HOST=0.0.0.0
CONSUMER_FLASK_PORT=9000
CONSUMER_WS_PORT=9003:9002
# < CONSTANTS

main: stop-docker-consumer run-docker-consumer

# > DOCKER-CONSUMER
run-docker-consumer: build-docker-consumer start-docker-consumer

build-docker-consumer:
	@echo '$(PATTERN_BEGIN) BUILDING CONSUMER PACK...'

	@pipreqs --force --savepath requirements.txt.tmp
	@sort -r requirements.txt.tmp > requirements.txt.tmp.sorted
	@if cmp -s requirements.txt.tmp.sorted requirements.txt; then :;\
	else cp -f requirements.txt.tmp.sorted requirements.txt; fi
	@rm -f requirements.txt.tmp
	@rm -f requirements.txt.tmp.sorted
	
	@pack build $(CONSUMER_PACK_NAME) \
	--builder $(BUILDPACK_BUILDER) \
	--pull-policy if-not-present \
	--verbose

	@echo '$(PATTERN_END) CONSUMER PACK BUILT!'

start-docker-consumer:
	@echo '$(PATTERN_BEGIN) STARTING CONSUMER PACK...'

	@docker run -d \
	--name $(CONSUMER_CONTAINER_NAME) \
	--network $(CONSUMER_NETWORK_NAME) \
	-p $(CONSUMER_PORT) \
	-p $(CONSUMER_WS_PORT) \
	$(CONSUMER_PACK_NAME)
	
	@echo '$(PATTERN_END) CONSUMER PACK STARTED!'

stop-docker-consumer:
	@echo '$(PATTERN_BEGIN) STOPPING CONSUMER PACK...'

	@( docker rm -f $(CONSUMER_CONTAINER_NAME) ) || true

	@echo '$(PATTERN_END) CONSUMER PACK STOPPED!'	
# < DOCKER-CONSUMER

# > CONSUMER
run-consumer: prep-consumer start-consumer

prep-consumer:
	@until nc -z $(GATEWAY_HOST) $(GATEWAY_PORT); do \
	echo "$$(date) - waiting for gateway..."; \
	sleep 2; \
	done

start-consumer:
	@FLASK_APP=consumer/main.py \
	python3 -m flask run \
	--host=$(CONSUMER_FLASK_HOST) \
	--port=$(CONSUMER_FLASK_PORT)
# < CONSUMER