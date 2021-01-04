import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { setSelectOptions } from '../../../functions/setters'
import { waitAlert, questionAlert, errorAdjuntos, errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import { Nothing } from '../../../components/Lottie'

const tiposArray = ['logo', 'carta_membretada', 'firmas_electronicas', 'tarjetas_presentacion', 'imagenes_personal']
const placeholderArray = ['LOGOS', 'CARTA MEMBRETADA', 'FIRMAS ELECTRÓNICAS', 'TARJETAS DE PRESENTACIÓN', 'IMÁGENES DEL PERSONAL']
class MaterialEmpresa extends Component {

    state = {
        opciones_adjuntos: [
            {
                nombre: 'LOGOS',
                icono: 'fas fa-image',
                tipo: 1,
                isActive: false
            },
            {
                nombre: 'CARTA MEMBRETADA',
                icono: 'far fa-file-alt',
                tipo: 2,
                isActive: false
            },
            {
                nombre: 'FIRMAS ELECTRÓNICAS',
                icono: 'fas fa-file-signature',
                tipo: 3,
                isActive: false
            },
            {
                nombre: 'TARJETAS DE PRESENTACIÓN',
                icono: 'far fa-id-card',
                tipo: 4,
                isActive: false
            },
            {
                nombre: 'IMÁGENES DEL PERSONAL',
                icono: 'fas fa-user-tie',
                tipo: 5,
                isActive: false
            }
        ],
        form: {
            empresa: 'inein',
            adjuntos: {
                slider: {
                    name: '',
                    value: '',
                    placeholder: 'LOGOS',
                    files: [],
                    menu: 0
                },
            }
        },
        options: {
            empresas: []
        },
        data: {
            empresas: []
        },
        formeditado: 0,
        empresa: '',
        activeTipo: ''
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

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'mercadotecnia/material-empresas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                let { activeTipo } = response.data
                const { options, data, form } = this.state
                let { empresa } = this.state
                data.empresas = empresas
                options.empresas = setSelectOptions(empresas, 'name')
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form,
                    activeTipo
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

    async addAdjunto(name) {

        const { access_token } = this.props.authUser
        const { form, empresa } = this.state
        const data = new FormData();

        data.append('empresa', empresa.id)
        
        form.adjuntos.slider.files.map((file, key) => {
            if (typeof file.id === 'undefined') {
                data.append(`files_name[]`, file.name)
                data.append(`files[]`, file.file)
            }                  
        })

        data.append('tipo', tiposArray[form.adjuntos.slider.eventKey])

        await axios.post(URL_DEV + 'mercadotecnia/material-empresas', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa, tipo } = response.data
                const { form } = this.state
                
                form.adjuntos.slider.files = []
                empresa.adjuntos.map((adjunto, key) => {
                    if(adjunto.pivot.tipo === tipo)
                        form.adjuntos.slider.files.push(adjunto)
                })

                this.setState({
                    ...this.state,
                    form
                })

                this.getOptionsAxios()
                doneAlert('Archivo adjuntado con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) forbiddenAccessAlert()
                else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })

    }

    handleChange = (files, item) => {
        const { form } = this.state
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        if (form.adjuntos[item].value !== '')
            questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto(item) })
    }
    
    onChangeAdjuntos = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        let aux2 = []
        let size = 0
        for (let counter = 0; counter < files.length; counter++) {
            size = files[counter].size;
            size = size / (Math.pow(2, 20))
            if (size <= 2)
                aux.push(
                    {
                        name: files[counter].name,
                        file: files[counter],
                        url: URL.createObjectURL(files[counter]),
                        key: counter
                    }
                )
            else
                aux2.push(files[counter].name)
        }
        if (aux2.length) {
            let html = ''
            aux2.map((element) => {
                html += '<div class="mb-2 text-dark-50">' + '&bull;&nbsp;' + element + '<br/>' + '</div>'
            })
            // html
            errorAdjuntos(
                'OCURRIÓ UN ERROR',
                'LOS SIGUIENTES ARCHIVOS NO SE PUDIERON ADJUNTAR, PESAN MÁS DE 2M',
                html
            )
            form['adjuntos'][name].value = ''
        } else {
            form['adjuntos'][name].value = value
            form['adjuntos'][name].files = aux
        }
        this.setState({
            ...this.state,
            form
        })
    }

    openAccordion = (indiceClick, name) => {

        let { opciones_adjuntos, form, empresa } = this.state

        form.adjuntos.slider.placeholder = name
        form.adjuntos.slider.files = []
        form.adjuntos.slider.eventKey = indiceClick

        opciones_adjuntos.map((element, key) => {
            if (indiceClick === key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
            return false
        })

        if(empresa.adjuntos)
            empresa.adjuntos.map( ( adjunto ) => {
                if( tiposArray[indiceClick] === adjunto.pivot.tipo )
                    form.adjuntos.slider.files.push(adjunto)
            })
        
        this.setState({
            opciones_adjuntos: opciones_adjuntos,
            form,
            activeTipo: indiceClick
        });
    }

    changeActiveKey = empresa => {

        // Seleccionar la empresa en el superior
        let { opciones_adjuntos, form, activeTipo } = this.state
        let aux = activeTipo === undefined ? 0 : activeTipo
        
        form.adjuntos.slider.placeholder = placeholderArray[aux]
        form.adjuntos.slider.files = []
        empresa.adjuntos.map( ( adjunto ) => {
            if( adjunto.pivot.tipo === tiposArray[aux] )
                form.adjuntos.slider.files.push( adjunto )
        })
        form.adjuntos.slider.eventKey = aux

        opciones_adjuntos.map((element, key) => {
            if(key === aux)
                opciones_adjuntos[aux].isActive = true
            else
                opciones_adjuntos[key].isActive = false
        })

        this.setState({
            empresa: empresa,
            opciones_adjuntos: opciones_adjuntos,
            form,
            activeTipo: aux
        })
    }

    render() {
        const { form, data, opciones_adjuntos, empresa } = this.state
        return (
            <Layout active = 'mercadotecnia' {...this.props}>
                <Tab.Container className="p-5">
                    <Row>
                        <Col sm={3}>
                            <Card className="card-custom card-stretch gutter-b">
                                <div className="card-header">
                                    <div className="card-title">
                                        <h3 className="card-label">Adjuntos</h3>
                                    </div>
                                </div>
                                <div className="card-body px-3">
                                    <Accordion id="accordion-material" className="accordion-light accordion-svg-toggle">
                                        {
                                            opciones_adjuntos.map((element, key) => {
                                                return (
                                                    <Card className="w-auto border-0 mb-2" key={key}>
                                                        <Card.Header>
                                                            <div className={(element.isActive) ? 'card-title text-primary collapsed rounded-0 ' : 'card-title text-dark-50 rounded-0'} onClick={() => { this.openAccordion(key, element.nombre) }}>
                                                                <div className="card-label">
                                                                    <i className={(element.isActive) ? element.icono + ' text-primary mr-3' : element.icono + ' text-dark-50 mr-3'}>
                                                                    </i>{element.nombre}
                                                                </div>
                                                            </div>
                                                        </Card.Header>
                                                    </Card>
                                                )
                                            }
                                            )
                                        }
                                    </Accordion>
                                </div>
                            </Card>
                        </Col>
                        <Col sm={9}>
                            <Card className="card-custom card-stretch gutter-b" >
                                <Card.Header className="">
                                    <div className="card-toolbar">
                                        <Nav className="nav nav-pills nav-pills-sm nav-light-primary font-weight-bolder">
                                            {
                                                data.empresas.map((empresa, index) => {
                                                    return (
                                                        <Nav.Item key={index}>
                                                            <Nav.Link eventKey={index} className="py-2 px-4" onClick={(e) => { e.preventDefault(); this.changeActiveKey(empresa) }} >
                                                                {empresa.name}
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
                                            <div className="col-md-12 d-flex justify-content-center">
                                                <div>
                                                    <div className="text-center font-weight-bolder mb-2">
                                                        {form.adjuntos.slider.placeholder}
                                                    </div>
                                                    <ItemSlider
                                                        item='slider'
                                                        items={form.adjuntos.slider.files}
                                                        handleChange={this.handleChange}
                                                        multiple={true}
                                                    />
                                                </div>
                                            </div>
                                        : <Nothing />
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab.Container>
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