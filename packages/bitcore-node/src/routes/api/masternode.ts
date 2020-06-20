import { Router } from 'express';
import logger from '../../logger';
import * as _ from 'lodash';
import { ChainStateProvider } from '../../providers/chain-state';

const router = Router({ mergeParams: true });

router.get('/', async (req, res) => {
  let { chain, network} = req.params;

  let utxo = '';
  chain = chain.toUpperCase();
  network = network.toLowerCase();
  try {
    let info = await ChainStateProvider.getMasternodeStatus({ chain, network, utxo });
    return res.send(info);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:utxo', async (req, res) => {
  let { chain, network, utxo } = req.params;
  if (typeof utxo !== 'string' || !chain || !network) {
    return res.status(400).send('Missing required param');
  }

  chain = chain.toUpperCase();
  network = network.toLowerCase();
  try {
    let infos = await ChainStateProvider.getMasternodeStatus({ chain, network, utxo });
    let ret;
    _.forEach(_.keys(infos), function (key) {
      if (key == utxo){
        ret = infos[key] ;
        return;
      }
    })
    if (typeof ret != 'undefined'){
      return res.send(ret)
    }else{
      return res.send('');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:payee/payee', async (req, res) => {
  let { chain, network, payee } = req.params;
  if (typeof payee !== 'string' || !chain || !network) {
    return res.status(400).send('Missing required param');
  }

  let utxo = '';
  chain = chain.toUpperCase();
  network = network.toLowerCase();
  try {
    let infos = await ChainStateProvider.getMasternodeStatus({ chain, network, utxo });
    let ret = _.findKey(infos, ['payee', payee]);
    if (typeof ret != 'undefined'){
      return res.send(infos[ret])
    }else{
      return res.send('');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:address/address', async (req, res) => {
  let { chain, network, address } = req.params;
  if (typeof address !== 'string' || !chain || !network) {
    return res.status(400).send('Missing required param');
  }

  let utxo = '';
  chain = chain.toUpperCase();
  network = network.toLowerCase();
  try {
    let infos = await ChainStateProvider.getMasternodeStatus({ chain, network, utxo });
    let ret = _.findKey(infos, ['address', address]);
    if (typeof ret != 'undefined'){
      return res.send(infos[ret])
    }else{
      return res.send('');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/send', async function(req, res) {
  try {
    let { chain, network } = req.params;
    let { rawTx } = req.body;
    chain = chain.toUpperCase();
    network = network.toLowerCase();
    let ret = await ChainStateProvider.broadcastMasternode({
      chain,
      network,
      rawTx
    });
    return res.send(ret);
  } catch (err) {
    logger.error(err);
    return res.status(500).send(err.message);
  }
});

module.exports = {
  router,
  path: '/masternode'
};
