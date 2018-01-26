#!/bin/bash

#nohup npm start &> $HOME/logs/gzoom2-app.out &
nohup ng serve -ec=true --proxy-config proxy.config.json --host 0.0.0.0 &> $HOME/logs/gzoom2-app.out &
cpid=$!
echo "Gzoom 2 frontend started with PID: $cpid"
echo $cpid > $HOME/logs/gzoom2-app.pid



