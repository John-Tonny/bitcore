#!/bin/bash

USER_PATH=/home/john
npm install nodemailer
npm install silly-datetime
npm install async
npm install request

ln -s $USER_PATH/bitcore/packages/bitcore-wallet-client $USER_PATH/monit/node_modules/bitcore-wallet-client

