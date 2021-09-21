import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import axios from 'axios'
import { PUSHER_OBJECT, URL_DEV } from '../../../constants'
import { getMeses, getAños, getQuincena } from '../../../functions/setters'
import { doneAlert, errorAlert, printResponseErrorAlert } from '../../../functions/alert'
import { SelectSearchGray } from '../../../components/form-components'
import Echo from 'laravel-echo';
import { setSingleHeader } from '../../../functions/routers'
/* import Pusher from 'pusher-js'; */
// import moment from 'moment'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
// const day = moment().format('YYYY-MM-DD')
// const validador = moment("2021-07-01").isSameOrAfter(day);
const horasPorTrabajar = 9
class Checador extends Component {
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
        if(process.env.NODE_ENV === 'production'){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('rrhh-checador').listen('UsuarioChecando', (data) => {
                let { mes, quincena, mes_number, año} = this.state
                mes_number=this.mesNumber(mes)
                this.getEmpleadosChecador(quincena, mes_number, año)
            })
        }
    }
    getEmpleadosChecador = async(quincena, mes, año) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/checador/${quincena}/${mes}/${año}`, { responseType: 'json', headers: { 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { users, feriados} = response.data
                let { data, arregloDiasFeriados, diasNumber } = this.state

                data.users=users
                data.feriados = feriados
                arregloDiasFeriados=[]
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
                data.feriados.forEach( (element) => {
                    daysFeriados = new Date(element.fecha.replace(/-/g, '/').replace(/T.+/, '')).getDate();
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
            console.error(error, 'error')
        })
    }

    exportAxios = async() => {
        const { quincena, mes, año } = this.state
        let mes_number=this.mesNumber(mes)
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/checador/exportar?quincena=${quincena}&mes=${mes_number}&anio=${año}`, 
            { responseType:'blob', headers: setSingleHeader(access_token)}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${quincena}Q-${mes_number}-${año}.xlsx`);
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Proyectos exportados con éxito.')
            }, (error) => { printResponseErrorAlert(error) }    
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                if(minutosTrabajados<(horasPorTrabajar * 60)){
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
    getDifHours = (user, day) => {
        let diference = 0
        let auxFin = null
        let auxInicio = null
        user.checadores.forEach(element=>{
            var fechaStart = new Date(element.fecha_inicio)
            var fechaEnd = new Date(element.fecha_fin)
            if(fechaStart.getDate() === day){
                auxInicio = element.fecha_inicio
                auxFin = element.fecha_fin
                diference = Math.floor(((fechaEnd - fechaStart)/1000)/60);
            }
            
        })
        if(auxInicio === null || auxFin === null){
            return(
                <div className="text-red font-weight-boldest">
                    { auxInicio === null ? 'NO CHECÓ ENTRADA' : ''}
                    { auxFin === null ? 'NO CHECÓ SALIDA' : ''}
                </div>
            )
        }
        return(
            <div className = { 
                diference < (horasPorTrabajar * 60) ? "text-red font-weight-boldest"
                : diference === (horasPorTrabajar * 60) ? "text-info font-weight-boldest"
                    : "text-success font-weight-boldest"
            }>
                { this.setTimer((diference - (diference % 60))/60) }
                :
                { this.setTimer(diference % 60) }
            </div>
        )
    }
    getHT(user, diasNumber){
        let minutosTotales = 0
        let fechaStart = ''
        let fechaEnd = ''
        let totalHorasQ = ''
        let totalHoras = ''
        let contadorDias = 0
        let end = new Date();
        end.setHours(0,0,0,0);
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
                    if( end - fechaStart > 0)
                        contadorDias++
                    var fecha3 =fechaEnd-fechaStart
                    minutosTotales += Math.floor((fecha3/1000)/60);
                }
            })
        })
        totalHorasQ = contadorDias*8 +':00'
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
        let start = new Date();
        start.setHours(0,0,0,0);
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
                    if( start - fechaStart > 0){
                        var fecha3 =fechaEnd-fechaStart
                        var minutosTrabajados = Math.floor((fecha3/1000)/60)
                        minutosTotales += minutosTrabajados - (horasPorTrabajar * 60)
                    }
                }
            })
        })
        let sign = ''
        if(minutosTotales < 0){
            sign = '-'
            minutosTotales = minutosTotales * -1
        }
        var mm = minutosTotales%60
        var hh = (minutosTotales-mm)/60
        return(
            <div className={sign === '' ?'text-success font-weight-boldest':''}>
                {sign + this.setTimer(hh)+':'+this.setTimer(mm)}
            </div>
        )
    }
    setTimer = (time) => {
        if(time < 10)
            return '0'+time
        return time
        
    }
    mesNumber(mes){
        switch (mes) {
            case "Enero":
                return 1;
            case "Febrero":
                return 2;
            case "Marzo":
                return 3;
            case "Abril":
                return 4;
            case "Mayo":
                return 5;
            case "Junio":
                return 6;
            case "Julio":
                return 7;
            case "Agosto":
                return 8;
            case "Septiembre":
                return 9;
            case "Octubre":
                return 10;
            case "Noviembre":
                return 11;
            case "Diciembre":
                return 12;
            default: break;
        }
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
                            <div className="col-md-3 mr-4 mb-4 mb-md-0">
                                <SelectSearchGray
                                    name='año' options={getAños()}
                                    customdiv='mb-0'
                                    value = { año }
                                    onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day"
                                    withicon={1}
                                />
                            </div>
                            <div className="col-md-3 mr-4 mb-4 mb-md-0">
                                <SelectSearchGray
                                    name='mes'
                                    options={getMeses()} 
                                    value={mes}
                                    customdiv='mb-0'
                                    onChange={this.updateMes}
                                    iconclass="fas fa-calendar-day"
                                    withicon={1}
                                />
                            </div>
                            <div className="col-md-2 mr-4 mb-4 mb-md-0">
                                <SelectSearchGray
                                    name='quincena'
                                    options={getQuincena()} 
                                    value={quincena}
                                    customdiv='mb-0'
                                    onChange={this.updateQuincena}
                                    iconclass="fas fa-calendar-day"
                                    withicon={1}
                                />
                            </div>
                            <div className="col-md-auto mr-4 mb-4 mb-md-0">
                                <span className="btn btn-light-info font-weight-bold" 
                                    onClick = { (e) => { e.preventDefault(); this.exportAxios() } } >
                                    <i className="far fa-file-excel" /> EXPORTAR
                                </span>
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
                                        {/* <th rowSpan="2" id="he" className="w-4-5">HORAS EXTRA</th>
                                        <th rowSpan="2" id="tl" className="w-4-5">TOTAL HORAS</th> */}
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
                                                                <td key={key}>
                                                                    <OverlayTrigger rootClose overlay = { <Tooltip>
                                                                        {
                                                                            this.getDifHours(user, element)
                                                                        }
                                                                    </Tooltip> } >
                                                                        {this.getHours(user, element)}
                                                                    </OverlayTrigger>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                    {/* <td id="cantidad-he">{this.getHE(user, diasNumber)}</td>
                                                    <td id="cantidad-th">{this.getHT(user, diasNumber)}</td> */}
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
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Checador);