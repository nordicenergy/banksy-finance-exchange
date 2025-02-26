import { WalletNames } from '../web3/wallets'

export type State = {
  app: AppState
  wallet: WalletState
  bridge: BridgeState
}

export type AppState = {}

export type BridgeState = {
  sourcePolyChainId: number
}

export type WalletState = {
  selectedWallet?: WalletNames
  account?: string
  // transactionHistoryList: Array<TransactionHistory>
  chainId?: number
  rpcUrl?: string
}
