import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { getMeses, getAños, getQuincena } from '../../../functions/setters'
import { errorAlert, printResponseErrorAlert } from '../../../functions/alert'
import { SelectSearchGray } from '../../../components/form-components'
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class Empleados extends Component {
    state = {
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        // dias: this.diasEnUnMes(meses[new Date().getMonth()],new Date().getFullYear()),
        quincena: 'B',
        data:{
            users: [],
            feriados: [],
        },
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
                const { users, feriados} = response.data
                let { data } = this.state
                data.users=users
                data.feriados = feriados
                this.setState({
                    ...this.state,
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getHours(dateTimeStart) {
        var fechaStart = new Date(dateTimeStart)
        var horaStart = this.setTimer(fechaStart.getHours()) + ":" + this.setTimer(fechaStart.getMinutes())
        return horaStart
    }

    setTimer = (time) => {
        switch (time) {
            case 0:
                return '00'
            case 1:
                return '01'
            case 2:
                return '02'
            case 3:
                return '03'
            case 4:
                return '04'
            case 5:
                return '05'
            case 6:
                return '06'
            case 7:
                return '07'
            case 8:
                return '08'
            case 9:
                return '09'
            default:
                return time
        }
    }

    diasEnUnMes(mes, año) {
        let dias = new Date(año, meses.indexOf(mes) + 1, 0).getDate()
        return ` ${dias} / ${mes}`;
    }
    // isActiveBackButton = () => {
    //     const { mes, año } = this.state
    //     let actualMonth = meses.indexOf(mes)
    //     if (actualMonth === 0) {
    //         let _mes = new Date().getMonth()
    //         let _año = new Date().getFullYear()
    //         let minimoAño = _año
    //         if (_mes > 9)
    //             minimoAño = _año - 3;
    //         else
    //             minimoAño = _año - 4;
    //         if (año.toString() === minimoAño.toString())
    //             return false
    //     }
    //     return true
    // }
    // isActiveForwardButton = () => {
    //     const { mes, año } = this.state
    //     let actualMonth = meses.indexOf(mes)
    //     if (actualMonth === 11) {
    //         let _mes = new Date().getMonth()
    //         let _año = new Date().getFullYear()
    //         let maximoAño = _año
    //         if (_mes > 9)
    //             maximoAño = _año + 1;
    //         else
    //             maximoAño = _año;
    //         if (año.toString() === maximoAño.toString())
    //             return false
    //     }
    //     return true
    // }
    // changeMonth = (direction) => {
    //     const { mes, año } = this.state
    //     let actualMonth = meses.indexOf(mes)
    //     let newMonth = meses[actualMonth]
    //     let newYear = año
    //     if (direction === 'back') {
    //         if (actualMonth === 0) {
    //             newMonth = meses[11]
    //             newYear = (año - 1).toString() 
    //         } else {
    //             newMonth = meses[actualMonth - 1]
    //         }
    //     } else {
    //         if (actualMonth === 11) {
    //             newMonth = meses[0]
    //             newYear = (parseInt(año) + 1).toString() 
    //         } else {
    //             newMonth = meses[actualMonth + 1]
    //         }
    //     }
    // }
    diasEnUnMes(mes, año) { return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); }

    updateMes = value => { this.setState({ ...this.state, mes: value }) }
    
    updateAño = value => { this.setState({...this.state, año: value}) }
    render() {
        const { data, mes, año, quincena, dias} = this.state
        console.log( data.users )
        return (
            <Layout active={'rh'} {...this.props}>
                <Card className="card-custom gutter-b">
                    <Card.Header>
                        <Card.Title>
                            <h3 className="card-label">
                                Checador
                            </h3>
                        </Card.Title>
                        <div className="card-toolbar row mx-0 row-paddingless d-flex justify-content-end ">
                            <div className="col-md-3 mr-4">
                                <SelectSearchGray
                                    name='año' options={getAños()} customdiv='mb-0'
                                    value = { año }
                                    onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day"
                                />
                            </div>
                            <div className="col-md-3 mr-4">
                                <SelectSearchGray
                                    name='mes'
                                    options={getMeses()} 
                                    value={mes}
                                    customdiv='mb-0'
                                    onChange={this.updateMes}
                                    iconclass="fas fa-calendar-day"
                                />
                            </div>
                            <div className="col-md-2 mr-4">
                                <SelectSearchGray
                                    name='mes'
                                    options={getQuincena()} 
                                    value={quincena}
                                    customdiv='mb-0'
                                    onChange={this.updateMes}
                                    iconclass="fas fa-calendar-day"
                                />
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div id="checador" className="table-responsive">
                            <table className="table table-vertical-center mb-0">
                                <thead>
                                    <tr id="fechas">
                                        <th rowSpan="2" className="quincena">
                                            <div className="empleado font-size-h4">{`${mes} ${año}`}</div>
                                            <div className="font-size-md">Quincena 2</div>
                                            <div>
                                                {/* <div className="btn-group">
                                                    <span className={`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveBackButton() ? 'enabled' : 'disabled'}`}
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                if (this.isActiveBackButton())
                                                                    this.changeMonth('back')
                                                            }
                                                        }>
                                                        <i className="fa fa-chevron-left icon-xs" />
                                                    </span>
                                                    <span className={`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveForwardButton() ? 'enabled' : 'disabled'}`}
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                if (this.isActiveForwardButton())
                                                                    this.changeMonth('forward')
                                                            }
                                                        }>
                                                        <i className="fa fa-chevron-right icon-xs" />
                                                    </span>
                                                </div> */}
                                            </div>
                                        </th>
                                        {
                                            [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                            return( <th key = {key}>{key + 1}</th> )
                                        })
                                        }
                                        {/* <th colSpan="2" className="w-4-5">15/03</th>
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
                                        <th colSpan="2" className="w-4-5">31/03</th> */}
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
                                    {
                                        data.users.map((user,key)=>{
                                            if(user.checadores.length){
                                                return(
                                                    <tr className="text-center" key={key}>
                                                        <td>
                                                            <span className="empleado">
                                                                {user.name}
                                                            </span>
                                                        </td>
                                                        {
                                                            user.checadores.map((checador, key) =>{
                                                                return(
                                                                    <td colSpan="2" key={key}>
                                                                        <div>{this.getHours(checador.fecha_inicio)}</div>
                                                                        <div>{this.getHours(checador.fecha_fin)}</div>
                                                                    </td>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                    // <tr className="text-center" key={key}>
                                                    //     <td>
                                                    //         <span className="empleado">
                                                    //             {user.name}
                                                    //         </span>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div className="text-red font-weight-bolder">10:30</div>
                                                    //         <div className="text-red font-weight-bolder">05:00</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td colSpan="2">
                                                    //         <div>09:30</div>
                                                    //         <div>06:30</div>
                                                    //     </td>
                                                    //     <td id="cantidad-he">1</td>
                                                    //     <td id="cantidad-th">31</td>
                                                    // </tr>
                                                )
                                            }
                                        })
                                    }
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