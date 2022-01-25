/**
 * Content script
 * 
 * This script will be executed when the page with the URL specified in manifest.json is loaded.
 */

import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import MAPSnackbar from '../components/map_snackbar'

console.log('content script mounted')

const snackbarRoot = document.createElement('div')
snackbarRoot.id = 'map-snackbar'
document.body.append(snackbarRoot)

render(
  <StrictMode>
    <MAPSnackbar />
  </StrictMode >,
  snackbarRoot
)