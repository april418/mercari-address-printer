import React, { Component, SyntheticEvent } from 'react'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Common from '../common/common'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default class MAPSnackbar extends Component<{}, Common.DataTypes.SnackbarComponent.State> {
  port?: chrome.runtime.Port

  constructor(props: any) {
    super(props)

    this.state = this.generateInitialState()
  }

  generateInitialState() {
    return { isOpen: false, message: undefined, messageType: undefined, }
  }

  openPort() {
    this.port = chrome.runtime.connect({ name: Common.Constraints.SNACKBAR_PORT_NAME })
    this.port.onMessage.addListener(this.onMessageRecieved.bind(this))
  }

  onMessageRecieved() {
    const productId = location.href.match(Common.MatchPatterns.MERCARI_PRODUCT_ID)?.at(0) || ''

    chrome.storage.sync.get({ deliveryInfos: [] }, items => {
      const deliveryInfos: Common.DataTypes.DeliveryInformation[] = items.deliveryInfos

      if (deliveryInfos.filter(info => info.productId === productId).length > 0)
        return this.setState({ isOpen: true, message: 'Transaction already added', messageType: 'warning', })

      const transactionUrl = location.href
      const productUrl = location.href.replace('transaction', 'item')

      const merItemObjectShadow = document.querySelector<HTMLElement>('mer-item-object')?.shadowRoot
      const productName = merItemObjectShadow?.querySelector<HTMLDivElement>('div.container')?.ariaLabel || ''
      const productThumbnail = merItemObjectShadow?.querySelector('mer-item-thumbnail')?.shadowRoot?.querySelector<HTMLImageElement>('img')?.src || ''

      let merTexts = Array.from(document.querySelectorAll<HTMLSpanElement>('mer-display-row span[slot="body"] mer-text')).map(el => el?.outerText)
      merTexts = merTexts.slice(0, merTexts.length / 2)
      const buyerName = merTexts.at(-1) || ''
      const buyerPostalcode = merTexts.at(1) || ''
      const buyerAddress = merTexts.slice(2, -1).join(' ') || ''

      deliveryInfos.push({ productId, productName, productThumbnail, productUrl, transactionUrl, buyerName, buyerPostalcode, buyerAddress, })

      return chrome.storage.sync.set({ deliveryInfos }, () => {
        this.setState({ isOpen: true, message: 'Transaction added', messageType: 'success', })
      })
    })
  }

  onCloseSnackbar(event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) {
    console.log('snackbar closed')

    if (reason === 'clickaway') return

    this.setState(this.generateInitialState())
  }

  componentDidMount() {
    console.log('snackbar mounted')

    this.openPort()
  }

  componentWillUnmount() {
    console.log('snackbar unmounted')

    this.port?.disconnect()
  }

  render() {
    return (
      <Snackbar open={this.state.isOpen} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={this.onCloseSnackbar.bind(this)}>
        <Alert severity={this.state.messageType} sx={{ width: '100%' }} onClose={this.onCloseSnackbar.bind(this)}>{this.state.message}</Alert>
      </Snackbar>
    )
  }
}