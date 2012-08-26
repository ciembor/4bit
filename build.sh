#!/bin/bash

##############################################
### Helpers

status () {
	if [ $? -gt 0 ]; then
		echo -ne "[\e[1;31mERROR\e[m]\n"
		exit 1
	else
		echo -ne "[\e[1;32mOK\e[m]\n"
	fi
}

##############################################
### Paths

APP_PATH=`pwd`
CLOSURE_LIB="../closure"
COMPILER="/usr/share/java/closure-compiler/closure-compiler.jar"

##############################################
### Options

closure_options="-o script"
less_options=""

if [ $# -ne 2 ]
then
	if [[ "$1" = "production" ]]
	then
		closure_options="-o compiled -c ${COMPILER}"
		less_options="-yui-compress"
	fi
fi

##############################################
### Compile JavaScript with Google Closure 

echo "==== Compiling JavaScript ======================================================"
python2 ${CLOSURE_LIB}/bin/calcdeps.py -i ${APP_PATH}/lib/js/jquery-ui-1.8.23.custom.js -i ${APP_PATH}/lib/js/jquery.ui.colorPicker.js -i ${APP_PATH}/js/main.js -p ${CLOSURE_LIB} ${closure_options} > ${APP_PATH}/js/compiled.js
status

##############################################
### Compile LESS

echo "==== Compiling LESS ============================================================"
lessc -i ${APP_PATH}/less/main.less -o ${APP_PATH}/css/_compiled_main.css ${less_options}
status

##############################################
### Merge CSS

echo "==== Merging CSS ==============================================================="
cat ${APP_PATH}/css/jquery-ui-1.8.23.custom.css > ${APP_PATH}/css/merged.css
cat ${APP_PATH}/css/jquery.ui.colorPicker.css >> ${APP_PATH}/css/merged.css
cat ${APP_PATH}/css/_compiled_main.css >> ${APP_PATH}/css/merged.css
status