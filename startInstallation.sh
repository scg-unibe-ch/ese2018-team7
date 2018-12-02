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
cd ..
clear

#Start
start bash ./start.sh
