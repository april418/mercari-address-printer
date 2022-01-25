import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, IconButton, Paper } from '@mui/material'
import { Delete, Print } from '@mui/icons-material'
import { renderWithBadge } from './styled_badge'
import MAPBaseComponent, { DeliveryInfo } from './map_base_component'

export default class MAPPopup extends MAPBaseComponent {
  onClickPrintListHeader() {
    this.toggleAll()
  }

  onClickPrintSelected() {
    this.printSelected()
  }

  onClickDeleteSelected() {
    this.deleteSelected()
  }

  onClickListItem(info: DeliveryInfo) {
    this.toggleInfo(info)
  }

  onClickPrint(info: DeliveryInfo) {
    this.printInfo(info)
  }

  onClickDelete(info: DeliveryInfo) {
    this.deleteInfo(info)
  }

  renderButtons(info: DeliveryInfo) {
    return (
      <React.Fragment>
        <IconButton edge="end" aria-label="Print" onClick={() => this.onClickPrint(info)}><Print /></IconButton>
        <IconButton edge="end" aria-label="Delete" color="error" onClick={() => this.onClickDelete(info)}><Delete /></IconButton>
      </React.Fragment>
    )
  }

  renderHeaderButtons() {
    return (
      <React.Fragment>
        {renderWithBadge(
          <IconButton edge="end" aria-label="PrintSelected" disabled={this.state.selectedDeliveryInfos.length <= 0} onClick={() => this.onClickPrintSelected()}><Print /></IconButton>,
          this.state.selectedDeliveryInfos.length
        )}
        {renderWithBadge(
          <IconButton edge="end" aria-label="DeleteSelected" color="error" disabled={this.state.selectedDeliveryInfos.length <= 0} onClick={() => this.onClickDeleteSelected()}><Delete /></IconButton>,
          this.state.selectedDeliveryInfos.length
        )}
      </React.Fragment>
    )
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <Paper>
          <List dense subheader={
            <ListSubheader component="div" disableGutters>
              <ListItem secondaryAction={this.renderHeaderButtons()} disablePadding>
                <ListItemButton role={undefined} onClick={() => this.onClickPrintListHeader()}>
                  <ListItemIcon>
                    <Checkbox edge="start" disableRipple tabIndex={-1} inputProps={{ 'aria-labelledby': `print-list-header` }} checked={this.state.deliveryInfos.length > 0 && this.state.selectedDeliveryInfos.length === this.state.deliveryInfos.length} disabled={this.state.deliveryInfos.length <= 0} />
                  </ListItemIcon>
                  <ListItemText id="print-list-header" primary="Print List" />
                </ListItemButton>
              </ListItem>
            </ListSubheader>
          }>
            {
              this.state.deliveryInfos.length > 0 ?
                this.state.deliveryInfos.map((info, index) => (
                  <ListItem key={info.productId} secondaryAction={this.renderButtons(info)} disablePadding>
                    <ListItemButton role={undefined} onClick={() => this.onClickListItem(info)}>
                      <ListItemIcon>
                        <Checkbox edge="start" checked={this.state.selectedDeliveryInfos.filter(i => i.productId === info.productId).length > 0} tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': `print-list-item_${index}` }} />
                      </ListItemIcon>
                      <ListItemText id={`print-list-item_${index}`} primary={info.productName} secondary={info.productId} />
                    </ListItemButton>
                  </ListItem>
                )) :
                <ListItem disablePadding secondaryAction={
                  <React.Fragment>
                    <IconButton edge="end" aria-label="Print" disabled><Print /></IconButton>
                    <IconButton edge="end" aria-label="Delete" color="error" disabled><Delete /></IconButton>
                  </React.Fragment>
                }>
                  <ListItemButton role={undefined} disabled>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={false} disabled tabIndex={-1} disableRipple />
                    </ListItemIcon>
                    <ListItemText primary="No item" secondary='Please right click on the transaction page of Mercari and add it with "Add transaction to print list" in ContextMenu' />
                  </ListItemButton>
                </ListItem>
            }
          </List>
        </Paper>
      </ThemeProvider>
    )
  }
}