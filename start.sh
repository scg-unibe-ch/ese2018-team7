#!/bin/sh

#install backend with nodemon
echo -e '\033]2;ESE - Team 7 - Install Backend\007'

cd backend
npm install -g nodemon
npm install
cd ..
clear

#install frontend with angular
echo -e '\033]2;ESE - Team 7 - Install Frontend\007'

cd frontend
npm install -g @angular/cli
npm install
ng add @angular/material
cd ..
clear

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


