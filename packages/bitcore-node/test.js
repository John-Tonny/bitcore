var bitcore = require('vircle-lib');
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;

var buffer = require('buffer');
var p2p = require('bitcore-p2p')
var Peer = p2p.Peer;

// var peer = new Peer({host: '127.0.0.1'});
var peer = new Peer({host: '52.82.67.41'});
// var peer = new Peer({host: '52.82.14.25'});
// var peer = new Peer({host: '47.104.25.28'});
// var peer = new Peer({host: '192.168.246.187'});
var Messages = peer.messages;

peer.on('ready', function() {
  // peer info
  console.log(peer.version, peer.subversion, peer.bestHeight);

  console.log("send ping");
  var date = new Date();
  var time = Math.floor(date.getTime()/1000);
  peer.sendMessage(Messages.Ping(get_int64(time).concat()));

  peer.sendMessage(Messages.GetAddr());

  // peer.sendMessage(Messages.Dseg({hash: '61c6464b14f70a82320a34d526348675b74d84077393df3195f9b00cae745ce6', n: 1}));

  // 主节点广播
  var buf = new BufferWriter();
  var reader = new BufferReader(buffer.Buffer.from('e65c74ae0cb0f99531df937307844db775863426d5340a32820af7144b46c6610100000000000000000000000000ffffa1bd62b326ac210266e6ea2505326eb405e8019270c8ffa43a05dc79e1079eaf079457ede4b48c3e4104703e2950e6514c0c4d3c1542d65ec468194d417d18724d23b1c5b491cc958c37518168adfb8b53323ec6638ce432d9193dc947b61760e32ae10b5691ea73b7f5411f3a69e0a140d7e6840a764c8e6615611a11dfe4150a1047882e0554eba4beffaf63ea20963105f28346eb10c3520ac43c43bc80b03e3f6bd4fbb50ae13f917c4f722b365f00000000387c0000e65c74ae0cb0f99531df937307844db775863426d5340a32820af7144b46c661010000009ff43c2e5b8ab3e708291acc658ee064a5469fd8f0bf145cc902b64804000000722b365f00000000411b2353b86b55d757a8f7bfefea93cb1bf4a07e55acf367b32a3112070f12762fec238e3bbe0e4668eeb326f66fee4e2254fb16ba021c1356080f5b4810296ac2d70140420f000f6a0f0000000000', 'hex'));
  buf.write(reader.read(387));
  // peer.sendMessage(peer.messages.Mnbroadcast(buf.concat()));

  // peer.sendMessage(Messages.GetData.forMasternodeAnnounce('1748f0f6ad3471456c8f0a1c0329187c795eb327068ec85e876bf71e8b44bd3a'));

  // 转账
  // var transaction = new bitcore.Transaction('020000000186113ec357d2d7b0dd5c1bbc3db2c4e3dd6e57631dc2479ebd1edab0bd3c093a010000006a4730440220391b03aaaeb6df232d1acfb7fe1cdd241817dfc731b726a9c3d879bf322dede402202e79431beb655e5d2a995d434115cae9905635576c359f716296e4133dbcb691012102348b9998d529553f7d579eb8f219c939ee2572a82ba44d764fe53a1c622188f9feffffff02468f4300000000001976a91402d7ad891b7f06d3295aa7f13e385681a56eb95f88ac7c56fe01000000001976a914a4f38a1503cda15a52810ee689235b644ad3139a88ac1cd90100');
  // var message1 = peer.messages.Transaction(transaction);
  // peer.sendMessage(message1);
});

peer.on('disconnect', function() {
  console.log('connection closed');
});
peer.on('connect', function() {
  console.log('connected');
});

// handle events
peer.on('inv', function(message) {
  console.log("#####inv#####");
  // console.log(message);

  message.inventory.forEach(function(inventory) {
    if (inventory.type == 7) {
      console.log("masternode payment vote:", inventory);
    }else if (inventory.type == 1) {
      console.log("tx:", inventory.hash.reverse().toString('hex'));
    }else if (inventory.type == 2) {
      console.log("blockhash:", inventory.hash.reverse().toString('hex'));
    }else if (inventory.type == 3) {
      console.log("filter block:", inventory);
    }else if (inventory.type == 4) {
      console.log("compact block:", inventory);
    }else if (inventory.type == 8) {
      console.log("masternode payment block:", inventory);
    }else if (inventory.type == 10) {
      console.log("masternode announce:", inventory);
      peer.sendMessage(Messages.GetData.forMasternodeAnnounce(inventory.hash.reverse().toString('hex')));
    }else if (inventory.type == 11) {
      console.log("masternode ping:", inventory);
      var msg = Messages.GetData.forMasternodePing(inventory.hash.reverse().toString('hex'));
      // peer.sendMessage(msg);
    }else if (inventory.type == 14) {
      console.log("masternode verify:", inventory);
    }
    // do something
  });

  // message.inventory[]
});
peer.on('tx', function(message) {
  console.log("#####tx#####");
  console.log(message);
  // message.transaction
});

peer.on('addr', function(message) {
  message.addresses.forEach(function(address) {
    // do something
    // console.log(address);
  });

  console.log("receive getaddr");

  /*
  var buf = new BufferWriter();
  get_int32(70015, buf);
  buf.writeVarintNum(1);

  var reader = new BufferReader(buffer.Buffer.from('00000bd8e8ed1ce55fd167c48c2f063744df71041bc2a562c39093f4289d316e', 'hex'));
  buf.write(reader.read(32));
  var stop = new BufferReader(buffer.Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'));
  buf.write(stop.read(32));
  var message1 = new Messages()._buildFromBuffer('getblocks', buf.concat());
  peer.sendMessage(message1);
  */

  var arg ={
    starts: ['0000000166523b6d6bb950e3b184746030f90c8b6bed718c9770ccc89fe3056b ']
  };
  peer.sendMessage(Messages.GetBlocks(arg));

  peer.sendMessage(Messages.GetHeaders(arg));

  var arg1 =[{
    type: 2,
    hash: new BufferReader(buffer.Buffer.from('0000000d936bd198f5bceb71136b230a823a4c4d18712eb81bd7c68aff64bd41', 'hex')).read(32)
  }];
  // peer.sendMessage(Messages.GetData.forBlock('0000000d936bd198f5bceb71136b230a823a4c4d18712eb81bd7c68aff64bd41'););

  // peer.sendMessage(peer.messages.GetData.forTransaction('82b975a29c8b8cbc614515401041dee5b13be9e2eba91e52f610dc1e2726827c'));

});

peer.on('mnb', function(message) {
    console.log("#####mnb#####");
    console.log(message.rawTx.toString('hex'));
    // message.transaction
});

peer.on('mnp', function(message) {
  console.log("#####mnp#####");
  console.log(message);
  // message.transaction
});

peer.on('pong', function(message) {
  console.log("#####pong#####");
  console.log(message);
  // message.transaction
});

peer.on('tx', function(message) {
  console.log("#####tx#####");
  console.log(message);
  // message.transaction
});

peer.on('block', function(message) {
  console.log("#####block#####");
  console.log(message);
  // message.transaction
});

peer.on('headers', function(message) {
  console.log("#####header#####");
  // console.log(message);
  // message.transaction
  message.headers.forEach(function(header) {
    // do something
    console.log(header);
  });
});


peer.connect();

function get_int64(value) {
  const MAX_UINT32 = 0xffffffff;
  var buf = new BufferWriter();
  const high = parseInt((value / MAX_UINT32).toString());
  const low = (value % MAX_UINT32) - high;
  buf.writeUInt32LE(low);
  buf.writeUInt32LE(high);
  return buf;
}

function get_int32(value, buf) {
  if (buf == undefined){
    buf = new BufferWriter();
  }
  buf.writeUInt32LE(value);
  return buf;
}

/*

    UNDEFINED = 0,
    MSG_TX = 1,
    MSG_BLOCK = 2,
    // The following can only occur in getdata. Invs always use TX or BLOCK.
    MSG_FILTERED_BLOCK = 3,  //!< Defined in BIP37
    MSG_CMPCT_BLOCK = 4,     //!< Defined in BIP152
    // Syscoin message types
    // NOTE: declare non-implmented here, we must keep this enum consistent and backwards compatible
    MSG_SPORK = 6,
    MSG_MASTERNODE_PAYMENT_VOTE = 7,
    MSG_MASTERNODE_PAYMENT_BLOCK = 8,
    MSG_MASTERNODE_ANNOUNCE = 10,
    MSG_MASTERNODE_PING = 11,
    MSG_GOVERNANCE_OBJECT = 12,
    MSG_GOVERNANCE_OBJECT_VOTE = 13,
    MSG_MASTERNODE_VERIFY = 14,
    MSG_WITNESS_BLOCK = MSG_BLOCK | MSG_WITNESS_FLAG, //!< Defined in BIP144
    MSG_WITNESS_TX = MSG_TX | MSG_WITNESS_FLAG,       //!< Defined in BIP144
    MSG_FILTERED_WITNESS_BLOCK = MSG_FILTERED_BLOCK | MSG_WITNESS_FLAG,



 */