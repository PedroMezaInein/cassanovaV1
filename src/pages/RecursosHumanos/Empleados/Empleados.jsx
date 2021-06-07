import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { EMPLEADOS_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS, TEL } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { AdjuntosForm } from '../../../components/forms'
import { setOptions, setTextTable, setArrayTable, setAdjuntosList, setDateTableReactDom, setArrayTableReactDom, setTextTableReactDom, setEstatusBancoTableReactDom, setTextTableCenter, setTagLabelReactDom } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert, questionAlert, customInputAlert, sendFileAlert } from '../../../functions/alert'
import { Tabs, Tab } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import { EmpleadosCard } from '../../../components/cards'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { InputGray, CalendarDaySwal, SelectSearchGray, InputNumberGray, InputPhoneGray } from '../../../components/form-components'
import moment from 'moment'
import $ from "jquery";
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import FormularioContrato from "../../../components/forms/recursoshumanos/FormularioContrato"
class Empleados extends Component {
    state = {
        formeditado: 0,
        key: 'administrativo',
        data: {
            adjuntos: []
        },
        adjuntos: [],
        modal: {
            delete: false,
            adjuntos: false,
            see: false,
            contrato: false
        },
        title: 'Nuevo empleado',
        form: {
            nombre: '',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo',
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: '',
            estatus_imss: 'Activo',
            puesto: '',
            vacaciones_disponibles: 0,
            fecha_alta_imss: '',
            numero_alta_imss: '',
            nomina_imss: 0.0,
            nomina_extras: 0.0,
            salario_hr: 0.0,
            salario_hr_extra: 0.0,
            adjuntos: {
                datosGenerales: {
                    value: '',
                    placeholder: 'Datos generales',
                    files: []
                },
                recibosNomina: {
                    value: '',
                    placeholder: 'Recibos de Nómina',
                    files: []
                },
                altasBajas: {
                    value: '',
                    placeholder: 'Altas y bajas',
                    files: []
                }
            }
        },
        options: {
            empresas: []
        },
        formContrato: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            periodo: '',
            dias: '',
            periodo_pago:'',
            ubicacion_obra:'',
            pagos_hr_extra:'',
            total_obra:'',
            dias_laborables:'',
            adjuntos: {
                contrato: {
                    value: '',
                    placeholder: 'Contrato',
                    files: []
                }
            }
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const empleados = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!empleados)
            history.push('/')
        this.getOptionsAxios()
    }
    changePageEdit = empleado => {
        const { history } = this.props
        history.push({
            pathname: '/rh/empleados/edit',
            state: { empleado: empleado }
        });
    }
    openModalDelete = empleado => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }
    openModalAdjuntos = empleado => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
        this.setState({
            ...this.state,
            modal,
            empleado: empleado,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', '', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    openModalSee = empleado => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }
    openModalContrato = empleado => {
        const { modal } = this.state
        modal.contrato = true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }
    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            empleado: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            empleado: ''
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            empleado: ''
        })
    }
    handleCloseContrato = () => {
        const { modal } = this.state
        modal.contrato = false
        this.setState({
            ...this.state,
            modal,
            empleado: '',
            formContrato: this.clearFormContrato()
        })
    }
    clearFormContrato = () => {
        const { formContrato } = this.state
        let aux = Object.keys(formContrato)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    formContrato[element] = new Date()
                    break;
                case 'adjuntos':
                    formContrato[element] = {
                        contrato: {
                            value: '',
                            placeholder: 'Contrato',
                            files: []
                        }
                    }
                break;
                default:
                    formContrato[element] = ''
                    break;
            }
            return false
        })
        return formContrato;
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.delete(URL_DEV + 'rh/empleado/' + empleado.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal, key } = this.state
                if (key === 'administrativo') {
                    this.getEmpleadosAxios()
                }
                if (key === 'obra') {
                    this.getEmpleadosObraAxios()
                }
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    empleado: '',
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El empleado fue eliminado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form, key } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        datosGenerales: {
                            value: '',
                            placeholder: 'Datos generales',
                            files: []
                        },
                        recibosNomina: {
                            value: '',
                            placeholder: 'Recibos de Nómina',
                            files: []
                        },
                        altasBajas: {
                            value: '',
                            placeholder: 'Altas y bajas',
                            files: []
                        }
                    }
                    break;
                case 'estatus_empleado':
                case 'estatus_imss':
                    form[element] = 'Activo'
                    break;
                case 'nomina_imss':
                case 'salario_hr':
                case 'salario_hr_extra':
                case 'vacaciones_tomadas':
                    form[element] = 0
                    break;
                case 'tipo_empleado':
                    if (key === 'obra')
                        form[element] = 'Obra'
                    else
                        form[element] = 'Administrativo'
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    setEmpleado = empleados => {
        let aux = []
        if (empleados)
            empleados.map((empleado) => {
                aux.push(
                    {
                        actions: this.setActions(empleado),
                        nombre: setTextTableReactDom(empleado.nombre, this.doubleClick, empleado, 'nombre', 'text-center'),
                        empresa: setTextTableReactDom(empleado.empresa ? empleado.empresa.name : '', this.doubleClick, empleado, 'empresa', 'text-center '),
                        departamento: empleado.departamentos.length === 0 ? setTextTableCenter("Sin definir") 
                        : setTagLabelReactDom(empleado, empleado.departamentos, 'departamento_empleado', this.deleteElementAxios, ''),
                        puesto: setTextTableReactDom(empleado.puesto, this.doubleClick, empleado, 'puesto', 'text-center'),
                        rfc: setTextTableReactDom(empleado.rfc, this.doubleClick, empleado, 'rfc', 'text-center'),
                        nss: setTextTableReactDom(empleado.nss, this.doubleClick, empleado, 'nss', 'text-center'),
                        curp: setTextTableReactDom(empleado.curp, this.doubleClick, empleado, 'curp', 'text-center'),
                        estatus: setEstatusBancoTableReactDom(empleado, this.changeEstatus ),
                        fechaInicio: setDateTableReactDom(empleado.fecha_inicio, this.doubleClick, empleado, 'fecha', 'text-center'),
                        cuenta: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': empleado.banco ? empleado.banco : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': empleado.cuenta ? empleado.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': empleado.clabe ? empleado.clabe : 'Sin definir' },
                            ], '180px'
                        )),
                        nombre_emergencia:setArrayTableReactDom(
                            [
                                { 'name': 'Nombre', 'text': empleado.nombre_emergencia ? empleado.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': empleado.telefono_emergencia ? empleado.telefono_emergencia : 'Sin definir' }
                            ],'120px', this.doubleClick, empleado, 'nombre_emergencia'
                        ),
                        vacaciones_tomadas: setTextTableReactDom(empleado.vacaciones_disponibles, this.doubleClick, empleado, 'vacaciones_disponibles', 'text-center'),
                        id: empleado.id
                    }
                )
                return false
            })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'empresa':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha':
                form.fechaInicio = new Date(moment(data.fecha_inicio))
                break
            case 'nombre_emergencia':
                form.nombre_emergencia = data.nombre_emergencia
                form.telefono_emergencia = data.telefono_emergencia
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    (tipo === 'nombre') || (tipo === 'puesto') || (tipo === 'rfc') || (tipo === 'curp') ?
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                    :<></>
                }
                {
                    tipo === 'nombre_emergencia' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } placeholder="NOMBRE DEL CONTACTO DE EMERGENCIA"
                            requirevalidation = { 0 }  value = { form.nombre_emergencia } name = { 'nombre_emergencia' } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                        
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="telefono_emergencia" value={form.telefono_emergencia} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'telefono_emergencia')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form.fechaInicio } onChange = { (e) => {  this.onChangeSwal(e.target.value, 'fechaInicio')} } name = { 'fechaInicio' } date = { form.fechaInicio } withformgroup={0} />
                    :<></>
                }
                {
                    (tipo === 'empresa')  ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv="mb-2 mt-7"
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}
                        />
                    :<></>
                }
                {
                    (tipo === 'nss') || (tipo ==='vacaciones_disponibles') ?
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } type="text"
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } customlabel="d-none"
                        />
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchEmpleados(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    changeEstatus = (estatus, empleado) =>  {
        estatus === 'Activo'?
            questionAlert('¿ESTÁS SEGURO?', 'ACTIVARÁS EL EMPLEADO', () => this.changeEstatusAxios(estatus, empleado))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'INHABILITARÁS EL EMPLEADO', () => this.changeEstatusAxios(estatus, empleado))
    }
    
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'empresa':
                return 'SELECCIONA LA EMPRESA'
            default:
                return ''
        }
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'empresa':
                return options.empresas
            default: return []
        }
    }

    setActions = empleado => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        if (empleado.estatus_empleado === 'Activo') {
            aux.push({
                text: 'Contrato',
                btnclass: 'warning',
                iconclass: 'flaticon2-file-1',
                action: 'contrato',
                tooltip: { id: 'adjuntos', text: 'Contrato' }
            })
        }
        return aux
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-' + adjunto.id
            })
            return false
        })
        return aux
    }

    setActionsAdjuntos = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
            })
        return aux
    }

    async getEmpleadosAxios() {
        $('#empleados_admin_table').DataTable().ajax.reload();
    }
    async getEmpleadosObraAxios() {
        $('#empleados_obra_table').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if (value === 'administrativo') { this.getEmpleadosAxios() }
        if (value === 'obra') {
            this.getEmpleadosObraAxios()
            form.tipo_empleado = 'Obra'
        }
        this.setState({ ...this.state, key: value, form })
    }

    async addAdjuntoEmpleadoAxios() {
        const { access_token } = this.props.authUser
        const { form, empleado } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        data.append('id', empleado.id)
        await axios.post(URL_DEV + 'rh/empleado/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.delete(URL_DEV + 'rh/empleado/' + empleado.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchEmpleados = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'fecha':
                value = form.fechaInicio
            break
            case 'nombre_emergencia':
                value = { nombre: form.nombre_emergencia, telefono: form.telefono_emergencia }
            break;
            default:
                value = form[tipo]
            break;
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/rh/empleados/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'administrativo')
                    this.getEmpleadosAxios()
                if (key === 'obra')
                    this.getEmpleadosObraAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La empleado fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async changeEstatusAxios(estatus, empleado){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/update/${empleado.id}/estatus`,{estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estatus actualizado con éxito')
                const { key } = this.state
                if (key === 'administrativo')
                    this.getEmpleadosAxios()
                if (key === 'obra')
                    this.getEmpleadosObraAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteElementAxios = async(user, element) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/rh/empleados/${user.id}/departamento/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'administrativo') {
                    this.getEmpleadosAxios()
                }
                if (key === 'obra') {
                    this.getEmpleadosObraAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El departamento fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) { aux.push(form.adjuntos[name].files[counter]) }
        }
        if (aux.length < 1) { form.adjuntos[name].value = '' }
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
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
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }
    exportRHAxios = async() =>{
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/exportar/rh/empleados`, { responseType:'blob', headers: setSingleHeader(access_token)}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'empleados.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El documento fue generado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    onChangeContrato= e => {
        const { name, value, type } = e.target
        const { formContrato } = this.state
        formContrato[name] = value

        if(type === 'radio'){
            formContrato.periodo = value === "true" ? true : false
            if(formContrato.periodo === false){
                formContrato.dias = ''
            }
        }
        
        this.setState({ 
            ...this.state,
            formContrato
        })
    }
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { formContrato } = this.state
        formContrato.fechaInicio = startDate
        formContrato.fechaFin = endDate
        let dias = moment(endDate).diff(moment(startDate), 'days') + 1
        formContrato.dias = dias
        this.setState({
            ...this.state,
            formContrato
        })
    }

    generar = async() => {
        waitAlert()
        const { empleado, formContrato, key, modal } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/generar?tipo_contrato=${key}`, formContrato, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { contrato, empleado } = response.data
                const { key } = this.state
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                modal.contrato = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrado fue generado con éxito.')
                var win = window.open(contrato.contrato, '_blank');
                win.focus();
                this.setState({ ...this.state, empleado: empleado, formContrato: this.clearFormContrato(), modal })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    renovarContrato = async() => {
        waitAlert()
        const { empleado, formContrato, key, modal } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/renovar?tipo_contrato=${key}`, formContrato, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { contrato, empleado } = response.data
                const { key } = this.state
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                modal.contrato = false
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrado fue generado con éxito.')
                var win = window.open(contrato.contrato, '_blank');
                win.focus();
                this.setState({ ...this.state, empleado: empleado, formContrato: this.clearFormContrato(), modal })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChangeAdjuntos = valor => {
        sendFileAlert( valor, (success) => { this.addAdjuntoAxios(success);})
    }

    async addAdjuntoAxios(valor) {
        waitAlert()
        const { name, file } = valor.target
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        let data = new FormData();
        if(file){
            data.append(`file`, file)
            await axios.post(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${name}/adjuntar`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { empleado } = this.state
                    const { key } = this.state
                    if (key === 'administrativo') { this.getEmpleadosAxios() }
                    if (key === 'obra') { this.getEmpleadosObraAxios() }
                    this.setState({...this.state, empleado: empleado})
                    doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        }else{ errorAlert('Adjunta solo un archivo') }
        
    }
    cancelarContrato = element => {
        deleteAlert('¿DESEAS TERMINAR EL CONTRATO?', '', () => this.cancelarContratoAxios(element.id), 'SI, TERMINAR')
    }
    async cancelarContratoAxios(element) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.get(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${element}/terminar`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleado } = response.data
                const { key } = this.state
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                this.setState({...this.state, empleado: empleado})
                doneAlert(response.data.message !== undefined ? response.data.message : 'Contrato terminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { modal, form, key, adjuntos, data, empleado, formContrato } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Tabs defaultActiveKey="administrativo" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="administrativo" title="Administrativo">
                        <NewTableServerRender columns = { EMPLEADOS_COLUMNS } title = 'Empleados administrativos'
                            subtitle = 'Listado de empleados' mostrar_boton = { true } abrir_modal = { false }
                            url = '/rh/empleados/add' mostrar_acciones = { true } exportar_boton = { true }
                            onClickExport = { () => this.exportRHAxios() }
                            actions = {
                                {
                                    'edit': { function: this.changePageEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'see': { function: this.openModalSee },
                                    'contrato' : { function: this.openModalContrato }
                                }
                            }
                            accessToken = { this.props.authUser.access_token } setter = { this.setEmpleado }
                            urlRender = { `${URL_DEV}v2/rh/empleados?type=admin` } idTable = 'empleados_admin_table'
                            cardTable = 'cardTable_admin' cardTableHeader = 'cardTableHeader_admin'
                            cardBody = 'cardBody_admin' isTab = { true } />
                    </Tab>
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender columns = { EMPLEADOS_COLUMNS } title = 'Empleados de obra' subtitle = 'Listado de empleados' 
                            mostrar_boton = { true } abrir_modal = { false } url = '/rh/empleados/add' mostrar_acciones = { true } exportar_boton = { true }
                            onClickExport = { () => this.exportRHAxios() }
                            actions={{
                                'edit': { function: this.changePageEdit },
                                'delete': { function: this.openModalDelete },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee },
                                'contrato' : { function: this.openModalContrato }
                            }}
                            accessToken = { this.props.authUser.access_token } setter = { this.setEmpleado } cardTable = 'cardTable_obra'
                            urlRender = { `${URL_DEV}v2/rh/empleados?type=obra` } idTable = 'empleados_obra_table'
                            cardTableHeader = 'cardTableHeader_obra' cardBody = 'cardBody_obra' isTab = { true } />
                    </Tab>
                </Tabs>
                <ModalDelete title={'¿Quieres eliminar el empleado?'} show={modal.delete} handleClose={this.handleCloseModalDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEmpleadoAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles }
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoEmpleadoAxios() }}
                        adjuntos={['datosGenerales', 'recibosNomina', 'altasBajas']} />
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-7"></div>
                    <TableForModals columns = { ADJUNTOS_COLUMNS } data = { adjuntos } hideSelector = { true } mostrar_acciones = { true }
                        actions = { { 'deleteAdjunto': { function: this.openModalDeleteAdjuntos } }} dataID = 'adjuntos'
                        elements = { data.adjuntos }/>
                </Modal>
                <Modal size="lg" title="Empleados" show={modal.see} handleClose={this.handleCloseSee} >
                    <EmpleadosCard empleado={empleado} />
                </Modal>
                <Modal size="lg" title="Contrato" show={modal.contrato} handleClose={this.handleCloseContrato} >
                    <FormularioContrato empleado={empleado} form={formContrato} onChangeRange={this.onChangeRange} onChangeContrato={this.onChangeContrato} 
                        generarContrato={this.generar} clearFiles = { this.clearFiles } onChangeAdjuntos={this.onChangeAdjuntos} 
                        cancelarContrato={this.cancelarContrato} renovarContrato = { this.renovarContrato } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);