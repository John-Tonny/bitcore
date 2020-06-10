var Client = require('bitcore-wallet-client/index').default;


var fs = require('fs');
var BWS_INSTANCE_URL = 'http://localhost:3232/bws/api'

// Generates a new extended private key
var ireneKeys = Client.Key.create();
console.log(ireneKeys);
var ret1 = JSON.stringify(ireneKeys);
fs.writeFileSync('create_key_single.dat', ret1);

var client = new Client({
  baseUrl: BWS_INSTANCE_URL,
  verbose: false,
});

let cred = ireneKeys.createCredentials(null, { coin: 'btc', network: 'livenet', account: 0, n: 1, addressType: 'P2PKH' });
client.fromObj(cred);
console.log("################");
console.log(client.credentials);

client.createWallet("My Wallet", "Irene", 1, 1, {network: 'livenet'}, function(err, secret) {
  if (err) {
    console.log('create wallet error: ',err);
    return
  };
  // Handle err
  console.log('Wallet Created. Share this secret with your copayers: ' + secret);
  var ret = JSON.stringify(client.credentials); 
  fs.writeFileSync('create_single.dat', ret);
  
  console.log("\ncreate wallet success");

  client.openWallet(function(err, ret) {
    if (err) {
      console.log('open wallet error: ', err);
      return
    };
    console.log("\nopen wallet status:", ret);
     
    client.createAddress({coin: 'btc', network: 'livenet'},function(err,addr){
      if (err) {
        console.log('create address error: ', err);
        return;
      };
      console.log('\nAddress:', addr)
    });
       
    client.getBalance({}, function(err, amount){
      if (err) {
        console.log('get balance error: ', err);
        return;
      };
      console.log('\nBalance:', amount)
    });
  });
});
