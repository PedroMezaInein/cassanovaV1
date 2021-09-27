import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, EMPRESA_COLUMNS, PUSHER_OBJECT} from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import { setTextTableReactDom, setTextTableCenter, setTagLabelReactDom } from '../../../functions/setters'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Nav, Tab, Col, Row, Card } from 'react-bootstrap'
import { waitAlert, printResponseErrorAlert, errorAlert, doneAlert, customInputAlert, questionAlertWithLottie } from '../../../functions/alert'
import { EmpresaCard } from '../../../components/cards'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
import { InputGray } from '../../../components/form-components'
/* import Pusher from 'pusher-js'; */
import Echo from 'laravel-echo';
import $ from "jquery";
import { Lock } from '../../../assets/animate'
const MySwal = withReactContent(Swal)
class Empresas extends Component {
    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalSee: false,
        modalInhabilitadas: false,
        empresa: {},
        form: {
            name: '',
            razonSocial: '',
            logo: '',
            file: [],
            rfc: ''
        },
        formeditado: 0,
        img: '',
        title: '',
        formAction: '',
        showadjuntos: [
            {
                placeholder: 'Logo de la empresa',
                id: 'logo_principal',
                value: '',
                files: []
            },
            {
                placeholder: 'Logo de la empresa blanco',
                id: 'logos_blanco',
                value: '',
                files: []
            },
            {
                placeholder: 'Isotipo',
                id: 'isotipos',
                value: '',
                files: []
            },
            {
                placeholder: 'Letras',
                id: 'letras',
                value: '',
                files: []
            },
            {
                placeholder: 'Firma de contacto',
                id: 'firma_contacto',
                value: '',
                files: []
            },
            // {
            //     placeholder: 'Portafolio',
            //     id: 'portafolio',
            //     value: '',
            //     files: []
            // },
            /* {
                placeholder: 'Cuestionario',
                id: 'cuestionario',
                value: '',
                files: []
            }, */
            {
                placeholder: 'Machote de contrato',
                id: 'machote_contrato',
                value: '',
                files: []
            }
        ],
        adjuntos: [],
        defaultactivekey: "",
        detenidas: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const empresas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!empresas)
            history.push('/')
        if(process.env.NODE_ENV === 'production'){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('Usuarios.Empresa').listen('Usuarios\\EmpresaEvent', (e) => {
                this.getEmpresas()
            })
        }
    }

    async getEmpresas() {
        $('#kt_datatable_empresas').DataTable().ajax.reload();
    }

    setEmpresas = empresas => {
        let aux = []
        empresas.map((empresa) => {
            aux.push({
                actions: this.setActions(empresa),
                logo: renderToString(empresa.logo_principal.length !== 0 ? 
                    <div className="text-center"><img className="img-empresa" src={empresa.logo_principal[empresa.logo_principal.length - 1].url} alt={empresa.name} /> </div>
                : <div className="text-center font-size-12px">-</div>),
                name: setTextTableReactDom(empresa.name, this.doubleClick, empresa, 'name', 'text-center'),
                razonSocial: setTextTableReactDom(empresa.razon_social, this.doubleClick, empresa, 'razon_social', 'text-center'),
                rfc: setTextTableReactDom(empresa.rfc, this.doubleClick, empresa, 'rfc', 'text-center'),
                departamento: empresa.departamentos.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(empresa, empresa.departamentos, 'departamento_empresa', this.deleteElementAxios, ''),
                id: empresa.id
            })
            return false
        })
        return aux
    }
    deleteElementAxios = async(empresa, element) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/usuarios/empresas/${empresa.id}/departamento/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEmpresas()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El departamento fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        if(tipo){
            form[tipo] = data[tipo]
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                    requirevalidation = { 0 }  value = { form[tipo] } name = { tipo }
                    onChange = { (e) => { this.onChange(e.target.value, tipo)} } swal = { true } />
            </div>,
            <Update />,
            () => { this.patchEmpresa(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChange = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }
    patchEmpresa = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/empresas/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEmpresas()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
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
                text: 'Imagen&nbsp;coorporativa',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Imagen&nbsp;coorporativa', type: 'info' }
            },
            {
                text: 'Inhabilitar&nbsp;empresa',
                btnclass: 'warning',
                iconclass: 'flaticon2-lock',
                action: 'inhabilitar',
                tooltip: { id: 'inhabilitar', text: 'Inhabilitar empresa', type: 'error' },
            }
        )
        return aux
    }

    openModalDeleteEmpresa = emp => {
        this.setState({
            ...this.state,
            modalDelete: true,
            empresa: emp,
            formAction: 'Delete'
        })
    }

    changePageEdit = empresa => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/empresas/edit',
            state: { empresa: empresa }
        });
    }

    openModalAdjuntos = empresa => {
        this.setState({
            ...this.state,
            modalAdjuntos: true,
            adjuntos: this.setAdjuntosSlider(empresa),
            empresa: empresa,
            form: this.clearForm(),
            formeditado: 0,
            defaultActiveKey: 'logo_principal'
        })
    }

    openModalSee = empresa => {
        this.setState({
            ...this.state,
            modalSee: true,
            empresa: empresa
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            empresa: ''
        })
    }

    setAdjuntosSlider = empresa => {
        let auxheaders = []
        let aux = []
        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: empresa[element.name],
                form: element.form,
                url: ''
            })
            return false
        })
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }

    updateActiveTabContainer = active => {
        this.setState({
            ...this.state,
            subActiveKey: active
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            empresa: {},
            formAction: ''
        })
    }

    safeDeleteEmpresa = e => (empresa) => {
        this.deleteEmpresaAxios(empresa);
        this.setState({
            ...this.state,
            modalDelete: false,
            empresa: {},
            formAction: ''
        })
    }

    async deleteEmpresaAxios(empresa) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'empresa/' + empresa, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {

                this.getEmpresas();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la empresa.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    onChangeAdjuntoGrupo = e => {
        const { form, showadjuntos } = this.state
        const { files, value, name } = e.target
        let adjunto = 0
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
        for (let i = 0; i < showadjuntos.length; i++) {
            if (showadjuntos[i].id === name) {
                adjunto = i;
            }
        }
        showadjuntos[adjunto].value = value
        showadjuntos[adjunto].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    handleChangeImages = (files, item) => {
        this.onChangeAdjuntoGrupo({ target: { name: item, value: files, files: files } })
        MySwal.fire({
            title: '¿CONFIRMAS EL ENVIÓ DE ADJUNTOS?',
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ACEPTAR",
            cancelButtonText: "CANCELAR",
            reverseButtons: true,
            customClass: {
                content: 'd-none',
            }
        }).then((result) => {
            if (result.value) {
                waitAlert()
                this.addAdjuntoAxios(item)
            }
        })
    }

    async addAdjuntoAxios(name) {
        const { access_token } = this.props.authUser
        const { empresa, showadjuntos } = this.state
        const data = new FormData();
        data.append('tipo', name)
        let adjunto = 0
        for (let i = 0; i < showadjuntos.length; i++) {
            if (showadjuntos[i].id === name) {
                adjunto = i;
            }
        }
        showadjuntos[adjunto].files.map((file) => {
            data.append(`files_name_${showadjuntos[adjunto].id}[]`, file.name)
            data.append(`files_${showadjuntos[adjunto].id}[]`, file.file)
            return false
        })
        await axios.post(`${URL_DEV}empresa/${empresa.id}/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data
                this.getEmpresas()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.')
                this.setState({
                    empresa: empresa
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
    handleCloseAdjuntos = () => {
        const { modalAdjuntos } = this.state
        this.setState({
            ...this.state,
            modalAdjuntos: !modalAdjuntos,
            form: this.clearForm(),
            empresa: '',
        })
    }
    removeFile = (e) => {
        e.preventDefault()
        const { name, logo, razon_social } = this.state.empresa
        this.setState({
            ...this.state,
            form: {
                name: name,
                razonSocial: razon_social,
                logo: '',
                file: logo
            },
            img: ''
        })
    }
    deleteFile = element => {
        MySwal.fire({
            title: '¿DESEAS ELIMINAR EL ARCHIVO?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            reverseButtons: true,
            customClass: {
                content: 'd-none',
                confirmButton: 'btn-light-danger-sweetalert2',
                cancelButton:'btn-light-gray-sweetalert2'
            }
        }).then((result) => {
            if (result.value) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }
    inhabilitar = (empresa) => {
        questionAlertWithLottie(
            `Inhabilitarás la empresa ${empresa.name}`,
            `¿Deseas continuar?`,
            Lock,
            { confirm: 'SI', cancel: 'NO' },
            {
                cancel: null,
                success: () => this.inhabilitarEmpresa(empresa, true)
            }
        )
    }
    habilitar = (empresa) => {
        questionAlertWithLottie(
            `Habilitarás la empresa ${empresa.name}`,
            `¿Deseas continuar?`,
            Lock,
            { confirm: 'SI', cancel: 'NO' },
            {
                cancel: null,
                success: () => this.inhabilitarEmpresa(empresa, false)
            }
        )
    }
    async inhabilitarEmpresa(empresa, estatus) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'empresa/detener/' + empresa.id, { detenido: estatus }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getEmpresas()
                if (estatus)
                    doneAlert('La empresa fue inhabilitada con éxito.')
                else
                    doneAlert('La empresa fue habilitada con éxito.')
                this.setState({
                    ...this.state,
                    detenidas: [],
                    modalInhabilitadas: false
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
    openModalHabilitar = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/detenidas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                Swal.close();
                this.setState({
                    ...this.state,
                    modalInhabilitadas: true,
                    title: 'Empresas inhabilitadas',
                    detenidas: empresas
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
    handleCloseInhabilitadas = () => {
        const { modalInhabilitadas } = this.state
        this.setState({
            ...this.state,
            modalInhabilitadas: !modalInhabilitadas,
        })
    }
    render() {
        const { modalDelete, empresa, modalAdjuntos, showadjuntos, defaultActiveKey, modalSee, modalInhabilitadas, detenidas } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <NewTableServerRender
                    columns={EMPRESA_COLUMNS}
                    title='Empresas'
                    subtitle='Listado de empresas'
                    mostrar_boton={true}
                    abrir_modal={false}
                    url='/usuarios/empresas/add'
                    mostrar_acciones={true}
                    habilitar={true}
                    text_habilitar="HABILITAR EMPRESA"
                    icon_habilitar="fa-unlock-alt"
                    onClickHabilitar={this.openModalHabilitar}
                    actions={
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDeleteEmpresa },
                            'adjuntos': { function: this.openModalAdjuntos },
                            'see': { function: this.openModalSee },
                            'inhabilitar': { function: this.inhabilitar },
                        }
                    }
                    idTable='kt_datatable_empresas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setEmpresas}
                    urlRender = { `${URL_DEV}v2/usuarios/empresas` }
                />
                <Modal>
                </Modal>
                <Modal size="xl" title="Imagen corporativa" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        <Card className="card-custom card-without-box-shadown">
                            <Card.Body>
                                <Tab.Container id="left-tabs-example" defaultActiveKey={defaultActiveKey}>
                                    <Row>
                                        <Col md={3} className="navi navi-accent navi-hover navi-bold border-nav">
                                            <Nav variant="pills" className="flex-column navi navi-hover navi-active">
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Nav.Item className="navi-item" key={key}>
                                                                <Nav.Link className="navi-link" eventKey={adjunto.id}>
                                                                    <span className="navi-text">{adjunto.placeholder}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    })
                                                }
                                            </Nav>
                                        </Col>
                                        <Col md={9} className="align-self-center">
                                            <Tab.Content>
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Tab.Pane key={key} eventKey={adjunto.id}>
                                                                <>
                                                                    {
                                                                        empresa ?
                                                                            empresa[adjunto.id] ?
                                                                                <ItemSlider multiple={false} items={empresa[adjunto.id]} handleChange={this.handleChangeImages}
                                                                                    item={adjunto.id} />
                                                                                : ''
                                                                            : ''
                                                                    }
                                                                </>
                                                            </Tab.Pane>
                                                        )
                                                    })
                                                }
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </div>
                </Modal>
                <ModalDelete title={empresa === null ? "¿Estás seguro que deseas eliminar a " : "¿Estás seguro que deseas eliminar a " + empresa.name + " ?"} show={modalDelete} handleClose={this.handleDeleteModal} onClick={(e) => { this.safeDeleteEmpresa(e)(empresa.id) }}>
                </ModalDelete>
                <Modal size="lg" title="Empresa" show={modalSee} handleClose={this.handleCloseSee} >
                    <EmpresaCard empresa={empresa} />
                </Modal>
                <Modal title="Habilitar por empresa" show={modalInhabilitadas} handleClose={this.handleCloseInhabilitadas} >
                    <div className="table-responsive mt-4">
                        <table className="table table-head-bg table-borderless table-vertical-center">
                            <thead>
                                <tr>
                                    <th className="w-auto">
                                        <div className="text-left text-muted font-size-sm d-flex justify-content-start">EMPRESA</div>
                                    </th>
                                    <th className="text-muted font-size-sm">
                                        <div className=" text-muted font-size-sm d-flex justify-content-center">HABILITAR</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detenidas.length > 0 ?
                                        detenidas.map((detenida, key) => {
                                            return (
                                                <tr key={key} >
                                                    <td>
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                            {detenida.name}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="btn btn-icon btn-light btn-text-primary btn-hover-text-dark font-weight-bold btn-sm mr-2"
                                                            onClick={(e) => { e.preventDefault(); this.habilitar(detenida) }} >
                                                            <i className="fas fa-unlock-alt text-dark-50"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td className='text-center' colSpan="2">
                                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                    NO HAY EMPRESA INHABILITADAS
                                                </span>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Empresas);