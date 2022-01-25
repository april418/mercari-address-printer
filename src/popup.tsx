/**
 * Popup
 * 
 * Runs when the popup page specified in the browser action, page action, or action is opened.
 */

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@mui/material/CssBaseline'
import MAPPopup from './components/map_popup'

ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <MAPPopup />
  </StrictMode>,
  document.getElementById('root')
)