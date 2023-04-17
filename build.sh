#!/bin/bash

################################################################################
#                                                                              #
# Usage:                                                                       #
#                                                                              #
# ./build.sh                - building in development (simple merging)         #
# ./build.sh production     - building in production (with compressing)        #
#                                                                              #
################################################################################

################################################################################
### Paths

APP_PATH=`pwd`
CLOSURE_LIB="./lib/google-closure-library/closure"
COMPILER="./node_modules/google-closure-compiler/compiler.jar"
################################################################################
### Options

closure_options="-o script"
less_options=""

if [ $# -ne 2 ]
then
	if [[ "$1" = "production" ]]
	then
		closure_options="-o compiled -c ${COMPILER} -f --strict_mode_input=false -f --process_closure_primitives=false"
		less_options="--compress"
	fi
fi

################################################################################
### Helpers

status () {
	if [ $? -gt 0 ]; then
		echo -ne "[\e[1;31mERROR\e[m]\n"
		exit 1
	else
		echo -ne "[\e[1;32mOK\e[m]\n"
	fi
}

################################################################################
### Building

echo "==== Compiling JavaScript ======================================================"
python2 ${CLOSURE_LIB}/bin/calcdeps.py -i ${APP_PATH}/lib/js/jquery-ui-1.8.23.custom.js -i ${APP_PATH}/lib/js/jquery.ui.colorPicker.js -i ${APP_PATH}/js/main.js -p ${CLOSURE_LIB} ${closure_options} > ${APP_PATH}/js/compiled.js
status

echo "==== Compiling LESS ============================================================"
lessc ${APP_PATH}/less/main.less ${APP_PATH}/css/_compiled_main.css ${less_options}
status

echo "==== Merging CSS ==============================================================="
echo "===> jquery-ui => merged.css"
cat ${APP_PATH}/css/jquery-ui-1.8.23.custom.css > ${APP_PATH}/css/merged.css
status
echo "===> jquery.ui.colorPicker => merged.css"
cat ${APP_PATH}/css/jquery.ui.colorPicker.css >> ${APP_PATH}/css/merged.css
status
echo "===> _compiled_main => merged.css"
cat ${APP_PATH}/css/_compiled_main.css >> ${APP_PATH}/css/merged.css
status

echo "==== Replcacing JS timestamp  =================================================="
echo "===> Get compiled.js modification date"
MERGED_JS_MODIFICATION_TIME=`date -r js/compiled.js +"%s"`
status
echo "===> substitute compiled.js timestamp with $MERGED_JS_MODIFICATION_TIME"
sed -i "s/compiled.js?modified=[0-9]*/compiled.js?modified=$MERGED_JS_MODIFICATION_TIME/" index.html
status

echo "==== Replcacing JS timestamp  =================================================="
MERGED_CSS_MODIFICATION_TIME=`date -r css/merged.css +"%s"`
status
echo "===> substitute merged.css timestamp with $MERGED_CSS_MODIFICATION_TIME"
sed -i "s/merged.css?modified=[0-9]*/merged.css?modified=$MERGED_CSS_MODIFICATION_TIME/" index.html
status
