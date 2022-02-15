#! /bin/bash
./node_modules/.bin/node-pre-gyp install --directory=./node_modules/sqlite3 --target_platform=darwin --target_arch=x64 --target=7.10.0 --update-binary
./node_modules/.bin/node-pre-gyp install --directory=./node_modules/sqlite3 --target_platform=win32 --target_arch=x64 --target=7.10.0 --update-binary
./node_modules/.bin/node-pre-gyp install --directory=./node_modules/sqlite3 --target_platform=linux --target_arch=x64 --target=7.10.0 --update-binary