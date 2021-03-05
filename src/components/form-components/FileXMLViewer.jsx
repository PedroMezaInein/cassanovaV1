import React, { Component } from 'react';
import XMLViewer from 'react-xml-viewer'

const customTheme = {
    "attributeKeyColor": "#9E6614",
    "attributeValueColor": "#008000",
    "cdataColor":"#1D781D",
    "commentColor":"#80808F",
    "separatorColor":"#2172C1",
    "tagColor":"#2172C1",
    "textColor":"#333",
    overflowBreak:false
}

class FileXMLViewer extends Component{
    // xml(){
    //     let xml= `<?xml version="1.0" encoding="UTF-8"?>
    //     <sferp:ComprobanteFiscal xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:sferp='http://www.solucionfactible.com/sferp/conector/cfd33' xsi:schemaLocation='http://www.solucionfactible.com/sferp/conector/cfd33  http://www.sat.gob.mx/Pagos http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos10.xsd' fecha="2017-08-09T00:01:15" folio="23554991" serie="OAS33" subTotal="40.00" total="41.20" descuento="3.00" motivoDescuento="PRONTO PAGO" metodoDePago="PUE" condicionesDePago="" estatus="vigente" numCtaPago="" formaDePago="01">
            
    //     </sferp:ComprobanteFiscal>`;
    //     return xml;
    // }
    render () {
        const { xml } = this.props
        return (
            <XMLViewer xml={xml} theme={customTheme} indentSize={6} collapsible={true}/>
        )
    }
}

export default FileXMLViewer