import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import swal from 'sweetalert'
import NewTable from '../../../components/tables/NewTable'
import { EMPRESA_COLUMNS } from '../../../constants'
import { setTextTable } from '../../../functions/setters'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Nav, Tab, Col, Row, Card } from 'react-bootstrap'
import { waitAlert, forbiddenAccessAlert, errorAlert, doneAlert } from '../../../functions/alert'
import { EmpresaCard } from '../../../components/cards'

class Empresas extends Component {

    state = {
        empresas: [],
        modalDelete: false,
        modalAdjuntos: false,
        modalSee: false,
        empresa: {},
        form: {
            name: '',
            razonSocial: '',
            logo: '',
            file: [],
            rfc: ''
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        img: '',
        title: '',
        formAction: '',
        showadjuntos: [
            {
                placeholder: 'Logo de la empresa',
                id: 'logos',
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
            }
        ],
        adjuntos: [],
        defaultactivekey:"",
    }
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const empresas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!empresas)
            history.push('/')
        this.getEmpresas()
    }

    async getEmpresas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { data: { empresas: empresas } } = response
                data.empresas = empresas
                this.setEmpresas(empresas)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setEmpresas = (empresas_list) => {
        const { data } = this.state
        data.empresas = empresas_list
        let empresas = []
        empresas_list.map((empresa, key) => {
            empresas[key] = {
                actions: this.setActions(empresa),
                name: renderToString(setTextTable(empresa.name)),
                razonSocial: renderToString(setTextTable(empresa.razon_social)),
                rfc: renderToString(setTextTable(empresa.rfc)),
                logo: renderToString(empresa.logos.length !== 0 ? <img className="img-empresa" src={empresa.logos[empresa.logos.length - 1].url } alt={empresa.name} /> : 'No hay logo'),
                id: empresa.id
            }
        })
        this.setState({
            ... this.state,
            empresas,
            img: '',
            formAction: '',
            form: {
                name: '',
                razonSocial: '',
                logo: '',
                file: ''
            },
            data
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
                text: 'Imagen&nbsp;coorporativa',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Ver',
                btnclass: 'info',
                iconclass: 'flaticon2-expand',                  
                action: 'see',
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            },
        )
        return aux
    }

    openModalDeleteEmpresa = (emp) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            empresa: emp,
            formAction: 'Delete'
        })
    }

    changePageEdit = empresa => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/empresas/edit',
            state: { empresa: empresa}
        });
    }

    openModalAdjuntos = empresa => {
        let { adjuntos } = this.state
        let auxheaders = [
        ]

        this.setState({
            ... this.state,
            modalAdjuntos: true,
            adjuntos: this.setAdjuntosSlider(empresa),
            empresa: empresa,
            form: this.clearForm(),
            formeditado: 0,
        })
    }

    openModalSee = empresa => {
        this.setState({
            ... this.state,
            modalSee: true,
            empresa: empresa
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            empresa: ''
        })
    }

    setAdjuntosSlider = empresa => {

        let auxheaders = [
        ]
        let aux = []

        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: empresa[element.name],
                form: element.form,
                url: ''
            })
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
        })
        return form
    }

    updateActiveTabContainer = active => {
        this.setState({
            ... this.state,
            subActiveKey: active
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            empresa: {},
            formAction: ''
        })
    }

    safeDeleteEmpresa = (e) => (empresa) => {
        this.deleteEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            modalDelete: false,
            empresa: {},
            formAction: ''
        })
    }

    async deleteEmpresaAxios(empresa) {
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'empresa/' + empresa, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { empresas: empresas } } = response
                this.setEmpresas(empresas)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la empresa.')
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateEmpresaAxios(empresa) {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa/' + empresa, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { empresas: empresas } } = response
                this.setEmpresas(empresas)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito la empresa.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addEmpresaAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { empresas: empresas } } = response
                this.setEmpresas(empresas)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChangeAdjuntoGrupo = (e) => {
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
        for(let i = 0; i < showadjuntos.length; i++){
            if(showadjuntos[i].id === name){
                adjunto = i;
            }
        }

        showadjuntos[adjunto].value = value
        showadjuntos[adjunto].files = aux
        
        this.setState({
            ... this.state,
            form
        })
    }

    handleChangeImages = (files, item) => {
        this.onChangeAdjuntoGrupo({ target: { name: item, value: files, files: files } })
        swal({
            title: '¿Confirmas el envio de adjuntos?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__red btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__green btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                waitAlert()
                this.addAdjuntoAxios(item)
            }
        })
    }

    async addAdjuntoAxios(name) {
        const { access_token } = this.props.authUser
        const { form, empresa, showadjuntos } = this.state
        const data = new FormData();
        data.append('tipo', name)
        let adjunto = 0
        for(let i = 0; i < showadjuntos.length; i++){
            if(showadjuntos[i].id === name){
                adjunto = i;
            }
        }
        showadjuntos[adjunto].files.map( (file) => {
            data.append(`files_name_${showadjuntos[adjunto].id}[]`, file.name)
            data.append(`files_${showadjuntos[adjunto].id}[]`, file.file)
        })

        await axios.post(URL_DEV + 'empresa/' + empresa.id + '/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { empresas, empresa } = response.data

                this.setEmpresas(empresas)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.')

                this.setState({
                    empresa: empresa
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form } = this.state
        if (name === 'logo') {
            form['logo'] = value
            form['file'] = e.target.files[0]
            let img = URL.createObjectURL(e.target.files[0])
            this.setState({
                ... this.state,
                form,
                img: img
            })
        }

        else {
            if (name === 'razonSocial') {
                let cadena = value.replace(/,/g, '')
                cadena = cadena.replace(/\./g, '')
                form[name] = cadena
                this.setState({
                    ... this.state,
                    form
                })
            } else {
                form[name] = value
                this.setState({
                    ... this.state,
                    form
                })
            }
        }


    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { empresa: { id: empresa } } = this.state
        this.updateEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            empresa: {}
        })
    }

    handleAddSubmit = (e) => {
        e.preventDefault()
        this.addEmpresaAxios();
        this.setState({
            ... this.state,
        })
    }

    handleCloseAdjuntos = () => {
        const { modalAdjuntos } = this.state
        this.setState({
            ... this.state,
            modalAdjuntos: !modalAdjuntos,
            form: this.clearForm(),
            empresa: '',
        })
    }

    removeFile = (e) => {
        e.preventDefault()
        const { name, logo, file, razon_social } = this.state.empresa
        this.setState({
            ... this.state,
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
        swal({
            title: '¿Deseas eliminar el archivo?',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }

    render() {
        const { empresas, modalDelete, empresa, form, img, title, formAction, data, formeditado, modalAdjuntos, showadjuntos, defaultactivekey,modalSee } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>

                <NewTable columns={EMPRESA_COLUMNS} data={empresas}
                    title='Empresas' subtitle='Listado de empresas'
                    mostrar_boton={true}
                    abrir_modal={false}                    
                    url = '/usuarios/empresas/add'
                    mostrar_acciones={true}

                    actions={{
                        'edit': {function: this.changePageEdit},
                        'delete': { function: this.openModalDeleteEmpresa },
                        'adjuntos': { function: this.openModalAdjuntos },  
                        'see': { function: this.openModalSee },

                    }}
                    elements={data.empresas}
                    idTable='kt_datatable_empresas'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <Modal>

                </Modal>
                <Modal size="xl" title="Imagen corporativa" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        <Card className="card-custom card-without-box-shadown">
                            <Card.Body>
                                <Tab.Container id="left-tabs-example" defaultActiveKey={defaultactivekey}>
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
                                                                                <ItemSlider multiple = { false } items={ empresa[adjunto.id] } handleChange={this.handleChangeImages}
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

                <Modal size="lg" title="Empresa" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <EmpresaCard empresa={empresa}/>
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