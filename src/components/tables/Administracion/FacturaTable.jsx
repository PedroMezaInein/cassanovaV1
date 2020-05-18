import React, { Component } from 'react'
import DataTable from '../Data'
import { FACTURAS_COLUMNS_2 } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../../functions/setters'
import { deleteAlert } from '../../../functions/alert'
import { Button } from '../../form-components'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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
                    actions: this.setActions(factura),
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

    setActions = factura => {
        const { deleteFactura } = this.props
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" 
                        onClick={
                            (e) => 
                                {
                                    e.preventDefault(); 
                                    deleteAlert('¿Seguro deseas borrar la factura?', () => deleteFactura(factura.id) ) 
                                } 
                        } 
                        text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }

    render(){
        const { data } = this.state
        return(
            <>
                {
                    data.length ? 
                        <DataTable columns = { FACTURAS_COLUMNS_2 } data = { data } hideSelector = { true } />
                    : ''
                }
                
            </>
        )
    }
}