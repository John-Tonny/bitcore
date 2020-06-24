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
