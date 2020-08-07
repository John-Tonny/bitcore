#!/bin/bash

cd /home/john/bitcore/packages/bitcore-wallet-service

stop_program ()
{
  pidfile=$1

  echo "Stopping Process - $pidfile. PID=$(cat $pidfile)"
  kill -9 $(cat $pidfile)
  rm $pidfile
  
}

stop_program $1

