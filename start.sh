#!/bin/sh


#start backend
echo -e '\033]2;ESE - Team 7 - Start Backend\007'


#Autocompile backend
start bash ./startBackendCompile.sh

sleep 3

#Auto refresh backend
start bash ./startBackendRun.sh


#start frontend
echo -e '\033]2;ESE - Team 7 - Start Frontend\007'

start bash ./startFrontendRun.sh


