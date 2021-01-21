import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip} from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import moment from 'moment'
import { Modal } from '../../../components/singles'
import PlanTrabajoForm from '../../../components/forms/mercadotecnia/PlanTrabajoForm';

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class PlanTrabajo extends Component{

    state = {
        modal: {
            form: false
        },
        form:{
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nombre:'',
            responsable:'',
            rol:'',
            color:''
        },
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        data: {
            empresas: []
        },
        options: [
            
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
                                nombre: 'MANTENIMIENTO DE CAMPAÑA',
                                color: '#eee5ff',
                                textColor: '#8950fc'
                            },
                            {
                                fechaInicio: '2021-01-06',
                                fechaFin: '2021-01-09',
                                duration: 4,
                                nombre: 'ANÁLISIS DE KEYWORDS',
                                color: '#eee5ff',
                                textColor: '#8950fc'
                            },
                            {
                                fechaInicio: '2021-01-06',
                                fechaFin: '2021-01-08',
                                duration: 3,
                                nombre: 'ENTRADA DE BLOGS',
                                color: '#E8F5E9',
                                textColor: '#388E3C'
                            }
                        ]
                    }else if(empresa.name === 'INFRAESTRUCTURA MÉDICA'){
                        empresa.datos = [
                            {
                                fechaInicio: '2021-01-11',
                                fechaFin: '2021-01-11',
                                duration: 1,
                                nombre: 'CAMBIOS DE SITIO',
                            },
                            {
                                fechaInicio: '2021-01-04',
                                fechaFin: '2021-01-06',
                                duration: 3,
                                nombre: 'ESTRATEGIA SEO',
                            }
                        ]
                    }else if(empresa.name === 'VITARA'){
                        empresa.datos = [
                            {
                                fechaInicio: '2021-01-03',
                                fechaFin: '2021-01-05',
                                duration: 3,
                                nombre: 'CREACIÓN DE REPORTES',
                            },
                            {
                                fechaInicio: '2021-01-11',
                                fechaFin: '2021-01-12',
                                duration: 2,
                                nombre: 'FOTOGRAFÍAS',
                            }
                        ]
                    }
                    else{
                        empresa.datos = []
                    }
                    return ''
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

    diasEnUnMes(mes, año) {
        return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); 
    }

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

    printGantt = (empresa, dia, dato) => {
        const { año, mes } = this.state
        let actualMonth = (meses.indexOf(mes) + 1).toString()
        let _dia = dia
        if(actualMonth.length === 1)
            actualMonth = '0'+actualMonth.toString();
        if(_dia.toString().length === 1)
            _dia = '0'+_dia.toString()
        let variables = []

        let fecha = moment(`${año}-${actualMonth}-${_dia}`)
        
            let from = moment(dato.fechaInicio)
            let to = moment(dato.fechaFin)
            if(fecha <= to && fecha >= from){
                if(dato.duration === 1){
                    dato.position = 'full'
                }else{
                    console.log('DURARTION FROM', moment.duration(fecha.diff(from))._milliseconds)
                    console.log('DURARTION TO', moment.duration(fecha.diff(to))._milliseconds)
                    if(moment.duration(fecha.diff(from))._milliseconds === 0)
                        dato.position = 'start'
                    else{
                        if(moment.duration(fecha.diff(to))._milliseconds === 0){
                            dato.position = 'end'
                        }else{
                            dato.position = 'middle'
                        }
                    }
                }
                variables.push(dato)
                // console.log(variables)
            }
        return(
            <>
                {
                    variables.map((dato1, index)=>{
                        return(
                            // <p>{index}</p>
                            <OverlayTrigger key={index} overlay={
                                <Tooltip>
                                    <span>
                                        <span className="mt-3 font-weight-bolder">
                                            {dato1.nombre}
                                        </span>
                                        <div>
                                            <div>
                                                {dato1.position}
                                            </div>
                                        </div>
                                    </span>
                                </Tooltip>}>
                                    <div className= "">
                                        <span className="text-plan" style = {{ backgroundColor: dato1.color, color: dato1.textColor }}>
                                            {dato1.nombre}
                                        </span>
                                    </div>
                            </OverlayTrigger>
                            // <div className = {`gantt-container gantt-container__${dato1.position}`} key = { index } 
                            //     >
                            //     {dato1.nombre}
                            // </div>
                        )
                    })
                }
            </>
        )
    }
    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ...this.state,
            modal,
            title: 'Agengar plan',
            form: this.clearForm(),
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                default:
                    form[element] = '';
                    break;
            }
            return ''
        })
        return form
    }

    handleCloseForm = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ...this.state,
            modal,
            empresa: '',
            form: this.clearForm(),
        })
    }
    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.setState({
                form
            })
        })
    }
    render(){
        const { mes, año, data, form, modal, title,options } = this.state
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
                                only_icon = 'flaticon2-writing pr-0 mr-2' text = 'AGENDAR PLAN'
                                onClick={this.openModal} />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className = 'd-flex justify-content-between'>
                            <div className = ''>
                                <h2 className="font-weight-bolder text-dark">{`${mes} ${año}`}</h2>
                            </div>
                            <div className = ''>
                                <div className="btn-group">
                                    <span className = {`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveBackButton() ? 'enabled' : 'disabled' }`}
                                        onClick = {
                                            (e) => {
                                                e.preventDefault();
                                                if(this.isActiveBackButton())
                                                    this.changeMonth('back')
                                            }
                                        }>
                                        <i className="fa fa-chevron-left icon-xs" />
                                    </span>
                                    <span className = {`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveForwardButton() ? 'enabled' : 'disabled' }`}
                                        onClick = {
                                            (e) => {
                                                e.preventDefault();
                                                if(this.isActiveForwardButton())
                                                    this.changeMonth('forward')
                                            }
                                        }>
                                        <i className="fa fa-chevron-right icon-xs" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive-xl">
                            <table className="table table-responsive table-bordered table-vertical-center">
                                <thead className="text-center">
                                    <tr>
                                        <th>Empresa</th>
                                        {
                                            [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                                return( <th key = {key}>{key<=8?"0"+(key+1):key+1}</th> )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        
                                        data.empresas.map((empresa, index) => { 
                                            return( 
                                                empresa.datos.map((dato,index1)=>{ 
                                                    let fechaInicio = moment(dato.fechaInicio);
                                                    let fechaFin = moment(dato.fechaFin); 
                                                    let duracion = fechaFin.diff(fechaInicio, 'days') + 1; 
                                                    let diaInicio = fechaInicio.date()
                                                    let diaFin = fechaFin.date()
                                                    console.log(diaInicio,diaFin)
                                                    return( 
                                                        <tr key = { index } class="h-30px">
                                                            {
                                                                (index1 == 0) ?
                                                                    <td className="text-center" rowSpan={empresa.datos.length}>
                                                                        {empresa.name}
                                                                    </td> : ""
                                                            }
                                                            {
                                                            [...Array(this.diasEnUnMes(mes, año))].map((element, diaActual) => {
                                                                return( 
                                                                    (diaActual+1>=diaInicio && diaActual+1<=diaFin)?
                                                                        (diaActual+1===diaInicio)?
                                                                        <td key = {diaActual} colSpan={duracion} class="text-center position-relative p-0"  > 
                                                                            {
                                                                                <OverlayTrigger key={diaActual} overlay={
                                                                                    <Tooltip>
                                                                                        <span>
                                                                                            <span className="mt-3 font-weight-bolder">
                                                                                                {dato.nombre}
                                                                                            </span>
                                                                                            <div>
                                                                                                <div>
                                                                                                    {dato.position}
                                                                                                </div>
                                                                                            </div>
                                                                                        </span>
                                                                                    </Tooltip>}>
                                                                                        <div className= "text-truncate w-100 position-absolute  px-1 top-20"  style = {{ backgroundColor: dato.color, color: dato.textColor }}>
                                                                                            <span className="  ">
                                                                                                {dato.nombre}
                                                                                            </span>
                                                                                        </div>
                                                                                </OverlayTrigger>
                                                                            }
                                                                        </td>
                                                                        :""
                                                                    :
                                                                    <td></td>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                    )
                                                    } )
                                                
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <PlanTrabajoForm
                        form={form}
                        onChange={this.onChange}
                        options={options}
                    />
                </Modal>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
