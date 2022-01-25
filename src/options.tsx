/**
 * Options
 * 
 * Runs when an option page or the option UI is opened.
 */

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@mui/material/CssBaseline'
import MAPOptions from './components/map_options'

ReactDOM.render(
  <StrictMode>
    <CssBaseline />
    <MAPOptions />
  </StrictMode>,
  document.getElementById('root')
)
