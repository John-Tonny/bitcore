import { VircleLib } from 'crypto-wallet-core';
import _ from 'lodash';
import { IChain } from '..';
import { BtcChain } from '../btc';

const Errors = require('../../errors/errordefinitions');

export class VclChain extends BtcChain implements IChain {
  constructor() {
    super(VircleLib);
    this.feeSafetyMargin = 0.02;
  }
}
