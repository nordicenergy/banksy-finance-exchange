import banksyRequest from './banksyRequest'
import axios from 'axios'
import { SellingOrder } from '../BanksyWeb3/ethereum/services/exchange/types'

export function banksyNftList(data: any) {
  return banksyRequest.post<any>('/nft/web/v1/query/list', data)
}

export function banksyNftDetail(data: { uri?: string, contractAddress?: string }) {
  return banksyRequest.post<any>('/nft/web/v1/query/detail', data)
}

export function personalNftList(data: any) {
  return banksyRequest.post<any>('/nft/web/v1/zone/nft/list', data)
}

export function NftHomeCreateData() {
  return banksyRequest.get<any>('/nft/web/v1/home/count')
}

export function createNFT(data: { uri: string, addressCreate: string, tokenId: string, group: string }) {
  return axios.post('http://43.129.189.139:25566/nft/web/v1/create/uri', data)
}

export function sellOrder(data: SellingOrder) {
  return banksyRequest.post<any>('/nft/web/v1/transfer/order/create',data)
}

export function chooseOrder(data: any) {
  return banksyRequest.post<any>('/nft/web/v1/transfer/order/select',data)
}

export function aiStyleList() {
  return banksyRequest.get<any>('/nft/web/v1/aiGenerators/style/list')
}

export function aiSwiperList() {
  return banksyRequest.get<any>('/nft/web/v1/aiGenerators/slideshow')
}

export function NftFavorite(uri: any) {
  return banksyRequest.get<any>(`/nft/web/v1/view/favorite/${uri}`)
}

export function NftDetailFavorite(uri: any) {
  return banksyRequest.get<any>(`/nft/web/v1/view/info/${uri}`)
}

export function completeOrder(data: any) {
  return banksyRequest.post<any>('nft/web/v1/transfer/order/complete', data)
}
