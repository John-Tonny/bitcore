import { BaseModule } from '..';
import { VCLStateProvider } from '../../providers/chain-state/vcl/vcl';
import { BitcoinP2PWorker } from '../bitcoin/p2p';
import { VerificationPeer } from '../bitcoin/VerificationPeer';

export default class VCLModule extends BaseModule {
  constructor(services: BaseModule['bitcoreServices']) {
    super(services);
    services.Libs.register('VCL', 'vircle-lib', 'bitcore-p2p');
    services.P2P.register('VCL', BitcoinP2PWorker);
    services.CSP.registerService('VCL', new VCLStateProvider());
    services.Verification.register('VCL', VerificationPeer);
  }
}
