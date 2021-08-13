import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { URL_DEV, DOCUMENTOS_COLUMNS } from '../../../constants'
import { setAdjuntoDocumento, setDateTableReactDom, setOptions, setTextTableReactDom } from '../../../functions/setters'
import { waitAlert, errorAlert, doneAlert, deleteAlert, printResponseErrorAlert, customInputAlert } from '../../../functions/alert'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Button, CalendarDaySwal, SelectSearchGray, InputGray } from '../../../components/form-components'
import { DocumentosCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import $ from "jquery";
class Documentos extends Component {
    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalSee: false,
        documento: '',
        options: {
            empresas: []
        },
        form: {
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const documentos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!documentos)
            history.push('/')
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'documentos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    setDocumentos = documentos => {
        let aux = []
        documentos.map((documento) => {
            aux.push({
                actions: this.setActions(documento),
                empresa: setTextTableReactDom(documento.empresa ? documento.empresa.name : 'Sin definir', this.doubleClick, documento, 'empresa', 'text-center'),
                nombre: setTextTableReactDom(documento.nombre, this.doubleClick, documento, 'nombre', 'text-center'),
                fecha: setDateTableReactDom(documento.created_at, this.doubleClick, documento, 'fecha', 'text-center'),
                documento: renderToString(setAdjuntoDocumento(documento)),
                id: documento.id
            })
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
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } swal = { true }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } />
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    tipo === 'empresa' &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)} withicon={1}/>
                    
                }
            </div>,
            <Update />,
            () => { this.patchDocumentos(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
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
    patchDocumentos = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/administracion/documentos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getDocumentosAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El documento del IMSS editado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'empresa':
                return options.empresas
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
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }
    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.map((adj) => {
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
            form
        })
    }
    changePageEdit = documento => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/documentos/edit',
            state: { documento: documento }
        });
    }
    openModalDelete = documento => {
        this.setState({
            ...this.state,
            documento: documento,
            modalDelete: true
        })
    }
    openModalAdjuntos = documento => {
        const { form } = this.state
        let aux = []
        if (documento.adjuntos) {
            documento.adjuntos.map((adj) => {
                aux.push({
                    id: adj.id,
                    name: adj.name,
                    url: adj.url
                })
                return false
            })
        }
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ...this.state,
            modalAdjuntos: true,
            form,
            documento: documento
        })
    }
    openModalSee = documento => {
        this.setState({
            ...this.state,
            modalSee: true,
            documento: documento
        })
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            documento: ''
        })
    }
    handleCloseDelete = () => {
        this.setState({
            ...this.state,
            documento: '',
            modalDelete: false
        })
    }
    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ...this.state,
            documento: '',
            form,
            modalAdjuntos: false
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
    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }
    async getDocumentosAxios() {
        $('#kt_datatable_documentos').DataTable().ajax.reload();
    }
    async deleteDocumentoAxios() {
        const { access_token } = this.props.authUser
        const { documento } = this.state
        await axios.delete(URL_DEV + 'documentos/' + documento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getDocumentosAxios()
                this.setState({
                    ...this.state,
                    modalDelete: '',
                    documento: ''
                })
                doneAlert('Documento eliminado con éxito')
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async sendAdjuntoAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, documento } = this.state
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
        await axios.post(URL_DEV + 'documentos/' + documento.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { documento } = response.data
                const { form } = this.state
                let aux = []
                documento.adjuntos.map((adj) => {
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
                    form
                })
                doneAlert('Adjunto creado con éxito')
                this.getDocumentosAxios()
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { documento } = this.state
        await axios.delete(URL_DEV + 'documentos/' + documento.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { documento } = response.data
                this.setAdjuntos(documento.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
                this.getDocumentosAxios()
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { modalDelete, modalAdjuntos, form, modalSee, documento } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTableServerRender
                    columns={DOCUMENTOS_COLUMNS}
                    title='Documentos'
                    subtitle='Listado de documentos'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/administracion/documentos/add'
                    mostrar_acciones={true}
                    actions={
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.openModalAdjuntos },
                            'see': { function: this.openModalSee },
                        }
                    }
                    accessToken={this.props.authUser.access_token}
                    setter={this.setDocumentos}
                    urlRender={URL_DEV + 'documentos'}
                    idTable='kt_datatable_documentos'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete
                    title='¿Estás seguro que deseas eliminar el documento?'
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteDocumentoAxios() }}
                />
                <Modal size="lg" title="Adjuntos" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos}>
                    <ItemSlider
                        items={form.adjuntos.adjuntos.files}
                        item='adjuntos'
                        handleChange={this.handleChange}
                        deleteFile={this.deleteFile}
                    />
                    {
                        form.adjuntos.adjuntos.value ?
                            <div className="card-footer py-3 pr-1 mt-4">
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
                <Modal size="lg" title="Documentos" show={modalSee} handleClose={this.handleCloseSee} >
                    <DocumentosCard documento={documento} />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Documentos)