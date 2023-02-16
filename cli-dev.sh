#!/bin/bash

CATEGORY="$1"

ACTION="$2"

if [ $CATEGORY == "clean" ]; then
    if [ $ACTION == "yarn" ]; then
        echo "Yarn garbage collection started"
        echo ""
        echo "  - dropping node_modules folder..."
        rm -rf node_modules
        echo "    Done"
        echo "  - removing .yarn cached files..."
        rm -rf .yarn/cache .yarn/build-state.yml .yarn/install-state.gz
        echo "    Done"
        echo "  - cleaning yarn cache..."
        yarn cache clean --all
        printf "  Done\n\n"
        echo "All done!"
    fi
fi

if [ $CATEGORY == "ci" ]; then
    echo "Yarn pre-deploy garbage collection started"
    echo ""
    bash cli-dev.sh clean yarn
    echo ""
    echo "Running yarn install (without modifying yarn.lock)"
    yarn install --check-cache
    echo "Done"
fi
