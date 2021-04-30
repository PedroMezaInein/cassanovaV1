import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { URL_DEV, HERRAMIENTAS_COLUMNS, UBICACIONES_HERRAMIENTAS_COLUMNS } from '../../../constants'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert } from '../../../functions/alert'
import { setDateTable, setTextTable, setTextTableReactDom, setDateTableReactDom, setOptions  } from '../../../functions/setters'
import { printSwalHeader } from '../../../functions/printers'
import axios from 'axios'
import { Button, CalendarDaySwal, InputGray } from '../../../components/form-components'
import UbicacionHerramientaForm from '../../../components/forms/proyectos/UbicacionHerramientaForm'
import { Tab, Tabs } from 'react-bootstrap'
import TableForModals from '../../../components/tables/TableForModals'
import { HerramientaCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import Swal from 'sweetalert2'
import { SelectSearchGray } from '../../../components/form-components'
import $ from "jquery";
class Herramienta extends Component {
    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalUbicacion: false,
        modalDeleteUbicacion: false,
        modalSee: false,
        active: 'historial',
        herramienta: '',
        form: {
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            },
            fecha: new Date(),
            herramienta: '',
            ubicacion: '',
            comentario: '',
            nombre: '',
            serie: '',
            modelo: '',
            empresa: '',
            proyecto: '',
            descripcion: '',
            // fechaCompra: new Date(),
        },
        options: {
            empresas: [],
            proyectos: []
        },
        data: {
            ubicaciones: []
        },
        ubicaciones: [],
        ubicacion: ''
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const herramienta = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getOptionsAxios()
        if (!herramienta)
            history.push('/')
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'herramientas/options', { responseType: 'json', headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos } = response.data
                const { options, herramienta, form } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                if (herramienta !== '') {
                    if (herramienta.empresa_id)
                        form.empresa = herramienta.empresa_id.toString()
                    if (herramienta.proyecto_id)
                        form.proyecto = herramienta.proyecto_id.toString()
                }
                this.setState({
                    ...this.state,
                    options,
                    form
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
    setHerramientas = herramientas => {
        let aux = []
        herramientas.map((herramienta) => {
            aux.push({
                actions: this.setActions(herramienta),
                empresa: setTextTableReactDom(herramienta.empresa ? herramienta.empresa.name:'', this.doubleClick, herramienta, 'empresa', 'text-center'),
                proyecto: setTextTableReactDom(herramienta.proyecto ? herramienta.proyecto.nombre :'', this.doubleClick, herramienta, 'proyecto', 'text-center'),
                nombre: setTextTableReactDom(herramienta.nombre, this.doubleClick, herramienta, 'nombre', 'text-center'),
                modelo: setTextTableReactDom(herramienta.modelo !== null ? herramienta.modelo :'', this.doubleClick, herramienta, 'modelo', 'text-center'),
                serie: setTextTableReactDom(herramienta.serie !== null ? herramienta.serie :'', this.doubleClick, herramienta, 'serie', 'text-center'),
                fecha: setDateTableReactDom(herramienta.created_at, this.doubleClick, herramienta, 'fecha', 'text-center'),
                descripcion: setTextTableReactDom(herramienta.descripcion !== null ? herramienta.descripcion :'', this.doubleClick, herramienta, 'descripcion', 'text-justify'),
                id: herramienta.id
            })
            return false
        })
        return aux
    }

    renderInputSwal = ( data, tipo, form ) => {
        switch(tipo){
            case 'empresa':
            case 'proyecto':
                return(
                    <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={`SELECCIONA ${tipo==='proyecto' ? 'el proyecto' : 'la ' + tipo }`}/>
                )
            case 'fecha':
                return(
                    <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } 
                        name = { tipo } date = { form[tipo] } withformgroup={0} />
                )
            case  'descripcion':
                return(
                    <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                        requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                        onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false } />
                )
            default:
                return (
                    <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                        requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } 
                        onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                )
        }
    }
    
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'empresa':
            case 'proyecto':
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
                { this.renderInputSwal(data, tipo, form) }
            </div>,
            <Update />,
            () => { this.patchRendimiento(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
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
    patchRendimiento = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/herramientas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getHerramientasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'proyecto':
                return options.proyectos
            case 'empresa':
                return options.empresas
            default: return []
        }
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
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Historial de ubicaciones',
                btnclass: 'dark',
                iconclass: 'flaticon-calendar',
                action: 'ubicacion',
                tooltip: { id: 'ubicacion', text: 'Ubicacion', type: 'error' }
            }
        )
        return aux
    }

    setActionsUbicaciones = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    setUbicaciones = ubicaciones => {
        let aux = []
        ubicaciones.map((ubicacion) => {
            aux.push({
                actions: this.setActionsUbicaciones(ubicacion),
                user: renderToString(setTextTable(ubicacion.user ? ubicacion.user.name : 'Sin definir')),
                ubicacion: renderToString(setTextTable(ubicacion.ubicacion)),
                comentario: renderToString(setTextTable(ubicacion.comentario)),
                fecha: renderToString(setDateTable(ubicacion.created_at)),
                id: ubicacion.id
            })
            return false
        })
        return aux
    }
    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    changePageEdit = (herramienta) => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/herramientas/edit',
            state: { herramienta: herramienta }
        });
    }
    openModalDelete = herramienta => {
        this.setState({
            ...this.state,
            herramienta: herramienta,
            modalDelete: true
        })
    }
    openModalAdjuntos = herramienta => {
        const { form } = this.state
        let aux = []
        herramienta.adjuntos.map((adjunto) => {
            aux.push({
                name: adjunto.name,
                url: adjunto.url,
                id: adjunto.id
            })
            return false
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ...this.state,
            herramienta: herramienta,
            modalAdjuntos: true,
            form
        })
    }
    openModalUbicacion = (herramienta) => {
        const { data } = this.state
        data.ubicaciones = herramienta.ubicaciones
        this.setState({
            ...this.state,
            herramienta: herramienta,
            modalUbicacion: true,
            data,
            ubicaciones: this.setUbicaciones(herramienta.ubicaciones)
        })
    }
    openModalDeleteUbicacion = ubicacion => {
        this.setState({
            ...this.state,
            modalDeleteUbicacion: true,
            ubicacion: ubicacion
        })
    }
    handleCloseDelete = () => {
        this.setState({
            ...this.state,
            modalDelete: false,
            herramienta: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            herramienta: '',
            form
        })
    }
    handleCloseUbicacion = () => {
        this.setState({
            ...this.state,
            herramienta: '',
            modalUbicacion: false
        })
    }
    handleCloseDeleteUbicacion = () => {
        this.setState({
            ...this.state,
            modalDeleteUbicacion: false,
            ubicacion: ''
        })
    }
    openModalSee = herramienta => {
        this.setState({
            ...this.state,
            modalSee: true,
            herramienta: herramienta
        })
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            herramienta: ''
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
    onSelect = value => {
        const { form } = this.state
        if (value === 'nuevo') {
            form.fecha = new Date()
            form.ubicacion = ''
            form.comentario = ''
        }
        this.setState({
            ...this.state,
            active: value,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.sendUbicacionAxios()
    }
    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }
    async getHerramientasAxios() {
        $('#kt_datatable_herramientas').DataTable().ajax.reload();
    }
    async deleteHerramientaAxios() {
        const { access_token } = this.props.authUser
        const { herramienta } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getHerramientasAxios()
                doneAlert('Herramienta eliminada con éxito')
                this.setState({
                    ...this.state,
                    modalDelete: false,
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
    async deleteUbicacionAxios() {
        const { access_token } = this.props.authUser
        const { herramienta, ubicacion } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id + '/ubicacion/' + ubicacion.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getHerramientasAxios()
                doneAlert('Ubicación eliminada con éxito')
                const { herramienta } = response.data
                const { data } = this.state
                data.ubicaciones = herramienta.ubicaciones
                this.setState({
                    ...this.state,
                    active: 'historial',
                    herramienta: herramienta,
                    data,
                    modalDeleteUbicacion: false,
                    ubicaciones: this.setUbicaciones(herramienta.ubicaciones)
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
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { herramienta } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + herramienta.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { herramienta } = response.data
                const { form } = this.state
                let aux = []
                herramienta.adjuntos.map((adj) => {
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                    return false
                })
                form.adjuntos.adjuntos.files = aux
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    herramienta: '',
                    form
                })
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async sendAdjuntoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, herramienta } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'herramientas/' + herramienta.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { herramienta } = response.data
                const { form } = this.state
                let aux = []
                herramienta.adjuntos.map((adj) => {
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                    return false
                })
                form.adjuntos.adjuntos.files = aux
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    herramienta: '',
                    form
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
    async sendUbicacionAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, herramienta } = this.state
        await axios.post(URL_DEV + 'herramientas/' + herramienta.id + '/ubicacion', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { herramienta } = response.data
                let { form } = this.state
                const { data } = this.state
                this.getHerramientasAxios()
                form.fecha = new Date()
                form.ubicacion = ''
                form.comentario = ''
                data.ubicaciones = herramienta.ubicaciones
                this.setState({
                    ...this.state,
                    active: 'historial',
                    herramienta: herramienta,
                    form,
                    data,
                    ubicaciones: this.setUbicaciones(herramienta.ubicaciones)
                })
                doneAlert('Herramienta actualizada')
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
        const { modalDelete, modalAdjuntos, modalUbicacion, modalDeleteUbicacion, form, active, data, ubicaciones, modalSee, herramienta } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender
                    columns={HERRAMIENTAS_COLUMNS}
                    title='Herramientas'
                    subtitle='Listado de herramientas'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/proyectos/herramientas/add'
                    mostrar_acciones={true}
                    actions={
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.openModalAdjuntos },
                            'ubicacion': { function: this.openModalUbicacion },
                            'see': { function: this.openModalSee }
                        }
                    }
                    accessToken={this.props.authUser.access_token}
                    setter={this.setHerramientas}
                    urlRender = { `${URL_DEV}v2/proyectos/herramientas` }
                    idTable='kt_datatable_herramientas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete
                    title='¿Estás seguro que deseas eliminar la herramienta?'
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteHerramientaAxios() }}
                />
                <Modal size="lg" title="Adjuntos" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <ItemSlider
                        items={form.adjuntos.adjuntos.files}
                        item='adjuntos'
                        handleChange={this.handleChange}
                        deleteFile={this.deleteFile}
                    />
                    {
                        form.adjuntos.adjuntos.value ?
                            <div className="card-footer py-3 pr-1">
                                <div className="row">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button icon='' text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); this.sendAdjuntoAxios() }} />
                                    </div>
                                </div>
                            </div>
                            : ''
                    }
                </Modal>
                <Modal size="xl" title="Historial de ubicaciones" show={modalUbicacion} handleClose={this.handleCloseUbicacion} >
                    <Tabs defaultActiveKey="historial" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100"
                        activeKey={active} onSelect={this.onSelect}>
                        <Tab eventKey="historial" title="Historial de ubicación">
                            <TableForModals
                                columns={UBICACIONES_HERRAMIENTAS_COLUMNS}
                                data={ubicaciones}
                                hideSelector={true}
                                mostrar_acciones={true}
                                elements={data.ubicaciones}
                                actions={
                                    {
                                        'delete': { function: this.openModalDeleteUbicacion },
                                    }
                                }
                            />
                        </Tab>
                        <Tab eventKey="nuevo" title="Nueva ubicación">
                            <UbicacionHerramientaForm
                                form={form}
                                onChange={this.onChange}
                                onSubmit={this.onSubmit}
                            />
                        </Tab>
                    </Tabs>
                </Modal>
                <ModalDelete
                    title='¿Estás seguro que deseas eliminar la ubicación?'
                    show={modalDeleteUbicacion}
                    handleClose={this.handleCloseDeleteUbicacion}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteUbicacionAxios() }} 
                />
                <Modal size="lg" title="Herramienta" show={modalSee} handleClose={this.handleCloseSee} >
                    <HerramientaCard
                        herramienta={herramienta}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Herramienta);