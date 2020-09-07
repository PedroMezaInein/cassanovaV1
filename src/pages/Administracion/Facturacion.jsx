import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS } from '../../constants'
import NewTable from '../../components/tables/NewTable'
import { Small, B } from '../../components/texts'
import { setTextTable, setMoneyTable, setDateTable, setLabelTable } from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert, doneAlert, waitAlert} from '../../functions/alert'
import { Modal, ItemSlider} from '../../components/singles'
import { Button } from '../../components/form-components'
class Facturacion extends Component {

    state = {
        modal: false,
        facturas: [],
        factura: '',
        data: {
            facturas: []
        },
        form: {
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        let aux = pathname.substr(1, pathname.length - 1)
        const facturas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!facturas)
            history.push('/')
        this.getFacturas()
    }

    setFactura = facturas => {
        let aux = []
        facturas.map((factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTable(factura.folio)),
                    estatus: renderToString(this.setLabelTable(factura)),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    serie: renderToString(setTextTable(factura.serie)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    acumulado: renderToString(setMoneyTable(factura.ventas_count + factura.ingresos_count)),
                    restante: renderToString(setMoneyTable(factura.total - factura.ventas_count - factura.ingresos_count)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    descripcion: renderToString(setTextTable(factura.descripcion)),
                    noCertificado: renderToString(setTextTable(factura.numero_certificado)),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    id: factura.id,
                    objeto: factura
                }
            )
        })
        return aux
    }

    setActions = factura => {

        let aux = []

        if (!factura.cancelada) {
            aux.push(
                {
                    text: 'Cancelar',
                    btnclass: 'danger',
                    iconclass: "flaticon-close",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }

        if(factura.cancelada){
            aux.push(
                {
                    text: 'Mostrar adjuntos',
                    btnclass: 'success',
                    iconclass: "flaticon-attachment",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }

        return aux
    }

    setLabelTable = objeto => {
        let restante = objeto.total - objeto.ventas_count - objeto.ingresos_count
        let text = {}
        if (objeto.cancelada) {
            text.letra = '#8950FC'
            text.fondo = '#EEE5FF'
            text.estatus = 'CANCELADA'
        } else {
            if (restante <= 1) {
                text.letra = '#388E3C'
                text.fondo = '#E8F5E9'
                text.estatus = 'PAGADA'
            } else {
                text.letra = '#F64E60'
                text.fondo = '#FFE2E5'
                text.estatus = 'PENDIENTE'
            }
        }

        return setLabelTable(text)
    }


    setAdjuntosTable = factura => {
        return (
            <div>
                {
                    factura.xml ?
                        <a href={factura.xml.url} target="_blank">
                            <Small>
                                factura.xml
                            </Small>
                        </a>
                        : ''
                }
                <br />
                {
                    factura.pdf ?
                        <a href={factura.pdf.url} target="_blank">
                            <Small>
                                factura.pdf
                            </Small>
                        </a>
                        : ''
                }
            </div>
        )
    }

    setInfoTable = (rfc, nombre) => {
        return (
            <div>
                <Small className="mr-1" >
                    <B color="gold">
                        RFC:
                    </B>
                </Small>
                <Small>
                    {rfc}
                </Small>
                <br />
                <Small className="mr-1" >
                    <B color="gold">
                        Nombre:
                    </B>
                </Small>
                <Small>
                    {nombre}
                </Small>
            </div>
        )
    }

    cancelarFactura = (factura) => {
        const { form } = this.state

        let aux = []
        factura.adjuntos_cancelados.map((adjunto)=> {
            aux.push({
                name: adjunto.name,
                url: adjunto.url
            })
        })

        form.adjuntos.adjuntos.files = aux

        this.setState({
            ... this.state,
            modal: true,
            factura: factura,
            form
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleChange = (files, item) => {
        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }
    
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async cancelarFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form, factura } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'facturas/cancelar/' + factura.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
                doneAlert('Factura cancelada con éxito')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getFacturas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturas, facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm()
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.cancelarFacturaAxios(e)
    }

    render() {
        const { facturas, data, modal, form } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTable
                    columns={FACTURAS_COLUMNS}
                    data={facturas}
                    title='Facturas'
                    subtitle='Listado de facturas'
                    mostrar_boton={false}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    elements={data.facturas}
                    tipo_validacion='facturas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    idTable='facturas-table'
                    actions={{
                        'cancelarFactura': { function: this.cancelarFactura }
                    }}
                />
                <Modal size="lg" title={"Agregar adjuntos"} show={modal} handleClose={this.handleClose} >
                    <div className="mt-4 mb-4">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            handleChange={this.handleChange}
                            item="adjuntos"
                            multiple = {true}
                        />
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button text='ENVIAR' 
                                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.cancelarFacturaAxios() }}
                                    className="btn btn-primary mr-2" />
                            </div>
                        </div>
                    </div>
                </Modal>

            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);