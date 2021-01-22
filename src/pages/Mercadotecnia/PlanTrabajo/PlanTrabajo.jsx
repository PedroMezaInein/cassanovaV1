import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños, setOptions } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'
import moment from 'moment'
import { Modal } from '../../../components/singles'
import PlanTrabajoForm from '../../../components/forms/mercadotecnia/PlanTrabajoForm';
import Swal from 'sweetalert2'
import { P } from '../../../components/texts'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

class PlanTrabajo extends Component {

    state = {
        modal: {
            form: false
        },
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nombre: '',
            responsable: '',
            rol: '',
            descripcion: '',
            color: '',
            usuarios: []
        },
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        dias: this.diasEnUnMes(meses[new Date().getMonth()],new Date().getFullYear()),
        data: {
            empresas: []
        },
        options: {
            empresas:[],
            usuarios: []
        }
    }

    componentDidMount() {
        const { mes, año } = this.state
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios(mes, año)
    }

    getContentAxios = async (mes, año) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/plan-trabajo?mes=${mes}&anio=${año}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, users, roles } = response.data
                const { data, modal, options } = this.state
                modal.form = false

                empresas.map((empresa) => {
                    empresa.datos = empresa.planes
                    let response = this.getRowspan(empresa.datos)
                    empresa.rowSpanSize = response.size
                    empresa.calendars = response.calendars
                })
                options.usuarios = []
                options.empresas = setOptions(empresas, 'name', 'id')
                users.map((user) => {
                    options.usuarios.push({
                        text: user.name,
                        value: user.id.toString(),
                        label: user.name
                    })
                })
                data.empresas = empresas
                Swal.close()
                this.setState({ ...this.state, data, mes: mes, año: año, dias: this.diasEnUnMes(mes, año), modal, form: this.clearForm(), options })
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

    addPlanAxios = async() => {
        const { form } = this.state
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}mercadotecnia/plan-trabajo`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { mes, año } = this.state
                this.getContentAxios( mes, año )
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

    diasEnUnMes(mes, año) { return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); }

    updateMes = value => { 
        const { año } = this.state
        this.getContentAxios( value, año )
    }

    updateAño = value => { 
        const { mes } = this.state
        this.getContentAxios( mes, value )
    }

    isActiveBackButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if (actualMonth === 0) {
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let minimoAño = _año
            if (_mes > 9)
                minimoAño = _año - 3;
            else
                minimoAño = _año - 4;
            if (año.toString() === minimoAño.toString())
                return false
        }
        return true
    }

    isActiveForwardButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if (actualMonth === 11) {
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let maximoAño = _año
            if (_mes > 9)
                maximoAño = _año + 1;
            else
                maximoAño = _año;
            if (año.toString() === maximoAño.toString())
                return false
        }
        return true
    }

    changeMonth = (direction) => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        let newMonth = meses[actualMonth]
        let newYear = año
        if (direction === 'back') {
            if (actualMonth === 0) {
                newMonth = meses[11]
                newYear = (año - 1).toString() 
            } else {
                newMonth = meses[actualMonth - 1]
            }
        } else {
            if (actualMonth === 11) {
                newMonth = meses[0]
                newYear = (parseInt(año) + 1).toString() 
            } else {
                newMonth = meses[actualMonth + 1]
            }
        }

        this.getContentAxios(newMonth, newYear)
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
                case 'usuarios':
                    form[element] = [];
                    break;
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

    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
    }

    onSubmit = e => {
        this.addPlanAxios()
    }

    getRowspan = datos => {
        const { dias } = this.state
        let arregloOfCalendars = [];
        let _arreglo = [];
        [...Array(dias)].map((unusedElement, key) => {
            _arreglo.push(null)
        })
        arregloOfCalendars.push(_arreglo)
        for(let z = 0; z < datos.length; z++){
            let dato = datos[z];
            let numeroFechaInicio = moment(datos[z].fechaInicio).date() - 1
            let numeroFechaFin = moment(datos[z].fechaFin).date() - 1
            let bandera = false;
            for(let x = 0; x < arregloOfCalendars.length; x++){
                if(arregloOfCalendars[x][numeroFechaInicio] === null){
                    arregloOfCalendars[x][numeroFechaInicio] = datos[z]
                    for(let y = numeroFechaInicio + 1; y <= numeroFechaFin; y++)
                        arregloOfCalendars[x][y] = 'filled';
                    bandera = true
                    x = arregloOfCalendars.length
                }
            }
            if(bandera === false){
                _arreglo = [];
                [...Array(dias)].map((unusedElement, key) => {
                    _arreglo.push(null)
                })
                arregloOfCalendars.push(_arreglo)
                arregloOfCalendars[arregloOfCalendars.length - 1][numeroFechaInicio] = dato
                for(let y = numeroFechaInicio + 1; y <= numeroFechaFin; y++) {
                    arregloOfCalendars[arregloOfCalendars.length - 1][y] = 'filled';
                }
            }
        }
        // console.log(arregloOfCalendars, 'ARREGLO OF CALENDARS')
        return { calendars: arregloOfCalendars, size: arregloOfCalendars.length}
    }

    printTd = (empresa, conteo, diaActual) => {

        if(empresa.name === 'INEIN')
            // console.log(empresa.calendars[conteo][diaActual], conteo, diaActual, "INEIN")
        
        if(empresa.calendars[conteo][diaActual] === null)
            return (
                <td>{/* diaActual + 1 */}</td>
            )
        else{
            if(empresa.calendars[conteo][diaActual] === 'filled'){
                return (<></>)
            }else{
                return (
                    <td colSpan = {empresa.calendars[conteo][diaActual].duracion} className = 'text-center position-relative p-0'>
                        <OverlayTrigger key={diaActual} overlay={
                            <Tooltip>
                                <span>
                                    <span className="mt-3 font-weight-bolder">
                                        {empresa.calendars[conteo][diaActual].nombre}
                                    </span>
                                </span>
                            </Tooltip>}>
                            <div className="text-truncate w-100 position-absolute text-white px-1 top-20" 
                                style={{ backgroundColor: empresa.calendars[conteo][diaActual].rol.color, color: 'white' }}>
                                <span className="font-weight-bold"> {empresa.calendars[conteo][diaActual].nombre} </span>
                            </div>
                        </OverlayTrigger>
                    </td>
                )
            }
        }
    }

    render() {
        const { mes, año, data, form, modal, title, options, dias } = this.state
        return (
            <Layout active='mercadotecnia' {... this.props}>
                <Card className='card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar align-items-center">
                            <div className='mr-3 d-flex'>
                                <SelectSearchGray name='mes' options={getMeses()} value={mes} customdiv='mb-0'
                                    onChange={this.updateMes} iconclass="fas fa-calendar-day"
                                    messageinc="Incorrecto. Selecciona el mes." requirevalidation={1} />
                            </div>
                            <div className='mr-3 d-flex'>
                                <SelectSearchGray name='año' options={getAños()} customdiv='mb-0'
                                    value={año} onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day" />
                            </div>
                            <Button icon='' className='btn btn-light-success btn-sm font-weight-bold'
                                only_icon='flaticon2-writing pr-0 mr-2' text='AGENDAR PLAN'
                                onClick={this.openModal} />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className='d-flex justify-content-between'>
                            <div className=''>
                                <h2 className="font-weight-bolder text-dark">{`${mes} ${año}`}</h2>
                            </div>
                            <div className=''>
                                <div className="btn-group">
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
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive-xl">
                            <table className="table table-responsive table-bordered table-vertical-center">
                                <thead className="text-center">
                                    <tr>
                                        <th>Empresa</th>
                                        {
                                            [...Array(dias)].map((element, key) => {
                                                return (<th key={key}>{key <= 8 ? "0" + (key + 1) : key + 1}</th>)
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.empresas.map((empresa, index) => {
                                            return(
                                                <>
                                                    {
                                                        [...Array(empresa.rowSpanSize)].map((element, conteo) => {
                                                            return(
                                                                <tr key = { `${conteo}-index-row-${empresa.name}` } className = 'h-30px'>
                                                                    {
                                                                        conteo === 0 ?
                                                                            <td rowSpan = { empresa.rowSpanSize} >{empresa.name}</td>
                                                                        : <></>
                                                                    }
                                                                    {
                                                                        [...Array(dias)].map((element, diaActual) => {
                                                                            return(
                                                                                <>
                                                                                    {this.printTd(empresa, conteo, diaActual)}
                                                                                </>
                                                                            )
                                                                            
                                                                        })
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <PlanTrabajoForm form = { form } onChange = { this.onChange } options = { options } onSubmit = { this.onSubmit }
                        onChangeAndAdd = { this.onChangeAndAdd } />
                </Modal>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
