import { BTCStateProvider } from '../btc/btc';

export class VCLStateProvider extends BTCStateProvider {
  constructor(chain: string = 'VCL') {
    super(chain);
  }
}
