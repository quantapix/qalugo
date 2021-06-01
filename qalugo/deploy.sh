#!/bin/bash
set -x -e -u -o pipefail

deploy() {
    rm -rf public/
    HUGO_ENV="production" hugo --gc || exit 1
    s3deploy -source=public/ -region=eu-west-1 -bucket=bep.is -distribution-id=E8OKNT7W9ZYZ2 -path temp/td
    aws s3 cp _site s3://femfas.com/ --acl public-read --recursive
}

show_usage() {
    echo "Usage: $(basename "$0") [-u]"
}

main() {
    local OPTIND=1
    while getopts "h" opt; do
	      case $opt in
	          *) show_usage; return 1;;
	      esac
    done
    shift $((OPTIND-1))
    deploy
}

main "$@"
