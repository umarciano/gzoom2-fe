#!/bin/bash

function abspath() {
  perl -MCwd -le 'print Cwd::abs_path(shift)' "$1"
}

sd=$(cd $(dirname -- $(abspath "$0")) && pwd -P)

clean_node_val=
clean_node=0
simulate=0

function usage() {
    echo "Usage: $0 [-n <true|false>] [-s]"
    exit 1
}

while getopts ':n:s' o; do
    case "${o}" in
        n) clean_node_val="$OPTARG" ;;
        s) simulate=1 ;;
        *) usage ;;
    esac
done

case "$clean_node_val" in
1|true|ok|y) clean_node=1 ;;
esac

if [ $simulate = 0 ]; then
    pushd "$sd/../app"
    [ $clean_node = 1 ] && rm -fr node_modules
    npm install
    npm build
    popd
else
    echo $(date '+%T') cd $(dirname $0)/..
    echo $(date '+%T') "[ $clean_node = 1 ] && rm -fr node_modules"
    echo $(date '+%T') npm install
    echo $(date '+%T') npm build
fi

