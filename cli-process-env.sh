#!/bin/bash

ENV_VALUE="$1"
FORCE_REWRITE="$2"
LOCAL_RUN="$3"

# Colors
Red="\033[0;31m"     # Red
Default="\033[1;37m" # White
Green="\033[0;32m"   # Green
Blue="\033[0;34m"    # Blue
BBlue="\033[1;34m"   # Bold Blue

if [ -z $ENV_VALUE ]; then
  ENV_VALUE="dev"
fi

FILE=".env"

printf "\n${BBlue}Configuration:\n\n" "" "$NC"

printf "${Default}   Environment:"
if [ "$ENV_VALUE" != "prod" ]; then
  echo "${Red} dev"
else
  echo "${Green} $ENV_VALUE"
fi

printf "${Default}   Localhost:"

if [ -z $LOCAL_RUN ]; then
  echo "${Green} nope"
else
  echo "${Red} yes"
fi


printf "${Default}   Generate .env anyway:"

if [ -n $FORCE_REWRITE ]; then
  echo "${Red} yes"
else
  echo "${Green} nope"
fi

printf "${BBlue}\nSearching for .env...\n\n"
printf "${Default}   File status: "

if [ -e $FILE ]; then
  echo "${Green}.env found"
else
  echo "${Default}   Configuring .env for $ENV_VALUE build"
  FORCE_REWRITE=1
fi

printf "\n${BBlue}Resolving...\n\n"

if [ -z $FORCE_REWRITE ]; then
  printf "${Default}   No changes made\n\n"
  echo "${Red}   Exiting..."
  exit
else
  printf "${Red}   Overriding found .env\n\n"
fi

GIT_VERSION="APP_GIT_VERSION=$(git tag -l | tail -n1)"
GIT_REVISION="APP_GIT_REVISION=$(git rev-parse --short HEAD)"
GIT_UPDATED_AT="APP_GIT_UPDATED_AT=\"$(git log -1 --format=%cd)\""
APP_ENV="APP_ENV=$ENV_VALUE"

rm -f ./.env &&
  cp ".env.example" ".env" &&
  echo "$GIT_VERSION" >>".env" &&
  echo "$GIT_REVISION" >>".env" &&
  echo "$APP_ENV" >>".env" &&
  echo "$GIT_UPDATED_AT" >>".env"

printf "${BBlue}Defining host...\n\n"

if [ -z $LOCAL_RUN ]; then
  echo "${Green}   Remote host detected."
else
  echo "${Red}   Localhost detected:"
  echo ""
  echo "${Default}   Sentry: ${Red}Disabled"
  echo "${Default}   GTM: ${Red}Disabled"
  echo ""
  echo "IS_LOCALHOST=1" >> ".env"
fi
echo ""
echo "${Green} ✅  Environment configured successfully!"
