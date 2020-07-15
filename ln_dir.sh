#!/bin/sh

cd packages/bitcore-mnemonic/node_modules
ln -s ../../vircle-lib ./vircle-lib

cd ../../
cd bitcore-node/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../vircle-lib ./vircle-lib

cd ../../
cd bitcore-p2p/node_modules
ln -s ../../vircle-lib ./vircle-lib

cd ../../
cd bitcore-wallet/node_modules
ln -s ../../bitcore-wallet-client ./bitcore-wallet-client
ln -s ../../vircle-lib ./vircle-lib

cd ../../
cd bitcore-wallet-client/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core

cd ../../
cd bitcore-wallet-service/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../vircle-lib ./vircle-lib

cd ../../
cd crypto-wallet-core/node_modules
ln -s ../../vircle-lib ./vircle-lib


