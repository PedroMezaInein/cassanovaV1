import React, { Component } from 'react'
import { Card, DropdownButton, Dropdown, OverlayTrigger, Tooltip, Col, Row } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import axios from 'axios'
import { toAbsoluteUrl } from "../../../../functions/routers"
import SliderImages from '../../../singles/SliderImages'
import { dayDMY } from "../../../../functions/setters"
import { ItemSlider, ModalSendMail } from '../../../singles'
import { CreatableMultiselectGray } from '../../../../components/form-components'
import { waitAlert, printResponseErrorAlert, errorAlert, doneAlert, deleteAlert } from '../../../../functions/alert'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader } from '../../../../functions/routers'
import { AvanceForm } from '../../../../components/forms'
import S3 from 'react-aws-s3';
class Avances extends Component {

    state = {
        tabAvance: 'avances',
        accordion: [],
        formeditado:0,
        modal:{
            avance_cliente:false
        },
        form:{
            correos_avances: [],
            url_avance:'',
            id_avance:0,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            semana: '',
            actividades_realizadas:'',
            avances: [
                {
                    avance: '',
                    descripcion: '',
                    adjuntos: {
                        value: '',
                        placeholder: 'Fotos del avance',
                        files: []
                    }
                }
            ],
            adjuntos: {
                avance: {
                    value: '',
                    placeholder: 'Avance',
                    files: []
                }
            }
        },
        options: {
            correos_clientes:[]
        }
    }

    componentDidUpdate = prev => {
        const { isActive, proyecto } = this.props
        const { isActive: prevActive } = prev
        let { tabAvance } = this.state
        if(isActive && !prevActive){
            if(proyecto.avances.length === 0){
                tabAvance = 'new'
                this.setState({
                    ...this.state,
                    tabAvance
                })
            }
        }
    }
    
    setNaviIcon(icon, text) {
        return (
            <span className="navi-icon d-flex align-self-center">
                <div className="d-flex"><i className={`${icon} mr-2`} /></div>
                <div className="navi-text align-self-center">
                    {text}
                </div>
            </span>
        )
    }

    openFormAvance = (type) => {
        this.setState({
            ...this.state,
            tabAvance: type,
            form: this.clearForm()
        })
    }

    handleAccordion = (indiceClick) => {
        const { proyecto: { avances } } = this.props;
        avances.forEach((element, key) => {
            if (element.id === indiceClick) {
                element.isActive = element.isActive ? false : true
            }else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: avances
        });
    }
    
    openModalEnviarAvance = (avance) => {
        const { modal, options } = this.state
        const { user, proyecto } = this.props
        let { form } = this.state

        form.url_avance = avance.pdf
        modal.avance_cliente = true
        
        form.correos_avances = []
        form.id_avance = avance.id
        let aux_contactos = [];
        if (user.email) {
            form.correos_avances.push({ value: user.email, label: user.email, id: user.id.toString() })
            aux_contactos.push({
                value: user.email,
                label: user.email,
                id: user.id.toString() 
            })
        }
        options.correos_clientes = []
        proyecto.contactos.forEach(contacto => {
            aux_contactos.push({
                value: contacto.correo.toLowerCase(),
                label: contacto.correo.toLowerCase(),
                id: contacto.id.toString()
            })
            return ''
        })
        options.correos_clientes = aux_contactos

        // ELIMINAR OPCIÓN DUPLICADO
        const values = aux_contactos.map(o => o.value)
        const filtered = aux_contactos.filter(({value}, index) => !values.includes(value, index + 1))
        
        options.correos_clientes = filtered
        this.setState({
            ...this.state,
            modal,
            form,
            options
        })
    }
    
    handleCloseModalEnviarAvance = () => {
        const { form, modal } = this.state
        form.correos_clientes = []
        form.url_avance = ''
        modal.avance_cliente = false
        this.setState({...this.state, modal, form })
    }

    handleChangeCreateMSelect = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label,
                id:valor.id
            })
            return ''
        })
        form.correos_avances = currentValue
        this.setState({...this.state, form })
    };

    sendMail = async () => {
        waitAlert();
        const { at, proyecto } = this.props
        const { form } = this.state
        let aux = []
        form.correos_avances.map((contacto) => {
            aux.push(contacto.value)
            return false
        })
        form.correos_avances = aux
        await axios.put(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}/avances/${form.id_avance}`, form, { headers: setSingleHeader(at) }).then(
            (response) => { doneAlert(response.data.message !== undefined ? response.data.message : 'El avance fue enviado con éxito.') }, 
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'avances':
                    form[element] = [{
                        descripcion: '',
                        avance: '',
                        adjuntos: {
                            value: '',
                            placeholder: 'Fotos del avance',
                            files: []
                        }
                    }]
                    break;
                case 'adjuntos':
                    form[element] = {
                        avance: {
                            value: '',
                            placeholder: 'Avance',
                            files: []
                        },
                    }
                    break;
                case 'correos_avances':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            form.adjuntos[element].value = ''
            form.adjuntos[element].files = []
            return false
        })
        return form
    }

    onChangeAvance = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form.avances[key][name] = value
        this.setState({ ...this.state, form })
    }

    onChangeAdjuntoAvance = (e, key, name) => {
        const { form } = this.state
        const { files, value } = e.target
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
        form.avances[key][name].value = value
        form.avances[key][name].files = aux
        this.setState({ ...this.state, form })
    }

    clearFilesAvances = (name, key, _key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.avances[_key].adjuntos.files.length; counter++) {
            if (counter !== key) { aux.push(form.avances[_key].adjuntos.files[counter]) }
        }
        if (aux.length < 1) {
            form.avances[_key].adjuntos.files = []
            form.avances[_key].adjuntos.value = ''
        }
        form.avances[_key].adjuntos.files = aux
        this.setState({ ...this.state, form })
    }
    
    addRowAvance = () => {
        const { form } = this.state
        form.avances.push(
            {
                descripcion: '',
                adjuntos: {
                    value: '',
                    placeholder: 'Fotos del avance',
                    files: []
                }
            }
        )
        this.setState({ ...this.state, form })
    }

    deleteRowAvance = () => {
        const { form } = this.state
        form.avances.pop()
        this.setState({
            ...this.state,
            form
        })
    }

    onSubmitNewAvance = async() => {
        const { form, tabAvance } = this.state
        const { proyecto, at } = this.props
        let auxPromises = []
        let files = []
        await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { alma } = response.data
                let urlPath = `proyectos/${proyecto.id}/avance/${form.semana}/`
                if(tabAvance !== 'attached'){
                    form.avances.forEach((avance, key) => {
                        avance.adjuntos.files.forEach((file, index) => {
                            files.push({ file: file, key: key })
                        })
                    })
                    auxPromises  = files.map((file) => {
                        return new Promise((resolve, reject) => {
                            new S3(alma).uploadFile(file.file.file, `${urlPath}${file.key}/${Math.floor(Date.now() / 1000)}-${file.file.name}`)
                                .then((data) =>{
                                    const { location,status } = data
                                    console.log(`Data: `, data)
                                    if(status === 204) resolve({ name: file.file.name, url: location, key: file.key })
                                    else reject(data)
                                }).catch(err => reject(err))
                        })
                    })
                    Promise.all(auxPromises).then(values => { this.addNewAvance(values) }).catch(err => console.error(err))
                }else{
                    if(form.adjuntos.avance.files.length === 1){
                        let auxPromises  = form.adjuntos.avance.files.map((file) => {
                            return new Promise((resolve, reject) => {
                                new S3(alma).uploadFile(file.file, `${urlPath}/${Math.floor(Date.now() / 1000)}-${file.file.name}`)
                                    .then((data) =>{
                                        const { location,status } = data
                                        console.log(`Data: `, data)
                                        if(status === 204) resolve({ name: file.file.name, url: location })
                                        else reject(data)
                                    }).catch(err => reject(err))
                            })
                        })
                        Promise.all(auxPromises).then(values => { this.attachAvance(values) }).catch(err => console.error(err))
                    }else{ errorAlert('Agrega UN archivo con el avance del proyecto') }
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
        
    }

    attachAvance = async(values) => {
        const { form } = this.state
        const { at, proyecto, refresh } = this.props
        let data = {}
        data.semana = form.semana
        data.actividades = form.actividades_realizadas
        data.fechaInicio = form.fechaInicio
        data.fechaFin = form.fechaFin
        data.archivo = values[0]
        await axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/avances`, data, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { avance } = response.data
                var win = window.open(avance.pdf, '_blank');
                win.focus();
                doneAlert(`Avance generado con éxito`, ()=> {refresh(proyecto.id)})
                this.handleCloseAvances()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    addNewAvance = async(files) => {
        const { form } = this.state
        const { at, proyecto, refresh } = this.props
        files.forEach((file) => {
            if(!form.avances[file.key].files){
                form.avances[file.key].files = []
            }
            form.avances[file.key].files.push( file )
            form.avances[file.key].adjuntos.files = []
            form.avances[file.key].adjuntos.value = null
        })
        let data = {}
        data.semana = form.semana
        data.actividades = form.actividades_realizadas
        data.fechaInicio = form.fechaInicio
        data.fechaFin = form.fechaFin
        data.avances = form.avances
        await axios.post(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/avances`, data, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { avance } = response.data
                var win = window.open(avance.pdf, '_blank');
                win.focus();
                doneAlert(`Avance generado con éxito`, ()=> {refresh(proyecto.id)})
                this.handleCloseAvances()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAvance = async(id) => {
        const { at, proyecto, refresh } = this.props
        waitAlert()
        await axios.delete(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/avances/${id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                doneAlert(`Avance eliminado con éxito`, ()=> {refresh(proyecto.id)})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    handleChangeAvance = (files, item) => { this.onChangeAdjunto({ target: { name: item, value: files, files: files } }) }

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
        this.setState({ ...this.state, form })
    }
    getTitle = () => {
        const { tabAvance } = this.state
        switch(tabAvance){
            case 'new':
                return 'NUEVO AVANCE'
            case 'attached':
                return 'ADJUNTAR AVANCE'
            case 'avances':
                return 'HISTORIAL DE AVANCES'
            default:
                return ''
        }
    }
    render() {
        const { proyecto } = this.props
        const { modal, form, options, formeditado, tabAvance } = this.state
        return (
            <div>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center">
                        <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                {
                                    proyecto ?
                                        proyecto.avances ?
                                            proyecto.avances.length > 0 && (tabAvance === 'new' || tabAvance === 'attached')?
                                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.openFormAvance('avances') }}>
                                                    {this.setNaviIcon('las la-clipboard-list icon-xl', 'HISTORIAL DE AVANCES')}
                                                </Dropdown.Item>
                                            : <></>
                                        : <></>
                                    : <></>
                                }
                                {
                                    tabAvance === 'new'?<></>:
                                    <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.openFormAvance('new') }}>
                                        {this.setNaviIcon('las la-camera-retro icon-xl', 'NUEVO AVANCE')}
                                    </Dropdown.Item>
                                }
                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => { this.openFormAvance('attached') }}>
                                    {this.setNaviIcon('las la-paperclip icon-xl', 'ADJUNTAR AVANCE')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        
                        {
                            tabAvance === 'avances' ?
                                proyecto ?
                                    proyecto.avances ?
                                        proyecto.avances.length ?
                                            <div className="d-flex justify-content-center">
                                                <div className="col-md-11">
                                                    <div className="accordion accordion-light accordion-svg-toggle">
                                                        {
                                                            proyecto.avances.map((avance, key) => {
                                                                return (
                                                                    <Card className="w-auto" key={key}>
                                                                        <Card.Header >
                                                                            <Card.Title className={`rounded-0 ${(avance.isActive) ? 'text-primary2 collapsed' : 'text-dark'}`} onClick={() => { this.handleAccordion(avance.id) }}>
                                                                                <span className={`svg-icon ${avance.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                                                </span>
                                                                                <div className="card-label ml-3 row mx-0 justify-content-between">
                                                                                    <div>
                                                                                        <div className="font-size-lg">Semana {avance.semana}</div>
                                                                                        <div className="font-weight-light font-size-sm text-dark-75">{dayDMY(avance.fecha_inicio)} - {dayDMY(avance.fecha_fin)}</div>
                                                                                    </div>
                                                                                    <div className="align-self-center">
                                                                                        <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>VER PDF</span></Tooltip>}>
                                                                                            <a rel="noopener noreferrer" href={avance.pdf} target="_blank" className={`btn btn-icon ${avance.isActive ? 'btn-color-primary2' : ''}  btn-active-light-primary2 w-30px h-30px mr-2`}>
                                                                                                <i className="las la-file-download icon-xl"></i>
                                                                                            </a>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>ENVIAR A CLIENTE</span></Tooltip>}>
                                                                                            <span onClick={() => { this.openModalEnviarAvance(avance) }} className={`btn btn-icon ${avance.isActive ? 'btn-color-primary2' : ''}  btn-active-light-primary2 w-30px h-30px`}>
                                                                                                <i className="las la-envelope icon-xl"></i>
                                                                                            </span>
                                                                                        </OverlayTrigger>
                                                                                        <OverlayTrigger rootClose 
                                                                                            overlay = { 
                                                                                                <Tooltip>
                                                                                                    <span className='font-weight-bolder'>ELIMINAR</span>
                                                                                                </Tooltip>}>
                                                                                            <span className={`btn btn-icon ${avance.isActive ? 'btn-color-danger' : ''}  btn-active-light-danger w-30px h-30px mr-2`}
                                                                                                onClick = { (e) => { e.preventDefault(); deleteAlert(`ELIMINARÁS EL AVANCE DE LA SEMANA ${avance.semana}`, '¿DESEAS CONTINUAR?', 
                                                                                                    () => this.deleteAvance(avance.id)) } }>
                                                                                                <i className="las la-trash icon-xl"></i>
                                                                                            </span>
                                                                                        </OverlayTrigger>
                                                                                    </div>
                                                                                </div>
                                                                            </Card.Title>
                                                                        </Card.Header>
                                                                        <Card.Body className={`card-body px-10 ${avance.isActive ? 'collapse show' : 'collapse'}`}>
                                                                            <Row className="mx-0">
                                                                                {
                                                                                    avance.actividades !== null ?
                                                                                        <div className="col-md-12">
                                                                                            <div className="mx-auto w-max-content">
                                                                                                <div className="font-weight-bold mb-2 text-center"><span className="bg-light px-3 font-size-lg rounded">Actividades realizadas</span></div>
                                                                                                <ul className="mb-0">
                                                                                                    { 
                                                                                                        avance.actividades.split('\n').map(( actividad, index) =>  {
                                                                                                            return(
                                                                                                                <li key = { index }>{actividad}</li>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </ul>
                                                                                            <div className="separator separator-dashed my-6"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    :<></>
                                                                                }
                                                                                <Col md={9} className="mb-5 mx-auto">
                                                                                    {
                                                                                        avance.adjuntos.length > 0 ?
                                                                                            <SliderImages elements={avance.adjuntos} />
                                                                                        :
                                                                                            <ItemSlider  items={[{ url: avance.pdf, name: 'ficha_tecnica.pdf' }]}/>
                                                                                    }
                                                                                </Col>
                                                                            </Row>
                                                                        </Card.Body>
                                                                    </Card>
                                                                )
                                                            }
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            : ''
                                        : ''
                                    : ''
                            :tabAvance === 'new' ?
                                <AvanceForm
                                    form = { form }
                                    onChangeAvance = { this.onChangeAvance }
                                    onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance }
                                    clearFilesAvances = { this.clearFilesAvances }
                                    addRowAvance = { this.addRowAvance }
                                    deleteRowAvance = { this.deleteRowAvance }
                                    onSubmit = { (e) => {e.preventDefault(); waitAlert(); this.onSubmitNewAvance() } }
                                    onChange = { this.onChange }
                                    proyecto = { proyecto } 
                                    sendMail = { this.sendMail }
                                    handleChange = { this.handleChangeAvance }
                                    formeditado = { formeditado } 
                                    isNew = { tabAvance === 'attached' ? true : false }
                                />
                            :tabAvance === 'attached' ?
                                <AvanceForm
                                    form = { form }
                                    onChangeAvance = { this.onChangeAvance }
                                    onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance }
                                    clearFilesAvances = { this.clearFilesAvances }
                                    addRowAvance = { this.addRowAvance }
                                    deleteRowAvance = { this.deleteRowAvance }
                                    onSubmit = { (e) => {e.preventDefault(); waitAlert(); this.onSubmitNewAvance() } }
                                    onChange = { this.onChange }
                                    proyecto = { proyecto } 
                                    sendMail = { this.sendMail }
                                    handleChange = { this.handleChangeAvance }
                                    formeditado = { formeditado } 
                                    isNew = { tabAvance === 'attached' ? true : false }
                                />
                            :<></>
                        }
                    </Card.Body>
                </Card>
                <ModalSendMail show = { modal.avance_cliente } handleClose = { this.handleCloseModalEnviarAvance } header = '¿DESEAS ENVIAR EL AVANCE?' 
                    validation = 'url_avance !==' url = { form.url_avance } url_text = 'EL AVANCE' sendMail = { this.sendMail } >
                    <div className="col-md-11 mt-5">
                        <div>
                            <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email"
                                requirevalidation = { 1 } messageinc = "Selecciona el o los correos" uppercase = { false }
                                onChange = { this.handleChangeCreateMSelect } options = { options.correos_clientes } elementoactual = { form.correos_avances } />
                        </div>
                    </div>
                </ModalSendMail>
            </div>
        )
    }
}

export default Avances