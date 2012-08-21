#!/bin/bash

APP_PATH=`pwd`

##############################################
### Compile JavaScript with Google Closure 

CLOSURE_LIB="../closure"
COMPILER="/usr/share/java/closure-compiler/closure-compiler.jar"

python2 ${CLOSURE_LIB}/bin/calcdeps.py -i ${APP_PATH}/lib/js/jquery-ui-1.8.23.custom.js -i ${APP_PATH}/lib/js/jquery.ui.colorPicker.js -i ${APP_PATH}/js/main.js -p ${CLOSURE_LIB} -o compiled -c ${COMPILER} > ${APP_PATH}/js/compiled.js

##############################################
### Compile LESS

lessc -i ${APP_PATH}/less/main.less -o ${APP_PATH}/css/_compiled_main.css -yui-compress

##############################################
### Merge CSS

cat ${APP_PATH}/css/jquery-ui-1.8.23.custom.css > ${APP_PATH}/css/merged.css
cat ${APP_PATH}/css/jquery.ui.colorPicker.css >> ${APP_PATH}/css/merged.css
cat ${APP_PATH}/css/_compiled_main.css >> ${APP_PATH}/css/merged.css
