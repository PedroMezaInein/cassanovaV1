import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import TableForModals from '../../../components/tables/TableForModals'
import { FACTURAS_COLUMNS_2 } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../../functions/setters'
import { deleteAlert } from '../../../functions/alert'
import { Button } from '../../form-components'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../../components/tables'
import swal from 'sweetalert'

export default class FacturaTable extends Component{

    state = {
        data: [],
        dataArray: {
            facturas: []
        },
    }
    componentDidMount(){
        const { facturas } = this.props
        const { dataArray } = this.state
        dataArray.facturas = facturas
        this.setState({
            ... this.state,
            data: this.setFactura(facturas),
            dataArray
        })
    }

    //Setter
    setFactura = facturas => {
        let aux = []
        const { data } = this.state
        facturas.map( (factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTable(factura.folio)),
                    serie: renderToString(setTextTable(factura.serie)),
                    noCertificado: renderToString(setTextTable(factura.numero_certificado)),
                    emisor: renderToString(setArrayTable(
                        [
                            {name:'RFC', text:factura.rfc_emisor},
                            {name:'Nombre', text:factura.nombre_emisor}
                        ])),
                    receptor: renderToString(setArrayTable(
                        [
                            {name:'RFC', text:factura.rfc_receptor},
                            {name:'Nombre', text:factura.nombre_receptor}
                        ])),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    expedicion: renderToString(setArrayTable(
                        [
                            {name:'Lugar', text:factura.lugar_expedicion}
                        ])),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    adjuntos: renderToString(setAdjuntosList([
                        factura.pdf ? {name: 'factura.pdf', url: factura.pdf.url} : '',
                        factura.xml ? {name: 'factura.xml', url: factura.xml.url} : '',
                    ])),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    id: factura.id
                }
            )
        })
        return aux
    }

    componentDidUpdate(prevProps){
        const { dataArray } = this.state
        if (prevProps.facturas !== this.props.facturas) {
            dataArray.facturas = this.props.facturas
            this.setState({
                ... this.state,
                data: this.setFactura(this.props.facturas),
                dataArray
            })
        }
    }

    /*setActions = factura => {
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
    }*/
    setActions = factura => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }            
        )        
        return aux
    }
    openModalDeleteFactura = (factura) => {
        const { deleteFactura } = this.props
        swal({
            title: '¿Seguro deseas borrar la factura?',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                deleteFactura(factura.id)             
            }            
        })
    } 

    render(){
        const { data, dataArray } = this.state 
        return(
            <>
                {
                    data.length ? 
                     //   <DataTable columns = { FACTURAS_COLUMNS_2 } data = { data } hideSelector = { true } />
                    <TableForModals 
                            columns = { FACTURAS_COLUMNS_2 } 
                            data = { data } 
                            hideSelector = { true } 
                            mostrar_acciones={true}
                            actions={{
                                'delete': { function: this.openModalDeleteFactura}
                            }}
                            elements={dataArray.facturas}

                            idTable = 'kt_datatable_estado'/>
                        : ''
                }
                
            </>
        )
    }
}