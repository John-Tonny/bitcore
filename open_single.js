var Client = require('bitcore-wallet-client/index').default;

var fs = require('fs');
var BWS_INSTANCE_URL = 'http://localhost:3232/bws/api'

var client = new Client({
  baseUrl: BWS_INSTANCE_URL,
  verbose: false,
});

var ret = fs.readFileSync("create_single.dat", {encoding:'ascii'});
client.fromString(ret);

console.log("##########credentials#############");
console.log(client.credentials);
console.log("###############");

client.openWallet(function(err, ret) {
  if (err) {
    console.log('error: ', err);
    return
  };
  console.log("\nopen wallet status:", ret);

  client.getBalance({}, function(err, amount){
    if (err) {
      console.log('error: ', err);
      return;
    };

    console.log('\nBalance:', amount)
  });
 
  client.createAddress({coin: 'btc', network: 'livenet'},function(err,addr){
    if (err) {
      console.log('create address error: ', err);
      return;
    };
    console.log('\nAddress:', addr)
  });
});

