import { LoggifyClass } from '../decorators/Loggify';
// import logger from '../logger';
import { StorageService } from '../services/storage';
import { IMasternode } from '../types/Masternode';
import { TransformOptions } from '../types/TransformOptions';
import { BaseModel, MongoBound } from './base';

export interface IMasternode {
  chain: string;
  network: string;
  txid: string;
  address: string;
  payee: string;
  protocol: number;
  daemonversion: string;
  sentinelversion: string;
  sentinelstate: string;
  lastseen: number;
  activateseconds: number;
  lastpaidtime: number;
  lastpaidblock: number;
  pingretries: number;
  time: Date;
  timeNormalized: Date;
  processed: boolean;
}

@LoggifyClass
export class BitcoinMasternode extends BaseModel<IMasternode> {
  constructor(storage?: StorageService) {
    super('masternode', storage);
  }

  allowedPaging = [];

  async onConnect() {
    this.collection.createIndex({ hash: 1 }, { background: true });
    this.collection.createIndex({ chain: 1, network: 1, processed: 1 }, { background: true });
    this.collection.createIndex({ chain: 1, network: 1, timeNormalized: 1 }, { background: true });
  }

  _apiTransform(masternode: Partial<MongoBound<IMasternode>>, options?: TransformOptions): any {
    const transform = {
      _id: masternode._id,
      chain: masternode.chain,
      network: masternode.network,
      time: masternode.time,
      timeNormalized: masternode.timeNormalized
    };
    if (options && options.object) {
      return transform;
    }
    return JSON.stringify(transform);
  }
}

export let BitcoinMasternodeStorage = new BitcoinMasternode();
