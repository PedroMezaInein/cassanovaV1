import React, { Component } from 'react'
import { renderToString } from 'react-dom/server' 
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import Layout from '../../components/layout/layout' 
import { Modal, ModalDelete} from '../../components/singles' 
import { EMPLEADOS_COLUMNS, EMPLEADOS_COLUMNS_OBRA, URL_DEV} from '../../constants'
import NewTableServerRender from '../../components/tables/NewTableServerRender' 
import { EmpleadosForm } from '../../components/forms'
import { setOptions, setTextTable, setArrayTable, setMoneyTable, setAdjuntosList, setDateTable} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert} from '../../functions/alert'
import { Tabs, Tab, Form } from 'react-bootstrap' 

const $ = require('jquery');

class Empleados extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nuevo empleado',
        form:{
            nombre:'',
            curp: '',
            rfc: '',
            nss: '',
            nombre_emergencia: '',
            telefono_emergencia: '',
            banco: '',
            cuenta: '',
            clabe: '',
            tipo_empleado: 'Administrativo' ,
            estatus_empleado: 'Activo',
            empresa: '',
            fechaInicio: new Date,
            fechaFin: '',
            estatus_imss: 'Activo',
            puesto:'',
            vacaciones_tomadas:0, 
            fecha_alta_imss: new Date(),
            numero_alta_imss: '',
            adjuntos:{
                datosGenerales:{
                    value: '',
                    placeholder: 'Datos generales',
                    files: []
                },
                recibosNomina:{
                    value: '',
                    placeholder: 'Recibos de Nómina',
                    files: []
                },
                altasBajas:{
                    value: '',
                    placeholder: 'Altas y bajas',
                    files: []
                }
            }
        },
        options: { 
            empresas:[]
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const empleados = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!empleados)
            history.push('/')
            this.getOptionsAxios()
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            form: this.clearForm(),
            formeditado:0,
            title: 'Nuevo empleado',
        })
    }

    openModalEdit = (empleado) => { 
        const { form, options, modal } = this.state 

        form.nombre = empleado.nombre 
        form.curp = empleado.curp
        form.rfc = empleado.rfc
        form.nss = empleado.nss
        form.nombre_emergencia = empleado.nombre_emergencia
        form.telefono_emergencia = empleado.telefono_emergencia
        form.banco = empleado.banco
        form.cuenta = empleado.cuenta
        form.clabe = empleado.clabe
        form.tipo_empleado = empleado.tipo_empleado
        form.estatus_empleado = empleado.estatus_empleado
        if(empleado.empresa){
            form.empresa = empleado.empresa.id.toString()
        } 
        form.fechaInicio = new Date(empleado.fecha_inicio)
        form.fechaFin = new Date(empleado.fecha_fin)
        form.puesto = empleado.puesto  
        form.estatus_imss = this.showStatusImss(empleado.estatus_imss);
        form.vacaciones_tomadas = empleado.vacaciones_tomadas 
        form.fecha_alta_imss = new Date(empleado.fecha_alta_imss)
        form.numero_alta_imss = empleado.numero_alta_imss  
        modal.form = true
        this.setState({
            ... this.state,
            modal,
            title: 'Editar empleado',
            form,
            options,
            empleado: empleado,
            formeditado:1,
        })
    }
    
    showStatusImss(valor) {
        let texto = '';
        switch (valor) {
            case 0:
                texto = 'Inactivo'
                break;
            case 1:
                texto = 'Activo'
                break;
            default:
                break;
        }
        return texto
    }


    openModalDelete = empleado => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            empleado: empleado
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/empleado/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close() 
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ... this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fecha_alta_imss':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'fechaFin':
                    if(form[element])
                        data.append(element, (new Date(form[element])).toDateString())
                    else
                        data.append(element, '')
                    break;
                case 'adjuntos':
                    break; 
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        await axios.post(URL_DEV + 'rh/empleado', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                if(empleado.tipo_empleado === 'Administrativo')
                    this.getEmpleadosAxios();
                if(empleado.tipo_empleado === 'Obra')
                    this.getEmpleadosObraAxios();

                const { modal } = this.state
                modal.form = false

                this.setState({                    
                    ... this.state,
                    modal,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El empleado fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    async updateEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, empleado } = this.state

        await axios.put(URL_DEV + 'rh/empleado/'+ empleado.id , form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const {  modal } = this.state
                const { empleado } = response.data
                
                window.location.reload(false); 

                modal.form = false

                this.setState({                    
                    ... this.state,
                    modal,
                    empleado: '',
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El empleado fue modificado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })

                
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
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

        await axios.delete(URL_DEV + 'rh/empleado/'+ empleado.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                const { empleado } = response.data
                if(empleado.tipo_empleado === 'Administrativo')
                    this.getEmpleadosAxios();
                if(empleado.tipo_empleado === 'Obra')
                    this.getEmpleadosObraAxios();
                modal.delete = false

                this.setState({                    
                    ... this.state,
                    modal,
                    empleado: '',
                    form: this.clearForm()
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El empleado fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ... this.state,
            modal, 
            form: this.clearForm()
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            form: this.clearForm(),
            modal, 
            empleado: ''
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fecha_alta_imss':
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
                case 'vacaciones_tomadas':
                    form[element] = 0
                    break;
                case 'tipo_empleado':
                    form[element] = 'Administrativo'
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    setEmpleado = empleados => {
        let aux = []
        if (empleados)
            empleados.map((empleado) => {
                aux.push(
                    {
                        actions: this.setActions(empleado),
                        nombre: renderToString(setTextTable(empleado.nombre)),
                        empresa: renderToString(setTextTable(empleado.empresa ? empleado.empresa.name : '')),
                        puesto: renderToString(setTextTable(empleado.puesto)),
                        rfc: renderToString(setTextTable(empleado.rfc)),
                        nss: renderToString(setTextTable(empleado.nss)),
                        curp: renderToString(setTextTable(empleado.curp)),
                        estatus: renderToString(setTextTable(empleado.estatus_empleado)),
                        fechaInicio: renderToString(setDateTable(empleado.fecha_inicio)),
                        tipo_empleado: renderToString(setTextTable(empleado.tipo_empleado)),
                        cuenta: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': empleado.banco ? empleado.banco : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': empleado.cuenta ? empleado.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': empleado.clabe ? empleado.clabe : 'Sin definir' },
                            ]
                        )),
                        nombre_emergencia: renderToString(setArrayTable(
                            [
                                { 'name': 'Nombre', 'text': empleado.nombre_emergencia ? empleado.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': empleado.telefono_emergencia ? empleado.telefono_emergencia : 'Sin definir' }
                            ]
                        )),
                        vacaciones_tomadas: renderToString(setTextTable(empleado.vacaciones_tomadas)),
                        id: empleado.id
                    }
                )
            })
        return aux
    }

    setEmpleadoObra = empleados => {
        let aux = []
        if (empleados)
            empleados.map((empleado) => {
                aux.push(
                    {
                        actions_obra: this.setActions(empleado),
                        nombre_obra: renderToString(setTextTable(empleado.nombre)),
                        empresa_obra: renderToString(setTextTable(empleado.empresa ? empleado.empresa.name : '')),
                        puesto_obra: renderToString(setTextTable(empleado.puesto)),
                        rfc_obra: renderToString(setTextTable(empleado.rfc)),
                        nss_obra: renderToString(setTextTable(empleado.nss)),
                        curp_obra: renderToString(setTextTable(empleado.curp)),
                        estatus_obra: renderToString(setTextTable(empleado.estatus_empleado)),
                        fechaInicio_obra: renderToString(setDateTable(empleado.fecha_inicio)),
                        tipo_empleado_obra: renderToString(setTextTable(empleado.tipo_empleado)),
                        cuenta_obra: renderToString(setArrayTable(
                            [
                                { 'name': 'Banco', 'text': empleado.banco ? empleado.banco : 'Sin definir' },
                                { 'name': 'No. Cuenta', 'text': empleado.cuenta ? empleado.cuenta : 'Sin definir' },
                                { 'name': 'Clabe', 'text': empleado.clabe ? empleado.clabe : 'Sin definir' },
                            ]
                        )),
                        nombre_emergencia_obra: renderToString(setArrayTable(
                            [
                                { 'name': 'Nombre', 'text': empleado.nombre_emergencia ? empleado.nombre_emergencia : 'Sin definir' },
                                { 'name': 'Teléfono', 'text': empleado.telefono_emergencia ? empleado.telefono_emergencia : 'Sin definir' }
                            ]
                        )),
                        vacaciones_tomadas_obra: renderToString(setTextTable(empleado.vacaciones_tomadas)),
                        id: empleado.id
                    }
                )
            })
        return aux
    }

    setActions= empleado => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                }
        ) 
        return aux 
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
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if(title === 'Editar empleado')
            this.updateEmpleadoAxios()
        else
            this.addEmpleadoAxios()
    }

    async getEmpleadosAxios() {
        var table = $('#kt_datatable2_empleados')
            .DataTable();
        table.ajax.reload();
    }

    async getEmpleadosObraAxios() {
        var table2 = $('#kt_datatable2_empleados_obra')
            .DataTable();
        table2.ajax.reload();
    }


    render() {
        const { modal, options, title, form, formeditado} = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Tabs defaultActiveKey="administrativo">
                    <Tab eventKey="administrativo" title="Administrativo">
                        <div className="py-2">
                            <NewTableServerRender
                                columns = { EMPLEADOS_COLUMNS }
                                title = 'Empleados administrativos' 
                                subtitle = 'Listado de empleados'
                                mostrar_boton = { true }
                                abrir_modal = { true }
                                onClick = { this.openModal }
                                mostrar_acciones = { true }
                                actions = {
                                    {
                                        'edit': {function: this.openModalEdit},
                                        'delete': {function: this.openModalDelete},
                                    }
                                }
                                accessToken = { this.props.authUser.access_token }
                                setter = { this.setEmpleado }
                                urlRender = {URL_DEV + 'rh/empleado/admin' }
                                idTable = 'kt_datatable2_empleados'
                            />
                        </div>
                    </Tab> 
                    <Tab eventKey="obra" title="Obra">
                        <div className="py-2">
                            <NewTableServerRender
                                columns={EMPLEADOS_COLUMNS_OBRA}
                                title='Empleados de obra' 
                                subtitle='Listado de empleados'
                                mostrar_boton = {true}
                                abrir_modal = {true}
                                onClick = {this.openModal}
                                mostrar_acciones = {true}
                                actions = {{
                                    'edit': {function: this.openModalEdit},
                                    'delete': {function: this.openModalDelete},
                                }}
                                accessToken = {this.props.authUser.access_token}
                                setter = {this.setEmpleadoObra}
                                urlRender = { URL_DEV + 'rh/empleado/obra' }
                                idTable = 'kt_datatable2_empleados_obra'
                                />
                        </div>
                    </Tab>
                </Tabs>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <EmpleadosForm
                        formeditado={formeditado}
                        className=" px-3 "   
                        options = { options }
                        form ={form}
                        onChange = { this.onChange } 
                        onSubmit = { this.onSubmit }
                        onChangeAdjunto = { this.onChangeAdjunto }
                        clearFiles = { this.clearFiles }
                        title = {title}
                    >
                    </EmpleadosForm>
                </Modal>  
                <ModalDelete title={'¿Quieres eliminar el empleado?'} show = { modal.delete } handleClose = { this.handleCloseModalDelete } onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deleteEmpleadoAxios() }}>
                </ModalDelete>
            </Layout>
        )
    }

}
const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Empleados);