import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { connect } from 'react-redux'
// import { Button } from '../../../components/form-components'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Tab, Nav, Col, Row, Card, Accordion, } from 'react-bootstrap'
import { setSelectOptions } from '../../../functions/setters'
import { waitAlert, questionAlert, errorAdjuntos, errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Nothing } from '../../../components/Lottie'
class MaterialCliente extends Component {

    state = {
        submenuactive: null,
        opciones_adjuntos: [
            {
                nombre: 'PORTAFOLIO',
                icono: 'fas fa-briefcase',
                tipo: 1,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'COMO TRABAJAMOS (FASE 1 Y 2)',
                icono: 'flaticon2-file',
                tipo: 2,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS GENERALES',
                icono: 'flaticon2-settings',
                tipo: 3,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'SERVICIOS POR CATEGORIA',
                icono: 'fas fa-tag',
                tipo: 4,
                isActive: false,
                subMenu: true
            },
            {
                nombre: 'BROKERS',
                icono: 'fas fa-user-tie',
                tipo: 5,
                isActive: false,
                subMenu: false
            },
            {
                nombre: 'VIDEOS',
                icono: 'fas fa-video',
                tipo: 6,
                isActive: false,
                subMenu: false
            }
        ],
        form: {
            empresa: 'inein',
            adjuntos: {
                slider: {
                    name: '',
                    value: '',
                    placeholder: 'PORTAFOLIO',
                    files: [],
                    menu: 0
                },
                subportafolio: {
                    value: '',
                    placeholder: 'SUBPORTAFOLIO',
                    files: []
                },
                ejemplo: {
                    value: '',
                    placeholder: 'EJEMPLOS',
                    files: []
                },
                portada: {
                    value: '',
                    placeholder: 'PORTADA',
                    files: []
                }
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
        await axios.get(URL_DEV + 'mercadotecnia/material-clientes', { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
    handleChange = (files, item) => {
        const { form } = this.state
        this.onChangeAdjuntos({ target: { name: item, value: files, files: files } })
        if (form.adjuntos[item].value !== '')
            questionAlert('ENVIAR ARCHIVO', '¿ESTÁS SEGURO QUE DESEAS ENVIARLO?', () => { waitAlert(); this.addAdjunto(item) })
    }
    onChangeAdjuntos = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = form.adjuntos[name].files
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

    async addAdjunto(name) {
        const { access_token } = this.props.authUser
        const { form, empresa, submenuactive } = this.state
        const data = new FormData();
        const tipos = [
            'portafolio',
            'como_trabajamos',
            'servicios_generales',
            '',
            'brokers',
            'videos'
        ]

        data.append('empresa', empresa.id)
        
        if(name === 'slider'){
            form.adjuntos.slider.files.map((file, key) => {
                if (typeof file.id === 'undefined') {
                    data.append(`files_name[]`, file.name)
                    data.append(`files[]`, file.file)
                }                  
            })
            data.append('tipo', tipos[form.adjuntos.slider.eventKey])
        }else{
            form.adjuntos[name].files.map((file, key) => {
                if (typeof file.id === 'undefined') {
                    data.append(`files_name[]`, file.name)
                    data.append(`files[]`, file.file)
                }                  
            })
            data.append('proyecto', submenuactive)
            data.append('tipo', name)
        }
        
        await axios.post(URL_DEV + 'mercadotecnia/material-clientes', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa, tipo } = response.data
                const { form } = this.state
                
                if(name === 'slider'){
                    form.adjuntos.slider.files = []
                    empresa.adjuntos.map((adjunto, key) => {
                        if(adjunto.pivot.tipo === tipo)
                            form.adjuntos.slider.files.push(adjunto)
                    })
                }else{
                    form.adjuntos[tipo].files = []
                    empresa.tipos.map((element, key) => {
                        if(element.id === submenuactive)
                            element.adjuntos.map((adjunto)=>{
                                if(adjunto.pivot.tipo === tipo)
                                    form.adjuntos[tipo].files.push(adjunto)
                            })
                    })
                }

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
    
    openAccordion = (indiceClick, name) => {
        
        const tipos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos']
        let { opciones_adjuntos, form, empresa } = this.state
        
        form.adjuntos.slider.placeholder = name
        form.adjuntos.slider.files = []
        form.adjuntos.slider.menu = indiceClick === 3 ? 1 : 0
        form.adjuntos.slider.eventKey = indiceClick
        
        if(indiceClick !== 3){
            if(empresa.adjuntos)
                empresa.adjuntos.map((adjunto, key) => {
                    if( tipos[indiceClick] === adjunto.pivot.tipo )
                        form.adjuntos.slider.files.push(adjunto)
                })
        }

        opciones_adjuntos.map((element, key) => {
            if (indiceClick === key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
            return false
        })

        this.setState({
            opciones_adjuntos: opciones_adjuntos,
            form,
            submenuactive: '',
            activeTipo: indiceClick
        });
    }
    // openSubMenu = (name) => {
    //     let { form } = this.state
    //     form.adjuntos.slider.placeholder = name
    //     form.adjuntos.slider.files = []
    //     form.adjuntos.slider.menu = 1
    //     this.setState({
    //         form
    //     });
    // }
    changeActiveKey = empresa => {
        
        let { opciones_adjuntos, form, activeTipo } = this.state
        let aux = activeTipo === undefined ? 0 : activeTipo
        const tipos = ['portafolio', 'como_trabajamos', 'servicios_generales', '', 'brokers', 'videos']
        const placeholder = ['PORTAFOLIO', 'COMO TRABAJAMOS (FASE 1 Y 2)', 'SERVICIOS GENERALES', 'SERVICIOS POR CATEGORIA', 'BROKERS', 'VIDEOS']

        form.adjuntos.slider.placeholder = placeholder[aux]
        form.adjuntos.slider.files = []
        empresa.adjuntos.map((adjunto, key) => {
            if(aux !== 3)
                if(adjunto.pivot.tipo === tipos[aux])
                    form.adjuntos.slider.files.push(adjunto)
        })
        form.adjuntos.slider.menu = aux === 3 ? 1 : 0
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
            submenuactive: ''
        });
    } 

    loadAdjuntos = tipo => {
        const { adjuntos } = tipo
        let { form } = this.state
        let subportafolio = []
        let ejemplo = []
        let portada = []
        adjuntos.forEach(adjunto=>{
            switch(adjunto.pivot.tipo){
                case "portada":
                    portada.push(adjunto)
                    break;
                case "subportafolio":
                    subportafolio.push(adjunto)
                    break;
                case "ejemplo":
                    ejemplo.push(adjunto)
                    break;
            }
        })
        form.adjuntos.portada.files =portada
        form.adjuntos.subportafolio.files =subportafolio
        form.adjuntos.ejemplo.files = ejemplo
        this.setState({
            form,
            submenuactive: tipo.id
        })
    } 
    render() {
        const { form, data, opciones_adjuntos, empresa, submenuactive } = this.state
        const sub_menu = (element) => {
            switch (element.tipo) {
                case 4: return <Nav className="navi">
                    {
                        empresa ?
                            empresa.tipos.map((tipo, key) => {
                                return (
                                    <Nav.Item className='navi-item' key={key} onClick={(e)=>{ e.preventDefault();this.loadAdjuntos(tipo)}}>
                                        <Nav.Link className = "navi-link p-2" eventKey={tipo.id}>
                                            <span className={ submenuactive === tipo.id ? "navi-icon text-primary" : "navi-icon"}>
                                                <span className="navi-bullet">
                                                    <i className = "bullet bullet-dot"></i>
                                                </span>
                                            </span>
                                            <div className={ submenuactive === tipo.id ? "navi-text text-primary" : "navi-text"}>
                                                <span className="d-block font-weight-bolder" >{tipo.tipo}</span>
                                            </div>
                                        </Nav.Link>
                                    </Nav.Item>
                                )
                            })
                            : ''
                    }
                </Nav>;
                default:
                    return <></>
            }
        }
        return (
            <Layout active={'mercadotecnia'} {...this.props}>
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
                                                                {
                                                                    element.subMenu ?
                                                                        <span className="svg-icon">
                                                                            <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                                                        </span>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </Card.Header>
                                                        <div className={(element.isActive) ? 'collapse show' : 'collapse'} >
                                                            {
                                                                element.subMenu ?
                                                                    <Card.Body>
                                                                        <div>{sub_menu(element)}</div>
                                                                    </Card.Body>
                                                                    : ''
                                                            }
                                                        </div>
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
                                                            <Nav.Link eventKey={empresa.id} className="py-2 px-4" onClick={(e) => { e.preventDefault(); this.changeActiveKey(empresa) }} >
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
                                        empresa !==  '' ?
                                            form.adjuntos.slider.menu === 0 ?
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
                                                :
                                                submenuactive ? 
                                                    <div className="col-md-12 d-flex justify-content-center">
                                                        <div className='row mx-0 justify-content-center'>
                                                            <div className="col-md-6">
                                                                <div className="text-center font-weight-bolder mb-2">
                                                                    {form.adjuntos.subportafolio.placeholder}
                                                                </div>
                                                                <ItemSlider
                                                                    item='subportafolio'
                                                                    items={form.adjuntos.subportafolio.files}
                                                                    handleChange={this.handleChange}
                                                                    multiple={true}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="text-center font-weight-bolder mb-2">
                                                                    {form.adjuntos.ejemplo.placeholder}
                                                                </div>
                                                                <ItemSlider
                                                                    item='ejemplo'
                                                                    items={form.adjuntos.ejemplo.files}
                                                                    handleChange={this.handleChange}
                                                                    multiple={true}
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="text-center font-weight-bolder mb-2">
                                                                    {form.adjuntos.portada.placeholder}
                                                                </div>
                                                                <ItemSlider
                                                                    item='portada'
                                                                    items={form.adjuntos.portada.files}
                                                                    handleChange={this.handleChange}
                                                                    multiple={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                : <Nothing />
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialCliente);