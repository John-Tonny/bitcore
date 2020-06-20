var Client = require('bitcore-wallet-client/index').default;

var fs = require('fs');
var BWS_INSTANCE_URL = 'http://localhost:3232/bws/api'

var tx = {
  toAddress: 'SfZKSG2xHe86vy1cTCd1Egdvd1EfBU7rtY',
  amount: 550000,
  txp: {}
};

tx.origToAddress = tx.toAddress;
tx.feeLevel = 'superEconomy';
tx.feeLevelName = "superEconomy";

var opts = {
  dryRun: false,
  excludeUnconfirmedUtxos: true,
  // sendMax: true, 
  // feeLevel: 'superEconomy', 
  color: 'btc',
  network: 'livenet',
  feePerKb: 10000,
  message: tx.description
};

opts.outputs = [{
                    toAddress: tx.toAddress,
                    amount: tx.amount,
                    message: tx.description,
  		    feeLevelName: 'superEconomy'
                 }];


var client = new Client({
  baseUrl: BWS_INSTANCE_URL,
  verbose: false,
});

var ret = fs.readFileSync("create_single_segwit.dat", {encoding:'ascii'});
client.fromString(ret);
console.log("##########credentials#############");
console.log(client.credentials);
console.log("###############");


var xPriv = 'xprv9s21ZrQH143K2UPDWuQcvPNrgj24a9UmdNE3pWz3jPnPEuSN5noB8gXa615DR3FAfVgDzQ5xP4v4pzMebQym38LgYApnR6GBMjJdgZjynor';
var key = Client.Key.fromExtendedPrivateKey(xPriv);


client.openWallet(function(err, ret) {
  if (err) {
    console.log('error: ', err);
    return
  };
  console.log("\nopen wallet status:", ret);

  client.createTxProposal(opts,function(err, createtxp){
    if(err){
      console.log(err);
      return;
    }
    console.log(createtxp);
    client.publishTxProposal({txp:createtxp}, function(err, publishtxp){
      if(err){
        console.log(err);
        return;
      }
      console.log(publishtxp);

      client.getTxProposals({}, (err, txps) => {
        if(err){
          console.log(err);
          return;
        }
        var changeAddress = txps[0].changeAddress.address;

        let signatures = key.sign(client.getRootPath(), txps[0]);
        client.pushSignatures(txps[0], signatures, (err, xx, paypro) => {
          if(err){
            console.log(err);
            return;
          }
	  console.log(xx);
	  /*
          client.broadcastTxProposal(xx, (err, zz, memo) => {
            if(err){
              console.log(err);
              return;
            }
	    console.log(zz);
	    console.log(memo);
          });
	  */
        });
      });
    });
  });
});
