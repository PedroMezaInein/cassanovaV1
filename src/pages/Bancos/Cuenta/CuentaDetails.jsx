import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import NewTable from '../../../components/tables/NewTable'
import { DETAILS_CUENTAS, URL_DEV } from '../../../constants'
import { renderToString } from 'react-dom/server'
import { setMoneyTable, setDateTable } from '../../../functions/setters'
import { Tab, Tabs } from 'react-bootstrap'
import { errorAlert, waitAlert, printResponseErrorAlert } from '../../../functions/alert'
import { Small } from '../../../components/texts'
import Swal from 'sweetalert2'
import { setSingleHeader } from '../../../functions/routers'
class CuentaDetails extends Component {
    state = {
        key: 'traspasos_destino',
        cuenta: '',
        cuentas: [],
        totales: [],
        data: {
            cuentas: [],
            compras: [],
            egresos: [],
            ingresos: [],
            traspasos_destino: [],
            traspasos_origen: [],
            ventas: [],
            nombre: ''
        },
        aux: {
            compras: true,
            egresos: true,
            ingresos: true,
            traspasos_destino: true,
            traspasos_origen: true,
            ventas: true,
            devoluciones: false,
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        const { state } = this.props.location
        if (state) {
            if (state.cuenta) {
                this.getCuentaAxios(state.cuenta.id)
            }
        }

    }

    async getCuentaAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/bancos/cuentas/${id}/detalles`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { cuenta } = response.data
                const { data } = this.state
                data.compras = this.setCompras(cuenta.compras)
                data.devoluciones = this.setDevoluciones(cuenta.devoluciones)
                data.egresos = this.setEgresos(cuenta.egresos)
                data.ingresos = this.setIngresos(cuenta.ingresos)
                data.traspasos_destino = this.setTraspasosDestino(cuenta.traspasos_destino)
                data.traspasos_origen = this.setTraspasosOrigen(cuenta.traspasos_origen)
                data.ventas = this.setVentas(cuenta.ventas)
                this.setState({ ...this.state, data, cuenta: cuenta })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setLinks = value => { return ( <a href={value.url}> <Small> { value.name } </Small> </a> ) }

    setCompras = compras => {
        let aux = []
        compras.map((compra) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: compra.id, url: '/proyectos/compras?id='+compra.id})),
                    fecha: renderToString(setDateTable(compra.created_at)),
                    monto: renderToString(setMoneyTable(compra.total)),
                    id: compra.id
                }
            )
            return false
        })
        return aux
    }

    setDevoluciones = devoluciones => {
        let aux = []
        devoluciones.map((devolucion) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: devolucion.id, url: '/proyectos/devoluciones?id='+devolucion.id})),
                    fecha: renderToString(setDateTable(devolucion.created_at)),
                    monto: renderToString(setMoneyTable(devolucion.total)),
                    id: devolucion.id
                }
            )
            return false
        })
        return aux
    }

    setEgresos = egresos => {
        let aux = []
        egresos.map((egreso) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: egreso.id, url: '/administracion/egresos?id='+egreso.id})),
                    fecha: renderToString(setDateTable(egreso.created_at)),
                    monto: renderToString(setMoneyTable(egreso.total)),
                    id: egreso.id
                }
            )
            return false
        })
        return aux
    }

    setIngresos = ingresos => {
        let aux = []
        ingresos.map((ingreso) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: ingreso.id, url: '/administracion/ingresos?id='+ingreso.id})),
                    fecha: renderToString(setDateTable(ingreso.created_at)),
                    monto: renderToString(setMoneyTable(ingreso.monto)),
                }
            )
            return false
        })
        return aux
    }

    setTraspasosDestino = traspasos_destino => {
        let aux = []
        traspasos_destino.map((traspaso_destino) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: traspaso_destino.id, url: '/bancos/traspasos?id='+traspaso_destino.id})),
                    fecha: renderToString(setDateTable(traspaso_destino.created_at)),
                    monto: renderToString(setMoneyTable(traspaso_destino.cantidad)),
                    id: traspaso_destino.id
                }
            )
            return false
        })
        return aux
    }

    setTraspasosOrigen = traspasos_origen => {
        let aux = []
        traspasos_origen.map((traspaso_origen) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: traspaso_origen.id, url: '/bancos/traspasos?id='+traspaso_origen.id})),
                    fecha: renderToString(setDateTable(traspaso_origen.created_at)),
                    monto: renderToString(setMoneyTable(traspaso_origen.cantidad)),
                    id: traspaso_origen.id
                }
            )
            return false
        })
        return aux
    }

    setVentas = ventas => {
        let aux = []
        ventas.map((venta) => {
            aux.push(
                {
                    idTraspaso: renderToString(this.setLinks({name: venta.id, url: '/proyectos/ventas?id='+venta.id})),
                    fecha: renderToString(setDateTable(venta.created_at)),
                    monto: renderToString(setMoneyTable(venta.monto)),
                    id: venta.id
                }
            )
            return false
        })
        return aux
    }

    controlledTab = value => {
        let auxiliar = ''
        switch (value) {
            case 'compras':
                auxiliar = {
                    compras: true,
                    egresos: false,
                    devoluciones: false,
                    ingresos: false,
                    traspasos_destino: false,
                    traspasos_origen: false,
                    ventas: false
                };
                break;
            case 'devoluciones':
                auxiliar = {
                    compras: false,
                    devoluciones: true,
                    egresos: false,
                    ingresos: false,
                    traspasos_destino: false,
                    traspasos_origen: false,
                    ventas: false
                };
                break;
            case 'egresos':
                auxiliar = {
                    compras: false,
                    devoluciones: false,
                    egresos: true,
                    ingresos: false,
                    traspasos_destino: false,
                    traspasos_origen: false,
                    ventas: false
                };
                break;
            case 'ingresos':
                auxiliar = {
                    compras: false,
                    devoluciones: false,
                    egresos: false,
                    ingresos: true,
                    traspasos_destino: false,
                    traspasos_origen: false,
                    ventas: true
                };
                break;
            case 'traspasos_destino':
                auxiliar = {
                    compras: false,
                    devoluciones: false,
                    egresos: false,
                    ingresos: false,
                    traspasos_destino: true,
                    traspasos_origen: false,
                    ventas: false
                };
                break;
            case 'traspasos_origen':
                auxiliar = {
                    compras: false,
                    devoluciones: false,
                    egresos: false,
                    ingresos: false,
                    traspasos_destino: false,
                    traspasos_origen: true,
                    ventas: false
                };
                break;
            case 'ventas':
                auxiliar = {
                    compras: false,
                    devoluciones: false,
                    egresos: false,
                    ingresos: false,
                    traspasos_destino: false,
                    traspasos_origen: false,
                    ventas: true
                };
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            aux: auxiliar,
            key: value
        })
    }

    render() {
        const { cuenta, data, key } = this.state
        return (
            <Layout active={'bancos'} {...this.props}>
                <Tabs defaultActiveKey="traspasos_destino" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="traspasos_destino" title="Traspasos Destino">
                        {
                            key === 'traspasos_destino' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.traspasos_destino}
                                    title={"Traspasos Destino"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    // elements={data.traspasos_destino}
                                    idTable='kt_datatable_traspasos_a'
                                    cardTable='cardTable_traspasos_a'
                                    cardTableHeader='cardTableHeader_traspasos_a'
                                    cardBody='cardBody_traspasos_a'
                                    isTab={true}
                                // ocultarHeader={'d-none'}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="ventas" title="Ventas">
                        {
                            key === 'ventas' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.ventas}
                                    title={"Ventas"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    // elements={data.ventas}
                                    idTable='kt_datatable_ventas'
                                    cardTable='cardTable_ventas'
                                    cardTableHeader='cardTableHeader_ventas'
                                    cardBody='cardBody_ventas'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="ingresos" title="Ingresos">
                        {
                            key === 'ingresos' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.ingresos}
                                    title={"Ingresos"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    // elements={data.ingresos}
                                    idTable='kt_datatable_ingresos'
                                    cardTable='cardTable_ingresos'
                                    cardTableHeader='cardTableHeader_ingresos'
                                    cardBody='cardBody_ingresos'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="devoluciones" title="Devoluciones">
                        {
                            key === 'devoluciones' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.devoluciones}
                                    title={"Devoluciones"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    elements={data.devoluciones}
                                    idTable='kt_datatable_devoluciones'
                                    cardTable='cardTable_devoluciones'
                                    cardTableHeader='cardTableHeader_devoluciones'
                                    cardBody='cardBody_devoluciones'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="traspasos_origen" title="Traspasos Origen">
                        {
                            key === 'traspasos_origen' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.traspasos_origen}
                                    title={"Transpaso Origen"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    elements={data.traspasos_origen}
                                    idTable='kt_datatable_traspasos_de'
                                    cardTable='cardTable_traspasos_de'
                                    cardTableHeader='cardTableHeader_traspasos_de'
                                    cardBody='cardBody_traspasos_de'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="compras" title="Compras">
                        {
                            key === 'compras' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.compras}
                                    title={"Compras"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    elements={data.compras}
                                    idTable='kt_datatable_compras'
                                    cardTable='cardTable_compras'
                                    cardTableHeader='cardTableHeader_compras'
                                    cardBody='cardBody_compras'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey="egresos" title="Egresos">
                        {
                            key === 'egresos' ?
                                <NewTable
                                    columns={DETAILS_CUENTAS}
                                    data={data.egresos}
                                    title={"Transpaso Destino"}
                                    subtitle={cuenta.nombre}
                                    mostrar_boton={false}
                                    abrir_modal={false}
                                    mostrar_acciones={false}
                                    elements={data.egresos}
                                    idTable='kt_datatable_egresos'
                                    cardTable='cardTable_egresos'
                                    cardTableHeader='cardTableHeader_egresos'
                                    cardBody='cardBody_egresos'
                                    isTab={true}
                                />
                                : ''
                        }
                    </Tab>
                </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(CuentaDetails);