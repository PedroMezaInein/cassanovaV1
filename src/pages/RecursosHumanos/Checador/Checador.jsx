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
        quincena: new Date().getDate() < 15 ? '1' : '2',
        diasNumber:[],
        days:[],
        data:{
            users: [],
            feriados: [],
        },
        horasExtra:0,
        totalHoras:0,
        mes_number:0,
        arregloDiasFeriados:[]
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
        const { quincena, mes, año } = this.state
        let { mes_number } = this.state

        mes_number=this.mesNumber(mes)
        this.getEmpleadosChecador(quincena, mes_number, año)
    }
    getEmpleadosChecador = async(quincena, mes, año) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/checador/${quincena}/${mes}/${año}`, { responseType: 'json', headers: { 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { users, feriados} = response.data
                let { data, arregloDiasFeriados, diasNumber, days } = this.state

                data.users=users
                data.feriados = feriados
                arregloDiasFeriados=[]

                days=[]
                let arregloFinal =[]
                let arregloNombres =[]
                let arr = []

                let total_dias = new Date(año, meses.indexOf(mes) + 1, 0).getDate();
                for(let i = 0; i < total_dias; i++) {
                    arr.push(i+1);
                }
                if(parseInt(quincena) === 1){
                    diasNumber=arr.slice(0, 15);
                }else{
                    diasNumber=arr.slice(15,arr.length);
                }
                let day =''
                let daysFeriados =''
                data.feriados.map(element=>{
                    daysFeriados = new Date(element.fecha.replace(/-/g, '\/').replace(/T.+/, '')).getDate();
                    arregloDiasFeriados.push(daysFeriados)
                })
                let daysArray = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SAB"];
                for (let i of diasNumber) {
                    day = new Date(`${año} ${mes} ${i}`);
                    if(day.getDay()!== 0 && day.getDay() !==6){
                        let esFestivo = false
                        for(let x of arregloDiasFeriados) {
                            if(x===i) esFestivo=true;
                        }
                        if(!esFestivo){
                            arregloFinal.push(i)
                            arregloNombres.push(daysArray[day.getDay()])
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    data,
                    diasNumber:arregloFinal, 
                    days:arregloNombres
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getHours(user, day) {
        let timeFechaStart=''
        let timeFechaEnd=''
        let noCumplioHorario = false
        user.checadores.forEach(element=>{
            var fechaStart = new Date(element.fecha_inicio)
            var fechaEnd = new Date(element.fecha_fin)
            if(fechaStart.getDate() === day){
                timeFechaStart = this.setTimer(fechaStart.getHours()) + ":" + this.setTimer(fechaStart.getMinutes())
                if(element.fecha_fin=== null){
                    timeFechaEnd=''
                }else{
                    timeFechaEnd = this.setTimer(fechaEnd.getHours()) + ":" + this.setTimer(fechaEnd.getMinutes())
                }
                var fecha3 =fechaEnd-fechaStart
                var minutosTrabajados = Math.floor((fecha3/1000)/60)
                if(minutosTrabajados<480){
                    noCumplioHorario = true
                }
            }
        })
        return(
            <div>
                <div className={timeFechaStart >= '10:00'?'text-red font-weight-boldest':''}>{timeFechaStart}</div>
                <div className={noCumplioHorario===true?'text-red font-weight-boldest':''}>{timeFechaEnd}</div>
            </div>
        )
    }
    getHT(user, diasNumber){
        let minutosTotales = 0
        let fechaStart = ''
        let fechaEnd = ''
        let totalHorasQ = ''
        let totalHoras = ''
        user.checadores.forEach(element=>{
            if(element.fecha_fin=== null){
                fechaStart = new Date(element.fecha_inicio)
                fechaEnd = new Date(element.fecha_inicio)
            }else{
                fechaStart = new Date(element.fecha_inicio)
                fechaEnd = new Date(element.fecha_fin)
            }
            totalHorasQ = diasNumber.length*8 +':00'
            diasNumber.forEach(day=>{ 
                if(fechaStart.getDate() === day){
                    var fecha3 =fechaEnd-fechaStart
                    minutosTotales += Math.floor((fecha3/1000)/60);
                }
            })
        })
        var mm = minutosTotales%60
        var hh = (minutosTotales-mm)/60
        totalHoras = (this.setTimer(hh)+':'+this.setTimer(mm))
        return (
            <div className={totalHoras<totalHorasQ?'text-red font-weight-boldest':''}>
                {totalHoras}
            </div>
        )
    }
    getHE(user, diasNumber){
        let minutosTotales = 0
        let fechaStart = ''
        let fechaEnd = ''
        user.checadores.forEach(element=>{
            if(element.fecha_fin=== null){
                fechaStart = new Date(element.fecha_inicio)
                fechaEnd = new Date(element.fecha_inicio)
            }else{
                fechaStart = new Date(element.fecha_inicio)
                fechaEnd = new Date(element.fecha_fin)
            }
            diasNumber.forEach(day=>{
                if(fechaStart.getDate() === day){
                    var fecha3 =fechaEnd-fechaStart
                    var minutosTrabajados = Math.floor((fecha3/1000)/60)
                    if(minutosTrabajados>480){ 
                        minutosTotales += minutosTrabajados -480
                    }
                }
            })
        })
        var mm = minutosTotales%60
        var hh = (minutosTotales-mm)/60
        return (this.setTimer(hh)+':'+this.setTimer(mm))
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
    mesNumber(mes){
        let mes_number=0
        switch (mes) {
            case "Enero":
                mes_number = 1;
                break;
            case "Febrero":
                mes_number = 2;
                break;
            case "Marzo":
                mes_number = 3;
                break;
            case "Abril":
                mes_number = 4;
                break;
            case "Mayo":
                mes_number = 5;
                break;
            case "Junio":
                mes_number = 6;
                break;
            case "Julio":
                mes_number = 7;
                break;
            case "Agosto":
                mes_number = 8;
                break;
            case "Septiembre":
                mes_number = 9;
                break;
            case "Octubre":
                mes_number = 10;
                break;
            case "Noviembre":
                mes_number = 11;
                break;
            case "Diciembre":
                mes_number = 12;
                break;
            default: break;
        }
        return mes_number
    }
    // diasEnUnMes(quincena) {
    //     const { mes, año, arregloDiasFeriados} = this.state
    //     let { diasNumber, days, mes_number} = this.state
    //     mes_number=this.mesNumber(mes)
    //     this.getEmpleadosChecador(quincena, mes_number, año)

    //     let arregloFinal =[]
    //     let arregloNombres =[]
    //     days=[]
    //     let arr = []
    //     let total_dias = new Date(año, meses.indexOf(mes) + 1, 0).getDate();
    //     for(let i = 0; i < total_dias; i++) {
    //         arr.push(i+1);
    //     }
    //     if(parseInt(quincena) === 1){
    //         diasNumber=arr.slice(0, 15);
    //     }else{
    //         diasNumber=arr.slice(15,arr.length);
    //     }
    //     let day =''
    //     let daysArray = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SAB"];
    //     for (let i of diasNumber) {
    //         day = new Date(`${año} ${this.mesNumber(mes)} ${i}`);
    //         if(day.getDay()!== 0 && day.getDay() !==6){
    //             let esFestivo = false
    //             for(let x of arregloDiasFeriados) {
    //                 if(x===i) esFestivo=true;
    //             }
    //             if(!esFestivo){
    //                 arregloFinal.push(i)
    //                 arregloNombres.push(daysArray[day.getDay()])
    //             }
    //         }
    //     }
    //     this.setState({
    //         ...this.state,
    //         diasNumber:arregloFinal, 
    //         days:arregloNombres
    //     })
    // }
    updateAño = value => { 
        let { mes, quincena, mes_number} = this.state
        mes_number=this.mesNumber(mes)
        this.setState({...this.state, año: value})
        this.getEmpleadosChecador(quincena, mes_number, value)
    }
    updateMes = value => {
        let { año, quincena, mes_number} = this.state
        mes_number=this.mesNumber(value)
        this.setState({ ...this.state, mes: value })
        this.getEmpleadosChecador(quincena, mes_number, año)
    }
    updateQuincena = value => {
        let { mes, año, mes_number } = this.state
        mes_number=this.mesNumber(mes)
        this.setState({
            ...this.state,
            quincena: value
        })
        // this.diasEnUnMes(value)
        this.getEmpleadosChecador(value, mes_number, año)
    }
    render() {
        const { data, mes, año, quincena, diasNumber, days} = this.state
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
                                    name='año' options={getAños()}
                                    customdiv='mb-0'
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
                                    onChange={this.updateQuincena}
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
                                        </th>
                                        {
                                            diasNumber.map((element, key) => {
                                                return( 
                                                    <th key={key}>{element}</th>
                                                )
                                            })
                                        }
                                        <th rowSpan="2" id="he" className="w-4-5">HORAS EXTRA</th>
                                        <th rowSpan="2" id="tl" className="w-4-5">TOTAL HORAS</th>
                                    </tr>
                                    <tr id="dias" className="text-center">
                                        {
                                            days.map((element, key)=>{
                                                return(
                                                    <th className="w-4-5" key={key}>{element}</th>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.users.map((user,key)=>{
                                            return(
                                                <tr className="text-center" key={key}>
                                                    <td>
                                                        <span className="empleado">
                                                            {user.name}
                                                        </span>
                                                    </td>
                                                    {
                                                        diasNumber.map((element, key) => {
                                                            return(
                                                                <td key={key}>{this.getHours(user, element)}</td>
                                                            )
                                                        })
                                                    }
                                                    <td id="cantidad-he">{this.getHE(user, diasNumber)}</td>
                                                    <td id="cantidad-th">{this.getHT(user, diasNumber)}</td>
                                                </tr>
                                            )
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