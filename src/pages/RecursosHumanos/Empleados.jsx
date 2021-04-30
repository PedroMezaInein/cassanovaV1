import React, { Component } from 'react'
import { renderToString } from 'react-dom/server' 
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../components/layout/layout' 
import { Modal, ModalDelete} from '../../components/singles' 
import { EMPLEADOS_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS} from '../../constants'
import NewTableServerRender from '../../components/tables/NewTableServerRender' 
import { EmpleadosForm, AdjuntosForm } from '../../components/forms'
import { setOptions, setTextTable, setArrayTable, setAdjuntosList, setDateTable} from '../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert } from '../../functions/alert'
import { Tabs, Tab } from 'react-bootstrap' 
import TableForModals from '../../components/tables/TableForModals'
import { EmpleadosCard } from '../../components/cards'
import $ from "jquery";

class Empleados extends Component {
    state = {  
        formeditado:0,
        key: 'administrativo',
        data:{
            adjuntos: []
        },
        adjuntos: [],
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
            see: false,
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
            fechaInicio: new Date (),
            fechaFin: '',
            estatus_imss: 'Activo',
            puesto:'',
            vacaciones_disponibles:0, 
            fecha_alta_imss: '',
            numero_alta_imss: '',
            nomina_imss: 0.0,
            nomina_extras: 0.0,
            salario_hr: 0.0,
            salario_hr_extra: 0.0,
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

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ...this.state,
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
        form.nomina_imss = empleado.nomina_imss
        form.nomina_extras = empleado.nomina_extras
        form.salario_hr = empleado.salario_hr
        form.salario_hr_extra = empleado.salario_hr_extra
        if(empleado.empresa){
            form.empresa = empleado.empresa.id.toString()
        } 
        form.fechaInicio = new Date(empleado.fecha_inicio)
        form.fechaFin = new Date(empleado.fecha_fin)
        form.puesto = empleado.puesto  
        form.estatus_imss = this.showStatusImss(empleado.estatus_imss);
        form.vacaciones_disponibles = empleado.vacaciones_disponibles 
        form.fecha_alta_imss = new Date(empleado.fecha_alta_imss)
        form.numero_alta_imss = empleado.numero_alta_imss  
        modal.form = true
        this.setState({
            ...this.state,
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
        const { modal} = this.state
        modal.see =true
        this.setState({
            ...this.state,
            modal,
            empleado: empleado
        })
    }

    handleCloseSee = () => {
        const { modal} = this.state
        modal.see =false
        this.setState({
            ...this.state,
            modal,
            empleado: ''
        })
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
        })
        return aux
    }

    setActionsAdjuntos = adjunto => {
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

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
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

    async addEmpleadoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'fechaFin':
                case 'fecha_alta_imss':
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
                const {  modal, key } = this.state
                
                if(key === 'administrativo'){
                    this.getEmpleadosAxios()
                }
                if(key === 'obra'){
                    this.getEmpleadosObraAxios()
                }
                modal.form = false

                this.setState({                    
                    ...this.state,
                    modal,
                    form: this.clearForm()
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El empleado fue registrado con éxito.')
                
            },
            (error) => {
                printResponseErrorAlert(error)
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
                const {  modal, key } = this.state
                
                if(key === 'administrativo'){
                    this.getEmpleadosAxios()
                }
                if(key === 'obra'){
                    this.getEmpleadosObraAxios()
                }

                modal.form = false

                this.setState({                    
                    ...this.state,
                    modal,
                    empleado: '',
                    form: this.clearForm()
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El empleado fue modificado con éxito.')
                
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

        await axios.delete(URL_DEV + 'rh/empleado/'+ empleado.id, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const {  modal, key } = this.state
                
                if(key === 'administrativo'){
                    this.getEmpleadosAxios()
                }
                if(key === 'obra'){
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
        })

        data.append('id', empleado.id)

        await axios.post(URL_DEV + 'rh/empleado/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if(key === 'administrativo'){
                    this.getEmpleadosAxios()
                }
                if(key === 'obra'){
                    this.getEmpleadosObraAxios()
                }

                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })

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

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { empleado } = this.state
        await axios.delete(URL_DEV + 'rh/empleado/' + empleado.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empleado } = response.data
                const { data, key } = this.state
                data.adjuntos = empleado.datos_generales.concat(empleado.recibos_nomina).concat(empleado.altas_bajas)
                if(key === 'administrativo'){
                    this.getEmpleadosAxios()
                }
                if(key === 'obra'){
                    this.getEmpleadosObraAxios()
                }

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    empleado: empleado,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
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

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ...this.state,
            modal, 
            form: this.clearForm()
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
                    if(key === 'obra')
                    form[element] = 'Obra'
                    else
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
            ...this.state,
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

    setActions= () => {
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
                },
                {
                    text: 'Mostrar&nbsp;información',
                    btnclass: 'primary',
                    iconclass: 'flaticon2-magnifier-tool',                  
                    action: 'see',
                    tooltip: {id:'see', text:'Mostrar', type:'info'},
                },
                {
                    text: 'Adjuntos',
                    btnclass: 'info',
                    iconclass: 'flaticon-attachment',
                    action: 'adjuntos',
                    tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
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
            ...this.state,
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
        $('#empleados_admin_table').DataTable().ajax.reload();
    }

    async getEmpleadosObraAxios() {
        $('#empleados_obra_table').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if(value === 'administrativo'){
            this.getEmpleadosAxios()
        }
        if(value === 'obra'){
            this.getEmpleadosObraAxios()
            form.tipo_empleado = 'Obra'
        }
        this.setState({
            ...this.state,
            key: value,
            form
        })
    }

    render() {
        const { modal, options, title, form, formeditado, key, adjuntos, data, empleado } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Tabs defaultActiveKey="administrativo" activeKey={key} onSelect = { (value) =>  { this.controlledTab(value)} }>
                    <Tab eventKey="administrativo" title="Administrativo">
                        <NewTableServerRender
                            columns={EMPLEADOS_COLUMNS}
                            title='Empleados administrativos'
                            subtitle='Listado de empleados'
                            mostrar_boton={true}
                            abrir_modal={true}
                            onClick={this.openModal}
                            mostrar_acciones={true}
                            actions={
                                {
                                    'edit': { function: this.openModalEdit },
                                    'delete': { function: this.openModalDelete },
                                    'adjuntos': { function: this.openModalAdjuntos },
                                    'see': { function: this.openModalSee },
                                }
                            }
                            accessToken={this.props.authUser.access_token}
                            setter={this.setEmpleado}
                            urlRender={URL_DEV + 'rh/empleado/admin'}
                            idTable='empleados_admin_table'
                            cardTable='cardTable_admin'
                            cardTableHeader='cardTableHeader_admin'
                            cardBody='cardBody_admin'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="obra" title="Obra">
                        <NewTableServerRender
                            columns={EMPLEADOS_COLUMNS}
                            title='Empleados de obra'
                            subtitle='Listado de empleados'
                            mostrar_boton={true}
                            abrir_modal={true}
                            onClick={this.openModal}
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.openModalEdit },
                                'delete': { function: this.openModalDelete },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee },
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setEmpleado}
                            urlRender={URL_DEV + 'rh/empleado/obra'}
                            idTable='empleados_obra_table'
                            cardTable='cardTable_obra'
                            cardTableHeader='cardTableHeader_obra'
                            cardBody='cardBody_obra'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseModal}>
                    <EmpleadosForm
                        formeditado={formeditado}
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
                <Modal size="xl" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.onChangeAdjunto} clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoEmpleadoAxios() }} 
                        adjuntos = {['datosGenerales', 'recibosNomina', 'altasBajas']}/>
                    
                    <TableForModals
                        columns={ADJUNTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjuntos }
                        }}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
                <Modal size="lg" title="Empleados" show = { modal.see } handleClose = { this.handleCloseSee } >
                    <EmpleadosCard empleado={empleado}/>
                </Modal>
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