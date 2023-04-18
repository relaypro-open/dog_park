PACKAGE=dog_park

all: build-react package

.PHONY: build
build: clean docker-build package

.PHONY: docker-build
docker-build:
	@(docker build --rm -t dog_park_build .)

build-react:
	test -d dog_park || mkdir dog_park
	yarn install
	./build-$(BUILD_ENV).sh
	cp -r build dog_park/

package:
	cp Makefile-configure dog_park/Makefile
	cd dog_park; tar --exclude="build/service-worker.js" -czvf dog_park-$(BUILD_ENV)-$(BUILD_ID).tar.gz *; cp dog_park-*.tar.gz ../

clean:
	test -d dog_park || rm -rf dog_park 
	test -e dog_park-*.tar.gz || rm dog_park-*.tar.gz
