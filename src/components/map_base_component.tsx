import React, { Component } from 'react'
import { createTheme } from '@mui/material/styles'
import Common from '../common/common'

export type State = Common.DataTypes.BaseComponent.State & { [key: string]: State[keyof State] }
export type SyncState = Common.DataTypes.BaseComponent.SynchronizedState & { [key: string]: SyncState[keyof SyncState] }
export type UnsyncState = Common.DataTypes.BaseComponent.UnsynchronizedState & { [key: string]: UnsyncState[keyof UnsyncState] }
export type DeliveryInfo = Common.DataTypes.DeliveryInformation

const UNSYNC_STATE_NAMES = Common.DataTypes.BaseComponent.UNSYNCHRONIZED_STATE_NAMES

export default abstract class MAPBaseComponent extends Component<{}, State> {
  get syncState(): SyncState {
    return Common.Functions.ommitInstance(this.state, ...UNSYNC_STATE_NAMES) as SyncState
  }

  get unsyncState(): UnsyncState {
    return Common.Functions.pickInstance(this.state, ...UNSYNC_STATE_NAMES) as UnsyncState
  }

  constructor(props: any) {
    super(props)

    this.state = {
      isLightMode: true,
      theme: createTheme({ palette: { mode: 'light' } }),
      shipperName: '',
      shipperPostalcode: '',
      shipperAddress: '',
      displayNotes: false,
      notes: '',
      deliveryInfos: new Array<DeliveryInfo>(),
      selectedDeliveryInfos: new Array<DeliveryInfo>(),
      printingDeliveryInfos: new Array<DeliveryInfo>(),
      deleteListItemAfterPrint: false,
      selectedPostcard: undefined,
    }
  }

  setTheme(isLightMode?: boolean) {
    isLightMode = isLightMode ?? this.state.isLightMode
    super.setState({ theme: createTheme({ palette: { mode: isLightMode ? 'light' : 'dark' } }), })
  }

  onStorageChanged(changes: { [key: string]: chrome.storage.StorageChange }) {
    super.setState(
      Object.keys(changes).reduce((state, changedPropertyName) => {
        const newValue = changes[changedPropertyName].newValue
        const oldValue = changes[changedPropertyName].oldValue
        const currentValue = this.syncState[changedPropertyName]

        if (newValue === oldValue || currentValue === newValue) return state

        console.log('changed propety: [%O] %O -> %O', changedPropertyName, oldValue, newValue)
        return Object.assign(state, { [changedPropertyName]: newValue })
      }, {})
    )

    if (changes.hasOwnProperty('isLightMode')) this.setTheme()
  }

  toggleAll() {
    this.setState({
      selectedDeliveryInfos: this.state.selectedDeliveryInfos.length === this.state.deliveryInfos.length ? [] : this.state.deliveryInfos,
    })
  }

  toggleInfo(info: DeliveryInfo) {
    if (this.state.selectedDeliveryInfos.filter(i => i.productId === info.productId).length > 0) {
      this.setState({
        selectedDeliveryInfos: this.state.selectedDeliveryInfos.filter(i => i.productId !== info.productId),
      })
    }
    else {
      this.state.selectedDeliveryInfos.push(info)
      this.setState({
        selectedDeliveryInfos: this.state.selectedDeliveryInfos,
      })
    }
  }

  deleteInfo(info: DeliveryInfo) {
    this.setState({
      deliveryInfos: this.state.deliveryInfos.filter(i => i.productId !== info.productId),
      selectedDeliveryInfos: this.state.selectedDeliveryInfos.filter(i => i.productId !== info.productId),
      printingDeliveryInfos: this.state.printingDeliveryInfos.filter(i => i.productId !== info.productId),
    })
  }

  deleteSelected() {
    const selectedIds = this.state.selectedDeliveryInfos.map(i => i.productId)
    this.setState({
      deliveryInfos: this.state.deliveryInfos.filter(i => !selectedIds.includes(i.productId)),
      selectedDeliveryInfos: [],
      printingDeliveryInfos: this.state.printingDeliveryInfos.filter(i => !selectedIds.includes(i.productId)),
    })
  }

  deleteAll() {
    this.setState({
      deliveryInfos: [],
      selectedDeliveryInfos: [],
      printingDeliveryInfos: [],
    })
  }

  openPrintPage(...infos: DeliveryInfo[]) {
    this.setState({ printingDeliveryInfos: infos })

    chrome.tabs.create(
      { url: chrome.runtime.getURL('print_page.html') },
      tab => console.log('tab opened: %O', tab)
    )
  }

  printInfo(info: DeliveryInfo) {
    this.openPrintPage(info)
  }

  printSelected() {
    this.openPrintPage(...this.state.selectedDeliveryInfos)
  }

  printAll() {
    this.openPrintPage(...this.state.deliveryInfos)
  }

  setState<K extends keyof State>(state: State | ((prevState: Readonly<State>, props: Readonly<any>) => State) | Pick<State, K> | null | Pick<State, K> | null, callback?: () => void): void {
    super.setState(state, () => {
      if (callback) callback()
      console.log('saved state: %O', state)
      chrome.storage.sync.set(this.syncState)
    })
  }

  componentDidMount() {
    chrome.storage.sync.get(
      Object.keys(this.syncState),
      (items) => {
        console.log('items: %O', items)

        Object.keys(items).forEach(propertyName => {
          console.log('initialize property: [%O] %O -> %O', propertyName, this.state[propertyName], items[propertyName])
        })

        super.setState(Object.assign(this.syncState, items))
        this.setTheme()
      }
    )

    chrome.storage.onChanged.addListener(this.onStorageChanged.bind(this))
  }

  componentWillUnmount() {
    chrome.storage.onChanged.removeListener(this.onStorageChanged.bind(this))
  }
}