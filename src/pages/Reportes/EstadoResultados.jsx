import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../constants'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
import { TreeGrid } from '../../components/form-components'
import { FormEstadoResultados } from '../../components/forms'
import { waitAlert, errorAlert, printResponseErrorAlert } from '../../functions/alert'
import { setOptions } from '../../functions/setters'
import { setSingleHeader } from '../../functions/routers'
import { MoneyTransaction } from '../../components/Lottie'
class Normas extends Component {

    state = {
        title: '',
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            empresas: [],
            empresa: '',
        },
        options: {
            empresas: [],
        },
        datos: null
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const estado_resultado = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!estado_resultado)
            history.push('/')
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/options', { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    getReporteEstadosResultadosAxios = async () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        this.setState({...this.state, datos: null})
        await axios.post(`${URL_DEV}v2/reportes/estado-resultados`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { datos } = response.data
                this.setDatos(datos)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setDatos = (old) => {
        let { datos } = this.state
        datos = [
			{
				header: 'INGRESOS',
                total: 0,
				subtasks: [
					{
						header: 'VENTAS',
                        total: 0,
                        porcentaje: 0,
						subtasks: []
					},
					{
						header: 'DEVOLUCIONES',
                        total: 0,
                        porcentaje: 0,
						subtasks: [
							{
								header: 'PROYECTOS',
								total: 0
							}
						]
					},
					{
						header: 'VENTAS NETAS',
						total: 0,
                        porcentaje: 0,
						subtasks: [
							{ header: 'SIN FACTURA', porcentaje: 0, total: 0},
							{ header: 'CON FACTURA', porcentaje: 0, total: 0},
						]
					}
				]
			},
			{
				header: 'COSTOS DE VENTAS',
				subtasks: [
					{
						header: 'PROYECTOS',
						total: 0
					},
					{
						header: 'COSTOS NETOS',
						subtasks: [
							{ header: 'SIN FACTURA', porcentaje: 0, total: 0},
							{ header: 'CON FACTURA', porcentaje: 0, total: 0},
						]
					}
				]
			},
			{
				header: 'GANANCIA / PERDIDA BRUTA',
				porcentaje: 0,
				subtasks: [
					{ header: 'TOTAL VENTAS', total: 0},
					{ header: 'TOTAL COSTOS DE VENTAS', total: 0}
				]
			},
			{
				header: 'GASTOS',
				subtasks: [
					{
						header: 'DEPARTAMENTOS',
						total: 0,
						subtasks:[]
					},
					{
						header: 'TOTAL DE GASTOS',
						total: 0
					}
				]
			},
			{
				header: 'OTROS INGRESOS',
				subtasks: [
					{
						header: 'DEPARTAMENTOS',
						total: 0,
						subtasks:[]
					},
					{
						header: 'TOTAL DE INGRESOS',
						total: 0
					}
				]
			},
			{
				header: 'FLUJO DE EFECTIVO',
				total: 0
			}
		]
        let aux = []
        let aux2 = []
        let aux3 = []
        let total = 0 
        old.ingresos.ventas.datos.forEach((element) => {
            aux2 = []
            for (const index in element.proyectos) {
                aux3 = []
                for (const index2 in element.proyectos[index].subareas) {
                    total = element.proyectos[index].subareas[index2].total
                    aux3.push({
                        'header': element.proyectos[index].subareas[index2].nombre,
                        'porcentaje': ((total * 100) / element.proyectos[index].total)/100,
                        'total': total
                    })
                }
                total = element.proyectos[index].total
                aux2.push({
                    'header': element.proyectos[index].nombre,
                    'total': total,
                    'porcentaje': ((total * 100) /element.total)/100,
                    'subtasks': aux3
                })
            }
            
            total = element.total
            aux.push({
                'header': element.nombre,
                'total': total,
                'porcentaje': ((total * 100) /old.ingresos.ventas.total)/100,
                'subtasks': aux2
            })
        });
        aux.push({
            'header': 'TOTAL INGRESOS',
            'total': old.ingresos.ventas.total
        })
        datos[0].subtasks[0].subtasks = aux
        aux = []
        total = 0
        for (const index in old.ingresos.devoluciones.datos) {
            total = old.ingresos.devoluciones.datos[index].total
            aux.push({
                'header': old.ingresos.devoluciones.datos[index].nombre,
                'porcentaje': ((total * 100) /old.ingresos.devoluciones.total)/100,
                'total': total
            })
        }
        total = old.ingresos.devoluciones.total
        datos[0].subtasks[1].subtasks = [
            {
                header: 'PROYECTOS ',
                total: total,
                subtasks: aux
            },
            {
                header: 'TOTAL DEVOLUCIONES',
                total: total,
            }
        ]
        let total_ventas_netas = old.ingresos.ventas_netas.total
        datos[0].subtasks[0].total = old.ingresos.ventas.total
        datos[0].subtasks[0].porcentaje = ((old.ingresos.ventas.total * 100) /total_ventas_netas)/100
        datos[0].subtasks[1].total = old.ingresos.devoluciones.total
        datos[0].subtasks[1].porcentaje = ((old.ingresos.devoluciones.total * 100) /total_ventas_netas)/100
        datos[0].subtasks[2].total = total_ventas_netas
        datos[0].subtasks[2].porcentaje=  ((total_ventas_netas * 100) /total_ventas_netas)/100
        datos[0].subtasks[2].subtasks[0].total = old.ingresos.ventas_netas.datos.sin_factura
        datos[0].subtasks[2].subtasks[0].porcentaje = (old.ingresos.ventas_netas.datos.sin_factura * 100 / total_ventas_netas) / 100
        datos[0].subtasks[2].subtasks[1].total = old.ingresos.ventas_netas.datos.con_factura
        datos[0].subtasks[2].subtasks[1].porcentaje = (old.ingresos.ventas_netas.datos.con_factura * 100 / total_ventas_netas) /100
        datos[0].total = total_ventas_netas
        aux = []
        total = 0
        for (const index in old.costos_ventas.compras.datos) {
            aux2 = []
            for (const index2 in old.costos_ventas.compras.datos[index].subareas) {
                aux3 = []
                total = 0
                old.costos_ventas.compras.datos[index].subareas[index2].compras.forEach((compra) => {
                    total = total + compra.total
                })
                aux2.push({
                    'header': old.costos_ventas.compras.datos[index].subareas[index2].nombre,
                    'porcentaje': ((total * 100) / old.costos_ventas.compras.datos[index].total)/100,
                    'total': total
                })
            }
            total = old.costos_ventas.compras.datos[index].total
            aux.push({
                'header': old.costos_ventas.compras.datos[index].nombre,
                'total': total,
                'porcentaje': ((total * 100) /old.costos_ventas.costos_netos.total)/100,
                'subtasks': aux2
            })
        }
        total = old.costos_ventas.costos_netos.total
        datos[1].subtasks[0].subtasks = aux
        datos[1].subtasks[0].total = total
        datos[1].subtasks[1].total = old.costos_ventas.costos_netos.total
        datos[1].subtasks[1].subtasks[0].total = old.costos_ventas.costos_netos.datos.sin_factura
        datos[1].subtasks[1].subtasks[0].porcentaje = (old.costos_ventas.costos_netos.datos.sin_factura * 100 / old.costos_ventas.costos_netos.total) / 100
        datos[1].subtasks[1].subtasks[1].total = old.costos_ventas.costos_netos.datos.con_factura
        datos[1].subtasks[1].subtasks[1].porcentaje = (old.costos_ventas.costos_netos.datos.con_factura * 100 / old.costos_ventas.costos_netos.total)/100
        datos[1].total = old.costos_ventas.costos_netos.total
        datos[2].total = old.ingresos.ventas_netas.total - old.costos_ventas.costos_netos.total
        datos[2].porcentaje = ( (old.ingresos.ventas_netas.total - old.costos_ventas.costos_netos.total) * 100 / old.ingresos.ventas_netas.total ) /100
        datos[2].subtasks = [
            {
                'header': 'TOTAL VENTAS',
                'total': old.ingresos.ventas_netas.total,
            },
            {
                'header': 'TOTAL COSTOS DE VENTAS',
                'total': old.costos_ventas.costos_netos.total
            }
        ]
        aux = []
        total = 0
        for (const index in old.gastos.datos) {
            aux2 = []
            for (const index2 in old.gastos.datos[index].subareas) {
                aux3 = []
                total = 0
                old.gastos.datos[index].subareas[index2].egresos.forEach((egreso) => {
                    total = total + egreso.total
                })
                aux2.push({
                    'header': old.gastos.datos[index].subareas[index2].nombre,
                    'porcentaje': ((total * 100) / old.gastos.datos[index].total)/100,
                    'total': total
                })
            }
            total = old.gastos.datos[index].total
            aux.push({
                'header': old.gastos.datos[index].nombre+" ",
                'total': total,
                'porcentaje': ((total * 100) / old.gastos.total)/100,
                'subtasks': aux2
            })
        }
        total = old.gastos.total
        datos[3].subtasks[0].subtasks = aux
        datos[3].subtasks[0].total = total
        datos[3].subtasks[1].total = old.gastos.total
        datos[3].total = old.gastos.total

        aux = []
        total = 0
        for (const index in old.otros_ingresos.datos) {
            aux2 = []
            for (const index2 in old.otros_ingresos.datos[index].subareas) {
                aux3 = []
                total = 0
                old.otros_ingresos.datos[index].subareas[index2].ingresos.forEach((egreso) => {
                    total = total + egreso.total
                })
                aux2.push({
                    'header': old.otros_ingresos.datos[index].subareas[index2].nombre,
                    'porcentaje': ((total * 100) / old.otros_ingresos.datos[index].total)/100,
                    'total': total
                })
            }
            total = old.otros_ingresos.datos[index].total
            aux.push({
                'header': old.otros_ingresos.datos[index].nombre+" ",
                'total': total,
                'porcentaje': ((total * 100) / old.otros_ingresos.total)/100,
                'subtasks': aux2
            })
        }
        total = old.otros_ingresos.total
        datos[4].subtasks[0].subtasks = aux
        datos[4].subtasks[0].total = total
        datos[4].subtasks[1].total = old.otros_ingresos.total
        datos[4].total = old.otros_ingresos.total

        datos[5].total = old.otros_ingresos.total - old.gastos.total + old.ingresos.ventas_netas.total - old.costos_ventas.costos_netos.total

        this.setState({...this.state, datos: datos})
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){ this.getReporteEstadosResultadosAxios() }
        this.setState({ ...this.state, form })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){ this.getReporteEstadosResultadosAxios() }
    }

    render() {
        const { form, options, datos } = this.state
        return (
            <Layout {...this.props}>
                <div className="row">
                    <div className="col-lg-4">
                        <Card className="card-custom card-stretch gutter-b">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">ESTADO DE RESULTADOS</h3>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <FormEstadoResultados
                                    form={ form }
                                    options = { options } 
                                    onChangeRange = { this.onChangeRange }
                                    onChange={this.onChange}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-lg-8">
                        <Card className="card-custom card-stretch gutter-b">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">Resultados</h3>
                                </div>
                                </Card.Header>
                            <Card.Body className={datos !== null ?'':"d-flex align-items-center"}>
                                {
                                    datos !== null ?
                                        <TreeGrid datos = { datos } form = { form } options = { options }/>
                                    : <MoneyTransaction />
                                }
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Normas);