# DOS [Daniel OS]
# Author:  Daniel Nicolas Gisolfi

image=dos
hub_image=dgisolfi/dos
container=dos
version=3.0

all: clean build os_latest

dev: clean build dev_os

intro:
	@echo "\n             DOS[Daniel OS] v$(version)"

clean:
	-docker kill $(container)_dev
	-docker kill $(container)_prod
	-docker rmi $(image)
	-docker rmi $(hub_image)
	
#replaces the c file 
c: intro
	@/usr/local/lib/node_modules/typescript/bin/tsc --version
	@/usr/local/lib/node_modules/typescript/bin/tsc --rootDir source/ --outDir public/distrib/  source/*.ts source/host/*.ts source/os/*.ts

#Run the latest deployment of the OS
os_latest: build_os
	@docker run -it --rm --name $(container)_prod -p48000:48000 $(image)

# build development enviorment
dev_os: intro build
	@docker run -it --rm --name $(container)_dev -p48000:48000 -v ${PWD}:/OS $(image) bash

#rebuild image
build: intro c
	@docker build -t $(image) .

#Push Docker image to Docker Hub
publish_os: build
	@docker tag $(image) $(hub_image):iProject3
	@docker tag $(image) $(hub_image):latest
	@docker push $(hub_image)