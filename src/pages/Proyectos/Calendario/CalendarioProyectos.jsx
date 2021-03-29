import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { URL_DEV, COLORES_CALENDARIO_PROYECTOS} from '../../../constants'
import { SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import moment from 'moment'
import { Modal } from '../../../components/singles'
import InformacionProyecto from '../../../components/cards/Proyectos/InformacionProyecto'
import Swal from 'sweetalert2'
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

class CalendarioProyectos extends Component {

    state = {
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        proyectos: [],
        data: {
            empresas: []
        },
        options: {
            empresas: [],
        },
        modal: false,
        proyecto:'',
        colorProyecto:[],
        form: {
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            },
            comentario: ''
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });

        const { mes, año } = this.state
        this.getContentCalendarAxios(mes, año)
    }

    getContentCalendarAxios = async (mes, año) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/calendario-proyectos?mes=${mes}&anio=${año}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                let { colorProyecto } = this.state

                proyectos.forEach((proyecto) => {
                    let esigual = false
                    let colorexistente = ''
                    Object.assign(proyecto, { color: COLORES_CALENDARIO_PROYECTOS[Math.floor(Math.random() * COLORES_CALENDARIO_PROYECTOS.length)]});
                    colorProyecto.forEach(color => {
                        if (color.id === proyecto.id ) {
                            esigual=true
                            colorexistente=color.color
                        }
                    });
                    if(!esigual){
                        Object.assign(proyecto, { color: COLORES_CALENDARIO_PROYECTOS[Math.floor(Math.random() * COLORES_CALENDARIO_PROYECTOS.length)]});
                        colorProyecto.push({
                            id: proyecto.id,
                            color: proyecto.color
                        })
                    }else{
                        Object.assign(proyecto, { color: colorexistente });
                    }
                })
                
                let dias = this.diasEnUnMes(mes, año)
                this.setState({
                    ...this.state,
                    mes: mes,
                    año: año,
                    dias: dias,
                    proyectos: proyectos,
                    colorProyecto
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

    diasEnUnMes(mes, año) { return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); }

    updateMes = value => {
        const { año } = this.state
        this.setState({
            ...this.state,
            mes: value
        })
        this.getContentCalendarAxios(value, año)
    }

    updateAño = value => {
        const { mes } = this.state
        this.setState({
            ...this.state,
            año: value
        })
        this.getContentCalendarAxios(mes, value)
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
        this.getContentCalendarAxios(newMonth, newYear)
    }
    showtd(proyecto, colspan, border) {
        return (
            <OverlayTrigger overlay={
                <Tooltip className="tool-calendar">
                    <div className="tool-titulo text-white font-weight-bolder letter-spacing-0-4" style={{ backgroundColor: proyecto.color }}>
                        {proyecto.nombre}
                    </div>
                    <div className="tool-horario py-3 text-center">
                        {this.printDates(proyecto)}
                    </div>
                    {
                        proyecto.descripcion!=="null" && proyecto.descripcion !==null?
                            <div className="text-justify px-5 pb-3">
                                {proyecto.descripcion}
                            </div>
                        :''
                    }
                    
                </Tooltip>
            }>
                <td className="text-center position-relative p-0 text-hover" colSpan={colspan} onClick = { (e) => { e.preventDefault(); this.openModal(proyecto) }}>
                    <div className={`text-truncate w-100 position-absolute text-white px-1 top-26 ${border}`} style={{ backgroundColor: proyecto.color, borderColor: proyecto.color }}>
                        {proyecto.nombre}
                    </div>
                </td>
            </OverlayTrigger>
        )
    }

    handleClose = () => { this.setState({...this.state, modal: false}) }

    printDates = dato => {
        let fechaInicio = moment(dato.fecha_inicio)
        let fechaFin = moment(dato.fecha_fin)
        let diffFechas = fechaFin.diff(fechaInicio, 'days')
        
        if(diffFechas === 0){
            return(
                <span>
                    {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}
                </span>
            )
        }else
            return(
                <span>
                    {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}  - {fechaFin.format('D')}/{fechaFin.format('MM')}/{fechaFin.format('YYYY')}
                </span>
            )
    }

    printTd = (proyecto, index, diaActual, fechaInicio, fechaFin) => {
        const { mes, año } = this.state
        fechaInicio.startOf('day')
        fechaFin.startOf('day')
        let fecha = new moment([año, meses.indexOf(mes), diaActual + 1])
        // let duracion = fechaFin.diff(fechaInicio, 'days') + 1;
        let esDiaActualInicioFecha = (diaActual + 1) === parseInt(fechaInicio.format('D'))
        let esMesActualInicioFecha = fechaInicio.format('M') == fecha.format('M')
        let esAnioActualInicioFecha = fechaInicio.format('Y') == fecha.format('Y')

        if ((diaActual + 1) === 1 || (esDiaActualInicioFecha && esMesActualInicioFecha && esAnioActualInicioFecha)) {


            let diasMesActual = fecha.daysInMonth()
            if ((diaActual + 1) === 1) {
                let esDia1DentroFechas = fecha.toDate() >= fechaInicio.toDate() && fecha.toDate() <= fechaFin.toDate()
                if (esDia1DentroFechas) {

                    let duracionDia1HastaFechaFin = fechaFin.diff(fecha, 'days') + 1
                    if (duracionDia1HastaFechaFin < diasMesActual) {
                        this.showtd(proyecto, duracionDia1HastaFechaFin)
                        return (
                            this.showtd(proyecto, duracionDia1HastaFechaFin, 'border-radius-right')
                        )
                    }
                    else {
                        return (
                            this.showtd(proyecto, diasMesActual)
                        )
                    }
                }
                else {
                    <td>
                    </td>
                }
            }
            else {
                let duracionDiaInicioHastaFechaFin = fechaFin.diff(fechaInicio, 'days') + 1
                let diasHastaFinMes = diasMesActual - diaActual + 1
                if (diasHastaFinMes > duracionDiaInicioHastaFechaFin) {

                    return (
                        this.showtd(proyecto, duracionDiaInicioHastaFechaFin, 'border-radius-4px')
                    )
                }
                else {
                    return (
                        this.showtd(proyecto, diasHastaFinMes, 'border-radius-left')
                    )
                }
            }
        } else {
            if (fecha.toDate() >= fechaInicio.toDate() && fecha.toDate() <= fechaFin.toDate()) {
                return (<></>)
            } else {
                return (
                    <td>
                    </td>
                )
            }
        }
        return (
            <td>
            </td>
        )
    }

    openModal = async(proyecto) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                this.setState({
                    ...this.state,
                    modal: true,
                    proyecto: proyecto,
                    form: this.clearForm(),
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    handleChangeComentario = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();

        form.adjuntos.adjunto_comentario.files.map(( adjunto) => {
            data.append(`files_name_adjunto[]`, adjunto.name)
            data.append(`files_adjunto[]`, adjunto.file)
            return ''
        })

        data.append(`comentario`, form.comentario)
        await axios.post(`${URL_DEV}v2/proyectos/calendario-proyectos/proyecto/${proyecto.id}/comentarios`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { proyecto } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({ ...this.state, form, proyecto: proyecto })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    render() {
        const { mes, año, proyectos, dias, modal, proyecto, form} = this.state
        return (
            <Layout active='proyectos' {... this.props}>
                <Card className='card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Calendario de proyectos
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar row mx-0 row-paddingless d-flex justify-content-end ">
                            <div className="col-md-4 mr-4">
                                <SelectSearchGray name='mes' options={getMeses()} value={mes} customdiv='mb-0'
                                    onChange={this.updateMes} iconclass="fas fa-calendar-day"
                                    messageinc="Incorrecto. Selecciona el mes." requirevalidation={1} />
                            </div>
                            <div className="col-md-3">
                                <SelectSearchGray name='año' options={getAños()} customdiv='mb-0'
                                    value={año} onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day" />
                            </div>
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
                                    <span className={`btn btn-icon btn-xs btn-light-primary my-1 ${this.isActiveForwardButton() ? 'enabled' : 'disabled'}`}
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
                        <div className="table-responsive-xl mt-5">
                            <table className="table table-responsive table-bordered table-vertical-center border-0" id="calendario-proyectos">
                                <thead className="text-center">
                                    <tr>
                                        <th className="font-weight-bolder border-0">PROYECTO</th>
                                        {
                                            [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                                return (<th className="border-top-0" key={key}>{key <= 8 ? "0" + (key + 1) : key + 1}</th>)
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        proyectos.length === 0 ?
                                            <tr>
                                                <td colSpan={this.diasEnUnMes(mes, año) + 1} className="text-center font-weight-bolder font-size-h6 py-6 border-0">
                                                    NO HAY PROYECTOS
                                                </td>
                                            </tr>
                                            :
                                            proyectos.map((proyecto, index) => {
                                                // console.log(proyecto)
                                                let fechaInicio = moment(proyecto.fecha_inicio);
                                                let fechaFin = moment(proyecto.fecha_fin);
                                                return (
                                                    <tr key={index} className='h-30px'>
                                                        <td className="text-center font-weight-bolder white-space-nowrap">
                                                            {proyecto.nombre}
                                                        </td>
                                                        {
                                                            [...Array(dias)].map((element, diaActual) => {
                                                                return (<>{this.printTd(proyecto, index, diaActual, fechaInicio, fechaFin)}</>)
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
                <Modal show = { modal } size="lg" title = {proyecto?proyecto.nombre:'Información del proyecto'} handleClose = { this.handleClose } >
                    <InformacionProyecto proyecto={proyecto} printDates={this.printDates} addComentario = { this.addComentarioAxios } form = { form } onChange = { this.onChange } handleChange = { this.handleChangeComentario }/>
                </Modal>
            </Layout>
            
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarioProyectos)