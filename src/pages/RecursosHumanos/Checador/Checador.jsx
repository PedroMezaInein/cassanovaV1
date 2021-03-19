import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { errorAlert, printResponseErrorAlert } from '../../../functions/alert'
class Empleados extends Component {
    state = {

    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const checador = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!checador)
            history.push('/')
        let fecha = new Date();
        let quincena = ''
        if(fecha.getDate() < 15){
            quincena = 'A'
        }else{
            quincena = 'B'
        }
        let mes = fecha.getMonth()
        let año = fecha.getFullYear()
        this.getEmpleadosChecador(quincena, mes, año)
    }

    getEmpleadosChecador = async(quincena, mes, año) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/checador/${quincena}/${mes + 1}/${año}`, { responseType: 'json', headers: { 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        return (
            <Layout active={'rh'} {...this.props}>
                <Card className="card-custom gutter-b">
                    <Card.Header>
                        <Card.Title>
                            <h3 className="card-label">
                                Checador
                            </h3>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {/* <div className="table-responsive">
                            <table className="table table-bordered table responsive">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th colSpan="2" className="w-10">15/03</th>
                                        <th colSpan="2" className="w-10">16/03</th>
                                        <th colSpan="2" className="w-10">17/03</th>
                                        <th colSpan="2" className="w-10">18/03</th>
                                        <th colSpan="2" className="w-10">19/03</th>
                                        <th colSpan="2" className="w-10">Semana 1</th>
                                    </tr>
                                    <tr>
                                        <th rowSpan="2">Empleado</th>
                                        <th colSpan="2" className="w-10">Lunes</th>
                                        <th colSpan="2" className="w-10">Martes</th>
                                        <th colSpan="2" className="w-10">Miércoles</th>
                                        <th colSpan="2" className="w-10">Jueves</th>
                                        <th colSpan="2" className="w-10">Viernes</th>
                                        <th rowSpan="2" className="w-10">Horas extra</th>
                                        <th rowSpan="2" className="w-10">Total horas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Carina Jiménez García</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>9:30</td>
                                        <td>6:30</td>
                                        <td>9:30</td>
                                        <td>6:30</td>
                                        <td>9:30</td>
                                        <td>6:30</td>
                                        <td>9:30</td>
                                        <td>6:30</td>
                                        <td>1</td>
                                        <td>31</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="table-responsive mt-40">
                            <table className="table table-bordered table responsive">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th colSpan="2" className="w-10">15/03</th>
                                        <th colSpan="2" className="w-10">16/03</th>
                                        <th colSpan="2" className="w-10">17/03</th>
                                        <th colSpan="2" className="w-10">18/03</th>
                                        <th colSpan="2" className="w-10">19/03</th>
                                        <th colSpan="2" className="w-10">Semana 1</th>
                                    </tr>
                                    <tr>
                                        <th rowSpan="2">Empleado</th>
                                        <th colSpan="2" className="w-10">Lunes</th>
                                        <th colSpan="2" className="w-10">Martes</th>
                                        <th colSpan="2" className="w-10">Miércoles</th>
                                        <th colSpan="2" className="w-10">Jueves</th>
                                        <th colSpan="2" className="w-10">Viernes</th>
                                        <th rowSpan="2" className="w-10">Horas extra</th>
                                        <th rowSpan="2" className="w-10">Total horas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Carina Jiménez García</td>
                                        <td colSpan="2">09:30 - 06:30</td>
                                        <td colSpan="2">09:30 - 06:30</td>
                                        <td colSpan="2">09:30 - 06:30</td>
                                        <td colSpan="2">09:30 - 06:30</td>
                                        <td colSpan="2">09:30 - 06:30</td>
                                        <td>01</td>
                                        <td>31</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

                        {/* <div className="table-responsive">
                            <table className="table table-bordered table responsive">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th colSpan="2" className="w-4">15/03</th>
                                        <th colSpan="2" className="w-4">16/03</th>
                                        <th colSpan="2" className="w-4">17/03</th>
                                        <th colSpan="2" className="w-4">18/03</th>
                                        <th colSpan="2" className="w-4">19/03</th>
                                        <th colSpan="2" className="w-4">22/03</th>
                                        <th colSpan="2" className="w-4">23/03</th>
                                        <th colSpan="2" className="w-4">24/03</th>
                                        <th colSpan="2" className="w-4">25/03</th>
                                        <th colSpan="2" className="w-4">26/03</th>
                                        <th colSpan="2" className="w-4">29/03</th>
                                        <th colSpan="2" className="w-4">30/03</th>
                                        <th colSpan="2" className="w-4">31/03</th>
                                        <th colSpan="2" className="w-4">Quincena 2</th>
                                    </tr>
                                    <tr>
                                        <th rowSpan="2">Empleado</th>
                                        <th colSpan="2" className="w-4">LUN</th>
                                        <th colSpan="2" className="w-4">MAR</th>
                                        <th colSpan="2" className="w-4">MIÉ</th>
                                        <th colSpan="2" className="w-4">JUE</th>
                                        <th colSpan="2" className="w-4">VIE</th>
                                        <th colSpan="2" className="w-4">LUN</th>
                                        <th colSpan="2" className="w-4">MAR</th>
                                        <th colSpan="2" className="w-4">MIÉ</th>
                                        <th colSpan="2" className="w-4">JUE</th>
                                        <th colSpan="2" className="w-4">VIE</th>
                                        <th colSpan="2" className="w-4">LUN</th>
                                        <th colSpan="2" className="w-4">MAR</th>
                                        <th colSpan="2" className="w-4">MIÉ</th>
                                        <th rowSpan="2" className="w-4">Horas extra</th>
                                        <th rowSpan="2" className="w-4">Total horas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Carina Jiménez García</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>1</td>
                                        <td>31</td>
                                    </tr>
                                    <tr>
                                        <td>EDMUNDO DE JESUS ORTEGA ESPAÑA</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>1</td>
                                        <td>31</td>
                                    </tr>
                                    <tr>
                                        <td>MARIA FERNANDA SABANERO QUIROZ</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>09:30</td>
                                        <td>06:30</td>
                                        <td>1</td>
                                        <td>31</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}

                        <div id="checador" className="table-responsive">
                            <table className="table table-striped table-vertical-center table-hover">
                                <thead>
                                    <tr id="fechas">
                                        <th rowSpan="2">
                                            <span className="font-size-h4">Quincena 2</span>
                                        </th>
                                        <th colSpan="2" className="w-4-5">15/03</th>
                                        <th colSpan="2" className="w-4-5">16/03</th>
                                        <th colSpan="2" className="w-4-5">17/03</th>
                                        <th colSpan="2" className="w-4-5">18/03</th>
                                        <th colSpan="2" className="w-4-5">19/03</th>
                                        <th colSpan="2" className="w-4-5">22/03</th>
                                        <th colSpan="2" className="w-4-5">23/03</th>
                                        <th colSpan="2" className="w-4-5">24/03</th>
                                        <th colSpan="2" className="w-4-5">25/03</th>
                                        <th colSpan="2" className="w-4-5">26/03</th>
                                        <th colSpan="2" className="w-4-5">29/03</th>
                                        <th colSpan="2" className="w-4-5">30/03</th>
                                        <th colSpan="2" className="w-4-5">31/03</th>
                                        <th rowSpan="2" id="he" className="w-4-5">HORAS EXTRA</th>
                                        <th rowSpan="2" id="tl" className="w-4-5">TOTAL HORAS</th>
                                    </tr>
                                    <tr id="dias" className="text-center">
                                        <th colSpan="2" className="w-4-5">LUN</th>
                                        <th colSpan="2" className="w-4-5">MAR</th>
                                        <th colSpan="2" className="w-4-5">MIÉ</th>
                                        <th colSpan="2" className="w-4-5">JUE</th>
                                        <th colSpan="2" className="w-4-5">VIE</th>
                                        <th colSpan="2" className="w-4-5">LUN</th>
                                        <th colSpan="2" className="w-4-5">MAR</th>
                                        <th colSpan="2" className="w-4-5">MIÉ</th>
                                        <th colSpan="2" className="w-4-5">JUE</th>
                                        <th colSpan="2" className="w-4-5">VIE</th>
                                        <th colSpan="2" className="w-4-5">LUN</th>
                                        <th colSpan="2" className="w-4-5">MAR</th>
                                        <th colSpan="2" className="w-4-5">MIÉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td>
                                            <span className="font-weight-bolder">
                                                Carina Jiménez García
                                            </span>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div className="text-red font-weight-bolder">10:30</div>
                                            <div className="text-red font-weight-bolder">05:00</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td id="cantidad-he">1</td>
                                        <td id="cantidad-th">31</td>
                                    </tr>
                                    <tr className="text-center">
                                        <td>
                                            <span className="font-weight-bolder">
                                                MARIA FERNANDA SABANERO QUIROZ
                                            </span>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td colSpan="2">
                                            <div>09:30</div>
                                            <div>06:30</div>
                                        </td>
                                        <td id="cantidad-he">1</td>
                                        <td id="cantidad-th">31</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);