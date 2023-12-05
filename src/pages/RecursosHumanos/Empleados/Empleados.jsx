import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
// import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
// import { NewTable } from '../../../components/NewTables'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { Modal, ModalDelete } from '../../../components/singles'
import { EMPLEADOS_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS, TEL } from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { AdjuntosForm } from '../../../components/forms'
import { setOptions, setTextTable, setArrayTable, setAdjuntosList, setDateTableReactDom, setArrayTableReactDom, setTextTableReactDom, setEstatusBancoTableReactDom, setTextTableCenter, setTagLabelReactDom,
    // setNaviIcon
 } from '../../../functions/setters'
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
import { FormularioContrato, LicenciasEquiposForm, HistorialVacaciones, PrestacionesRHList } from "../../../components/forms"
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
            contrato: false,
            licencias: false,
            vacaciones: false,
            prestaciones: false
        },
        title: 'Nuevo colaborador',
        form: {
            nombre: '',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            nombre_emergencia2: '',
            telefono_emergencia2: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo',
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: '',
            fecha_egreso:'',
            estatus_imss: 'Activo',
            puesto: '',
            vacaciones_disponibles: 0,
            fecha_alta_imss: '',
            numero_alta_imss: '',
            nomina_imss: 0.0,
            nomina_extras: 0.0,
            salario_hr: 0.0,
            salario_hr_extra: 0.0,
            imss: 0.0,
            rcv: 0.0,
            organigrama:'',
            checador: '',
            matricula: '',
            adjuntos: {
                acta: {
                    value: '',
                    placeholder: 'Acta de nacimiento',
                    files: []
                },
                curp: {
                    value: '',
                    placeholder: 'CURP',
                    files: []
                },
                rfc: {
                    value: '',
                    placeholder: 'RFC',
                    files: []
                },
                nss: {
                    value: '',
                    placeholder: 'NSS',
                    files: []
                },
                identificacion: {
                    value: '',
                    placeholder: 'Identificación Oficial',
                    files: []
                },
                domicilio: {
                    value: '',
                    placeholder: 'Comprobante Domicilio',
                    files: []
                },
                estudios: {
                    value: '',
                    placeholder: 'Comprobante Estudios',
                    files: []
                },
                bancaria: {
                    value: '',
                    placeholder: 'Cuenta Bancaria',
                    files: []
                },
                retencion: {
                    value: '',
                    placeholder: 'Aviso Retención INFONAVIT',
                    files: []
                },
                firma: {
                    value: '',
                    placeholder: 'Firma electrónica',
                    files: []
                },
                foto: {
                    value: '',
                    placeholder: 'Foto de ingreso',
                    files: []
                },
                imss: {
                    value: '',
                    placeholder: 'IMSS',
                    files: []
                },
                bajaimss: {
                    value: '',
                    placeholder: 'Baja IMSS',
                    files: []
                },
                responsiva: {
                    value: '',
                    placeholder: 'Responsiva',
                    files: []
                },
                cv: {
                    value: '',
                    placeholder: 'Curriculum Vitae',
                    files: []
                },
            }
        },
        options: {
            empresas: [],
            bancos: [],
            estado_civil: [
                { value: 'Soltero(a)', name: 'Soltero(a)', label: 'Soltero(a)' },
                { value: 'Casado(a)', name: 'Casado(a)', label: 'Casado(a)' },
                { value: 'Divorciado(a)', name: 'Divorciado(a)', label: 'Divorciado(a)' },
                { value: 'Viudo(a)', name: 'Viudo(a)', label: 'Viudo(a)' },
                { value: 'Union libre', name: 'Unión libre', label: 'Unión libre' },
            ]
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
            genero: '',
            tipos: [],

            adjuntos: {
                contrato: {
                    value: '',
                    placeholder: 'Contrato',
                    files: []
                },
                carta: {
                    value: '',
                    placeholder: 'Carta',
                    files: []
                }
            },
            direccion_contrato:''
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
    changePageEdit = colaborador => {
        const { history } = this.props
        history.push({
            pathname: '/rh/colaboradores/edit',
            state: { empleado: colaborador }
        });
    }
    openModalDelete = colaborador => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            empleado: colaborador
        })
    }
    openModalAdjuntos = colaborador => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = colaborador.datos_generales.concat(colaborador.recibos_nomina).concat(colaborador.altas_bajas)
        this.setState({
            ...this.state,
            modal,
            empleado: colaborador,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', '', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }
    openModalSee = colaborador => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            empleado: colaborador
        })
    }
    openModalContrato = colaborador => {
        const { modal, formContrato } = this.state
        modal.contrato = true
        formContrato.direccion_contrato = colaborador.empresa.direccion
        this.setState({
            ...this.state,
            modal,
            empleado: colaborador,
            formeditado:1
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
                        },
                        carta: {
                            value: '',
                            placeholder: 'Carta',
                            files: []
                        }
                    }
                break;
                
                case 'tipos':
                    formContrato[element] = []
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
                        acta: {
                            value: '',
                            placeholder: 'Acta de nacimiento',
                            files: []
                        },
                        curp: {
                            value: '',
                            placeholder: 'CURP',
                            files: []
                        },
                        rfc: {
                            value: '',
                            placeholder: 'RFC',
                            files: []
                        },
                        nss: {
                            value: '',
                            placeholder: 'NSS',
                            files: []
                        },
                        identificacion: {
                            value: '',
                            placeholder: 'Identificación Oficial',
                            files: []
                        },
                        domicilio: {
                            value: '',
                            placeholder: 'Comprobante Domicilio',
                            files: []
                        },
                        estudios: {
                            value: '',
                            placeholder: 'Comprobante Estudios',
                            files: []
                        },
                        bancaria: {
                            value: '',
                            placeholder: 'Cuenta Bancaria',
                            files: []
                        },
                        retencion: {
                            value: '',
                            placeholder: 'Aviso Retención INFONAVIT',
                            files: []
                        },
                        firma: {
                            value: '',
                            placeholder: 'Firma electrónica',
                            files: []
                        },
                        foto: {
                            value: '',
                            placeholder: 'Foto de ingreso',
                            files: []
                        },
                        imss: {
                            value: '',
                            placeholder: 'IMSS ALTA',
                            files: []
                        },
                        bajaimss: {
                            value: '',
                            placeholder: 'IMSS BAJA',
                            files: []
                        },
                        responsiva: {
                            value: '',
                            placeholder: 'Responsiva',
                            files: []
                        },
                        cv: {
                            value: '',
                            placeholder: 'Curriculum Vitae',
                            files: []
                        },
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
    setEmpleado = colaboradores => {
        let aux = []
        if (colaboradores)
            colaboradores.map((colaborador) => {
                aux.push(
                    {
                        actions: this.setActions(colaborador),
                        nombre: setTextTableReactDom(`${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`, this.doubleClick, colaborador, 'nombre', 'text-center'),
                        empresa: setTextTableReactDom(colaborador.empresa ? colaborador.empresa.name : '', this.doubleClick, colaborador, 'empresa', 'text-center '),
                        departamento: colaborador.departamentos.length === 0 ? setTextTableCenter("Sin definir") 
                        : setTagLabelReactDom(colaborador, colaborador.departamentos, 'departamento_empleado', this.deleteElementAxios, ''),
                        puesto: setTextTableReactDom(colaborador.puesto, this.doubleClick, colaborador, 'puesto', 'text-center'),
                        rfc: setTextTableReactDom(colaborador.rfc, this.doubleClick, colaborador, 'rfc', 'text-center'),
                        nss: setTextTableReactDom(colaborador.nss, this.doubleClick, colaborador, 'nss', 'text-center'),
                        curp: setTextTableReactDom(colaborador.curp, this.doubleClick, colaborador, 'curp', 'text-center'),
                        estatus: setEstatusBancoTableReactDom(colaborador, this.changeEstatus ),
                        fechaInicio: setDateTableReactDom(colaborador.fecha_inicio, this.doubleClick, colaborador, 'fecha', 'text-center'),
                        cuenta: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': colaborador.banco_nombre ? colaborador.banco_nombre : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': colaborador.cuenta ? colaborador.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': colaborador.clabe ? colaborador.clabe : 'Sin definir' },
                            ], '180px'
                        )),
                        nombre_emergencia:setArrayTableReactDom(
                            [
                                { 'name': 'Nombre', 'text': colaborador.nombre_emergencia ? colaborador.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': colaborador.telefono_emergencia ? colaborador.telefono_emergencia : 'Sin definir' }
                            ],'120px', this.doubleClick, colaborador, 'nombre_emergencia'
                        ),
                        nombre_emergencia2:setArrayTableReactDom(
                            [
                                { 'name': 'Nombre', 'text': colaborador.nombre_emergencia2 ? colaborador.nombre_emergencia2 : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': colaborador.telefono_emergencia2 ? colaborador.telefono_emergencia2 : 'Sin definir' }
                            ],'120px', this.doubleClick, colaborador, 'nombre_emergencia2'
                        ),
                        vacaciones_tomadas: setTextTableReactDom(colaborador.vacaciones_disponibles, this.doubleClick, colaborador, 'vacaciones_disponibles', 'text-center'),
                        id: colaborador.id
                    }
                )
                return false
            })
            localStorage.setItem('activeKeyTabColaboradores', 'administrativo')
        return aux
    }
    setEmpleadoObra = colaboradores => {
        let aux = []
        if (colaboradores)
            colaboradores.map((colaborador) => {
                aux.push(
                    {
                        actions: this.setActions(colaborador),
                        nombre: setTextTableReactDom(`${colaborador.nombre} ${colaborador.apellido_paterno} ${colaborador.apellido_materno}`, this.doubleClick, colaborador, 'nombre', 'text-center'),
                        empresa: setTextTableReactDom(colaborador.empresa ? colaborador.empresa.name : '', this.doubleClick, colaborador, 'empresa', 'text-center '),
                        departamento: colaborador.departamentos.length === 0 ? setTextTableCenter("Sin definir") 
                        : setTagLabelReactDom(colaborador, colaborador.departamentos, 'departamento_empleado', this.deleteElementAxios, ''),
                        puesto: setTextTableReactDom(colaborador.puesto, this.doubleClick, colaborador, 'puesto', 'text-center'),
                        rfc: setTextTableReactDom(colaborador.rfc, this.doubleClick, colaborador, 'rfc', 'text-center'),
                        nss: setTextTableReactDom(colaborador.nss, this.doubleClick, colaborador, 'nss', 'text-center'),
                        curp: setTextTableReactDom(colaborador.curp, this.doubleClick, colaborador, 'curp', 'text-center'),
                        estatus: setEstatusBancoTableReactDom(colaborador, this.changeEstatus ),
                        fechaInicio: setDateTableReactDom(colaborador.fecha_inicio, this.doubleClick, colaborador, 'fecha', 'text-center'),
                        cuenta: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': colaborador.banco ? colaborador.banco : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': colaborador.cuenta ? colaborador.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': colaborador.clabe ? colaborador.clabe : 'Sin definir' },
                            ], '180px'
                        )),
                        nombre_emergencia:setArrayTableReactDom(
                            [
                                { 'name': 'Nombre', 'text': colaborador.nombre_emergencia ? colaborador.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': colaborador.telefono_emergencia ? colaborador.telefono_emergencia : 'Sin definir' }
                            ],'120px', this.doubleClick, colaborador, 'nombre_emergencia'
                        ),
                        nombre_emergencia2:setArrayTableReactDom(
                            [
                                { 'name': 'Nombre', 'text': colaborador.nombre_emergencia2 ? colaborador.nombre_emergencia2 : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': colaborador.telefono_emergencia2 ? colaborador.telefono_emergencia2 : 'Sin definir' }
                            ],'120px', this.doubleClick, colaborador, 'nombre_emergencia2'
                        ),
                        vacaciones_tomadas: setTextTableReactDom(colaborador.vacaciones_disponibles, this.doubleClick, colaborador, 'vacaciones_disponibles', 'text-center'),
                        id: colaborador.id
                    }
                )
                return false
            })
            localStorage.setItem('activeKeyTabColaboradores', 'obra')
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
            case 'nombre_emergencia2':
                form.nombre_emergencia2 = data.nombre_emergencia2
                form.telefono_emergencia2 = data.telefono_emergencia2
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
                    tipo === 'nombre_emergencia2' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } placeholder="NOMBRE DEL CONTACTO DE EMERGENCIA 2"
                            requirevalidation = { 0 }  value = { form.nombre_emergencia2 } name = { 'nombre_emergencia2' } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                        
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="telefono_emergencia2" value={form.telefono_emergencia2} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'telefono_emergencia2')} }
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
                            placeholder={this.setSwalPlaceholder(tipo)} withicon={1}
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
    changeEstatus = (estatus, colaborador) =>  {
        estatus === 'Activo'?
            questionAlert('¿ESTÁS SEGURO?', 'ACTIVARÁS EL COLABORADOR', () => this.changeEstatusAxios(estatus, colaborador))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'INHABILITARÁS EL COLABORADOR', () => this.changeEstatusAxios(estatus, colaborador))
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

    setActions = colaborador => {
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
        if (colaborador.estatus_empleado === 'Activo') {
            aux.push(
                {
                    text: 'Contrato',
                    btnclass: 'warning',
                    iconclass: 'flaticon2-file-1',
                    action: 'contrato',
                    tooltip: { id: 'adjuntos', text: 'Contrato' }
                },
                {
                    text: 'Licencias y equipos',
                    btnclass: 'dark',
                    iconclass: 'flaticon-imac',
                    action: 'licencias',
                    tooltip: { id: 'licencias', text: 'Licencias y equipos' }
                },
                {
                    text: 'Historial de vacaciones',
                    btnclass: 'success',
                    iconclass: 'la-umbrella-beach',
                    action: 'historial-vacaciones',
                    tooltip: { id: 'historial-vacaciones', text: 'Historial de vacaciones' }
                },
                {
                    text: 'Prestaciones',
                    btnclass: 'primary',
                    iconclass: 'la-hand-holding-usd',
                    action: 'prestaciones',
                    tooltip: { id: 'prestaciones', text: 'Prestaciones' }
                }
            )
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
        if (value === 'prestaciones'){

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
                //console.log(response)               
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                // console.log(data.adjuntos)
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue eliminado con éxito.')
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
            console.error(error, 'error')
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
            case 'nombre_emergencia2':
                value = { nombre: form.nombre_emergencia2, telefono: form.telefono_emergencia2 }
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
                doneAlert(response.data.message !== undefined ? response.data.message : 'La colaborador fue editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async changeEstatusAxios(estatus, colaborador){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/update/${colaborador.id}/estatus`,{estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
        })
    }
    onChangeContrato= e => {
        
        const { name, value, type } = e.target
        let { formContrato, empleado } = this.state
        formContrato[name] = value
        if(type === 'radio'){
            formContrato.periodo = value
            if(formContrato.periodo === 'indefinido'){
                formContrato.dias = ''
            }
        }
        switch (name) {
            case 'pagos_hr_extra':
            case 'total_obra':
                formContrato[name] = value.replace(/[,]/gi, '')
                break;
            case 'periodo':
                if(empleado.contratos.length === 0){
                    formContrato.fechaInicio = new Date(moment(empleado.fecha_inicio))
                }else{
                    let aux = []
                    empleado.contratos.map((contrato) => {
                        if (contrato.fecha_fin) {
                            aux.push(contrato.fecha_fin)
                        }
                        return false
                    })
                    aux.sort(function(a,b){
                        return new Date(b) - new Date(a);
                    });
                    formContrato.fechaInicio = new Date(moment(aux[0]))
                }
                break;
            default:
                break;
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
                formContrato.tipos = []

                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrado fue generado con éxito.')
                if(contrato.contrato)
                    window.open(contrato.contrato, '_blank');
                if(contrato.carta)
                    window.open(contrato.carta, '_blank');
                this.setState({ ...this.state, empleado: empleado, formContrato: this.clearFormContrato(), modal })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                if(contrato.contrato)
                    window.open(contrato.contrato, '_blank');
                if(contrato.carta)
                    window.open(contrato.carta, '_blank');
                    formContrato.tipos = []

                this.setState({ ...this.state, empleado: empleado, formContrato: this.clearFormContrato(), modal })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onChangeAdjuntos = valor => {
        let tipo = valor.target.id
        sendFileAlert( valor, (success) => { this.addAdjuntoAxios(success, tipo);})
    }

    async addAdjuntoAxios(valor, tipo) {
        waitAlert()
        const { name, file } = valor.target
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        let data = new FormData();
        if(file){
            data.append(`file`, file)
            await axios.post(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${name}/adjuntar?tipo=${tipo}`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { empleado } = response.data
                    const { key } = this.state
                    if (key === 'administrativo') { this.getEmpleadosAxios() }
                    if (key === 'obra') { this.getEmpleadosObraAxios() }
                    this.setState({...this.state, empleado: empleado})
                    doneAlert(response.data.message !== undefined ? response.data.message : 'El adjunto fue registrado con éxito.')
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }else{ errorAlert('Adjunta solo un archivo') }
        
    }
    cancelarContrato = element => {
        deleteAlert('¿DESEAS TERMINAR EL CONTRATO?', '', () => this.cancelarContratoAxios(element.id), 'SI, TERMINAR')
    }
    regeneratePdf = element => {
        deleteAlert('¿ESTÁS SEGURO?', 'GENERARÁS UN NUEVO CONTRATO', () => this.regeneratePdfAxios(element.id), 'SI, REGENERAR')
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
            console.error(error, 'error')
        })
    }
    regeneratePdfAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.get(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${id}/regenerar`, { headers: setSingleHeader(access_token) }).then(
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
            console.error(error, 'error')
        })
    }

    deleteContratoAxios = async(contrato) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { empleado ,formContrato} = this.state
        await axios.delete(`${URL_DEV}v2/rh/empleados/${empleado.id}/contratos/${contrato.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleado } = response.data
                const { key } = this.state
                if (key === 'administrativo') { this.getEmpleadosAxios() }
                if (key === 'obra') { this.getEmpleadosObraAxios() }
                formContrato.tipos = []

                this.setState({...this.state, empleado: empleado})
                doneAlert(response.data.message !== undefined ? response.data.message : 'Contrato terminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    // LICENCIAS Y EQUIPOS
    openModalLicencias = colaborador => {
        const { modal } = this.state
        modal.licencias = true
        this.setState({
            ...this.state,
            modal,
            empleado: colaborador,
            formeditado:1
        })
    }
    handleCloseLicencias = () => {
        const { modal } = this.state
        modal.licencias = false
        modal.vacaciones = false
        modal.prestaciones = false
        this.setState({
            ...this.state,
            modal
        })
    }
    openModalHistorialVacaciones = colaborador => {
        const { modal } = this.state
        modal.vacaciones = true
        this.setState({
            ...this.state,
            empleado: colaborador,
            modal
        })
    }
    openModalPrestaciones = colaborador => { 
        const { modal } = this.state
        modal.prestaciones = true
        this.setState({
            ...this.state,
            empleado: colaborador,
            modal
        })
    }
// setActions = empleados => {
//     return (
//         <div className="w-100 d-flex justify-content-center">
//             <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
//                 <Dropdown.Item className="text-hover-success dropdown-success" 
//                     onClick={(e) => { e.preventDefault(); this.changePageEdit(empleados)}} >
//                     {setNaviIcon('flaticon2-pen', 'editar')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-danger dropdown-danger" 
//                     onClick={(e) => { e.preventDefault(); deleteAlert(`ELIMINARÁS LA empleados CON IDENTIFICADOR: ${empleados.id}`, 
//                         '¿DESEAS CONTINUAR?', () => this.openModalDelete(empleados.id)) }}>
//                     {setNaviIcon('flaticon2-rubbish-bin', 'eliminar')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalSee(empleados) }}>
//                     {setNaviIcon('flaticon2-magnifier-tool', 'Mostrar')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-info dropdown-info" onClick={(e) => { e.preventDefault(); this.openModalAdjuntos(empleados) }}>
//                     {setNaviIcon('flaticon-attachment', 'Adjuntos')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-warning dropdown-warning" onClick={(e) => { e.preventDefault(); this.openModalContrato(empleados) }}>
//                     {setNaviIcon('flaticon2-file-1', 'Contrato')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-warning dropdown-dark" onClick={(e) => { e.preventDefault(); this.openModalLicencias(empleados) }}>
//                     {setNaviIcon('flaticon-imac', 'Licencias y equipos')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-warning dropdown-success" onClick={(e) => { e.preventDefault(); this.openModalHistorialVacaciones(empleados) }}>
//                     {setNaviIcon('la-umbrella-beach', 'Historial de vacaciones')}
//                 </Dropdown.Item>
//                 <Dropdown.Item className="text-hover-warning dropdown-primary" onClick={(e) => { e.preventDefault(); this.openModalHistorialVacaciones(empleados) }}>
//                     {setNaviIcon('la-hand-holding-usd', 'Prestaciones')}
//                 </Dropdown.Item>
//             </DropdownButton>
//         </div>
//     )
// }

//     setEmpleados = empleados => {
//         // let aux = []
//         // empleados.map((empleado) => {
//         // aux.push(
//         //    {
//         //     actions: this.setActions(empleado)
//         //    }
//         //         )    
//         //      return false
//         // })
//         // return aux
//     }

    render() {
        const { modal, form, key, adjuntos, data, empleado, formContrato, formeditado } = this.state
        const { access_token, departamento } = this.props.authUser

        return (
            <Layout active={'rh'} {...this.props}>
                <Tabs defaultActiveKey={localStorage.getItem('activeKeyTabColaboradores')} activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    {
                        // departamento.departamentos[0].nombre !== "COMPRAS" &&
                        <Tab eventKey="administrativo" title="Administrativo">
                    {/* <NewTable
                    columns = { EMPLEADOS_COLUMNS } title = 'Colaboradores administrativos'
                            subtitle = 'Listado de colaboradores' mostrar_boton = { true } abrir_modal = { false }
                            url = '/rh/colaboradores/add'
                            mostrar_acciones = { true }
                            exportar_boton = { true }
                            onClickExport = { () => this.exportRHAxios() }
                            actions = {  () => this.setEmpleados() }
                            accessToken = { this.props.authUser.access_token } setter = { this.setEmpleado }
                            urlRender = { `${URL_DEV}v2/rh/empleados?type=admin` } idTable = 'empleados_admin_table'
                            cardTable = 'cardTable_admin' cardTableHeader = 'cardTableHeader_admin'
                            cardBody = 'cardBody_admin' isTab = { true } 
                     /> */}
                        <NewTableServerRender columns = { EMPLEADOS_COLUMNS } title = 'Colaboradores administrativos'
                            subtitle = 'Listado de colaboradores' mostrar_boton = { true } abrir_modal = { false }
                            url = '/rh/colaboradores/add' mostrar_acciones = { true } exportar_boton = { true }
                            onClickExport = { () => this.exportRHAxios() }
                            actions = {
                                {
                                    'edit': { function: this.changePageEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'see': { function: this.openModalSee },
                                    'contrato' : { function: this.openModalContrato },
                                    'licencias' : { function: this.openModalLicencias },
                                    'historial-vacaciones' : { function: this.openModalHistorialVacaciones },
                                    'prestaciones' : { function: this.openModalPrestaciones }
                                }
                            }
                            accessToken = { this.props.authUser.access_token } setter = { this.setEmpleado }
                            urlRender = { `${URL_DEV}v2/rh/empleados?type=admin` } idTable = 'empleados_admin_table'
                            cardTable = 'cardTable_admin' cardTableHeader = 'cardTableHeader_admin'
                            cardBody = 'cardBody_admin' isTab = { true } />
                    </Tab>
                    }
                    
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender columns = { EMPLEADOS_COLUMNS } title = 'Colaboradores de obra' subtitle = 'Listado de colaboradores' 
                            mostrar_boton = { true } abrir_modal = { false } url = '/rh/colaboradores/add' mostrar_acciones = { true } exportar_boton = { true }
                            onClickExport = { () => this.exportRHAxios() }
                            actions={{
                                'edit': { function: this.changePageEdit },
                                'delete': { function: this.openModalDelete },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee },
                                'contrato' : { function: this.openModalContrato }
                            }}
                            accessToken = { this.props.authUser.access_token } setter = { this.setEmpleadoObra } cardTable = 'cardTable_obra'
                            urlRender = { `${URL_DEV}v2/rh/empleados?type=obra` } idTable = 'empleados_obra_table'
                            cardTableHeader = 'cardTableHeader_obra' cardBody = 'cardBody_obra' isTab = { true } />
                    </Tab>
                    <Tab eventKey="prestaciones" title="Prestaciones de ley"> <h4>Prestaciones de Ley</h4></Tab>
                </Tabs>
                <ModalDelete title={'¿Quieres eliminar el colaborador?'} show={modal.delete} handleClose={this.handleCloseModalDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteEmpleadoAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = { this.clearFiles }
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoEmpleadoAxios() }}
                        adjuntos={['acta', 'curp', 'rfc','nss', 'identificacion', 'domicilio','estudios', 'bancaria','retencion', 'firma', 'foto', 'imss', 'bajaimss', 'responsiva', 'cv']} />
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-7"></div>
                    <TableForModals columns = { ADJUNTOS_COLUMNS } data = { adjuntos } hideSelector = { true } mostrar_acciones = { true }
                        actions = { { 'deleteAdjunto': { function: this.openModalDeleteAdjuntos } }} dataID = 'adjuntos'
                        elements = { data.adjuntos }/>
                </Modal>
                <Modal size="lg" title="Colaborador" show={modal.see} handleClose={this.handleCloseSee} >
                    <EmpleadosCard empleado={empleado} />
                </Modal>
                <Modal size="xl" title="Contrato" show={modal.contrato} handleClose={this.handleCloseContrato} >
                    <FormularioContrato empleado={empleado} form={formContrato} onChangeRange={this.onChangeRange} onChangeContrato={this.onChangeContrato} 
                        generarContrato={this.generar} clearFiles = { this.clearFiles } onChangeAdjuntos={this.onChangeAdjuntos} 
                        cancelarContrato={this.cancelarContrato} renovarContrato = { this.renovarContrato } regeneratePdf = { this.regeneratePdf } formeditado={formeditado}
                        user = { this.props.authUser.user } deleteContrato = { this.deleteContratoAxios } />
                </Modal>
                <Modal size="xl" title="Licencias y equipos" show={modal.licencias} handleClose={this.handleCloseLicencias} >
                    {
                        modal.licencias ?
                            <LicenciasEquiposForm 
                            at={access_token} 
                            empleado = { empleado }
                            esColaborador={true}
                            adminView={false}
                            />
                        : <></>
                    }
                </Modal>
                <Modal size="lg" title="Historial de solicitud de vacaciones" show={modal.vacaciones} handleClose={this.handleCloseLicencias} >
                    <HistorialVacaciones at={access_token} empleado = { empleado }/>
                </Modal>
                <Modal title="Prestaciones del colaborador" show={modal.prestaciones} handleClose={this.handleCloseLicencias} >
                    <PrestacionesRHList at={access_token} empleado = { empleado }/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);