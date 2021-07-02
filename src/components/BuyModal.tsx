import React, { useState } from 'react'
import { Button, Checkbox, Divider, Modal } from 'antd'
import StepOne from '@/assets/images/allModalImg/number1.png'
import DepositIcon from '@/assets/images/allModalImg/deposit-icon.png'
import Authorizing from '@/assets/images/allModalImg/authorizing.png'
import danger from '@/assets/images/allModalImg/danger.png'
import dangerDownArrow from '@/assets/images/allModalImg/dangerDownArrow.png'
import successExchange from '@/assets/images/allModalImg/successExchange.png'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getAccount } from '../store/wallet'
import { banksyWeb3 } from '../BanksyWeb3'
import { ethers } from 'ethers'
import { ExchangeOrder, ExchangeOrderAsset } from '../BanksyWeb3/ethereum/services/exchange/types'
import { hashExchangeOrder, hashExchangeOrderAsset } from '../BanksyWeb3/ethereum/services/exchange/utils'
import { toWei } from '../web3/utils'
import { completeOrder } from '../utils/banksyNftList'
import { useHistory } from 'react-router-dom'
import history from '@/assets/images/swap/history.png'

type BuyModalProps = {
  isBuyModalVisible: boolean,
  checkoutCancel: () => void,
  data: any,
  buyData: any
}

const MyBuyModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 1rem;
    width: 62.3rem;
    padding-bottom: 4rem;
  }

  .ant-modal-header {
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .ant-modal-header .ant-modal-title {
    display: flex;
    justify-content: center;
    font-weight: 550;
    font-size: 1.8rem;
  }

  .checkout-list {
    display: flex;
    justify-content: space-between;
    margin-top: 3.2rem;

    p {
      line-height: 25px;
      font-size: 1.8rem;
      font-weight: 550;
    }
  }

  .checkout-detail {
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    .ntf-info {
      display: flex;

      .nft-image {
        object-fit: cover;
        width: 7.1rem;
        height: 7.1rem;
      }

      .nft-detail {
        margin-left: 2.4rem;
        align-self: center;

        .artist-name {
          font-size: 1.8rem;
          font-weight: 500;
          color: #7C6DEB;
          line-height: 2.5rem;
        }

        .nft-name {
          font-size: 1.8rem;
          font-weight: 550;
          line-height: 2.5rem;
        }
      }
    }

    .nft-value {
      display: flex;
      flex-direction: column;
      align-self: center;
      text-align: right;

      .nft-price {
        font-size: 1.8rem;
        font-weight: 500;
        line-height: 2.5rem;
        width: 7.1rem;
      }

      .nft-price-dollar {
        font-size: 1.4rem;
        font-weight: 500;
        color: #999999;
        line-height: 20px;
        width: 7.1rem;
      }
    }
  }

  .total-price {
    display: flex;
    justify-content: space-between;

    .total {
      line-height: 25px;
      font-size: 1.8rem;
      font-weight: 550;
    }

    .nft-value {
      display: flex;
      flex-direction: column;
      align-self: center;
      text-align: right;

      .nft-price {
        font-size: 2.2rem;
        font-weight: 500;
        color: #7C6DEB;
        line-height: 3rem;
        width: 9.1rem;
      }

      .nft-price-dollar {
        font-size: 1.8rem;
        font-weight: 500;
        color: #999999;
        line-height: 2.5rem;
        width: 9.1rem;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    margin-top: 3.3rem;

    .ant-btn {
      width: 16.1rem;
      height: 5rem;
      background: #7C6DEB;
      border-radius: 1rem;
    }

    .ant-btn > span {
      font-size: 1.8rem;
      font-weight: 550;
      color: #FFFFFF;
    }
  }
`

const MyCheckoutModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 1rem;
    width: 62.3rem;
    height: 43.8rem;
  }

  .ant-modal-header {
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .head-title {
    display: flex;
    justify-content: center;
    font-weight: 550;
    font-size: 1.8rem;
  }

  .step-tip {
    font-size: 1.6rem;
    font-weight: 500;
    color: #999999;
    line-height: 2.2rem;
  }

  .step-one-border {
    margin-top: 2.6rem;
    width: 55.7rem;
    height: 22.9rem;
    border: 1px solid #DCDCDC;

    .border-head {
      display: flex;
      align-content: center;
      padding: 1.9rem 1.9rem;


      .step-title {
        font-size: 1.6rem;
        font-weight: 500;
        color: #000000;
        line-height: 2.5rem;
        align-self: center;
        margin-left: 1.1rem;
      }
    }

    .border-body {
      padding: 1.9rem 1.9rem;
      background: rgba(124, 109, 235, 0.1);

      .border-detail {
        font-size: 1.6rem;
        font-weight: 500;
        color: #999999;
        line-height: 22px;
      }

      .ant-btn {
        width: 16.1rem;
        height: 5rem;
        background: #7C6DEB;
        border-radius: 1rem;
        margin-top: 2.1rem;
      }

      .ant-btn > span {
        font-size: 1.8rem;
        font-weight: 550;
        color: #FFFFFF;
      }
    }
  }
`

const Caveat = styled.div`
  width: 100%;
  height: 4.3rem;
  display: flex;
  align-items: center;
  background: #FDFDF4;
  border: 1px solid #E0DDF6;
  position: relative;

  .danger {
    width: 2rem;
    margin-left: 1.7rem;
  }

  span {
    margin-left: 1.4rem;
    font-weight: bold;
    font-size: 1.4rem;
  }

  .dangerDownArrow {
    width: 1.2rem;
    position: absolute;
    right: 1.5rem;
  }
`

const CaveatContent = styled.div`
  width: 100%;
  padding: 2rem;
  background: #FDFDF4;
  border: 1px solid #EFC300;
`

const Announcement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 6rem;

  .text {
    width: 54.6rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: #7c6deb;
    line-height: 2.5rem;
    padding-top: 4.4rem;
  }

  .text2 {
    font-size: 1.6rem;
    font-weight: 400;
    color: #7c6deb;
    line-height: 2.5rem;
    padding-top: 5rem;
  }
`

const MyDepositModal = styled(Modal)`
  .ant-modal-content {
    width: 62.3rem;
    height: 33.3rem;
    background: #FFFFFF;
    border-radius: 1rem;
  }

  .ant-modal-header {
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .ant-modal-header .ant-modal-title {
    display: flex;
    justify-content: center;
    font-weight: 550;
    font-size: 1.8rem;
  }

  .deposit-body {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;

    .deposit-text {
      font-weight: 500;
      color: #999999;
      line-height: 2.2rem;
      margin-top: 4.3rem;
    }

    .options {
      width: 33.3rem;
      height: 6.1rem;
      border: 1px solid #DCDCDC;
      margin-top: 2.8rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .deposit-icon {
        margin-right: 1.2rem;
      }

      .deposit-tip {
        font-size: 1.6rem;
        font-weight: 500;
        color: #999999;
        line-height: 2.2rem;
      }
    }
  }
`

const MyAuthorizingModal = styled(Modal)`
  .ant-modal-content {
    width: 62.3rem;
    height: 49.4rem;
    background: #FFFFFF;
    border-radius: 1rem;
  }

  .ant-modal-header {
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .author-body {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;

    .author-title {
      font-size: 2.2rem;
      font-weight: 400;
      color: #000000;
      line-height: 3rem;
      margin-top: 7.1rem;
      margin-bottom: 2.5rem;
    }

    .author-tip {
      font-size: 1.4rem;
      font-weight: 400;
      color: #000000;
      line-height: 2rem;
    }
  }

  .author-img {
    position: absolute;
    margin-top: 5.1rem;
    margin-left: 17.8rem;
  }
`

const SuccessModal = styled(Modal)`
  width: 62.3rem;
  height: 49.4rem;
  border-radius: 1rem;

  .success-title {
    width: 100%;
    text-align: center;
    font-size: 2.2rem;
  }

  img {
    width: 7.6rem;
    margin-left: calc((100% - 7.6rem) / 2);
    margin-top: 5.4rem;
  }

  .toItem {
    width: 25.3rem;
    height: 5rem;
    background: #7C6DEB;
    border-radius: 10px;
    color: #fff;
    font-size: 1.8rem;
    margin-left: calc((100% - 25.3rem) / 2);
    margin-top: 6.4rem;
  }
`

const ExchangeSuccessModal: React.FC<{isSuccessVisible: boolean, handleCancel: () => void}> = ({ isSuccessVisible, handleCancel }) => {
  const history = useHistory()

  const backItem = () => {
    history.push('/personal/home')
  }

  return (
    <div>
      <SuccessModal
        visible={isSuccessVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="success-title">Your transaction Succeeded！</div>
        <img src={successExchange} alt="" />
        <Button className="toItem" onClick={backItem}>BACK TO ALL ITEMS</Button>
      </SuccessModal>
    </div>
  )
}

const BuySignModal: React.FC<{isAuthorizingModalVisible: boolean, handleCancel: () => void}> = ({ isAuthorizingModalVisible, handleCancel }) => {
  return (
    <div>
      <MyAuthorizingModal
        visible={isAuthorizingModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="author-body">
          <div className="author-title">
            Authorizing your account for this order...
          </div>
          <div className="author-tip">if a signature request pops up, just click &quot;Sign&quot;</div>
          <div className="author-tip">to verify that you own your wallet.</div>
        </div>
        <div className="author-img">
          <img src={Authorizing} alt="" style={{ width: '21.1rem', height: '15.2rem' }} />
        </div>
      </MyAuthorizingModal>
    </div>
  )
}


const Deposit: React.FC<any> = ({ nextPart, handleCancel, isCheckoutModalVisible }) => {
  return (
    <div>
      <MyCheckoutModal visible={isCheckoutModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="head-title">
          Complete your purchase
        </div>
        <Divider />
        <div className="step-tip">
          To complete your purchase, follow these steps:
        </div>
        <div className="step-one-border">
          <div className="border-head">
            <img src={StepOne} alt="" style={{ width: '3.7rem', height: '3.7rem' }} />
            <div className="step-title">Deposit or convert funds</div>
          </div>
          <div className="border-body">
            <div className="border-detail">
              You don&apos;t have enough funds to complete the purchase. Please deposit or convert your funds.
            </div>
            {/*<Button onClick={nextPart}>Deposit</Button>*/}
          </div>
        </div>
      </MyCheckoutModal>
    </div>
  )
}

const BuyModal: React.FC<BuyModalProps> = ({ isBuyModalVisible, checkoutCancel, data, buyData }) => {
  const account = useSelector(getAccount)

  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false)

  const [isDepositModalVisible, setDepositModalVisible] = useState(false)

  const [isAuthorizingModalVisible, setAuthorizingModalVisible] = useState(false)

  const [isCaveatContent, setCaveatContent] = useState(false)

  const [isCheckOut, setCheckOut] = useState(true)

  const [isSuccessVisible, setSuccessVisible] = useState(false)

  const checkboxOptions = [
    'By checking this box. I acknowledge that this item has not been reviewed or approved by Banksy',
    'By checking this box. I agree to Banksy\'s Terms of Services'
  ]


  const showCheckoutModal = () => {
    checkoutCancel()
    setCheckoutModalVisible(true)
  }

  const showDepositModal = () => {
    setDepositModalVisible(true)
  }

  const handlePurchase = async () => {
    const price = toWei(buyData!.makerAsset!.baseAsset!.value)

    const sellOrder: ExchangeOrder = {
      dir: 0,
      maker: data!.addressOwner,
      makerAsset: {
        settleType: 0,
        baseAsset: {
          code: {
            baseType: 3,
            extraType: data!.tokenId,
            contractAddr: '0xb1e45866BF3298A9974a65577c067C477D38712a'
          },
          value: 1
        },
        extraValue: 0
      },
      taker: '0x0000000000000000000000000000000000000000',
      takerAsset: {
        settleType: 0,
        baseAsset: {
          code: {
            baseType: 1,
            extraType: 0,
            contractAddr: '0x0000000000000000000000000000000000000000'
          },
          value: price
        },
        extraValue: 0
      },
      fee: 0,
      feeRecipient: '0x0000000000000000000000000000000000000000',
      startTime: 0,
      endTime: 0,
      salt: buyData?.salt
    }

    const makerAsset: ExchangeOrderAsset = {
      settleType: 0,
      baseAsset: {
        code: {
          baseType: 1,
          extraType: 0,
          contractAddr: '0x0000000000000000000000000000000000000000'
        },
        value: price
      },
      extraValue: 0
    }

    const takerAsset: ExchangeOrderAsset  = {
      settleType: 0,
      baseAsset: {
        code: {
          baseType: 3,
          extraType: data?.tokenId,
          contractAddr: '0xb1e45866BF3298A9974a65577c067C477D38712a'
        },
        value: 1
      },
      extraValue: 0
    }

    const buyOrder: ExchangeOrder = {
      dir: 1,
      maker: account!,
      makerAsset,
      makerAssetHash: hashExchangeOrderAsset(makerAsset),
      taker: data!.addressOwner,
      takerAsset,
      takerAssetHash: hashExchangeOrderAsset(takerAsset),
      fee: 0,
      feeRecipient: '0x0000000000000000000000000000000000000000',
      startTime: 0,
      endTime: 0,
      salt: (Date.parse(new Date().toString())) / 1000
    }



    // setAuthorizingModalVisible(true)
    const signature = await banksyWeb3.signer!.signMessage(ethers.utils.arrayify(hashExchangeOrder(buyOrder)))

    await banksyWeb3.eth.Exchange.matchSingle(sellOrder, buyData!.signature, buyOrder, signature, `${makerAsset!.baseAsset.value}`).then(res => {
      setAuthorizingModalVisible(false)
      completeOrder({
        valueUri: data?.valueUri,
        addressOwner: account!
      }).then(res => setSuccessVisible(true))
    }).catch(err => {
      if (err.code === 'INSUFFICIENT_FUNDS') {
        setCheckoutModalVisible(true)
      }
    })
  }



  const nextPart = () => {
    if (isBuyModalVisible) {
      checkoutCancel()
      setAuthorizingModalVisible(true)
      handlePurchase()
    }
    if (isCheckoutModalVisible) {
      setCheckoutModalVisible(false)
      showDepositModal()
    }
  }

  const handleCancel = () => {
    setCheckoutModalVisible(false)
    setDepositModalVisible(false)
    setAuthorizingModalVisible(false)
    setSuccessVisible(false)
  }

  const showCaveatContent = () => {
    setCaveatContent(!isCaveatContent)
  }

  const onChange = (e: any) => e.length === 2 ? setCheckOut(false) : setCheckOut(true)

  return (
    <div>
      <MyBuyModal title="Checkout"
        visible={isBuyModalVisible}
        onCancel={checkoutCancel}
        footer={null}
      >
        <Caveat onClick={showCaveatContent}>
          <img className="danger" src={danger} alt="" />
          <span>This item has not been reviewed by Banksy</span>
          <img className="dangerDownArrow" src={dangerDownArrow} alt="" />
        </Caveat>
        {
          isCaveatContent ?
            <CaveatContent>
              You should proceed with extra caution. Anyone can
              create a digital item on a blockchain with any name.
              Including fake versions of existing items. Please take
              extra caution an do your research when interacting with
              this item to ensure it&apos;s what it claims to be.
            </CaveatContent> :
            <div />
        }
        <div className="checkout-list">
          <p>Item</p>
          <p>Subtotal</p>
        </div>
        <Divider style={{ marginTop: '-8px' }} />
        <div className="checkout-detail">
          <div className="ntf-info">
            <img className="nft-image" src={data?.image} alt="" />
            <div className="nft-detail">
              <div className="artist-name">{data?.name}</div>
              <div className="nft-name">{data?.description}</div>
            </div>
          </div>
          <div className="nft-value">
            <div className="nft-price">{data?.price ? data?.price : '- - -'}</div>
            <div className="nft-price-dollar">($- - -)</div>
          </div>
        </div>
        <Divider />
        <div className="total-price">
          <div className="total">Total</div>
          <div className="nft-value">
            <div className="nft-price">{data?.price ? data?.price : '- - -'}</div>
            <div className="nft-price-dollar">($- - -)</div>
          </div>
        </div>
        <Divider />
        <Announcement>
          <Checkbox.Group options={checkboxOptions} defaultValue={['Apple']} onChange={onChange} />
        </Announcement>
        <div className="footer">
          <Button onClick={nextPart} disabled={isCheckOut}>Checkout</Button>
        </div>
      </MyBuyModal>
      <Deposit nextPart={nextPart} isCheckoutModalVisible={isCheckoutModalVisible} handleCancel={handleCancel} />

      <MyDepositModal
        title="Add ETH to you wallet"
        visible={isDepositModalVisible}
        // onCancel={handleCancle}
        footer={null}
      >
        <div className="deposit-body">
          <div className="deposit-text">
            Select one of the options to deposit ETH to your wallet
          </div>
          <div className="options">
            <div className="deposit-icon">
              <img src={DepositIcon} alt="" style={{ width: '2.5rem', height: '2.4rem' }} />
            </div>
            <div className="deposit-tip">Deposit from an exchange</div>
          </div>
        </div>
      </MyDepositModal>
      <BuySignModal isAuthorizingModalVisible={isAuthorizingModalVisible} handleCancel={handleCancel} />
      <ExchangeSuccessModal isSuccessVisible={isSuccessVisible}  handleCancel={handleCancel} />
    </div>
  )
}

export default BuyModal
