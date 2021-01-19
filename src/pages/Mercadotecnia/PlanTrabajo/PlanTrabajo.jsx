import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import moment from 'moment'
import { data } from 'jquery'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class PlanTrabajo extends Component{

    state = {
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        data: {
            empresas: []
        }
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

    getContentAxios = async() => {
        const { access_token } = this.props.authUser
        const { mes, año } = this.state
        await axios.get(`${URL_DEV}mercadotecnia/plan-trabajo?mes=${mes}&anio=${año}`, { headers: { Authorization: `Bearer ${access_token}`}  }).then(
            (response) => {
                const { empresas } = response.data
                const { data } = this.state
                data.empresas = empresas
                data.empresas.map((empresa) => {
                    if(empresa.name === 'INEIN'){
                        empresa.datos = [
                            {
                                fechaInicio: '2021-01-13',
                                fechaFin: '2021-01-13',
                                duration: 1,
                                nombre: 'IDENTIDAD',
                            },
                            {
                                fechaInicio: '2021-01-06',
                                fechaFin: '2021-01-09',
                                duration: 4,
                                nombre: 'CONSTRUCCIÓN',
                            }
                        ]
                    }else{
                        empresa.datos = []
                    }
                })
                this.setState({...this.state, data})
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error)=>{
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    diasEnUnMes(mes, año) { return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); }

    updateMes = value => { this.setState({ ...this.state, mes: value }) }
    
    updateAño = value => { this.setState({...this.state, año: value}) }

    isActiveBackButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if(actualMonth === 0 ){
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let minimoAño = _año
            if(_mes > 9)
                minimoAño = _año - 3;
            else
                minimoAño = _año - 4;
            if(año.toString() === minimoAño.toString())
                return false
        }
        return true
    }

    isActiveForwardButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if(actualMonth === 11 ){
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let maximoAño = _año
            if(_mes > 9)
                maximoAño = _año + 1;
            else
                maximoAño = _año;
            if(año.toString() === maximoAño.toString())
                return false
        }
        return true
    }

    changeMonth = (direction) => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if(direction === 'back'){
            if(actualMonth === 0){
                this.setState({
                    ...this.state,
                    mes: meses[11],
                    año: (año - 1).toString()
                })
            }else{
                this.setState({
                    ...this.state,
                    mes: meses[actualMonth - 1],
                })
            }
        }else{
            if(actualMonth === 11){
                this.setState({
                    ...this.state,
                    mes: meses[0],
                    año: (año + 1).toString()
                })
            }else{
                this.setState({
                    ...this.state,
                    mes: meses[actualMonth + 1],
                })
            }
        }
    }

    printGantt = (empresa, dia) => {
        const { año, mes } = this.state
        let actualMonth = (meses.indexOf(mes) + 1).toString()
        let _dia = dia
        if(actualMonth.length === 1)
            actualMonth = '0'+actualMonth.toString();
        if(_dia.toString().length === 1)
            _dia = '0'+_dia.toString()
        let variables = []
        /* let from = ''
        let to = '' */
        let fecha = moment(`${año}-${actualMonth}-${_dia}`)
        empresa.datos.map((dato)=>{
            let from = moment(dato.fechaInicio)
            let to = moment(dato.fechaFin)
            if(fecha <= to && fecha >= from){
                if(dato.duration === 1){
                    dato.position = 'full'
                }else{
                    let _from = from.startOf('day')
                    let _to = to.startOf('day')
                    let _fecha = fecha.startOf('day')
                    if( _from === _fecha)
                        dato.position = 'start'
                    else{
                        if( _to === _fecha){
                            dato.position = 'end'
                        }else{
                            dato.position = 'middle'
                        }
                    }
                }
                variables.push(dato)
            }
        })
        return(
            <div>
                {
                    variables.map((dato, index)=>{
                        return(
                            <div key = { index } >
                                {dato.nombre}
                                <br />
                                {dato.position}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    render(){
        const { mes, año, data } = this.state
        return(
            <Layout active = 'mercadotecnia' { ... this.props}>
                <Card className = 'card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar align-items-center">
                            <div className = 'mr-3 d-flex'>
                                <SelectSearchGray name = 'mes' options = { getMeses() } value = { mes } customdiv = 'mb-0'
                                    onChange = { this.updateMes } iconclass = "fas fa-calendar-day"
                                    messageinc = "Incorrecto. Selecciona el mes." requirevalidation={1}/>
                            </div>
                            <div className = 'mr-3 d-flex'>
                                <SelectSearchGray name = 'año' options = { getAños() } customdiv = 'mb-0'
                                    value = { año } onChange = { this.updateAño } 
                                    iconclass = "fas fa-calendar-day" />
                            </div>
                            <Button icon = '' className = 'btn btn-light-success btn-sm font-weight-bold' 
                                only_icon = 'flaticon2-writing pr-0 mr-2' text = 'Agendar plan'
                                onClick = { console.log('Parrilla de contenido') } />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className = 'd-flex justify-content-between'>
                            <div className = ''>
                                <h2 className="font-weight-bolder text-dark">{`${mes} ${año}`}</h2>
                            </div>
                            <div className = ''>
                                <div className="btn-group">
                                    <span class = {`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveBackButton() ? 'enabled' : 'disabled' }`}
                                        onClick = {
                                            (e) => {
                                                e.preventDefault();
                                                if(this.isActiveBackButton())
                                                    this.changeMonth('back')
                                            }
                                        }>
                                        <i class="fa fa-chevron-left icon-xs" />
                                    </span>
                                    <span class = {`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveForwardButton() ? 'enabled' : 'disabled' }`}
                                        onClick = {
                                            (e) => {
                                                e.preventDefault();
                                                if(this.isActiveForwardButton())
                                                    this.changeMonth('forward')
                                            }
                                        }>
                                        <i class="fa fa-chevron-right icon-xs" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive-xl">
                            <table className="table table-responsive">
                                <thead className="text-center">
                                    <tr>
                                        <th>Empresa</th>
                                        {
                                            [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                                return( <th key = {key}>{key + 1}</th> )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.empresas.map((empresa, index) => {
                                            return(
                                                <tr key = { index } >
                                                    <td>
                                                        {empresa.name}    
                                                    </td>            
                                                    {
                                                        [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                                            return( <td key = {key}>
                                                                {
                                                                    this.printGantt(empresa, key+1)
                                                                }
                                                            </td> )
                                                        })
                                                    }   
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

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
