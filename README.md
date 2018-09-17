# DOS

A Typescript OS created for Fall 2018 Operating Systems class. The boilerplate for this project can be found in the [TSOS](https://github.com/AlanClasses/TSOS) repository created by Alan Labouseur. The name of this OS refers to not only my first initial but also the well known DOS attack (clever naming is hard).

### Releases 

[iProject 1](https://github.com/dgisolfi/DOS/tree/iProject1)

## Deployment

There are 2 ways currently to deploy an instance of this project. The simplest is the makefile. Either method is valid and results in the same compiled source code.

### Makefile

Using the makefile a target has been created to run the necessary commands in order to compile all source code. Before doing so make sure the TypeScript Compiler is installed, we can do this using `npm`, to install the TypeScript Compiler use the following command:`npm install -g typescript`

After complete, the target named `c` in the makefile can be run. To do so in the directory of the makefile run: `make c`. The result should be compiled source code within the `distrib` directory.

If for some reason this project needs to compile on windows then you can simply run the commands listed under the `c` target within the makefile manually. Next, buy a Mac and have many of the issues you experience as a developer magically disappear.

### Gulp Deployment

We can also use npm and gulp to accomplish the same task. After installing npm you must first install the required dependencies:

First Install the Gulp Task Runner needed for using the included Gulp file: `npm install gulp`

Next, install the  Gulp TypeScript plugin by running `npm install gulp-tsc`

Once complete you can compile the output of all source code by running `gulp` in the directory of the Gulp file.

## Docker Integration

Using Docker you can run the most recent deploy of the DOS as well as a development environment in a container.

### Running Latest Version

To run the latest version of the DOS pushed to Docker Hub execute the following command on a host with Docker installed. 

`docker run --rm --name dos_prod -p80:80 dgisolfi/dos`

Alternatively, you can run the dedicated make target for this command: `make os_latest`

### OS Development Enviorment

Using Docker a development and testing environment can be created. To do so you can run the following commands in the root of this directory:

* First build the image:`docker build -t dos .`

* Then run the image as a container `docker run -it --rm --name dos_dev -p80:80 dos bash`

The result of this command is root access to the newly created container. where you can run either the make target `c` or `gulp` to compile the code. In either case, DOS should be accessible from port 80.

If you would like to run a development version where the changes made on the host machine are reflected live within the container we must use volume mounting. To do so run the following docker command(If the image has not been built still run the docker build command from above):

`docker run -it --rm --name dos_dev -p80:80 -v/PATH/TO/SRC/DIR:/OS dos bash`

Alternatively, you can run the dedicated make target for this command: `make dev_os`