#!/bin/bash

# Define the path to the Angular project
ANGULAR_PROJECT_PATH="./front-end-v0.2"

# Define the path to the deployment directory
DEPLOYMENT_DIR="/var/www/html"

# Function to build the Angular application
build_angular_app() {
    echo "Building Angular application..."
    cd $ANGULAR_PROJECT_PATH || exit
    npm install
    npm run build --prod
    cd -
}

# Function to deploy the built files to the specified directory
deploy_to_directory() {
    echo "Deploying built files to $DEPLOYMENT_DIR..."
    rm -rf $DEPLOYMENT_DIR/*
    cp -R $ANGULAR_PROJECT_PATH/dist/* $DEPLOYMENT_DIR
}

# Function to check for changes in the Git repository
check_git_changes() {
    echo "Checking for changes in the Git repository..."
    
    git pull origin master

    # Get the commit hash of the latest commit
    HEAD_COMMIT=$(git rev-parse HEAD)

    # Get the commit hash of the remote origin/master
    ORIGIN_MASTER_COMMIT=$(git rev-parse origin/master)

    # Check if the latest commit hash is different from the remote origin/master
    if [ "$HEAD_COMMIT" != "$ORIGIN_MASTER_COMMIT" ] || [ -n "$(git status --porcelain)" ]; then
        echo "Changes detected in the Git repository."
        return 0  # Changes detected
    else
        echo "No changes in the Git repository."
        return 1  # No changes
    fi
}

# Check if the Angular project path exists
if [ ! -d $ANGULAR_PROJECT_PATH ]; then
    echo "Angular project not found in the specified path: $ANGULAR_PROJECT_PATH"
    exit 1
fi

# Main script logic
case "$1" in
    build)
        if check_git_changes; then
            build_angular_app
        else
            echo "Skipping build as there are no changes in the Git repository."
        fi
        ;;
    deploy)
        if check_git_changes; then
            build_angular_app
            deploy_to_directory
        else
            echo "Skipping deploy as there are no changes in the Git repository."
        fi
        ;;
    *)
        echo "Usage: $0 {build|deploy}"
        exit 1
        ;;
esac
