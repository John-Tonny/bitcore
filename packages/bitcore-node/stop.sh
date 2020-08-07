#!/bin/bash

stop_program ()
{
  pidfile=$1

  echo "Stopping Process - $pidfile. PID=$(cat $pidfile)"
  kill -9 $(cat $pidfile)
  rm -f $pidfile
  
}


cd /home/john/bitcore/packages/bitcore-node
stop_program bitcore-node.pid

