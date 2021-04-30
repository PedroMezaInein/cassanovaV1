import React, { Component } from 'react'
import { Form, Tab, Tabs } from 'react-bootstrap'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import CuentaCard from '../../../components/cards/Bancos/CuentaCard'
import { Calendar, Button } from '../../../components/form-components'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import ItemSlider from '../../../components/singles/ItemSlider'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import TableForModals from '../../../components/tables/TableForModals'
import { CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS, URL_DEV } from '../../../constants'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert, questionAlert } from '../../../functions/alert'
import { setArrayTable, setDateTable, setSelectOptions, setMoneyTable, setTextTableCenter, setDateTableReactDom, setTextTableReactDom, setOptions, setListTable, setEstatusBancoTableReactDom, setTextTable } from '../../../functions/setters'
import axios from 'axios'
import Swal from 'sweetalert2'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { InputGray, CalendarDaySwal, SelectSearchGray, InputNumberGray } from '../../../components/form-components'
import $ from "jquery";
class Cuenta extends Component {
    state = {
        key: 'bancos',
        keyEstados: 'listado',
        modal: {
            delete: false,
            see: false,
            estado: false
        },
        form: {
            nombre: '',
            numero: '',
            estatus: 0,
            tipo: '',
            banco: '',
            empresa_principal: '',
            empresa: '',
            empresas: [],
            descripcion: '',
            usuarios: [],
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: ''
                }
            },
            fecha: new Date()
        },
        options: {
            empresas: [],
            bancos: [],
            estatus: [],
            tipos: [],
            usuarios:[]
        },
        data: {
            estados: []
        },
        estados: [],
        cuenta: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!modulo)
            history.push('/')
            this.getOptionsAxios()
    }
    async getOptionsAxios(tipo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { bancos, estatus, tipos, empresas, users } = response.data
                const { options, cuenta } = this.state
                let aux = []
                if (tipo === 'bancos') {
                    bancos.map((banco) => {
                        if (banco.nombre !== 'CAJA CHICA')
                            aux.push(banco)
                        return false
                    })
                }
                if (tipo === 'cajas') {
                    bancos.map((banco) => {
                        if (banco.nombre === 'CAJA CHICA') {
                            aux.push(banco)
                            this.onChange({ target: { value: banco.id.toString(), name: 'banco' } })
                        }
                        return false
                    })
                    tipos.map((element) => {
                        if (element.tipo === 'EFECTIVO') {
                            this.onChange({ target: { value: element.id.toString(), name: 'tipo' } })
                        }
                        return false
                    })
                }
                if (cuenta) {
                    if (cuenta.banco) {
                        if (cuenta.banco.nombre === 'CAJA CHICA') {
                            tipo = 'cajas'
                            bancos.map((banco) => {
                                if (banco.nombre === 'CAJA CHICA') {
                                    aux.push(banco)
                                    this.onChange({ target: { value: banco.id.toString(), name: 'banco' } })
                                }
                                return false
                            })
                        } else {
                            tipo = 'bancos'
                            bancos.map((banco) => {
                                if (banco.nombre !== 'CAJA CHICA')
                                    aux.push(banco)
                                return false
                            })
                            this.onChange({ target: { value: cuenta.banco.id.toString(), name: 'banco' } })
                        }
                    }
                }
                if (aux.length === 0)
                    aux = bancos
                options.bancos = setOptions(aux, 'nombre', 'id')
                options.tipos = setOptions(tipos, 'tipo', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                options.estatus = setSelectOptions(estatus, 'estatus')
                options.usuarios =  setOptions(users, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    tipo: tipo
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
    controlledTab = value => {
        if (value === 'bancos') {
            this.getBancosAxios()
        }
        if (value === 'cajas') {
            this.getCajasAxios()
        }
        this.setState({
            ...this.state,
            key: value
        })
    }
    controlledTabEstados = value => {
        const { form } = this.state
        if (value === 'nuevo') {
            form.adjuntos.adjuntos.files = []
            form.adjuntos.adjuntos.value = ''
            form.fecha = new Date()
        }
        this.setState({
            ...this.state,
            keyEstados: value,
            form
        })
    }
    setCuentas = cuentas => {
        let aux = []
        cuentas.map((cuenta) => {
            aux.push({
                actions: this.setActions(cuenta),
                nombre: renderToString(setTextTableCenter(cuenta.nombre, '180px')),
                numero: renderToString(setTextTable(cuenta.numero)),
                balance: renderToString(setMoneyTable(cuenta.balance)),
                descripcion: setTextTableReactDom(cuenta.descripcion !== null ? cuenta.descripcion :'', this.doubleClick, cuenta, 'descripcion', 'text-justify'),
                banco: renderToString(setTextTableCenter(cuenta.banco ? cuenta.banco.nombre : '')),
                tipo: renderToString(setTextTableCenter(cuenta.tipo ? cuenta.tipo.tipo : '')),
                estatus: cuenta.estatus ? setEstatusBancoTableReactDom(cuenta, this.changeEstatus ) : '',
                empresa: renderToString(setListTable(cuenta.empresa, 'name', '151px')),
                principal: renderToString(setTextTableCenter(cuenta ? cuenta.empresa_principal ? cuenta.empresa_principal.name : '' : '', '153px')),
                fecha: setDateTableReactDom(cuenta.created_at, this.doubleClick, cuenta, 'fecha', 'text-center'),
                id: cuenta.id
            })
            return false
        })
        return aux
    }
    changeEstatus = (estatus, cuenta) =>  {
        estatus === 'Activo'?
            questionAlert('¿ESTÁS SEGURO?', 'ACTIVARÁS LA CUENTA', () => this.changeEstatusAxios(estatus, cuenta))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'INHABILITARÁS LA CUENTA', () => this.changeEstatusAxios(estatus, cuenta))
    }
    async changeEstatusAxios(estatus, cuenta){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/bancos/cuentas/update/${cuenta.id}/estatus`,{estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estatus actualizado con éxito')
                const { key } = this.state
                if (key === 'bancos') 
                    this.getBancosAxios()
                if (key === 'cajas') 
                    this.getCajasAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    deleteElementAxios = async(data, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/bancos/cuentas/${data.id}/empresa/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    doubleClick = (data, tipo) => {
        // console.log(data)
        const { form } = this.state
        switch(tipo){
            case 'empresa_principal':
            case 'banco':
            case 'tipo':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
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
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    (tipo === 'empresa_principal') || (tipo === 'banco') || (tipo === 'tipo') ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) } value = { form[tipo] } customdiv="mb-2 mt-7"
                            onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo } requirevalidation={1} 
                            placeholder={this.setSwalPlaceholder(tipo)}
                        />
                    :<></>
                }
                {
                    tipo === 'numero' &&
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } type="text"
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                }
            </div>,
            <Update />,
            () => { this.patchCuenta(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'empresa_principal':
                return 'SELECCIONA LA EMPRESA'
            case 'banco':
                return 'SELECCIONA EL BANCO'
            case 'tipo':
                return 'SELECCIONA EL TIPO DE CUENTA'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchCuenta = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/bancos/cuentas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'La cuenta fue editada con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'empresa_principal':
                return options.empresas
            case 'banco':
                return options.bancos
            case 'tipo':
                return options.tipos
            default: return []
        }
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Adjuntos',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }
    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Agregar&nbsp;estado&nbsp;de&nbsp;cuenta',
                btnclass: 'info',
                iconclass: 'flaticon2-infographic',
                action: 'estado',
                tooltip: { id: 'estado', text: 'Agregar estados de cuenta', type: 'error' }
            },
            {
                text: 'Detalles',
                btnclass: 'info',
                iconclass: 'flaticon-eye',
                action: 'details',
                tooltip: { id: 'details', text: 'Detalles', type: 'info' },
            },
        )
        return aux
    }
    setEstados = estados => {
        let aux = []
        estados.map((estado, key) => {
            aux.push({
                actions: this.setActionsEstado(estado),
                estado: renderToString(setArrayTable([{ url: estado.url, text: estado.name }])),
                fecha: renderToString(setDateTable(estado.created_at)),
                id: estado.id
            })
            return false
        })
        return aux
    }
    setActionsEstado = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAction',
                tooltip: { id: 'deleteEstado', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    onChangeCalendar = date => {
        const { form } = this.state
        form.fecha = date
        this.setState({
            ...this.state,
            form
        })
    }
    handleChange = (files, item) => {
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
    async getBancosAxios() {
        $('#cuentas_bancos').DataTable().ajax.reload();
    }
    async getCajasAxios() {
        $('#cuentas_cajas').DataTable().ajax.reload();
    }
    changePageEdit = cuenta => {
        const { history } = this.props
        history.push({
            pathname: '/bancos/cuentas/edit',
            state: { cuenta: cuenta }
        });
    }
    changePageDetails = cuenta => {
        const { history } = this.props
        history.push({
            pathname: '/bancos/cuentas/details/'+cuenta.id,
            state: { cuenta: cuenta }
        });
    }
    openModalDelete = cuenta => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            cuenta: ''
        })
    }
    openModalSee = cuenta => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            cuenta: ''
        })
    }
    openModalEstado = cuenta => {
        const { modal, data } = this.state
        modal.estado = true
        data.estados = cuenta.estados
        this.setState({
            ...this.state,
            modal,
            cuenta: cuenta,
            data,
            estados: this.setEstados(cuenta.estados)
        })
    }
    handleCloseEstado = () => {
        const { modal, data } = this.state
        modal.estado = false
        data.estados = []
        this.setState({
            ...this.state,
            modal,
            cuenta: '',
            data,
            estados: []
        })
    }
    openModalDeleteEstado = estado => {
        deleteAlert('¿DESEAS ELIMINAR EL ESTADO DE CUENTA?', '', () => this.deleteEstadoCuentaAxios(estado))
    }
    async deleteCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key, modal } = this.state
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                modal.delete = false
                this.setState({
                    ...this.state,
                    modal,
                    cuenta: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta eliminada con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { form, cuenta } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        data.append('id', cuenta.id)
        await axios.post(URL_DEV + 'cuentas/estado', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuenta } = response.data
                const { data, key, form } = this.state
                data.estados = cuenta.estados
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                form.fecha = new Date()
                this.setState({
                    ...this.state,
                    form,
                    cuenta: cuenta,
                    estados: this.setEstados(cuenta.estados),
                    data,
                    keyEstados: 'listado'
                })
                doneAlert('Adjunto creado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteEstadoCuentaAxios(estado) {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id + '/estado/' + estado.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuenta } = response.data
                const { data, key } = this.state
                data.estados = cuenta.estados
                if (key === 'bancos') {
                    this.getBancosAxios()
                }
                if (key === 'cajas') {
                    this.getCajasAxios()
                }
                this.setState({
                    ...this.state,
                    data,
                    estados: this.setEstados(cuenta.estados)
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Estado de cuenta eliminado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getExcelBancos = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/bancos/cuentas', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'cuentas.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getExcelCajaChica = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/bancos/caja', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'caja.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { key, cuenta, modal, keyEstados, form, estados, data } = this.state
        return (
            <Layout active='bancos' {...this.props}>
                <Tabs defaultActiveKey='bancos' activeKey={key}
                    onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey='bancos' title='Banco'>
                        {
                            key === 'bancos' ?
                                <NewTableServerRender
                                    columns={CUENTAS_COLUMNS}
                                    title='Cuentas'
                                    subtitle='Listado de cuentas'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/bancos/cuentas/add?type=bancos'
                                    mostrar_acciones={true}
                                    actions={
                                        {
                                            'edit': { function: this.changePageEdit },
                                            'delete': { function: this.openModalDelete },
                                            'estado': { function: this.openModalEstado },
                                            'see': { function: this.openModalSee },
                                            'details': { function: this.changePageDetails },
                                        }
                                    }
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setCuentas}
                                    urlRender={`${URL_DEV}v2/bancos/cuentas/cuentas`}
                                    idTable='cuentas_bancos'
                                    cardTable='cardTable_bancos'
                                    cardTableHeader='cardTableHeader__bancos'
                                    cardBody='cardBody_bancos'
                                    isTab={true}
                                    exportar_boton = { true }
                                    onClickExport = { () => this.getExcelBancos() }
                                />
                                : ''
                        }
                    </Tab>
                    <Tab eventKey='cajas' title='Caja chica'>
                        {
                            key === 'cajas' ?
                                <NewTableServerRender
                                    columns={CUENTAS_COLUMNS}
                                    title='Cajas chicas'
                                    subtitle='Listado de cajas chicas'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/bancos/cuentas/add?type=cajas'
                                    mostrar_acciones={true}
                                    actions={
                                        {
                                            'edit': { function: this.changePageEdit },
                                            'delete': { function: this.openModalDelete },
                                            'estado': { function: this.openModalEstado },
                                            'see': { function: this.openModalSee },
                                            'details': { function: this.changePageDetails },
                                        }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setCuentas}
                                    urlRender={`${URL_DEV}v2/bancos/cuentas/cajas`}
                                    idTable='cuentas_cajas'
                                    cardTable='cardTable_caja'
                                    cardTableHeader='cardTableHeader_caja'
                                    cardBody='cardBody_caja'
                                    isTab={true}
                                    exportar_boton = { true }
                                    onClickExport = { () => this.getExcelCajaChica() }
                                />
                                : ''
                        }
                    </Tab>
                </Tabs>
                <ModalDelete
                    title={cuenta === null ? "¿Estás seguro que deseas eliminar la cuenta " : "¿Estás seguro que deseas eliminar la cuenta " + cuenta.nombre + " ?"}
                    show={modal.delete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteCuentaAxios() }}
                />
                <Modal size='lg' title='Cuenta' show={modal.see} handleClose={this.handleCloseSee}>
                    <CuentaCard cuenta={cuenta} />
                </Modal>
                <Modal size="lg" title={cuenta === null ? "Estados de cuenta" : "Estados de cuenta para " + cuenta.nombre} show={modal.estado} handleClose={this.handleCloseEstado} >
                    <Tabs defaultActiveKey='listado' activeKey={keyEstados} onSelect={(value) => { this.controlledTabEstados(value) }} className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100">
                        <Tab eventKey='listado' title='Estados de cuenta'>
                            <TableForModals
                                columns={EDOS_CUENTAS_COLUMNS}
                                data={estados}
                                mostrar_acciones={true}
                                actions={
                                    {
                                        'deleteAction': { function: this.openModalDeleteEstado }
                                    }
                                }
                                elements={data.estados}
                                idTable='kt_datatable_estado'
                            />
                        </Tab>
                        <Tab eventKey='nuevo' title='Agregar estado de cuenta'>
                            <Form >
                                <div className="form-group row form-group-marginless pt-4 justify-content-center">
                                    <div className='col-md-6'>
                                        <Calendar
                                            onChangeCalendar={this.onChangeCalendar}
                                            placeholder='fecha'
                                            name='fecha'
                                            value={form.fecha} />
                                    </div>
                                </div>
                                <div className="form-group row form-group-marginless justify-content-center">
                                    <div className='col-md-6'>
                                        <ItemSlider items={form.adjuntos.adjuntos.files} item='adjuntos'
                                            handleChange={this.handleChange} />
                                    </div>
                                </div>
                                {
                                    form.adjuntos.adjuntos.value ?
                                        <div className="card-footer py-3 pr-1">
                                            <div className="row">
                                                <div className="col-lg-12 text-right pr-0 pb-0">
                                                    <Button
                                                        icon=''
                                                        text='ENVIAR'
                                                        onClick={(e) => { e.preventDefault(); waitAlert(); this.addEstadoAxios() }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </Form>
                        </Tab>
                    </Tabs>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Cuenta);