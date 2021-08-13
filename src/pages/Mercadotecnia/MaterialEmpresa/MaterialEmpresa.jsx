import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { waitAlert, questionAlert, errorAlert, printResponseErrorAlert, doneAlert, deleteAlert} from '../../../functions/alert'
import { Build, NoFiles} from '../../../components/Lottie'
import { Button, TablePagination } from '../../../components/form-components'
import { Modal } from '../../../components/singles'
import Swal from 'sweetalert2'
class MaterialEmpresa extends Component {

    state = {
        modal: false,
        opciones_adjuntos: [
            {
                nombre: 'LOGOS',
                icono: 'fas fa-image',
                isActive: false,
                slug: 'logos'
            },
            {
                nombre: 'CARTA MEMBRETADA',
                icono: 'far fa-file-alt',
                isActive: false,
                slug: 'carta_membretada'
            },
            {
                nombre: 'FIRMAS ELECTRÓNICAS',
                icono: 'fas fa-file-signature',
                isActive: false,
                slug: 'firmas_electronicas'
            },
            {
                nombre: 'TARJETAS DE PRESENTACIÓN',
                icono: 'far fa-id-card',
                isActive: false,
                slug: 'tarjetas_presentacion'
            },
            {
                nombre: 'IMÁGENES DEL PERSONAL',
                icono: 'fas fa-user-tie',
                isActive: false,
                slug: 'imagenes_personal'
            },
            {
                nombre: 'TIPOGRAFÍA',
                icono: 'fas fa-pen-nib',
                isActive: false,
                slug: 'tipografía'
            },
            {
                nombre: 'FOLDER',
                icono: 'far fa-folder-open',
                isActive: false,
                slug: 'folder'
            }
        ],
        form: {
            adjuntos: {
                adjuntos: {
                    name: '',
                    value: '',
                    placeholder: 'LOGOS',
                    files: []
                },
            }
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        empresa: '',
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const material = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!material)
            history.push('/')
        this.getOptionsAxios()
    }

    /* ANCHOR AXIOS FUNCTIONS */

    /* ANCHOR GET ALL EMPRESAS Y ADJUNTOS */
    getOptionsAxios = async () => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/material-empresas`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                const { data } = this.state
                data.empresas = empresas
                this.setState({ ...this.state, data })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* ANCHOR GET ADJUNTOS POR EMPRESA */
    getAdjuntoEmpresaAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/material-empresas/empresa/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
        (response) => {
                Swal.close()
                const { empresa } = response.data
                const { opciones_adjuntos } = this.state
                opciones_adjuntos.map((element, index)=>{
                    if(index === 0)
                        element.isActive = true
                    else 
                        element.isActive = false
                    return ''
                })
                this.setState({...this.state, empresa, opciones_adjuntos, submenuactive: '', menuactive: 0 })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    /* ANCHOR ADD ADJUNTO SINGLE */
    addAdjunto = async() => {
        const { access_token } = this.props.authUser
        const data = new FormData();
        const { form, menuactive, opciones_adjuntos, empresa } = this.state
        data.append('tipo', opciones_adjuntos[menuactive].slug)
        form.adjuntos.adjuntos.files.map((file)=>{
            data.append(`files_name[]`, file.name)
            data.append(`files[]`, file.file)
            return ''
        })
        data.append('empresa', empresa.id)
        await axios.post(`${URL_DEV}mercadotecnia/material-empresas`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresa } = response.data
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.value = ''
                this.setState({...this.state,modal:false,form,empresa:empresa})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* ANCHOR DELETE SINGLE FILE */
    deleteAdjunto = async (id, tipo) => {
        const { access_token } = this.props.authUser
        const { empresa } = this.state
        await axios.delete(`${URL_DEV}mercadotecnia/material-empresas/${empresa.id}/adjunto/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('ADJUNTO ELIMINADO CON ÉXITO')
                const { empresa } = response.data
                this.setState({...this.state,empresa:empresa})
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openAccordion = (key) => {
        const { opciones_adjuntos } = this.state
        if(opciones_adjuntos.length >= key+1){
            opciones_adjuntos.map((adjunto)=>{
                adjunto.isActive = false
                return ''
            })
            opciones_adjuntos[key].isActive = true
        }
        this.setState({...this.state, opciones_adjuntos, menuactive: key})
    }

    openModalAddFiles = type => {
        const { form, opciones_adjuntos } = this.state
        form.adjuntos.adjuntos.placeholder = opciones_adjuntos[type].nombre
        form.adjuntos.adjuntos.value = ''
        form.adjuntos.adjuntos.files = []
        this.setState({...this.state,modal:true, form})
    }

    handleCloseModal = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.value = ''
        form.adjuntos.adjuntos.files = []
        this.setState({...this.state,modal:false, form})
    }

    handleChange = (files, item) => {
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto() })
    }

    onClickDelete = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', element.name, () => this.deleteAdjunto(element.id, element.pivot.tipo))
    }

    onChangeAdjuntos = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        files.map((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
            return ''
        })
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    printFiles = () => {
        const { empresa, opciones_adjuntos } = this.state
        let active = ''
        let index = 0
        let adjuntos = []
        opciones_adjuntos.map((adjunto, key)=>{
            if(adjunto.isActive){
                active = adjunto
                index = key
            }
            return ''
        })
        empresa.adjuntos.map((adjunto)=>{
            if(adjunto.pivot.tipo === active.slug)
                adjuntos.push(adjunto)
            return ''
        })
        return(
            <div>
                <div className='d-flex justify-content-between'>
                    <div className=''></div>
                    <div>
                        <Button id="subir_archivos" icon='' className="btn btn-outline-secondary btn-icon btn-sm "
                            onClick={(e) => { e.preventDefault(); this.openModalAddFiles(index) }} only_icon="fas fa-upload icon-15px text-primary"
                            tooltip={{ text: 'SUBIR ARCHIVOS' }} />
                    </div>
                </div>
                <div className='row mx-0 my-3'>
                    {
                        adjuntos.length === 0 ?
                            this.renderCarpetaVacia()     
                        : 
                            <TablePagination adjuntos = { adjuntos } delete_onclick = { this.onClickDelete } />
                    }
                </div>
            </div>
        )
    }

    renderCarpetaVacia = () => {
        return(
            <div className='col-md-12 '>
                <div>
                    <NoFiles />
                </div>
                <div className='text-center mt-5 font-weight-bolder font-size-h4 text-primary'>
                    CARPETA VACÍA
                </div>
            </div>
        )
    }

    render() {
        const { data, opciones_adjuntos, empresa, modal, form } = this.state
        return (
            <Layout active = 'mercadotecnia' {...this.props}>
                <Tab.Container className = "p-5">
                    <Row>
                        <Col sm = { 3 } >
                            <Card className = "card-custom card-stretch gutter-b">
                                <div className = "card-header">
                                    <div className = "card-title">
                                        <h3 className = "card-label">Adjuntos</h3>
                                    </div>
                                </div>
                                <div className="card-body px-3">
                                    <Accordion id="accordion-material" className="accordion-light accordion-svg-toggle">
                                        {
                                            opciones_adjuntos.map((element, key)=>{
                                                return (
                                                    <Card className="w-auto border-0 mb-2" key={key}>
                                                        <Card.Header>
                                                            <div className={(element.isActive) ? 'card-title text-primary collapsed rounded-0 ' : 'card-title text-dark-50 rounded-0'} 
                                                                onClick={() => { this.openAccordion(key, element.nombre) }}>
                                                                <div className="card-label">
                                                                    <i className={(element.isActive) ? element.icono + ' text-primary mr-3' : element.icono + ' text-dark-50 mr-3'}>
                                                                    </i>{element.nombre}
                                                                </div>
                                                            </div>
                                                        </Card.Header>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </div>
                            </Card>
                        </Col>
                        <Col sm = { 9 }>
                            <Card className="card-custom card-stretch gutter-b" >
                                <Card.Header className="">
                                    <div className="card-toolbar">
                                        <Nav className="nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder">
                                            {
                                                data.empresas.map((empresa, index) => {
                                                    return (
                                                        <Nav.Item key={index}>
                                                            <Nav.Link eventKey = { index } className = "py-2 px-4" 
                                                                onClick = { (e) => { e.preventDefault(); this.getAdjuntoEmpresaAxios(empresa.id) } } >
                                                                { empresa.name }
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    )
                                                })
                                            }
                                        </Nav>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {
                                        empresa !== '' ?
                                            this.printFiles()
                                        : 
                                            <div className='col-md-12'>
                                                <div>
                                                    <Build />
                                                </div>
                                                <div className='text-center mt-5 font-weight-bolder font-size-h3 text-primary'>
                                                    Selecciona la empresa
                                                </div>
                                            </div>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab.Container>
                <Modal show = { modal } title = 'Agregar adjuntos' handleClose = { this.handleCloseModal } size = 'lg' >
                    <div className = ''>
                        <div className="text-center font-weight-bolder my-2 pt-3">
                            {form.adjuntos.adjuntos.placeholder}
                        </div>
                        <ItemSlider item = 'adjuntos' items = { form.adjuntos.adjuntos.files } handleChange = { this.handleChange } multiple={true} />
                    </div>
                </Modal>
            </Layout >
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialEmpresa);