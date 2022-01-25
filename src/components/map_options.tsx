import React, { ChangeEvent } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { AppBar, Avatar, Button, ButtonGroup, Card, CardContent, Checkbox, Container, Divider, FormControl, FormControlLabel, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { Delete, InsertLink, Print } from '@mui/icons-material'
import Common from '../common/common'
import ThemeModeSwitch from './theme_mode_switch'
import { renderWithBadge } from './styled_badge'
import MAPBaseComponent, { DeliveryInfo } from './map_base_component'

export default class MAPOptions extends MAPBaseComponent {
  postcardInfos = Common.Functions.generatePostcardInfos()

  onChangeThemeMode(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ isLightMode: event.target.checked })
    this.setTheme()
  }

  onChangeShipperName(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ shipperName: event.target.value })
  }

  onChangeShipperPostalcode(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ shipperPostalcode: event.target.value })
  }

  onChangeShipperAddress(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ shipperAddress: event.target.value })
  }

  onChangeSelectedPostcard(event: SelectChangeEvent<string>) {
    console.log('selected postcard: [%O]: %O', event.target.value, this.postcardInfos.find(info => info.name === event.target.value))
    this.setState({ selectedPostcard: this.postcardInfos.find(info => info.name === event.target.value) })
  }

  onChangeDisplayNotes(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ displayNotes: event.target.checked })
  }

  onChangeNotes(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({ notes: event.target.value })
  }

  onChangeDeleteListItemAfterPrint(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ deleteListItemAfterPrint: event.target.checked })
  }

  onClickPrintListHeader() {
    this.toggleAll()
  }

  onClickPrintAll() {
    this.printAll()
  }

  onClickDeleteAll() {
    this.deleteAll()
  }

  onClickPrintSelected() {
    this.printSelected()
  }

  onClickDeleteSelected() {
    this.deleteSelected()
  }

  onClickSelect(info: DeliveryInfo) {
    console.log('selected item: %O', info)

    this.toggleInfo(info)
  }

  onClickPrint(info: DeliveryInfo) {
    console.log('print item: %O', info)

    this.printInfo(info)
  }

  onClickDelete(info: DeliveryInfo) {
    console.log('deleted item: %O', info)

    this.deleteInfo(info)
  }

  renderHeaderButtons() {
    return (
      <React.Fragment>
        {renderWithBadge(
          <IconButton edge="end" size="large" aria-label="PrintSelected" disabled={this.state.selectedDeliveryInfos.length <= 0} onClick={event => this.onClickPrintSelected()}><Print /></IconButton>,
          this.state.selectedDeliveryInfos.length
        )}
        {renderWithBadge(
          <IconButton edge="end" size="large" color="error" aria-label="DeleteSelected" disabled={this.state.selectedDeliveryInfos.length <= 0} onClick={event => this.onClickDeleteSelected()}><Delete /></IconButton>,
          this.state.selectedDeliveryInfos.length
        )}
      </React.Fragment>
    )
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme} >
        <Paper style={{ minHeight: '100vh' }}>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, }}>Mercari Address Printer</Typography>
              <Stack direction="row" spacing={2}>
                <ButtonGroup variant="text">
                  <Button color="inherit" aria-label="PrintAll" startIcon={<Print />} disabled={this.state.deliveryInfos.length <= 0} onClick={() => this.onClickPrintAll()}>Print All</Button>
                  <Button color="error" aria-label="DeleteAll" startIcon={<Delete />} disabled={this.state.deliveryInfos.length <= 0} onClick={() => this.onClickDeleteAll()}>Delete All</Button>
                </ButtonGroup>
                <ThemeModeSwitch checked={this.state.isLightMode} onChange={event => this.onChangeThemeMode(event)} />
              </Stack>
            </Toolbar>
          </AppBar>

          <Container sx={{ paddingY: this.state.theme.spacing(2), }}>
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <TextField label="Shipper name" variant="standard" value={this.state.shipperName} onChange={event => this.onChangeShipperName(event)} />
                    <TextField label="Shipper postalcode" variant="standard" value={this.state.shipperPostalcode} onChange={event => this.onChangeShipperPostalcode(event)} />
                    <TextField label="Shipper address" variant="standard" value={this.state.shipperAddress} onChange={event => this.onChangeShipperAddress(event)} />
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <FormControl fullWidth>
                    <InputLabel id="postcard-select-label">Postcard size</InputLabel>
                    <Select labelId="postcard-select-label" value={this.state.selectedPostcard?.name ?? ''} label="Postcard size" onChange={event => this.onChangeSelectedPostcard(event)}>
                      <MenuItem value="" disabled>Select postcard size</MenuItem>
                      {
                        this.postcardInfos.map(info => <MenuItem key={info.name} value={info.name}>{info.label}</MenuItem>)
                      }
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <FormControlLabel control={<Checkbox checked={this.state.displayNotes} onChange={event => this.onChangeDisplayNotes(event)} />} label="Display notes" />
                    {
                      this.state.displayNotes ?
                        <TextField label="Notes" variant="standard" value={this.state.notes} onChange={event => this.onChangeNotes(event)} /> :
                        null
                    }
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <FormControlLabel control={<Checkbox checked={this.state.deleteListItemAfterPrint} onChange={event => this.onChangeDeleteListItemAfterPrint(event)} />} label="Delete list item after printed" />
                  </Stack>
                </CardContent>
              </Card>

              <Paper>
                <List subheader={
                  <ListSubheader component="div" disableGutters>
                    <ListItem disablePadding secondaryAction={this.renderHeaderButtons()}>
                      <ListItemButton dense role={undefined} onClick={() => this.onClickPrintListHeader()}>
                        <ListItemIcon>
                          <Checkbox edge="start" disableRipple tabIndex={-1} inputProps={{ 'aria-labelledby': 'print-list-header' }} checked={this.state.deliveryInfos.length > 0 && this.state.selectedDeliveryInfos.length === this.state.deliveryInfos.length} disabled={this.state.deliveryInfos.length <= 0} />
                        </ListItemIcon>
                        <ListItemText id="print-list-header" primary="Print List" />
                      </ListItemButton>
                    </ListItem>
                  </ListSubheader>
                }>
                  {
                    this.state.deliveryInfos.length > 0 ?
                      this.state.deliveryInfos.map((info, index) => (
                        <React.Fragment key={info.productId}>
                          <Divider component="li" />
                          <ListItem disablePadding secondaryAction={
                            <React.Fragment>
                              <IconButton edge="end" size="large" aria-label="Print" onClick={() => this.onClickPrint(info)}><Print /></IconButton>
                              <IconButton edge="end" size="large" color="error" aria-label="Delete" onClick={() => this.onClickDelete(info)}><Delete /></IconButton>
                            </React.Fragment>
                          }>
                            <ListItemButton dense role={undefined} onClick={() => this.onClickSelect(info)}>
                              <ListItemIcon>
                                <Checkbox edge="start" disableRipple tabIndex={-1} checked={this.state.selectedDeliveryInfos.filter(i => i.productId === info.productId).length > 0} inputProps={{ 'aria-labelledby': `print-list-item_${index}` }} />
                              </ListItemIcon>
                              <ListItemAvatar>
                                <Avatar variant="square" alt={`Image of "${info.productName}"`} src={info.productThumbnail} sx={{ height: 240, width: 240 }} />
                              </ListItemAvatar>
                              <ListItemText id={`print-list-item_${index}`} sx={{ paddingX: this.state.theme.spacing(4) }} primary={
                                <Typography component="h5" variant="h5">{info.productName}</Typography>
                              } secondary={
                                <Stack component="span" spacing={0}>
                                  <Typography component="span" variant="h6">{info.productId}</Typography>
                                  <Typography component="span" variant="subtitle1">{info.buyerName}</Typography>
                                  <Typography component="span" variant="body1">{info.buyerPostalcode}</Typography>
                                  <Typography component="span" variant="body1">{info.buyerAddress}</Typography>
                                  <Stack component="span" direction="row" spacing={2}>
                                    <Button variant="text" startIcon={<InsertLink />} href={info.transactionUrl} target="_blank" onClick={event => event.stopPropagation()}>Transaction page</Button>
                                    <Button variant="text" startIcon={<InsertLink />} href={info.productUrl} target="_blank" onClick={event => event.stopPropagation()}>Item page</Button>
                                  </Stack>
                                </Stack>
                              } />
                            </ListItemButton>
                          </ListItem>
                        </React.Fragment>
                      )) :
                      <ListItem disablePadding secondaryAction={
                        <React.Fragment>
                          <IconButton edge="end" size="large" aria-label="Print" disabled><Print /></IconButton>
                          <IconButton edge="end" size="large" color="error" aria-label="Delete" disabled><Delete /></IconButton>
                        </React.Fragment>
                      }>
                        <ListItemButton role={undefined} disabled>
                          <ListItemIcon>
                            <Checkbox edge="start" disabled disableRipple tabIndex={-1} checked={false} />
                          </ListItemIcon>
                          <ListItemText primary="No item" secondary='Please right click on the transaction page of Mercari and add it with "Add transaction to print list" in ContextMenu' />
                        </ListItemButton>
                      </ListItem>
                  }
                </List>
              </Paper>
            </Stack>
          </Container>
        </Paper>
      </ThemeProvider >
    )
  }
}