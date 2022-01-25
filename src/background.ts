/**
 * Background script
 * 
 * It will be executed first when this Chrome Extension is installed, earlier than the OnIstalled event fires.
 */

import Common from './common/common'

let snackbarPort: chrome.runtime.Port | undefined

/**
 * Handler of `chrome.contextMenus.onClick` event.
 * @param info Information of context menu clicked
 * @param tab Tab with context menu opened
 */
const onClickContextMenu = (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab | undefined) => {
  console.log('context menu clicked. info: %O, tab: %O, port: %O', info, tab, snackbarPort)

  if (info.menuItemId !== Common.Constraints.CONTEXT_MENU_ID || !tab?.id || !snackbarPort) return

  const message: Common.DataTypes.Message.AddTransactionToPrintList = { type: 'addTransactionToPrintList', tabId: tab.id, }

  try {
    snackbarPort.postMessage(message)
  }
  catch (e) {
    console.error('Error occured sending message to snackbar: %O', e)
  }
}

/**
 * Handler of `chrome.storage.onChange` event.
 * @param changes Changed values
 */
const onStrageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
  console.log('changes: %O', changes)

  if (!changes.deliveryInfos) return

  const length: number | undefined = changes.deliveryInfos.newValue?.length
  chrome.browserAction.setBadgeText({ text: length?.toString() ?? '' })
}

/**
 * Handler of `chrome.runtime.onConnect` event.
 * @param port Connected port
 */
const onPortConnected = (port: chrome.runtime.Port) => {
  console.log('port connected: %O', port)

  if (port.name === Common.Constraints.SNACKBAR_PORT_NAME) snackbarPort = port
}

/**
 * Handler of `chrome.tabs.onCreated` event.
 * @param tab Created tab
 */
const onTabCreated = (tab: chrome.tabs.Tab) => {
  console.log('tab created: %O', tab)
}

/**
 * Handler of `chrome.tabs.onActivated` event.
 * @param info Activated tab info
 */
const onTabActivated = (info: chrome.tabs.TabActiveInfo) => {
  console.log('tab activated: %O', info)

  chrome.tabs.get(
    info.tabId,
    tab => {
      if (tab.url || tab.pendingUrl) console.log('tab: %O', tab)
    }
  )
}

const onWindowCreated = (window: chrome.windows.Window, filters?: chrome.windows.WindowEventFilter) => {
  console.log('window created: %O', window)
  window.tabs?.some(tab => Common.MatchPatterns.MERCARI_PAGES.test(tab.url ?? ''))
  filters?.windowTypes.includes('normal')
}

/**
 * Handler of `chrome.runtime.onInstalled` event where the reason is `update`.
 * @param details Installed details
 */
const onUpdated = (details: chrome.runtime.InstalledDetails) => { }

/**
 * Handler of `chrome.runtime.onInstalled` event where the reason is `chrome_update`.
 * @param details Installed details
 */
const onChromeUpdated = (details: chrome.runtime.InstalledDetails) => { }

/**
 * Handler of `chrome.runtime.onInstalled` event where the reason is `shared_module_update`.
 * @param details Installed details
 */
const onSharedModuleUpdated = (details: chrome.runtime.InstalledDetails) => { }

/**
 * Handler of `chrome.runtime.onInstalled` event where the reasons is `update` or `chrome_update` or `shared_module_update`.
 * @param details Installed details
 */
const onAnyUpdated = (details: chrome.runtime.InstalledDetails) => { }

/**
 * Handler of `chrome.runtime.onInstalled` event where the reason is `install`.
 * @param details Installed details
 */
const onInstalled = (details: chrome.runtime.InstalledDetails) => {
  // Show onboarding.html
  // chrome.tabs.create({
  //   url: chrome.runtime.getURL('onboarding.html')
  // })
}

/**
 * Handler of `chrome.runtime.onInstalled` event where the reason is `install`.
 * @param details Installed details
 */
const onAnyUpdatedAndInstalled = (details: chrome.runtime.InstalledDetails) => {
  // Add context menu
  chrome.contextMenus.create({
    id: Common.Constraints.CONTEXT_MENU_ID,
    title: 'Add transaction to print list',
    type: 'normal',
    contexts: ['page'],
    documentUrlPatterns: [Common.UrlPatterns.MERCARI_TRANSACTION_PAGES],
  })

  // Reload Mercari pages already opened
  chrome.tabs.query(
    { url: Common.UrlPatterns.MERCARI_PAGES },
    tabs => {
      tabs.forEach(tab => {
        if (tab.id) chrome.tabs.reload(tab.id, { bypassCache: false })
      })
    }
  )

  // Set badge text
  chrome.storage.sync.get(
    { deliveryInfos: [] },
    items => {
      console.log('get delivery infos: %O', items.deliveryInfos)

      if (items.deliveryInfos.length > 0)
        chrome.browserAction.setBadgeText({ text: items.deliveryInfos.length.toString() })
    }
  )
}

// Add context menu onCreated event listener
chrome.contextMenus.onClicked.addListener(onClickContextMenu)

// Add storage onChanged event listener
chrome.storage.onChanged.addListener(onStrageChange)

// Add port onConnect event listener
chrome.runtime.onConnect.addListener(onPortConnected)

// Add tab onCreated and onActivated event listener
chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onActivated.addListener(onTabActivated)

// Add window onCreated event listener
chrome.windows.onCreated.addListener(onWindowCreated)

// Add onInstalled listener
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'update') onUpdated(details)
  if (details.reason === 'chrome_update') onChromeUpdated(details)
  if (details.reason === 'shared_module_update') onSharedModuleUpdated(details)
  if (details.reason === 'install') onInstalled(details)
  if (details.reason !== 'install') onAnyUpdated(details)
  onAnyUpdatedAndInstalled(details)
})