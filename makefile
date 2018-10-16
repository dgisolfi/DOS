# DOS [Daniel OS]
# Author:  Daniel Nicolas Gisolfi

intro:
	@echo "\n             DOS[Daniel OS] v1.0"

#replaces the c file 
c: intro
	@/usr/local/lib/node_modules/typescript/bin/tsc --version
	@/usr/local/lib/node_modules/typescript/bin/tsc --rootDir source/ --outDir public/distrib/  source/*.ts source/host/*.ts source/os/*.ts

#Run the latest deployment of the OS
os_latest: build_os
	@docker run -it --rm --name dos_prod -p48000:48000 dos

# build development enviorment
dev_os: intro build_os
	@docker run -it --rm --name dos_dev -p48000:48000 -v ${PWD}:/OS dos bash

#rebuild image
build_os: intro c
	@docker build -t dos .

#Push Docker image to Docker Hub
publish_os: build_os
	@docker tag dos dgisolfi/dos:2.0
	@docker push dgisolfi/dos