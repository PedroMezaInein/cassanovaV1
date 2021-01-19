import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearch } from '../../../components/form-components'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import Chart from 'react-google-charts'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class PlanTrabajo extends Component{

    state = {
        mes: meses[new Date().getMonth()],
        form:{
            mes: meses[new Date().getMonth()],
        },
        data: [],
        options: [
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'string', label: 'Resource' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'Fecha fin' },
            { type: 'number', label: 'Duración' },
            { type: 'number', label: 'Percent Complete' },
            { type: 'string', label: 'Dependencies' },
        ]
    }

    componentDidMount(){
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios()
    }

    // ANCHOR ASYNC CALL TO GET CONTENT
    getContentAxios = async() => {
        const { access_token } = this.props.authUser
        const { mes } = this.state
        console.log(URL_DEV, "URL_DEV")
        await axios.get(`${URL_DEV}mercadotecnia/plan-trabajo/${mes}`, { headers: {Authorization: `Bearer ${access_token}`} } ).then(
            (response) => {
                const { options } = this.state
                let data = [ options, 
                    [
                        '1',
                        'Junta con cliente',
                        'ventas',
                        new Date(2021, 0, 1),
                        null,
                        1 * 24 * 60 * 60 * 1000,
                        100,
                        null
                    ],
                    [
                        '2',
                        'Presupuesto de obra',
                        'obra',
                        new Date(2021, 0, 2),
                        null,
                        4 * 24 * 60 * 60 * 1000,
                        100,
                        '1'
                    ],
                    [
                        '3',
                        'Compra de materiales',
                        'ventas',
                        new Date(2021, 0, 4),
                        null,
                        2 * 24 * 60 * 60 * 1000,
                        100,
                        '1'
                    ],
                    [
                        '4',
                        'Ejecución de obra',
                        'obra',
                        new Date(2021, 0, 6),
                        null,
                        25 * 24 * 60 * 60 * 1000,
                        100,
                        '2,3'
                    ]
                ]
                this.setState({
                    ...this.state,
                    data: data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        }) 
    }

    getMeses = () => {
        return [
            { name: 'Enero', value: 'Enero' },
            { name: 'Febrero', value: 'Febrero' },
            { name: 'Marzo', value: 'Marzo' },
            { name: 'Abril', value: 'Abril' },
            { name: 'Mayo', value: 'Mayo' },
            { name: 'Junio', value: 'Junio' },
            { name: 'Julio', value: 'Julio' },
            { name: 'Agosto', value: 'Agosto' },
            { name: 'Septiembre', value: 'Septiembre' },
            { name: 'Octubre', value: 'Octubre' },
            { name: 'Noviembre', value: 'Noviembre' },
            { name: 'Diciembre', value: 'Diciembre' }
        ]
    }
    
    render(){
        const { form, mes, options, data } = this.state
        return(
            <Layout active = 'mercadotecnia' { ... this.props}>
                <Card className = 'card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo {meses[mes]}
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar align-items-center">
                            <div className = 'mr-3 d-flex'>
                                <SelectSearch name = 'mes' options = { this.getMeses() } value = { mes }
                                    onChange = { this.updateMes } iconclass = "fas fa-calendar-day"
                                    messageinc = "Incorrecto. Selecciona el mes." />
                            </div>
                            <Button icon = '' className = 'btn btn-light-success btn-sm font-weight-bold' 
                                only_icon = 'flaticon2-writing pr-0 mr-2' text = 'Agendar plan'
                                onClick = { console.log('Parrilla de contenido') } />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className = ''>
                            <Chart width = '100%' height = '400px' chartType = 'Gantt' loader = { <div>Cargando</div>}
                                chartLanguage = 'es'
                                data = { data } options = { 
                                    {
                                        gantt: {
                                            criticalPathEnabled: false,
                                            defaultStartDateMillis: new Date(2021,0,1),
                                        }
                                    }
                                } 
                                chartEvents = { [
                                    {
                                        eventName: 'select',
                                        callback: ({ chartWrapper }) => {
                                            const chart = chartWrapper.getChart()
                                            const selection = chart.getSelection()
                                            if (selection.length === 1) {
                                                const [selectedItem] = selection
                                                const dataTable = chartWrapper.getDataTable()
                                                const { row } = selectedItem
                                                alert(
                                                    'You selected : ' +
                                                    JSON.stringify({
                                                        row,
                                                        value: dataTable.getValue(row, 0),
                                                    }),
                                                    null,
                                                    2,
                                                )
                                            }
                                            console.log(selection, chart)
                                        },
                                    },
                                ]}
                                />
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)