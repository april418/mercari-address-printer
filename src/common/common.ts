import { Theme } from "@mui/material/styles"

export interface Window {
  MercariAddressPrinter: {
    tabId: number
  }
}

export namespace MAPCommon {
  export namespace Constraints {
    export const CONTEXT_MENU_ID = 'MAPContextMenu'
    export const SNACKBAR_PORT_NAME = 'MAPSnackbarPort'
  }

  export namespace DataTypes {
    export namespace Message {
      export interface AddTransactionToPrintList {
        type: 'addTransactionToPrintList'
        tabId: number
      }
    }

    export interface DeliveryInformation {
      transactionUrl: string
      productId: string
      productUrl: string
      productName: string
      productThumbnail: string
      buyerName: string
      buyerPostalcode: string
      buyerAddress: string
    }

    export namespace DeliveryInfomation {
      export type BuyerInformation = Pick<DeliveryInformation, 'buyerName' | 'buyerPostalcode' | 'buyerAddress'>

      export type ProductInformation = Pick<DeliveryInformation, 'productId' | 'productUrl' | 'productName' | 'productThumbnail'>

      export type TransactionInformation = Pick<DeliveryInformation, 'transactionUrl'>
    }

    export namespace PostcardInformation {
      export const NAMES = ['LetterJP', 'MiniLetterJP', 'EnvelopeJPN3', 'EnvelopeJPN4', 'EnvelopeJPK2', 'EnvelopeJPK3', 'EnvelopeJPK8'] as const

      export const LABELS = {
        LetterJP: 'はがき',
        MiniLetterJP: 'ミニレター(郵便書簡)',
        EnvelopeJPN3: '長形3号',
        EnvelopeJPN4: '長形4号',
        EnvelopeJPK2: '角形2号',
        EnvelopeJPK3: '角形3号',
        EnvelopeJPK8: '角形8号',
      } as const

      export const SIZES = {
        LetterJP: { width: 100, height: 148, },
        MiniLetterJP: { width: 92, height: 165, },
        EnvelopeJPN3: { width: 120, height: 235, },
        EnvelopeJPN4: { width: 90, height: 205, },
        EnvelopeJPK2: { width: 240, height: 332, },
        EnvelopeJPK3: { width: 216, height: 277, },
        EnvelopeJPK8: { width: 119, height: 197, },
      } as const
    }

    export interface PostcardInformation {
      name: typeof PostcardInformation.NAMES[number]
      label: typeof PostcardInformation.LABELS[typeof PostcardInformation.NAMES[number]]
      size: typeof PostcardInformation.SIZES[typeof PostcardInformation.NAMES[number]]
    }

    export namespace BaseComponent {
      export interface State {
        isLightMode: boolean
        theme: Theme
        shipperName: string
        shipperPostalcode: string
        shipperAddress: string
        displayNotes: boolean
        notes: string
        deliveryInfos: DeliveryInformation[]
        selectedDeliveryInfos: DeliveryInformation[]
        printingDeliveryInfos: DeliveryInformation[]
        deleteListItemAfterPrint: boolean
        selectedPostcard?: PostcardInformation
      }

      export const UNSYNCHRONIZED_STATE_NAMES = ['theme'] as const

      export type SynchronizedState = Omit<State, typeof UNSYNCHRONIZED_STATE_NAMES[number]>

      export type UnsynchronizedState = Pick<State, typeof UNSYNCHRONIZED_STATE_NAMES[number]>
    }

    export namespace SnackbarComponent {
      export type State = {
        isOpen?: boolean
        message?: string
        messageType?: 'info' | 'success' | 'warning' | 'error'
      }
    }
  }

  export namespace Functions {
    export function pickInstance<K>(instance: K, ...pickProperties: (keyof K)[]): Pick<K, typeof pickProperties[number]> {
      return <Pick<K, typeof pickProperties[number]>>pickProperties.reduce<Partial<K>>((i, p) => {
        i[p] = instance[p]
        return i
      }, {})
    }

    export function ommitInstance<K>(instance: K, ...omitProperties: (keyof K)[]): Omit<K, typeof omitProperties[number]> {
      return <Omit<K, typeof omitProperties[number]>>omitProperties.reduce<Partial<K>>((i, p) => {
        delete i[p]
        return i
      }, Object.assign({}, instance))
    }

    export function generatePostcardInfos(): Readonly<DataTypes.PostcardInformation[]> {
      return DataTypes.PostcardInformation.NAMES.map(name => ({
        name,
        label: DataTypes.PostcardInformation.LABELS[name],
        size: DataTypes.PostcardInformation.SIZES[name],
      }))
    }
  }

  export namespace MatchPatterns {
    export const MERCARI_PAGES = /https?:\/\/jp.mercari.com/
    export const MERCARI_PRODUCT_ID = /m\d{11}/
  }

  export namespace UrlPatterns {
    export const MERCARI_PAGES = '*://jp.mercari.com/*'
    export const MERCARI_TRANSACTION_PAGES = '*://jp.mercari.com/transaction/*'
  }
}

export default MAPCommon