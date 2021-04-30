import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout'
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { URL_DEV, IMSS_COLUMNS } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert } from '../../../functions/alert';
import { setDateTableReactDom, setTextTableReactDom, setAdjuntoDocumento, setOptions} from '../../../functions/setters';
import axios from 'axios'
import Swal from 'sweetalert2'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles';
import { Button, CalendarDaySwal, InputGray, SelectSearchGray } from '../../../components/form-components'
import { ImssCard } from '../../../components/cards'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import $ from "jquery";
class Imss extends Component {

    state = {
        modalDelete: false,
        modalAdjuntos: false,
        imss: '',
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
    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get( URL_DEV + 'imss/options', { headers: { Authorization: `Bearer ${access_token}` } } ).then(
            ( response ) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch( (error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setImss = imsses => {
        let aux = []
        imsses.map((imss) => {
            aux.push({
                actions: this.setActions(imss),
                empresa: setTextTableReactDom(imss.empresa ? imss.empresa.name : 'Sin definir', this.doubleClick, imss, 'empresa', 'text-center'),
                fecha: setDateTableReactDom(imss.created_at, this.doubleClick, imss, 'fecha', 'text-center'),
                adjunto: renderToString(setAdjuntoDocumento(imss)),
                id: imss.id
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
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
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
                        placeholder={this.setSwalPlaceholder(tipo)}/>
                    
                }
            </div>,
            <Update />,
            () => { this.patchImss(data, tipo) },
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
    patchImss = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/rh/imss/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getImssAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El documento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
    changePageEdit = imss => {
        const { history } = this.props
        history.push({
            pathname: '/rh/imss/edit',
            state: { imss: imss }
        });
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
    openModalDelete = imss => {
        this.setState({
            ...this.state,
            imss: imss,
            modalDelete: true
        })
    }
    openModalAdjuntos = imss => {
        const { form } = this.state
        let aux = []
        if (imss.adjuntos) {
            imss.adjuntos.map((adj) => {
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
            imss: imss
        })
    }
    openModalSee = imss => {
        this.setState({
            ...this.state,
            modalSee: true,
            imss: imss
        })
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            imss: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            form,
            imss: ''
        })
    }
    handleCloseDelete = () => {
        this.setState({
            ...this.state,
            modalDelete: false,
            imss: ''
        })
    }
    async getImssAxios() {
        $('#kt_datatable_imss').DataTable().ajax.reload();
    }
    async deleteDocumentoAxios() {
        const { access_token } = this.props.authUser
        const { imss } = this.state
        await axios.delete(URL_DEV + 'imss/' + imss.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getImssAxios()
                this.setState({
                    ...this.state,
                    modalDelete: '',
                    imss: ''
                })
                doneAlert('Documento eliminado con éxito')
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
        const { form, imss } = this.state
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
        await axios.post(URL_DEV + 'imss/' + imss.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { imss } = response.data
                const { form } = this.state
                let aux = []
                imss.adjuntos.map((adj) => {
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                    return false
                })
                form.adjuntos.adjuntos.files = aux
                form.adjuntos.adjuntos.value = ''
                this.setState({
                    ...this.state,
                    form
                })
                doneAlert('Adjunto creado con éxito')
                this.getImssAxios()
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
        const { imss } = this.state
        await axios.delete(URL_DEV + 'imss/' + imss.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { imss } = response.data
                this.setAdjuntos(imss.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
                this.getImssAxios()
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
        const { modalDelete, modalAdjuntos, form, modalSee, imss } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <NewTableServerRender
                    columns={IMSS_COLUMNS}
                    title='IMSS'
                    subtitle='Listado de documentos IMSS'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/rh/imss/add'
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
                    setter={this.setImss}
                    urlRender={URL_DEV + 'imss'}
                    idTable='kt_datatable_imss'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete
                    title='¿Estás seguro que deseas eliminar el documento del IMSS?'
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteDocumentoAxios() }}
                />
                <Modal size="lg" title="Adjuntos" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <ItemSlider 
                        items={form.adjuntos.adjuntos.files}
                        item='adjuntos'
                        handleChange={this.handleChange}
                        deleteFile={this.deleteFile}
                    />
                    {
                        form.adjuntos.adjuntos.value !== '' ?
                            <div className="card-footer py-3 pr-1 mt-4">
                                <div className="row">
                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                        <Button icon='' text='ENVIAR'
                                            onClick={(e) => { e.preventDefault(); this.sendAdjuntoAxios() }} />
                                    </div></div>
                            </div>
                            : ''
                    }
                </Modal>
                <Modal size="lg" title="IMSS" show={modalSee} handleClose={this.handleCloseSee} >
                    <ImssCard imss={imss} />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Imss)