# DOS [Daniel OS]
# Author:  Daniel Nicolas Gisolfi

intro:
	@echo "\n             DOS[Daniel OS] v0.1"

#replaces the c file 
c: intro
	@/usr/local/lib/node_modules/typescript/bin/tsc --version
	@/usr/local/lib/node_modules/typescript/bin/tsc --rootDir source/ --outDir distrib/  source/*.ts source/host/*.ts source/os/*.ts

#Run the latest deployment of the OS
os_latest: 
	@docker run --rm --name dos_prod -p80:80 dgisolfi/dos

# build development enviorment
dev_os: intro
	@docker run -it --rm --name dos_dev -p80:80 -v ${PWD}:/OS dos bash

#rebuild image
build_os: intro
	@docker build -t dos .

#Push Docker image to Docker Hub
publish_os: build_os
	@docker tag dos dgisolfi/dos:latest
	@docker push dgisolfi/dos