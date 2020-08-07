#!/bin/sh

rm -rf packages/bitcore-mnemonic/node_modules/vircle-lib
cd packages/bitcore-mnemonic/node_modules
ln -s ../../vircle-lib ./vircle-lib

rm -rf packages/bitcore-client/node_modules/crypto-wallet-core
rm -rf packages/bitcore-client/node_modules/vircle-lib
cd ../../bitcore-client/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../vircle-lib ./vircle-lib

rm -rf packages/bitcore-node/node_modules/crypto-wallet-core
rm -rf packages/bitcore-node/node_modules/vircle-lib
rm -rf packages/bitcore-node/node_modules/bitcore-client
rm -rf packages/bitcore-node/node_modules/bitcore-p2p
rm -rf packages/bitcore-node/node_modules/bitcore-wallet-client
cd ../../bitcore-node/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../vircle-lib ./vircle-lib
ln -s ../../bitcore-client ./bitcore-client
ln -s ../../bitcore-p2p ./bitcore-p2p
ln -s ../../bitcore-wallet-client ./bitcore-wallet-client

rm -rf packages/bitcore-p2p/node_modules/vircle-lib
cd ../../bitcore-p2p/node_modules
ln -s ../../vircle-lib ./vircle-lib

rm -rf packages/bitcore-wallet/node_modules/bitcore-wallet-client
rm -rf packages/bitcore-wallet/node_modules/vircle-lib
cd ../../bitcore-wallet/node_modules
ln -s ../../bitcore-wallet-client ./bitcore-wallet-client
ln -s ../../vircle-lib ./vircle-lib

rm -rf packages/bitcore-wallet-client/node_modules/crypto-wallet-core
rm -rf packages/bitcore-wallet-client/node_modules/bitcore-mnemonic
rm -rf packages/bitcore-wallet-client/node_modules/bitcore-wallet-service
cd ../../bitcore-wallet-client/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../bitcore-mnemonic ./bitcore-mnemonic
ln -s ../../bitcore-wallet-service ./bitcore-wallet-service

rm -rf packages/bitcore-wallet-service/node_modules/crypto-wallet-core
rm -rf packages/bitcore-wallet-service/node_modules/vircle-lib
cd ../../bitcore-wallet-service/node_modules
ln -s ../../crypto-wallet-core ./crypto-wallet-core
ln -s ../../vircle-lib ./vircle-lib

rm -rf packages/crypto-wallet-core/node_modules/vircle-lib
cd ../../crypto-wallet-core/node_modules
ln -s ../../vircle-lib ./vircle-lib


