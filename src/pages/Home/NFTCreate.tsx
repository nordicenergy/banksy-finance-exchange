import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Checkbox, Form, Input, message, Select, Upload } from 'antd'
import UploadBtn from '@/assets/images/upload-button.png'
import { pinFileToIPFS, pinJsonToIPFS } from '../../utils/pinata'
import { UploadProps } from 'antd/lib/upload/interface'
import { RcFile } from 'antd/es/upload'
import { LoadingOutlined } from '@ant-design/icons'
import { banksyWeb3 } from '../../BanksyWeb3'
import { useSelector } from 'react-redux'
import { getAccount } from '../../store/wallet'
import { useWalletErrorMessageGetter } from '../../hooks'
import { useWeb3EnvContext } from '../../contexts/Web3EnvProvider'
import { useWalletSelectionModal } from '../../contexts/WalletSelectionModal'
import { createNFT } from '../../utils/banksyNftList'
import { NFTMetadata } from '../../types/NFTMetadata'
import { useHistory } from 'react-router-dom'
import LoadingModal from '../../components/PleaseWaitModal'


const ArtistPageContainer = styled.div`
  padding-top: 5.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 3rem;
    font-weight: 500;
    color: #7c6deb;
    line-height: 4.2rem;
    padding-bottom: 4.7rem;
  }
`

const ArtistForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 82.8rem;
  background: #ffffff;
  border-radius: 5rem;
  padding: 3rem 8rem 12.2rem 8rem;
  margin-bottom: 5rem;

  .split-line {
    width: 66.8rem;
    height: 0.1rem;
    color: #e5e2fb;
    margin-top: 5.8rem;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: 500;
    color: #7c6deb;
    line-height: 2.8rem;
    padding-top: 3rem;
  }

  .text-area {
    &::placeholder {
      color: rgba(124, 109, 235, 0.5) !important;
    }

    width: 66.8rem !important;
    height: 10rem !important;
    background: #e5e2fb !important;
    border-radius: 1rem !important;
    border: 0.1rem solid #7c6deb !important;

    font-size: 1.4rem !important;
    font-weight: 500 !important;
    color: rgba(124, 109, 235, 1) !important;
    line-height: 2rem !important;
  }
`

const CustomFormItem = styled(Form.Item)`
  width: 100%;
  margin-top: 2.5rem;

  .ant-form-item-label > label {
    font-size: 1.6rem;
    font-weight: 500;
    color: #7c6deb;
    line-height: 2.2rem;
    margin-bottom: 1rem;
  }

  .ant-input {
    &::placeholder {
      color: rgba(124, 109, 235, 0.5);
    }

    width: 66.8rem !important;
    height: 5rem !important;
    background: #e5e2fb !important;
    border-radius: 1rem !important;
    border: 0.1rem solid #7c6deb !important;

    font-size: 1.4rem !important;
    font-weight: 500 !important;
    color: rgba(124, 109, 235, 1) !important;
    line-height: 2rem !important;
  }
`

const Selector = styled(Select)`
  width: 16.4rem !important;

  .ant-select-selector {
    width: 16.4rem !important;
    height: 5rem !important;
    background: #e5e2fb !important;
    border-radius: 1rem !important;
    border-color: #7c6deb !important;
  }

  .ant-select-clear {
    background-color: transparent;
  }

  .ant-select-selection-item {
    display: flex;
    align-items: center !important;
    justify-content: center !important;
    font-size: 1.4rem !important;
    font-weight: 500 !important;
    color: #7c6deb !important;
    line-height: 2rem !important;
    padding-right: 5rem !important;
  }

`

const AssetUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 3.7rem;

  .upload-border {
    width: fit-content;
    background: #e5e2fb;
    border-radius: 1rem;
    border: 0.2rem solid rgba(124, 109, 235, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      margin-top: 10rem;
      margin-bottom: 4.3rem;
      width: 8.2rem;
    }

    .tip {
      text-align: center;
      width: 15.4rem;
      font-size: 1.4rem;
      font-weight: 500;
      color: #7c6deb;
      opacity: 0.5;
      filter: alpha(opacity=50); /* IE8 及其更早版本 */
      margin-left: 7.2rem;
      margin-right: 7.2rem;
    }

    .tip:nth-of-type(1) {
      margin-bottom: 1.2rem;
    }

    .tip:nth-of-type(2) {
      margin-bottom: 10rem;
    }

    img.pinned {
      width: 46rem;
      margin: 2.5rem;
    }

    .loading {
      margin: 14rem 10rem;
      font-size: 10rem;
      color: #7c6deb;
    }
  }

  .upload-btn {
    margin-top: 2rem;
    width: 9.8rem;
    height: 3.6rem;
    background: #7c6deb;
    border-radius: 1rem;
    text-align: center;

    font-size: 1.2rem;
    font-weight: 500;
    color: #ffffff;
    line-height: 2.2rem;
  }
`

const Announcement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .text {
    width: 54.6rem;
    height: 5rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: #7c6deb;
    line-height: 2.5rem;
    padding-top: 6.4rem;
  }

  .text2 {
    font-size: 1.6rem;
    font-weight: 400;
    color: #7c6deb;
    line-height: 2.5rem;
    padding-top: 5rem;
  }
`

const CreateButton = styled(Button)`
  width: 30.2rem;
  height: 6rem;
  margin: 5.2rem 0 1.2rem 0;
  background: #7c6deb;
  border-radius: 1rem;
  text-align: center;

  font-size: 1.6rem;
  font-weight: 500;
  color: #ffffff;
  line-height: 2.2rem;
`


type AssetUploadProps = {
  onUploadSuccess: (_assetIpfsHash: string) => void
}

type MessageHintProps = {
  message: string,
  type?: 'error' | 'hint' | 'success'
}



const MessageHint: React.FC<MessageHintProps> = ({ message, type }) => {
  const color = type ? {
    'error': 'red',
    'success': 'rgb(82,196,26)',
    'hint': '#7c6deb'
  }[type] : ''

  return (
    <p style={{ fontSize: '1.2rem', color }}>
      {message}
    </p>
  )
}

const AssetUpload: React.FC<AssetUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false)

  const [fileList, setFileList] = useState<RcFile[]>([])

  const [pinnedFileHash, setPinnedFileHash] = useState<any>()

  const handleUpload = () => {
    if (!fileList[0]) {
      return
    }

    setUploading(true)
    setPinnedFileHash(undefined)

    pinFileToIPFS(fileList[0])
      .then(r => {
        setUploading(false)
        setPinnedFileHash(r.data.IpfsHash)
        onUploadSuccess(r.data.IpfsHash)
      })
      .catch(e => {
        setUploading(false)
        message.warn(`Upload failed. [${e}]`)
      })
  }

  const uploadProps: UploadProps = {
    showUploadList: false,
    name: 'file',
    maxCount: 1,
    beforeUpload: async file => {
      setFileList([file])
      return false
    },
    fileList,
    progress: {
      strokeColor: {
        '0%': '#ffabe1',
        '50%': '#a685e2',
        '100%': '#7c6deb'
      },
      strokeWidth: 6,
      format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`
    }
  }

  useEffect(handleUpload, [fileList])

  return (
    <AssetUploadContainer>
      <Upload {...uploadProps}>
        {pinnedFileHash ? (
          <div className="upload-border">
            <img className="pinned" src={`https://banksy.mypinata.cloud/ipfs/${pinnedFileHash}`} alt="" />
          </div>
        ) : uploading ? (
          <div className="upload-border">
            <LoadingOutlined className="loading" />
          </div>
        ) : (
          <div className="upload-border">
            <img src={UploadBtn} alt="upload-btn" />
            <div className="tip">Support: png / jpg /</div>
            <div className="tip">Size: 10M/</div>
          </div>
        )}
      </Upload>
      {/*<Button className="upload-btn" onClick={handleUpload}>*/}
      {/*  Start Upload*/}
      {/*</Button>*/}
    </AssetUploadContainer>
  )
}

const NFTCreate: React.FC = () => {
  const { providerInitialized, networkReady } = useWeb3EnvContext()

  const { open: openWalletSelectionModal } = useWalletSelectionModal()

  const history = useHistory()

  const account = useSelector(getAccount)

  const [form] = Form.useForm()

  const { walletErrorMessageGetter } = useWalletErrorMessageGetter()

  const [visible, setVisible] = useState(false)


  const [promised, setPromised] = useState(false)
  const [assetIpfsHash, setAssetIpfsHash] = useState('')
  const [hintMessage, setHintMessage] = useState<MessageHintProps>({
    message: '', type: 'hint'
  })

  const formInitialValues = {
    artworkType: 'pictures',
    artworkName: '',
    artistName: '',
    socialMedia: '',
    briefIntroduction: ''
  }

  const onArtworkTypeChange = (value: any) => {
    form.setFieldsValue({ artworkType: value })
  }

  const onAssetUploadSuccess = (assetIpfsHash: string) => {
    setAssetIpfsHash(assetIpfsHash)
  }

  const handleCreate = () => {
    if (!promised) {
      setHintMessage({
        message: 'Please check the checkbox first!',
        type: 'error'
      })
      return
    }

    if (!assetIpfsHash) {
      setHintMessage({
        message: 'Please upload artwork image first!',
        type: 'error'
      })
      return
    }

    setHintMessage({
      message: ''
    })

    form
      .validateFields()
      .then(values => {
        /*const attributes: NFTMetadataAttribute[] = Object.keys(values).map(key => ({
          key,
          value: values[key]
        }))*/
        const nftMetadata: NFTMetadata = {
          name: values.artworkName,
          description: values.briefIntroduction,
          image: `https://banksy.mypinata.cloud/ipfs/${assetIpfsHash}`
          // attributes
        }

        setHintMessage({
          message: 'Pinning asset JSON to IPFS...',
          type: 'hint'
        })

        pinJsonToIPFS(nftMetadata)
          .then(r => {
            setHintMessage({
              message: 'Pinned successful! Please confirm in your wallet...',
              type: 'hint'
            })

            const { IpfsHash } = r.data

            const tokenUri = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`

            const createForm = {
              uri: IpfsHash,
              addressCreate: account!,
              tokenId: '',
              group: '',
              nameArtist: values.artistName
            }

            createNFT(createForm)

            setVisible(true)


            banksyWeb3.eth.Banksy.contract!.on('URI', async (...args) => {
              const [ tokenUriFromEvent] = args
              if (tokenUri === tokenUriFromEvent) {
                await createNFT(createForm)
              }
            })

            banksyWeb3.eth.Banksy.awardItem(account!, tokenUri)
              .then(res => {
                setVisible(false)
                setHintMessage({ message: '' })
                message.success('Create successfully!')
                history.push(`/nft/create/success?img=${assetIpfsHash}&name=${values.artworkName}`)
                setHintMessage({
                  message: 'Your creation request has been submitted!',
                  type: 'hint'
                })
                console.log(res)
              })
              .catch(e => {
                setHintMessage({
                  message: walletErrorMessageGetter(e),
                  type: 'error'
                })
              })
          })
          .catch(e => {
            const error = e.response.data.error
            setHintMessage({
              message: `Error occurred when pinning JSON to IPFS, retry again. [${error}]`,
              type: 'error'
            })
          })
      })
      .catch(() => {
        setHintMessage({
          message: 'Please complete the form first!',
          type: 'error'
        })
      })

  }

  const creating = (() => !!hintMessage.message && hintMessage.type === 'hint')()

  useEffect(() => {
    if (providerInitialized && !networkReady) {
      setHintMessage({ message: 'Please manually switch to the Rinkeby in MetaMask', type: 'error' })
    }

    if (providerInitialized && networkReady || !providerInitialized) {
      setHintMessage({ message: '' })
    }
  }, [providerInitialized, networkReady])

  useEffect(() => {
    return () => {
      console.log('remove all listener')
      banksyWeb3.eth.Banksy.contract?.removeAllListeners()
      console.log(banksyWeb3.eth.Banksy.contract?.listeners())
    }
  }, [])

  return (
    <ArtistPageContainer>
      <div className="title">Banksy Artists</div>
      <ArtistForm form={form} colon={false} layout="vertical" initialValues={formInitialValues}>
        <h1>1. Artwork Information</h1>

        <CustomFormItem
          name="artworkType"
          label="Artwork Type"
          rules={[{ required: true, message: 'Artwork Type is Required!' }]}
        >
          <Selector onChange={onArtworkTypeChange}>
            <Select.Option value="pictures">
              {/*<div className="test" style={{ display: 'flex' }}>*/}
              {/*<img src={PicIcon} alt="pic" style={{ width: '1.8rem', height: '1.8rem', marginRight: '0.5rem' }} />*/}
              Pictures
              {/*</div>*/}
            </Select.Option>
            <Select.Option value="gif">GIF</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="audio">Audio</Select.Option>
          </Selector>
        </CustomFormItem>

        <CustomFormItem
          name="artworkName"
          label="Artwork Name"
          rules={[{ required: true, message: 'Artwork Name is Required!' }]}
        >
          <Input placeholder="Enter the artwork name" />
        </CustomFormItem>

        <CustomFormItem
          name="artistName"
          label="Artist Name"
          rules={[{ required: true, message: 'Artist Name is Required!' }]}
        >
          <Input placeholder="Enter the artist name" />
        </CustomFormItem>

        <CustomFormItem
          name="socialMedia"
          label="Social Media/Portfolio link"
          rules={[{ required: true, message: 'Social Media/Portfolio link is Required!' }]}
        >
          <Input placeholder="Personal website" />
        </CustomFormItem>

        <CustomFormItem
          name="briefIntroduction"
          label="Brief Introduction"
          rules={[{ required: true, message: 'Brief Introduction is Required!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter the Brief introduction" className="text-area" />
        </CustomFormItem>

        <h1>2. Upload Artwork Image</h1>

        <AssetUpload onUploadSuccess={onAssetUploadSuccess} />

        <hr className="split-line" />

        <Announcement>
          <Checkbox
            checked={promised}
            onChange={e => setPromised(e.target.checked)}
          >
            <div className="text">
              I declare that this is an original artwork. I understand that no plagiarism is allowed, and that the
              artwork can be removed anytime if detected.
            </div>
          </Checkbox>
        </Announcement>

        {
          !providerInitialized ? (
            <CreateButton onClick={openWalletSelectionModal}>
              Connect to Wallet
            </CreateButton>
          ) : (
            networkReady ? (
              <CreateButton onClick={handleCreate} disabled={creating}>
                {
                  creating
                    ? 'Creating...'
                    : 'Create'
                }
              </CreateButton>
            ) : (
              <CreateButton disabled={true}>
                Correct Network First
              </CreateButton>
            )
          )
        }


        <MessageHint {...hintMessage} />
      </ArtistForm>
      <LoadingModal visible={visible} onCancel={() => setVisible(false)} />
    </ArtistPageContainer>
  )
}

export default NFTCreate
