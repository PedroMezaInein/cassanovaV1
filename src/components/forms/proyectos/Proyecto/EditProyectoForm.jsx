import React, { Component } from 'react';
import { Card, Form, Row, DropdownButton, Dropdown, Col } from 'react-bootstrap';
import { setOptions, setNaviIcon } from '../../../../functions/setters';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, setSingleHeader } from "../../../../functions/routers"
import { InfoProyecto } from "../..";
import { TagSelectSearchGray, InputGray, InputMoneyGray, TagInputGray, InputPhoneGray, InputNumberGray, ReactSelectSearchGray, RangeCalendar, Button, FixedMultiOptionsGray } from '../../../form-components'
import { openWizard1, openWizard2 /*, openWizard3 */ } from '../../../../functions/wizard'
import { validateAlert, waitAlert, doneAlert, errorAlert, printResponseErrorAlert } from '../../../../functions/alert'
import { TEL, URL_DEV } from '../../../../constants'
import { optionsFases } from "../../../../functions/options"
import axios from 'axios'
import { Modal } from '../../../../components/singles'
import { ClienteCPModal } from '../../../../components/forms'
import Swal from 'sweetalert2'
import moment from 'moment'
class EditProyectoForm extends Component {
    state = {
        cliente_seleccionado:[],
        clientes_add:[],
        navInfo: 'info',
        showModal:false,
        modal:{
            cp:false
        },
        form: {
            nombre: '',
            empresa: '',
            tipoProyecto: '',
            fases: [],
            m2: '',
            costo: '',
            descripcion: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            contacto: '',
            numeroContacto: '',
            cliente_principal: '',
            clientes: [],
            correos: [],
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            ubicacion_cliente: '',
            ciudad: '',
            sucursal: '',
            cp_ubicacion:[]
        },
        formContratar: {
            nombre:'',
            fases: [],
            costo: '',
            fechaInicio: new Date(),
            fechaFin: new Date()
        },
        formeditado:1,
        stateOptions:{
            fases:[]
        }
    }

    componentDidUpdate = prev => {
        const { isActive } = this.props
        const { isActive: prevActive } = prev
        if(isActive && !prevActive){
            this.setState({ ...this.state, navInfo: 'info' })
        }
    }

    getForm(){
        const { proyecto, options } = this.props
        const { form, formContratar } = this.state
        let { cliente_seleccionado, clientes_add } = this.state
        form.nombre = proyecto.nombre
        form.sucursal = proyecto.sucursal
        form.ciudad = proyecto.ciudad

        if (proyecto.empresa){
            form.empresa = {name: proyecto.empresa.name, value: proyecto.empresa.id.toString(), label: proyecto.empresa.name}
            options.empresas.forEach(empresa => {
                if(proyecto.empresa.name === empresa.name){
                    options.tipos = setOptions(empresa.tipos, 'tipo', 'id')
                }
            });
        }
        if (proyecto.tipo_proyecto){
            form.tipoProyecto = {name: proyecto.tipo_proyecto.tipo, value: proyecto.tipo_proyecto.id.toString(), label: proyecto.tipo_proyecto.tipo}
        }
        let auxFases = []
        if(proyecto.fase1){ auxFases.push({name: 'Fase 1', value: 'fase1', label: 'Fase 1'}) }
        if(proyecto.fase2){ auxFases.push({name: 'Fase 2', value: 'fase2', label: 'Fase 2'}) } 
        if(proyecto.fase3){ auxFases.push({name: 'Fase 3', value: 'fase3', label: 'Fase 3'}) }
        form.fases = auxFases
        form.m2 = proyecto.m2
        form.costo = proyecto.costo
        form.descripcion = proyecto.descripcion
        form.fechaInicio = new Date(proyecto.fecha_inicio)
        form.fechaFin = new Date(proyecto.fecha_fin)
        form.contacto = proyecto.contacto
        form.numeroContacto = proyecto.numero_contacto
        let auxClientes = []
        let aux_clientesPrincipal = []
        if (proyecto.clientes) {
            proyecto.clientes.forEach(cliente => {
                options.clientes.forEach(option => {
                    if(cliente.id.toString() === option.value.toString()){
                        auxClientes.push({
                            name: cliente.empresa,
                            value: cliente.id.toString(),
                            label: cliente.empresa,
                            cp: option.cp,
                            estado: option.estado,
                            municipio: option.municipio,
                            colonia: option.colonia,
                            calle: option.calle
                        })
                        aux_clientesPrincipal.push({
                            name: cliente.empresa,
                            value: cliente.id.toString(),
                            label: cliente.empresa,
                            cp: option.cp,
                            estado: option.estado,
                            municipio: option.municipio,
                            colonia: option.colonia,
                            calle: option.calle
                        })
                    }
                });
            });
            form.clientes = auxClientes
        }
        let auxEmail = []
        if (proyecto.contactos) {
            proyecto.contactos.forEach(email => {
                auxEmail.push(email.correo)
            });
        }
        form.correos = auxEmail
        form.cp = proyecto.cp
        form.estado = proyecto.estado
        form.municipio = proyecto.municipio
        form.colonia = proyecto.colonia
        form.calle = proyecto.calle
        if(proyecto.cliente){
            form.cliente_principal = {
                value: proyecto.cliente.id.toString(),
                name: proyecto.cliente.empresa,
                label: proyecto.cliente.empresa
            }
            aux_clientesPrincipal.push({
                value: proyecto.cliente.id.toString(),
                name: proyecto.cliente.empresa,
                label: proyecto.cliente.empresa
            })
            cliente_seleccionado.push(form.cliente_principal)
        }else{
            form.cliente_principal = ''
        }
        formContratar.costo = proyecto.costo
        formContratar.fechaInicio = new Date( moment(proyecto.fecha_fin))
        formContratar.fechaFin = null
        let auxFasesContratar = []
        if(proyecto.fase1){ auxFasesContratar.push({name: 'Fase 1', value: 'fase1', label: 'Fase 1', isFixed:true}) }
        if(proyecto.fase2){ auxFasesContratar.push({name: 'Fase 2', value: 'fase2', label: 'Fase 2', isFixed:true}) } 
        if(proyecto.fase3){ auxFasesContratar.push({name: 'Fase 3', value: 'fase3', label: 'Fase 3', isFixed:true}) }
        formContratar.fases = auxFasesContratar
        formContratar.nombre = this.getNameWithoutFases( proyecto.nombre )

        clientes_add = aux_clientesPrincipal
        this.optionsFixed()
        this.setState({ ...this.state, form, formContratar, cliente_seleccionado, clientes_add })
    }

    getNameWithoutFases = cadena => {
        let auxiliar = cadena.split(' - FASE 1')[0]
        auxiliar = auxiliar.split(' - FASE 2')[0]
        return auxiliar.split(' - FASE 3')[0]
    }

    optionsFixed = () => {
        const { proyecto } = this.props
        let { stateOptions } = this.state
        stateOptions.fases = optionsFases()
        stateOptions.fases = optionsFases()
        stateOptions.fases.forEach((fase) => {
            if (proyecto.fase1) {
                if (fase.label === 'Fase 1') {
                    fase.isFixed = true;
                }
            }
            if (proyecto.fase2) {
                if (fase.label === 'Fase 2') {
                    fase.isFixed = true;
                }
            }
            if (proyecto.fase3) {
                if (fase.label === 'Fase 3') {
                    fase.isFixed = true;
                }
            }
        })
        this.setState({ ...this.state, stateOptions })
    }
    onChange = e => {
        const { name, value, type } = e.target
        const { form } = this.state
        const { options } = this.props
        let { showModal } = this.state
        form[name] = value
        if (type === 'radio') {
            if (name === 'ubicacion_cliente')
                form[name] = value === "true" ? true : false
        }
        switch (name) {
            case 'clientes':
                let aux = [];
                form.clientes.forEach((cliente) => {
                    if (cliente.cp !== null) {
                        aux.push({
                            name: cliente.name,
                            value: cliente.value,
                            label: cliente.name,
                            cp: cliente.cp,
                            estado: cliente.estado,
                            municipio: cliente.municipio,
                            colonia: cliente.colonia,
                            calle: cliente.calle
                        })
                    }
                })
                options.cp_clientes = aux
                if (options.cp_clientes.length > 1 || options.cp_clientes.length === 1) {
                    showModal = true
                }
                else if (options.cp_clientes.length === 0) {
                    form.cp = ''
                    form.estado = ''
                    form.municipio = ''
                    form.colonia = ''
                    form.calle = ''
                    showModal = false
                }
                this.setState({
                    ...this.state,
                    form,
                    showModal
                })
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            form,
            showModal
        })
    }
    updateSelect = (value, name) => {
        const { proyecto } = this.props
        const { form } = this.state
        let { cliente_seleccionado, clientes_add } = this.state
        if (value === null) {
            value = []
        }
        this.onChange({ target: { value: value, name: name } }, true)
        switch (name) {
            case 'fases':
                let nombre = this.getNameWithoutFases( proyecto.nombre )
                let ordenValue = value
                ordenValue.sort( (a, b) => (a.value > b.value) ? 1 : -1)
                if(value.length){
                    value.forEach((element) => {
                        nombre += ` - ${element.label.toUpperCase()}`
                    })
                }
                form.nombre = nombre
                this.setState({ ...this.state, form })
                break;
                case 'cliente_principal':
                    let arr3 = []
                    if(value.length === 0){ 
                        if(cliente_seleccionado.length>0){
                            clientes_add.forEach((clientes, index1) => {
                                if(clientes.value === cliente_seleccionado[0].value){ 
                                    clientes_add.splice(index1,1); 
                                }
                            }) 
                            cliente_seleccionado.splice(0,1); 
                        }
                        form.clientes = clientes_add
                    } else { 
                        clientes_add.forEach((clientes, index1) => {
                            if(clientes.value === value.value){ 
                                clientes_add.splice(index1,1); 
                            }
                        })
                        if(cliente_seleccionado.length>0){
                            clientes_add.forEach((clientes, index1) => {
                                if(clientes.value === cliente_seleccionado[0].value){ 
                                    clientes_add.splice(index1,1); 
                                }
                            }) 
                            cliente_seleccionado.splice(0,1); 
                        }
                        cliente_seleccionado.push(value)
                        arr3 = [...clientes_add, ...cliente_seleccionado]
                        form.clientes = arr3
                    }
                    break;
                case 'clientes':
                    clientes_add = value
                    this.setState({ ...this.state, clientes_add })
                break;
            default:
                break;
        }
    }
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeRangeContratar = range => {
        const { startDate, endDate } = range
        const { formContratar } = this.state
        formContratar.fechaInicio = startDate
        formContratar.fechaFin = endDate
        this.setState({
            ...this.state,
            formContratar
        })
    }
    onChangeContratar = e => {
        const { name, value } = e.target
        const { formContratar } = this.state
        formContratar[name] = value
        this.setState({ ...this.state, formContratar })
    }
    updateSelectContratar = (value, name) => {
        const { proyecto } = this.props
        if (value === null) {
            value = []
        }
        const { formContratar } = this.state
        if(name === 'fases'){
            let nombre = this.getNameWithoutFases( proyecto.nombre )
            if(value.length){
                value.forEach((element) => {
                    if(!element.isFixed){
                        nombre += ` - ${element.label.toUpperCase()}`
                    }
                })
            }
            formContratar.nombre = nombre
        }
        formContratar[name] = value
        this.setState({ ...this.state, formContratar })
    }
    transformarOptions = options => {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    tagInputChange = (nuevosCorreos) => {
        const uppercased = nuevosCorreos.map(tipo => tipo.toUpperCase());
        const { form } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            form
        })
    }

    updateEmpresa = value => {
        const { form } = this.state
        const { options } = this.props
        if (value === null) {
            value = []
            options.tipos = []
            form.tipoProyecto = []
            this.setState({
                form
            })
        }
        this.onChange({ target: { value: value, name: 'empresa' } })
        this.onChange({ target: { value: '', name: 'tipoProyecto' } })
        options.empresas.find(function (element, index) {
            if (value.length !== 0) {
                if (value.value.toString() === element.value.toString()) {
                    options.tipos = setOptions(element.tipos, 'tipo', 'id')
                }
                return false
            }
            return false
        })
    }
    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.editProyectoAxios()
    }

    async editProyectoAxios() {
        const { at, proyecto, refresh } = this.props
        const { form } = this.state
        await axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}`, form, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { proyecto } = response.data
                this.setState({...this.state, navInfo: 'info'});
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.', () => {refresh(proyecto.id)})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    onClickInfo = (type) => {
        this.getForm()
        this.setState({
            // ...this.state,
            navInfo: type
        })
    }

    // Formulario de cp
    
    openModalCP = () => {
        const { modal } = this.state
        modal.cp = true
        this.setState({
            ...this.state,
            modal
        })
    }
    handleCloseCP = () => { 
        const { modal } = this.state
        let { form } = this.state
        modal.cp = false
        form.ubicacion_cliente = ''
        form.cp_ubicacion = ''
        this.setState({
            ...this.state,
            modal,
            form
        })
    }
    sendForm = async() => {
        let { form } = this.state
        const { modal } = this.state
        const { options } = this.props
        modal.cp = false
        options.cp_clientes.forEach((cliente) => {
            if (form.cp_ubicacion.value === cliente.value) {
                form.cp = cliente.cp
                form.estado = cliente.estado
                form.municipio = cliente.municipio
                if(cliente.colonia){
                    form.colonia = cliente.colonia.toUpperCase()
                }else{
                    form.colonia = ''
                }
                form.calle = cliente.calle
            }else if(options.cp_clientes.length === 1){
                form.cp = cliente.cp
                form.estado = cliente.estado
                form.municipio = cliente.municipio
                form.colonia = cliente.colonia.toUpperCase()
                form.calle = cliente.calle
            }
        })
        Swal.close()
        this.setState({
            ...this.state,
            modal,
            form
        })
    }
    getTitle = () => {
        const { navInfo } = this.state
        switch(navInfo){
            case 'info':
                return 'INFORMACIÓN DEL PROYECTO'
            case 'edit':
                return 'EDITAR PROYECTO'
            case 'contratar':
                return 'CONTRATAR FASE'
            default:
                return ''
        }
    }

    sendFormContratar  = async() => {
        const { at, proyecto, refresh } = this.props
        const { formContratar } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/contratar`, formContratar, { headers: setSingleHeader(at) }).then(
            (response) => {
                this.setState({...this.state, navInfo: 'info'});
                doneAlert('Fase contratada con éxito.', () => {refresh(proyecto.id)})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { /*showModal,*/ form, formeditado, modal, navInfo, formContratar, stateOptions } = this.state
        const { proyecto, options } = this.props
        return (
            <>
                {
                    proyecto ?
                        <Card className='card card-custom gutter-b'>
                            <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                                <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                                <div className="card-toolbar">
                                    {/*
                                        <button type="button" className="btn btn-sm btn-flex btn-light-primary2" onClick={() => { this.mostrarFormulario() }} >
                                            span className="svg-icon"><SVG src={toAbsoluteUrl('/images/svg/Edit.svg')} /></span><div>EDITAR PROYECTO</div>
                                        </button> 
                                    */}
                                    <div className="card-toolbar toolbar-dropdown">
                                        <DropdownButton menualign="right" 
                                            title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                            {
                                                (navInfo === 'edit' || navInfo === 'contratar') ?
                                                    <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickInfo('info') }}>
                                                        {setNaviIcon('las la-clipboard-list icon-xl', 'INFORMACIÓN')}
                                                    </Dropdown.Item>
                                                : <></>
                                            }
                                            {
                                                navInfo === 'edit'?<></>:
                                                <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.onClickInfo('edit') }}>
                                                    {setNaviIcon('las la-pencil-alt icon-xl', 'EDITAR PROYECTO')}
                                                </Dropdown.Item>
                                            }
                                            {
                                                (proyecto.fase3 !== 1 && navInfo !== 'contratar')?
                                                <Dropdown.Item className="text-hover-primary dropdown-primary" onClick={() => { this.onClickInfo('contratar') }}>
                                                    {setNaviIcon('las la-handshake icon-xl', 'CONTRATAR FASES')}
                                                </Dropdown.Item>
                                                :<></>
                                            }
                                        </DropdownButton>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className = {`px-0 px-md-4 ${navInfo === 'info'?'pt-0':''}`}>
                                {
                                    navInfo === 'info' ?
                                        <InfoProyecto proyecto={proyecto}/>
                                        :navInfo === 'edit' ?
                                        <div className="wizard wizard-6" id="wizardP" data-wizard-state="first">
                                            <div className="wizard-content d-flex flex-column mx-auto">
                                                <div className="d-flex flex-column-auto flex-column px-0">
                                                    <div className="wizard-nav d-flex flex-column align-items-center align-items-md-center">
                                                        <div className="wizard-steps d-flex flex-column flex-md-row">
                                                            <div id="wizard-1" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                                                                <div className="wizard-wrapper pr-lg-7 pr-5">
                                                                    <div className="wizard-icon">
                                                                        <i className="wizard-check fas fa-check"></i>
                                                                        <span className="wizard-number">1</span>
                                                                    </div>
                                                                    <div className="wizard-label mr-3">
                                                                        <h3 className="wizard-title">Detalles</h3>
                                                                        <div className="wizard-desc">Datos del proyecto</div>
                                                                    </div>
                                                                    <span className="svg-icon">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div id="wizard-2" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={() => { openWizard2() }}>
                                                                <div className="wizard-wrapper pr-lg-7 pr-5">
                                                                    <div className="wizard-icon">
                                                                        <i className="wizard-check fas fa-check"></i>
                                                                        <span className="wizard-number">2</span>
                                                                    </div>
                                                                    <div className="wizard-label mr-3">
                                                                        <h3 className="wizard-title mb-0">Información</h3>
                                                                        <div className="wizard-desc">Datos de contacto</div>
                                                                    </div>
                                                                    <span className="svg-icon">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* <div id="wizard-3" className="wizard-step flex-grow-1 flex-basis-0" data-wizard-type="step" onClick={(e) => { e.preventDefault(e); openWizard3(); if (showModal) { this.openModalCP(); } }}>
                                                                <div className="wizard-wrapper">
                                                                    <div className="wizard-icon">
                                                                        <i className="wizard-check fas fa-check"></i>
                                                                        <span className="wizard-number">3</span>
                                                                    </div>
                                                                    <div className="wizard-label">
                                                                        <h3 className="wizard-title">Ubicación</h3>
                                                                        <div className="wizard-desc">Ubicación del proyecto</div>
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Form
                                                    onSubmit={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(this.onSubmit, e, 'wizard-3-content')
                                                        }
                                                    }
                                                >
                                                    <div id="wizard-1-content" data-wizard-type="step-content" data-wizard-state="current">
                                                        <Row className="mx-0 mt-10">
                                                            <div className="text-center col-sm-12 col-lg-12 col-xxl-4 order-2 order-xxl-1 mt-5 mt-xxl-0">
                                                                <div className="col-form-label mb-3 p-0 font-weight-bolder text-dark-60">Periodo inicio - final</div>
                                                                <RangeCalendar
                                                                    onChange={this.onChangeRange}
                                                                    start={form.fechaInicio}
                                                                    end={form.fechaFin}
                                                                />
                                                            </div>
                                                            <div className="align-self-center col-sm-12 col-lg-12 col-xxl-8 order-1 order-xxl-2">
                                                            <div className="form-group row form-group-marginless">
                                                                    
                                                                    <div className="col-md-4">
                                                                        <ReactSelectSearchGray
                                                                            placeholder='Selecciona la empresa'
                                                                            defaultvalue={form.empresa}
                                                                            iconclass='las la-building icon-xl'
                                                                            options={this.transformarOptions(options.empresas)}
                                                                            onChange={this.updateEmpresa}
                                                                            requirevalidation={1}
                                                                            messageinc="Selecciona la empresa."
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <ReactSelectSearchGray
                                                                            placeholder='Tipo de proyecto'
                                                                            defaultvalue={form.tipoProyecto}
                                                                            iconclass='las la-swatchbook icon-xl'
                                                                            options={this.transformarOptions(options.tipos)}
                                                                            onChange={(value) => { this.updateSelect(value, 'tipoProyecto') }}
                                                                            requirevalidation={1}
                                                                            messageinc="Selecciona el tipo de proyecto."
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                                                <div className="form-group row form-group-marginless">
                                                                    <div className="col-md-4">
                                                                        <InputGray
                                                                            letterCase={true}
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withplaceholder={1}
                                                                            withicon={1}
                                                                            requirevalidation={1}
                                                                            withformgroup={0}
                                                                            formeditado={formeditado}
                                                                            name="nombre"
                                                                            value={form.nombre}
                                                                            onChange={this.onChange}
                                                                            type="text"
                                                                            placeholder="SUCURSAL"
                                                                            iconclass="far fa-folder-open"
                                                                            messageinc="Ingresa la sucursal del proyecto."
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <InputGray
                                                                                letterCase={true}
                                                                                withtaglabel={1}
                                                                                withtextlabel={1}
                                                                                withplaceholder={1}
                                                                                withicon={1}
                                                                                requirevalidation={1}
                                                                                withformgroup={0}
                                                                                formeditado={formeditado}
                                                                                name="ciudad"
                                                                                value={form.ciudad}
                                                                                onChange={this.onChange}
                                                                                type="text"
                                                                                placeholder="CIUDAD"
                                                                                iconclass="far fa-folder-open"
                                                                                messageinc="Ingresa la ciudad del proyecto."
                                                                            />
                                                                    </div>
                                                                    
                                                                </div>
                                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                                                <div className="form-group row form-group-marginless">
                                                                    <div className="col-md-8">
                                                                        <InputGray
                                                                            letterCase={false}
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withplaceholder={1}
                                                                            withicon={0}
                                                                            requirevalidation={0}
                                                                            withformgroup={0}
                                                                            formeditado={formeditado}
                                                                            rows="3"
                                                                            as="textarea"
                                                                            placeholder="UBICACIÓN"
                                                                            name="sucursal"
                                                                            onChange={this.onChange}
                                                                            value={form.sucursal}
                                                                            customclass="px-2"
                                                                            messageinc="Ingresa la dirección completa."
                                                                        />
                                                                    </div>
                                                                    
                                                                </div>
                                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                                                <div className="form-group row form-group-marginless">
                                                                    <div className="col-md-4">
                                                                        <TagSelectSearchGray
                                                                            requirevalidation={1}
                                                                            placeholder="SELECCIONA LA FASE"
                                                                            options={optionsFases()}
                                                                            defaultvalue={form.fases}
                                                                            onChange={(value) => { this.updateSelect(value, 'fases') }}
                                                                            iconclass="las la-pencil-ruler icon-xl"
                                                                            messageinc="Selecciona la fase."
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <InputNumberGray
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withplaceholder={1}
                                                                            withicon={1}
                                                                            requirevalidation={1}
                                                                            formeditado={formeditado}
                                                                            placeholder="M²"
                                                                            value={form.m2}
                                                                            name="m2"
                                                                            onChange={this.onChange}
                                                                            iconclass="las la-ruler-combined icon-xl"
                                                                            messageinc="Ingresa los m²."
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <InputMoneyGray
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withplaceholder={1}
                                                                            withicon={1}
                                                                            withformgroup={0}
                                                                            requirevalidation={1}
                                                                            formeditado={formeditado}
                                                                            thousandseparator={true}
                                                                            placeholder="Costo con IVA"
                                                                            value={form.costo}
                                                                            name="costo"
                                                                            onChange={this.onChange}
                                                                            iconclass="las la-coins"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                                                <div className="row form-group-marginless">
                                                                    <div className="col-md-12">
                                                                        <InputGray
                                                                            letterCase={false}
                                                                            withtaglabel={1}
                                                                            withtextlabel={1}
                                                                            withplaceholder={1}
                                                                            withicon={0}
                                                                            requirevalidation={0}
                                                                            withformgroup={0}
                                                                            formeditado={formeditado}
                                                                            rows="3"
                                                                            as="textarea"
                                                                            placeholder="DESCRIPCIÓN"
                                                                            name="descripcion"
                                                                            onChange={this.onChange}
                                                                            value={form.descripcion}
                                                                            customclass="px-2"
                                                                            messageinc="Ingresa una descripción."
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Row>
                                                        <div className="d-flex justify-content-end pt-3 border-top mt-10">
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard2() }}>Siguiente
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div id="wizard-2-content" data-wizard-type="step-content">
                                                        <div className="form-group row form-group-marginless">
                                                            <div className="col-md-4">
                                                                <InputGray
                                                                    letterCase={true}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={1}
                                                                    requirevalidation={1}
                                                                    withformgroup={0}
                                                                    formeditado={formeditado}
                                                                    name="contacto"
                                                                    value={form.contacto}
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                    placeholder="NOMBRE DEL CONTACTO"
                                                                    iconclass="far fa-user-circle"
                                                                    messageinc="Ingresa el nombre de contacto."
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <InputPhoneGray
                                                                    requirevalidation={1}
                                                                    formeditado={formeditado}
                                                                    prefix={''}
                                                                    name="numeroContacto"
                                                                    value={form.numeroContacto}
                                                                    onChange={this.onChange}
                                                                    placeholder="NÚMERO DE CONTACTO"
                                                                    iconclass="fas fa-mobile-alt"
                                                                    messageinc="Ingresa el número de contacto."
                                                                    patterns={TEL}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <ReactSelectSearchGray
                                                                    placeholder='Selecciona el cliente principal'
                                                                    defaultvalue={form.cliente_principal}
                                                                    iconclass='las la-user icon-xl'
                                                                    options={options.clientes}
                                                                    onChange={(value) => { this.updateSelect(value, 'cliente_principal') }}
                                                                    requirevalidation={1}
                                                                    messageinc="Selecciona el cliente principal."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                                        <div className="form-group row form-group-marginless">
                                                            <div className="col-md-6">
                                                                <TagSelectSearchGray
                                                                    requirevalidation={1}
                                                                    placeholder="SELECCIONA EL(LOS) CLIENTE(S)"
                                                                    options={options.clientes}
                                                                    defaultvalue={form.clientes}
                                                                    onChange={(value) => { this.updateSelect(value, 'clientes') }}
                                                                    iconclass="las la-user-friends icon-xl"
                                                                    messageinc="Selecciona el cliente."
                                                                />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <TagInputGray
                                                                    tags={form.correos}
                                                                    onChange={this.tagInputChange}
                                                                    placeholder="CORREO DE CONTACTO"
                                                                    iconclass="far fa-folder-open"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between border-top pt-3">
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard1() }}>
                                                                <span className="svg-icon svg-icon-md mr-2">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                                                </span>Anterior
                                                            </button>
                                                            {/* <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={() => { openWizard3(); if (showModal) { this.openModalCP(); } }}>Siguiente
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Right-2.svg')} />
                                                                </span>
                                                            </button> */}
                                                             <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'wizard-2-content') }} >Editar
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* <div id="wizard-3-content" data-wizard-type="step-content">
                                                        <div className="form-group row form-group-marginless">
                                                            <div className="col-md-4">
                                                                <InputNumberGray
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={1}
                                                                    requirevalidation={0}
                                                                    formeditado={formeditado}
                                                                    name="cp"
                                                                    onChange={this.onChange}
                                                                    value={form.cp}
                                                                    type="text"
                                                                    placeholder="CÓDIGO POSTAL"
                                                                    iconclass={"far fa-envelope"}
                                                                    maxLength="5"
                                                                    messageinc="Ingresa el código postal."
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <InputGray
                                                                    letterCase={true}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={1}
                                                                    requirevalidation={0}
                                                                    withformgroup={0}
                                                                    formeditado={formeditado}
                                                                    value={form.estado}
                                                                    onChange={this.onChange}
                                                                    name="estado"
                                                                    type="text"
                                                                    placeholder="ESTADO"
                                                                    iconclass={"fas fa-map-marked-alt"}
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <InputGray
                                                                    letterCase={false}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={0}
                                                                    requirevalidation={0}
                                                                    withformgroup={0}
                                                                    formeditado={formeditado}
                                                                    value={form.municipio}
                                                                    onChange={this.onChange}
                                                                    name="municipio"
                                                                    type="text"
                                                                    placeholder="MUNICIPIO/DELEGACIÓN"
                                                                    iconclass={"fas fa-map-marker-alt"}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="separator separator-dashed mt-1 mb-2"></div>
                                                        <div className="form-group row form-group-marginless">
                                                            <div className="col-md-4">
                                                                <InputGray
                                                                    letterCase={true}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={1}
                                                                    requirevalidation={0}
                                                                    withformgroup={0}
                                                                    formeditado={formeditado}
                                                                    value={form.colonia}
                                                                    onChange={this.onChange}
                                                                    name="colonia"
                                                                    type="text"
                                                                    placeholder="COLONIA"
                                                                    iconclass={"fas fa-map-pin"}
                                                                />
                                                            </div>
                                                            <div className="col-md-8">
                                                                <InputGray
                                                                    letterCase={true}
                                                                    withtaglabel={1}
                                                                    withtextlabel={1}
                                                                    withplaceholder={1}
                                                                    withicon={1}
                                                                    requirevalidation={0}
                                                                    withformgroup={0}
                                                                    formeditado={formeditado}
                                                                    name="calle"
                                                                    value={form.calle}
                                                                    onChange={this.onChange}
                                                                    type="text"
                                                                    placeholder="CALLE Y NÚMERO"
                                                                    iconclass={"fas fa-map-signs"}
                                                                    messageinc="Ingresa la calle y número."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between border-top pt-3">
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-light-primary2 font-weight-bold" onClick={() => { openWizard2() }}>
                                                                <span className="svg-icon svg-icon-md mr-2">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Left-2.svg')} />
                                                                </span>Anterior
                                                            </button>
                                                            <button type="button" className="btn btn-sm d-flex place-items-center btn-primary2 font-weight-bold" onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'wizard-3-content') }} >Editar
                                                                <span className="svg-icon svg-icon-md ml-2 mr-0">
                                                                    <SVG src={toAbsoluteUrl('/images/svg/Sending.svg')} />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div> */}
                                                </Form>
                                            </div>
                                        </div>
                                        :navInfo === 'contratar' ? 
                                        <Form id="form-contratar" onSubmit={ (e) => { e.preventDefault(); validateAlert(this.sendFormContratar, e, 'form-contratar') }} >
                                            <Row className="mx-auto justify-content-center">
                                                <Col md="6" className="text-center">
                                                    <div className="col-form-label mb-3 p-0 font-weight-bolder text-dark-60">Periodo inicio - final</div>
                                                    <RangeCalendar
                                                        onChange={this.onChangeRangeContratar}
                                                        start={formContratar.fechaInicio}
                                                        end={formContratar.fechaFin}
                                                    />
                                                </Col>
                                                <Col md="5" className="align-self-center">
                                                    <div className="form-group row form-group-marginless">
                                                        <div className="col-md-12">
                                                            <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                                                withformgroup = { 1 } requirevalidation = { 1 } formeditado = { formeditado }
                                                                thousandseparator = { true } placeholder = "Costo con IVA" value = { formContratar.costo }
                                                                name = "costo" onChange = { this.onChangeContratar } iconclass = "las la-coins" />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <FixedMultiOptionsGray requirevalidation = { 1 } placeholder = "SELECCIONA LA FASE"
                                                                options = { stateOptions.fases } defaultvalue = { formContratar.fases }
                                                                onChange = { this.updateSelectContratar } iconclass = "las la-pencil-ruler icon-xl"
                                                                messageinc = "Selecciona la fase." name = "fases" />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                                                withformgroup = { 1 } requirevalidation = { 1 } formeditado = { formeditado }
                                                                placeholder = 'NOMBRE' value = { formContratar.nombre } name = 'nombre'
                                                                onChange = { this.onChangeContratar } iconclass="far fa-folder-open"
                                                                messageinc="Ingresa el nombre del proyecto." />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div className="card-footer p-0 mt-8 pt-3">
                                                <div className="row mx-0">
                                                    <div className="col-md-12 text-right p-0">
                                                        <Button icon='' className="btn btn-light-primary2" text="CONTRATAR" onClick = { (e) => { e.preventDefault(); validateAlert(this.sendFormContratar, e, 'form-contratar') } } />
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                        :<></>    
                            }
                            </Card.Body>
                        </Card>
                        : <></>
                }
                <Modal size="lg" show = { modal.cp } title = 'ACTUALIZAR DATOS DEL CLIENTE' handleClose = { this.handleCloseCP } >
                    <ClienteCPModal
                        sendForm = { this.sendForm }
                        form = { form }
                        onChange = { this.onChange }
                        options = { options }
                    />
                </Modal>
            </>
        );
    }
}

export default EditProyectoForm;