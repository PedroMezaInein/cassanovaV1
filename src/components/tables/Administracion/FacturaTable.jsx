import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import TableForModals from '../../../components/tables/TableForModals'
import { FACTURAS_COLUMNS_2 } from '../../../constants'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable, setAdjuntosList } from '../../../functions/setters'
import { deleteAlert } from '../../../functions/alert'

export default class FacturaTable extends Component {

    state = {
        data: [],
        dataArray: {
            facturas: []
        },
    }
    componentDidMount() {
        const { facturas } = this.props
        const { dataArray } = this.state
        dataArray.facturas = facturas
        this.setState({
            ...this.state,
            data: this.setFactura(facturas),
            dataArray
        })
    }

    setFactura = facturas => {
        let aux = []
        facturas.map((factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTable(factura.folio)),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    serie: renderToString(setTextTable(factura.serie)),
                    emisor: renderToString(setArrayTable(
                        [
                            { name: 'RFC', text: factura.rfc_emisor },
                            { name: 'Nombre', text: factura.nombre_emisor }
                        ])),
                    receptor: renderToString(setArrayTable(
                        [
                            { name: 'RFC', text: factura.rfc_receptor },
                            { name: 'Nombre', text: factura.nombre_receptor }
                        ])),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    adjuntos: renderToString(setAdjuntosList([
                        factura.pdf ? { name: 'factura.pdf', url: factura.pdf.url } : '',
                        factura.xml ? { name: 'factura.xml', url: factura.xml.url } : '',
                    ])),
                    descripcion: renderToString(setTextTable(factura.descripcion)),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    noCertificado: renderToString(setTextTable(factura.numero_certificado)),
                    id: factura.id
                }
            )
            return false
        })
        return aux
    }

    componentDidUpdate(prevProps) {
        const { dataArray } = this.state
        if (prevProps.facturas !== this.props.facturas) {
            dataArray.facturas = this.props.facturas
            this.setState({
                ...this.state,
                data: this.setFactura(this.props.facturas),
                dataArray
            })
        }
    }

    setActions = () => {
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
        deleteAlert('¿SEGURO DESEAS BORRAR LA FACTURA?','', () => deleteFactura(factura.id))
    }

    render() {
        const { data, dataArray } = this.state
        return (
            <>
                {
                    data.length ?
                        <>
                            <div className="separator separator-dashed mb-6 mt-5" />
                            <TableForModals
                                columns={FACTURAS_COLUMNS_2}
                                data={data}
                                hideSelector={true}
                                mostrar_acciones={true}
                                actions={{
                                    'delete': { function: this.openModalDeleteFactura }
                                }}
                                elements={dataArray.facturas}
                                idTable='kt_datatable_estado'
                                />
                            </>
                        :<></>
                }
            </>
        )
    }
}