# > CONSTANTS
PATTERN_BEGIN=»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
PATTERN_END=«««««««««««««««««««««««««««««««««««««««««««««

BUILDPACK_BUILDER=heroku/buildpacks:18

CONSUMER_PACK_NAME=pack_energysim_consumer
CONSUMER_CONTAINER_NAME=cont_energysim_consumer
CONSUMER_FLASK_HOST=0.0.0.0
CONSUMER_FLASK_PORT=9090
CONSUMER_FLASK_PORT_EXTERNAL=9091:9090
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
	-p $(CONSUMER_FLASK_PORT_EXTERNAL) \
	$(CONSUMER_PACK_NAME)
	
	@echo '$(PATTERN_END) CONSUMER PACK STARTED!'

stop-docker-consumer:
	@echo '$(PATTERN_BEGIN) STOPPING CONSUMER PACK...'

	@( docker rm -f $(CONSUMER_CONTAINER_NAME) ) || true

	@echo '$(PATTERN_END) CONSUMER PACK STOPPED!'	
# < DOCKER-CONSUMER

# > CONSUMER
run-consumer: start-consumer

start-consumer:
	@FLASK_APP=consumer/main.py \
	python3 -m flask run \
	--host=$(CONSUMER_FLASK_HOST) \
	--port=$(CONSUMER_FLASK_PORT)
# < CONSUMER