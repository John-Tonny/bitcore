#!/home/john/.nvm/versions/node/v10.5.0/bin/node

const Client = require('bitcore-wallet-client/index').default;
const nodemailer = require("nodemailer");
const async = require('async');
const sd = require('silly-datetime');
const fs = require('fs')
const _ = require('lodash')
const request = require('request'); 

const workPath = '/home/john/monit';

const block_delay = 1200;

var sendNums = 0;
var errNames = []; 
var send1Nums = 0;
var err1Names = []; 

readStatus();
readExplorer();

var bws_api = ':3232/bws/api';
var explorer_api = ':8200/api/VCL/mainnet/block/tip';

var wallet_word = 'bone casual observe virus prepare system aunt bamboo horror police vault floor';
var all_ip = [
  'http://52.82.67.41',        		// 维公链
  'http://8.129.2.199',			// 送多多
  'http://47.118.59.228',		// 竞德链
  'http://118.31.245.212',       	// 酒交所
  //'http://116.62.53.102',        	// 明涬链
  'http://101.37.86.246',		// 德亿链
  'http://47.98.45.255',		// 玖合链
  'http://115.29.178.38',		// 爱链
  'http://8.136.100.217',		// 链美
  'http://8.136.137.159',		// 渝公链 
  'http://47.114.57.42',		// 国度链
  'http://8.136.121.88',		// 安食链
  'http://47.98.180.101',		// 轩古链
  'http://39.101.201.121',		// 链爱链
  'http://121.41.93.22',		// 唯爱链
  'http://8.136.246.174',		// 新奥莱
  'http://112.124.64.12',		// 再平衡
  'http://8.136.247.22',		// 鹿小麦
]
var ip_to_name = {
  'http://52.82.67.41':     	'维公链',
  'http://8.129.2.199':     	'送多多',
  'http://47.118.59.228':   	'竞德链',
  'http://118.31.245.212':  	'酒交所',
  // 'http://116.62.53.102':   	'明涬链',
  'http://101.37.86.246':       '德亿链',
  'http://47.98.45.255':        '玖合链',
  'http://115.29.178.38':       '爱链',
  'http://8.136.100.217':       '链美',
  'http://8.136.137.159':       '渝公链',
  'http://47.114.57.42':        '国度链',
  'http://8.136.121.88':        '安食链',
  'http://47.98.180.101':       '轩古链',
  'http://39.101.201.121':      '链爱链',
  'http://121.41.93.22':        '唯爱链',
  'http://8.136.246.174':       '新奥莱',
  'http://112.124.64.12':       '再平衡',
  'http://8.136.247.22':        '鹿小麦',
}

var funcWallets = new Array();
var funcExplorers = new Array();

var smtp = "smtp.tom.com";
// var mailFrom = "jlw2020@tom.com";
var mailFrom = "jlwkk99@tom.com";
var mailPwd = "jlw9090";

function emailTo(email,subject,text,html,callback) {
    var transporter = nodemailer.createTransport({
        host: smtp,
	port: 25,
        auth: {
            user: mailFrom,
            pass: mailPwd //授权码        
	}
    });
    var mailOptions = {
        from: mailFrom, // 发送者
        to: email, // 接受者,可以同时发送多个,以逗号隔开
        subject: subject, // 标题
    };
    if(text != undefined)
    {
        mailOptions.text = text;// 文本
    }
    if(html != undefined)
    {
        mailOptions.html = html;// html
    }
    var result = {
        httpCode: 200,
        message: '发送成功!',
    }
    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                result.httpCode = 500;
                result.message = err;
                callback(result);
                return;
            }
            callback(result);
        });
    } catch (err) {
        result.httpCode = 500;
        result.message = err;
        callback(result);
    }
}

const getExplorer = function (explorerUrl, retrys, cb) { 
  request(explorerUrl, function (error, response, body) {
    let result = {
      url: explorerUrl,
      data: null,
      error: null
    };
    if (!error && response.statusCode == 200) {
      let block = JSON.parse(body);
      let arrDate = block.time.split('T');
      let arrTime = arrDate[1].split('Z'); 
      let time = arrDate[0] + ' ' + arrTime[0];
      let date = (new Date(Date.parse(time.replace(/-/g,"/")))).getTime() / 1000;
      let currDate = new Date().getTime() / 1000;
      if(currDate - date >= block_delay){
	result.error = 'block delay';
      }else{
	result.data = body;
      }
      cb(null, result);
    }else{
      if(retrys<2){
        setTimeout(getExplorer, 5000, explorerUrl, retrys+1, cb);
      }else{
	result.error = 'timeout';
	cb(null, result);
      }
    }
  });
}

const getStatus = function (bwsUrl, word, cb) {
  let key = Client.Key.fromMnemonic(word);
  let client = new Client({
    baseUrl: bwsUrl,
    verbose: false,
  });

  let cred = key.createCredentials(null, { coin: 'vcl', network: 'livenet', account: 0, n: 1});
  client.fromObj(cred);

  let ret = {
    url: bwsUrl,
    data: null,
    error: null
  };

  async.series(
    [
      next => {
        client.openWallet(function(err, result){  
          if (err){ 
	    ret.error = err;
	    return cb(null, ret);
	  }
	  next();
	});
      },
      next => {
        client.getBalance({}, function(err, result){  
          if (err){
	    ret.error = err;
 	    return cb(null, ret);
	  }
	  next(null, result);
	});
      }
    ],
    (err, result) => {
      if (err){
	ret.error = err;
      }else{
	ret.data = result;
      }
      return cb(null, ret);
    }
  );
}

function getName(url) {
  let index = 0;
  for(ip of all_ip){
    if(url.search(ip) != -1){
      return ip_to_name[all_ip[index]];
    }
    index +=1;
  }
  return '';
}


function readStatus() {
  try {
    let data = fs.readFileSync(workPath + '/status.txt','utf-8');
    let arrs = data.toString().split(",");
    if(arrs.length >= 2 ){
      sendNums = Number(arrs[0]);
      errNames = arrs[1].split('|');
    }
  }catch(e){
    sendNums = 0;
    errNames = [];
  }
}

function writeStatus(data) {
  fs.writeFileSync(workPath + '/status.txt' ,data);
}

function readExplorer() {
  try {
    let data = fs.readFileSync(workPath + '/explorer.txt','utf-8');
    let arrs = data.toString().split(",");
    if(arrs.length >= 2 ){
      send1Nums = Number(arrs[0]);
      err1Names = arrs[1].split('|');
    }
  }catch(e){
    send1Nums = 0;
    err1Names = [];
  }
}

function writeExplorer(data) {
  fs.writeFileSync(workPath + '/explorer.txt' ,data);
}

var all_ip_wallet = all_ip.concat();
var all_ip_explorer = all_ip.concat();

const startMonitExplorer = function(retrys) {
  for(var k=0; k<all_ip.length; k++){
    funcExplorers[k] = (callback) => {
    let url = all_ip_explorer.pop() + explorer_api;
      getExplorer(url, 0, function(err, result){
        callback(err, result);
      });
    }
  }

  async.parallel(funcExplorers, function (err, results){
    var myarr = [];
    var myNames = '';
    if(err){
      console.log("error:", err);
    }else{
      // console.log(results);
      for(result of results) {
        if(result.error != null) {
          myarr.push(result.url);
          if(myNames.length == 0){
            myNames = getName(result.url);
          }else{
            myNames = myNames + '|' + getName(result.url) ;
          }
        }
      }
    }

    if (myarr.length > 0){
      if(retrys<2){
	all_ip_explorer = all_ip.concat();
        setTimeout(startMonitExplorer, 5000, retrys+1);
        return;
      }
      let arr1Names = myNames.split('|');
      if(!(_.isEqual(err1Names, arr1Names)) || send1Nums <= 3){
        emailTo("szlhtao@tom.com", "monit explorer", myarr.toString(), "", function(result){
          console.log("explorer", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),result);
          send1Nums = send1Nums + 1;
          writeExplorer(send1Nums.toString() + ',' + myNames);
        });
      }else{
        console.log("explorer", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), myarr.toString());
      }
    }else{
      // silly-datetime 当前时间格式化
      console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),"all of block time is good！");
      writeExplorer('0,');
    }
  });
}

const startMonitWallet = function(retrys) {
  for(var i=0; i<all_ip.length; i++){
    funcWallets[i] = (callback) => {
    let url = all_ip_wallet.pop() + bws_api;
      getStatus(url, wallet_word, function(err, result){
        callback(err, result);
      });
    }
  }

  async.parallel(funcWallets, function (err, results){
    var myarr = [];
    var myNames = '';
    if(err){
      console.log("error:", err);
    }else{
      // console.log(results);
      for(result of results) {
        // console.log("result", result);
 	if(result.error != null) {
          myarr.push(result.url);
          if(myNames.length == 0){
            myNames = getName(result.url);
          }else{
            myNames = myNames + '|' + getName(result.url) ;
          }
        }
      }
    }
    
    if (myarr.length > 0){
      let arrNames = myNames.split('|');
      if(!(_.isEqual(errNames, arrNames)) || sendNums <= 3){
        emailTo("szlhtao@tom.com", "monit copayer", myarr.toString(), "", function(result){
          console.log("wallet", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),result);
          sendNums = sendNums + 1;
          writeStatus(sendNums.toString() + ',' + myNames);
        });
      }else{
        console.log("wallet", sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),  myarr.toString());
      }
    }else{
      // silly-datetime 当前时间格式化
      console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),"all of wallet service is good！");
      writeStatus('0,');
    }
  });
}


startMonitExplorer(0);
startMonitWallet(0);


