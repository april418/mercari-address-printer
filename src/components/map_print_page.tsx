import React from 'react'
import MAPBaseComponent from './map_base_component'
import VerticalWriting from './vertical_writing'

export default class MAPPrintPage extends MAPBaseComponent {
  shapPostalcode(postalcode: string) {
    return postalcode.replace(/.?(\d{3}).?(\d{4})/, '$1$2')
  }

  renderStyles() {
    if (!this.state.selectedPostcard) return

    const styleText = `
/*
@page {
  size: ${this.state.selectedPostcard.size.width}mm ${this.state.selectedPostcard.size.height}mm;
}
*/

.postcard {
  aspect-ratio: ${this.state.selectedPostcard.size.width} / ${this.state.selectedPostcard.size.height};
}
    `

    return <style>{styleText}</style>
  }

  render() {
    return (
      <React.Fragment>
        {this.renderStyles()}
        {
          this.state.printingDeliveryInfos.map(info => (
            <React.Fragment key={info.productId}>
              <div className="postcard">
                <div className="delivery-postalcode">{this.shapPostalcode(info.buyerPostalcode)}</div>
                <div className="delivery-name-address-container">
                  <div className="delivery-address">
                    <VerticalWriting text={info.buyerAddress} />
                  </div>
                  <div className="delivery-name">
                    <VerticalWriting text={info.buyerName} />
                  </div>
                  {
                    this.state.displayNotes ?
                      <div className="notes">
                        <VerticalWriting text={this.state.notes} />
                      </div> :
                      <div className="notes" v-if="!renderNotes">　</div>
                  }
                </div>
              </div>
              <div className="postcard">
                <div className="shipper-name-address-container">
                  <div className="shipper-address">
                    <VerticalWriting text={this.state.shipperAddress} />
                  </div>
                  <div className="shipper-name">
                    <VerticalWriting text={this.state.shipperName} />
                  </div>
                </div>
                <div className="shipper-postalcode">{this.shapPostalcode(this.state.shipperPostalcode)}</div>
              </div>
            </React.Fragment>
          ))
        }
      </React.Fragment>
    )
  }
}