import React, { Component } from 'react'
import DataTable from '../Data'
import { FACTURAS_COLUMNS } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../../functions/setters'
export default class FacturaTable extends Component{

    state = {
        data: []
    }
    componentDidMount(){
        const { facturas } = this.props
        this.setState({
            ... this.state,
            data: this.setFactura(facturas)
        })
    }

    //Setter
    setFactura = facturas => {
        let aux = []
        facturas.map( (factura) => {
            console.log(factura, 'FACTURA')
            aux.push(
                {
                    folio: setTextTable(factura.folio),
                    serie: setTextTable(factura.serie),
                    noCertificado: setTextTable(factura.numero_certificado),
                    emisor: setArrayTable(
                        [
                            {name:'RFC', text:factura.rfc_emisor},
                            {name:'Nombre', text:factura.nombre_emisor}
                        ]),
                    receptor: setArrayTable(
                        [
                            {name:'RFC', text:factura.rfc_receptor},
                            {name:'Nombre', text:factura.nombre_receptor}
                        ]),
                    usoCFDI: setTextTable(factura.uso_cfdi),
                    expedicion: setArrayTable(
                        [
                            {name:'Lugar', text:factura.lugar_expedicion},
                            {name:'Fecha', text:factura.fecha}
                        ]),
                    subtotal: setMoneyTable(factura.subtotal),
                    total: setMoneyTable(factura.total),
                    adjuntos: setAdjuntosList([
                        factura.pdf ? {name: 'factura.pdf', url: factura.pdf.url} : '',
                        factura.xml ? {name: 'factura.xml', url: factura.xml.url} : '',
                    ]),
                    fecha: setDateTable(factura.created_at)
                }
            )
        })
        return aux
    }

    componentDidUpdate(prevProps){
        if (prevProps.facturas !== this.props.facturas) {
            this.setState({
                ... this.state,
                data: this.setFactura(this.props.facturas)
            })
        }
    }

    render(){
        const { data } = this.state
        return(
            <>
                {
                    data.length ? 
                        <DataTable columns = { FACTURAS_COLUMNS } data = { data } hideSelector = { true } />
                    : ''
                }
                
            </>
        )
    }
}