import React, { Component } from 'react'
import { connect } from 'react-redux'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert,  errorAlert} from '../../../functions/alert'
import { CalendarDay, InputGray, FileInput, SelectSearchGray, InputMoneyGray, Button, RangeCalendar } from '../../form-components'
import { setOptions } from '../../../functions/setters'
import { apiOptions, catchErrors, apiPutForm, apiGet } from '../../../functions/api'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setFormHeader } from '../../../functions/routers'
import Swal from 'sweetalert2'
import { Form, Col } from 'react-bootstrap'
import InputPassword from '../../form-components/InputPassword'

class RepseFormulario extends Component{

    state = {
        formeditado:0,
        form: {
            fechas: { start: null, end: null },
            nombre_repse: '',  
            registro: '', 
            nombre_patronal: '',   
            r_obra: '',  
            proyecto: '',
            repse: '',  
            patronal: '',  
            siroc: '',  
            empresa: '',  
            fecha: new Date(),
            fechaInicio: new Date(),
            fechaFin: new Date(),
            monto: 0,
            captura: '',
            folio: '',
            plataforma: '',
            url: '',
            usuarios: '',
            password:'',
            tabla: '',
            nominasAdmin: [{
                usuario: '',
            }],
            adjuntos: {
                repse: {
                    value: '',
                    placeholder: 'Adjunto repse',
                    files: []
                },
                siroc: {
                    value: '',
                    placeholder: 'Adjunto siroc',
                    files: []
                },
                colaborador: {
                    value: '',
                    placeholder: 'Adjunto colaboradores de obra',
                    files: []
                },
                patronal: {
                    value: '',
                    placeholder: 'Adjunto patronal',
                    files: []
                },
                nomina: {
                    value: '',
                    placeholder: 'Adjunto recibos de nomina',
                    files: []
                },
                sipare: {
                    value: '',
                    placeholder: 'Adjunto sipare',
                    files: []
                },
                claves: {
                    value: '',
                    placeholder: 'Adjunto claves y accesos',
                    files: []
                },
                isn: {
                    value: '',
                    placeholder: 'Adjunto ISN',
                    files: []
                },
            }
        },
        options: {
            empresas: [], repse: [], patronal: [],  proyectos: [], siroc: [], nominasAdmin: [], usuarios: []
        },
        data: {  empresas: [] ,usuarios: []  },
    }

    updateSelect = (value, name) => {
        const { form, options } = this.state
        form[name] = value
        let item = null
        switch(name){
           
            case 'empresa':
                item = options.empresas.find((elemento) => {
                    return elemento.value === value
                })
                if(item){
                    form.cuenta = ''
                    options.cuentas = setOptions(item.cuentas, 'nombre', 'id')
                }            
                break;
            default: break;
        }
        this.setState({ ...this.state, form, options })
    }

    componentDidMount = () => {
        this.getOptions()
        const { type,  dato } = this.props
        this.setState({
            ...this.state,
            formeditado: type === 'add' ? 0 : 1
        })
        if(dato){
            this.getVenta()
        }
    }

    componentDidUpdate = (nextProps) => {
        
        if(this.props.dato !== nextProps.dato){
            if(this.props.dato){
                this.getVenta()
            }
        }
    }

    /** funcion para enviar los datos al formulario */
    getVenta = async() => {
        waitAlert()
        const { dato, at ,type} = this.props
        apiGet(`repse/${dato.id+'_'+dato.tabla}`, at).then(
            (response) => {
                const { form, options } = this.state

                if(type === 'edit_Repse'){
                    form.empresa = response.data.repse.empresa_id.toString()
                    form.nombre_repse = response.data.repse.name
                    form.fecha = new Date( response.data.repse.fecha_alta )
                }
                if(type === 'edit_Registro Patronal'){
                    form.empresa = response.data.patronal.empresa_id.toString()
                    form.nombre_patronal = response.data.patronal.name_patronal
                    form.folio = response.data.patronal.folio
                    form.fecha = new Date( response.data.patronal.fecha_alta )
                }

                if(type === 'edit_Siroc'){
                    form.proyecto = response.data.siroc.proyecto_id.toString()
                    form.repse = response.data.siroc.repse_id.toString()
                    form.patronal = response.data.siroc.patronal_id.toString()
                    form.r_obra = response.data.siroc.no_obra
                    form.folio = response.data.siroc.folio
                    form.fecha = new Date( response.data.siroc.fecha_alta )
                }

                if(type === 'edit_Recibos nomina'){
                    form.empresa = response.data.nomina.empresa_id.toString()
                    form.nombre_repse = response.data.nomina.name
                    form.fechas.start = new Date( response.data.nomina.fecha_inicio )
                    form.fechas.end = new Date( response.data.nomina.fecha_fin )
                }
                if(type === 'edit_Sipare'){
                    form.empresa = response.data.sipare.empresa_id.toString()
                    form.monto = response.data.sipare.monto
                    form.captura = response.data.sipare.linea_captura
                    form.fechas.start = new Date( response.data.sipare.fecha_inicio )
                    form.fechas.end = new Date( response.data.sipare.fecha_fin )
                }
                if(type === 'edit_Accesos claves'){
                    form.plataforma = response.data.claves.plataforma
                    form.url = response.data.claves.url
                    form.usuario = response.data.claves.usuario
                    form.password = response.data.claves.password
                }
                if(type === 'edit_Isn'){
                    form.empresa = response.data.isn.empresa_id.toString()
                    form.monto = response.data.isn.monto
                    form.captura = response.data.isn.linea_captura
                    form.fechas.start  = new Date( response.data.isn.fecha_inicio )
                    form.fechas.end = new Date( response.data.isn.fecha_fin )
                }
                
                Swal.close()

                this.setState({
                    ...this.state,
                    form,
                    options
                })
            }, ( error ) => { printResponseErrorAlert(error) }
        ).catch( (error ) => { catchErrors(error) })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    getOptions = async() => {
        const { at } = this.props
        apiOptions(`v2/proyectos/ventas`, at).then(
            (response) => {
                const { empresas, repse, patronal, proyectos, siroc,usuarios  } = response.data
                const { options, data ,form} = this.state
                // console.log(response)
                options.empresas = setOptions(empresas, 'name', 'id')
                options['repse'] = setOptions(repse, 'name', 'id')
                options['patronal'] = setOptions(patronal, 'name_patronal', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options['siroc'] = setOptions(siroc, 'no_obra', 'id')
                options.usuarios = setOptions(usuarios, 'nombre', 'id')
                data.empresas = empresas
                data.proyectos = proyectos
                data.usuarios  = usuarios
                form.nominasAdmin = data.usuarios
                options.nominasAdmin = data.usuarios

                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch( (error) => { catchErrors(error) })
    }
    
    setOptions = key => {
        // const {usuarios } = this.props
        // const { options, form } = this.state
        // let array = []
        // if (form.nominasAdmin[key] === '')
        // console.log('es vacios')
        //     return options.usuarios
        // let aux = options.nominasAdmin.find((element) => {
        //     return element.id.toString() === form.nominasAdmin[key]
        // })
        // options.usuarios.forEach((element) => {
        //     array.push(element)
        // })
        // if (aux)
        //     array.push({ 'label': aux.nombre, 'name': aux.nombre, 'value': aux.id.toString() })
        // return array
    }

     onChangeAdjunto = e => {
        const { name, value, files } = e.target
        const { form } = this.state
        form.adjuntos[name].value = value
        form.adjuntos[name].files = []
        files.forEach((file, index) => {
            form.adjuntos[name].files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        this.setState({ ...this.state, form })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        if(name === 'xml'){
            form.facturaObject = {}
            form.factura = ''
        }
        form.adjuntos[name].files.splice(key, 1)
        if(form.adjuntos[name].files.length === 0){
            form.adjuntos[name].value = ''
        }
        this.setState({ ...this.state, form })
    }

    onSubmit = () => {
        const { type } = this.props
        waitAlert()
        switch(type){
            case 'repse':
            case 'patronal':
            case 'siroc':
            case 'Nomina':
            case 'Sipare':
            case 'claves':
            case 'isn':
            case 'Colaborador':
            case 'convert':
                this.addVenta()
            break;
            case 'edit':
            case 'edit_Repse':
            case 'edit_Registro Patronal':
            case 'edit_Recibos nomina':
            case 'edit_Sipare':
            case 'edit_Siroc':
            case 'edit_Accesos claves':
            case 'edit_Isn':
            case 'edit_colaborador':
                this.editVentaAxios()
            break;
            default: break;
        }
    }

    addVenta = () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        const { type } = this.props

        if(type === 'repse'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })
            let fecha = form.fecha;
            let result = fecha.toISOString();    
            data.append('fecha_alta', result)
            axios.post(`${URL_DEV}repse`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Repse fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })    
        }

        if(type === 'patronal'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })
            let fecha = form.fecha;
            let result = fecha.toISOString();
    
            data.append('fecha_alta', result)
            axios.post(`${URL_DEV}patronal`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Registro patronal fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }

        if(type === 'siroc'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })
            let fecha = form.fecha;
            let result = fecha.toISOString();
    
            data.append('fecha_alta', result)
            axios.post(`${URL_DEV}siroc`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Siroc fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }

        if(type === 'Nomina'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })

            let fechas = form.fechas.start;
            let result = fechas.toISOString();    
            data.append('fechaInicio', result)
            let fecha = form.fechas.end;;
            let resul = fecha.toISOString();    
            data.append('fechaFin', resul)
            
            axios.post(`${URL_DEV}recibos_nomina`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Nomina fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }

        if(type === 'Sipare'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })

            let fechas = form.fechas.start;
            let result = fechas.toISOString();    
            data.append('fechaInicio', result)

            let fecha = form.fechas.end;;
            let resul = fecha.toISOString();    
            data.append('fechaFin', resul)

            axios.post(`${URL_DEV}sipare`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Sipare fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }

        if(type === 'claves'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })
            axios.post(`${URL_DEV}accesos_claves`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Acceso y claves fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
    
        }

        if(type === 'isn'){
            aux.forEach((element) => {
                switch (element) {               
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })
            aux = Object.keys(form.adjuntos)
            aux.forEach((element) => {
                if (form.adjuntos[element].value !== '') {
                    form.adjuntos[element].files.forEach((file) => {
                        data.append(`files_name_${element}[]`, file.name)
                        data.append(`files_${element}[]`, file.file)
                    })
                    data.append('adjuntos[]', element)
                }
            })

            let fechas = form.fechas.start;
            let result = fechas.toISOString();    
            data.append('fechaInicio', result)

            let fecha = form.fechas.end;;
            let resul = fecha.toISOString();    
            data.append('fechaFin', resul)

            axios.post(`${URL_DEV}isn`, data, { headers: setFormHeader(access_token) }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert(response.data.message !== undefined ? response.data.message : 'ISN fue agregado con éxito.')
                    history.push({ pathname: '/rh/modulo' });
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }

    }

    editVentaAxios = async() => {
        const { dato, at,refresh } = this.props
        const { form } = this.state
        const { type } = this.props
        form.tabla = type
        if(type === 'edit_Recibos nomina' || type === 'edit_Sipare' || type === 'edit_Isn' ){
            form.fechaInicio = form.fechas.start
            form.fechaFin = form.fechas.end
        }
        apiPutForm(`repse/edit/${dato.id}`, form, at).then(
            (response) => {
                const { history } = this.props
                doneAlert(`Editado con éxito`, () => { refresh() })
                history.push(`/rh/modulo`)

                this.setState({ ...this.state, form })

            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    deleteRowNominaAdmin = async(nominaAdmin, key) => {
        
            let aux = []
            const { form, options } = this.state
            form.nominasAdmin.forEach((element, index) => {
                if(index !== key)
                    aux.push(element)
            })
            if (aux.length) { form.nominasAdmin = aux } 
            else { form.nominasAdmin = [{ usuario: '', nominImss: '', restanteNomina: '', extras: '' }] }
            options.usuarios = this.updateOptionsUsuarios(form.nominasAdmin)
            this.setState({...this.state, form, options})
        
    }

    updateOptionsUsuarios = (formulario) => {
        const { data, options } = this.state
        let aux = []
        let aux2 = []
        options.usuarios = setOptions(data.usuarios, 'nombre', 'id')
        formulario.forEach((element) => {
            aux.push(element.usuario)
        })
        options.usuarios.forEach((element) => {
            if(!aux.includes(element.value))
                aux2.push(element)
        })
        return aux2
    }

    render(){
        const { form, options, formeditado} = this.state
        const { type} = this.props

        return(
              <Form id = 'form-repse'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-repse') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="12" className="align-self-center">                                            
                            {
                                type === 'repse' ||  type ==='edit_Repse'?

                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-4  text-center align-self-center">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bold text-dark-60">FECHA DE ALTA</label>
                                            </div>
                                            <CalendarDay date = { form.fecha } onChange = { this.onChange } name = 'fecha' requirevalidation = { 1 } />
                                        </div>
                                        
                                    </div>
                                     <div className="col-md-8">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-5">
                                                <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                                    formeditado = { formeditado }/>
                                            </div>
                                            <div className="col-md-5">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='nombre_repse' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='NUMERO DE REPSE'onChange={this.onChange} 
                                                    value={form.nombre_repse} messageinc="Ingresa el nombre de repse." />
                                            </div>                                
                                        
                                        </div>

                                {  type !=='edit_Repse' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.repse.placeholder} value = { form.adjuntos.repse.value } name = 'repse' id = 'repse'
                                                files = { form.adjuntos.repse.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                        :<></>
                                }
                                    </div>
                                </div>
                                : <></>
                            }
                                                       
                            {
                                type === 'patronal' || type === 'edit_Registro Patronal' ?
                                
                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-4 text-center align-self-center">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bold text-dark-60">FECHA DE ALTA</label>
                                            </div>
                                            <CalendarDay date = { form.fecha } onChange = { this.onChange } name = 'fecha' requirevalidation = { 1 } />
                                        </div>
                                        
                                    </div>
                                     <div className="col-md-8">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-5">
                                                <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                                    onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                                    formeditado = { formeditado }/>
                                            </div>
                                            <div className="col-md-5">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='nombre_patronal' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='NUMERO DE REGISTRO PATRONAL'onChange={this.onChange} 
                                                    value={form.nombre_patronal} messageinc="Ingresa el numero de registro patronal." />
                                            </div>  
                                            <div className="col-md-5">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='folio' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='Folio'onChange={this.onChange} 
                                                    value={form.folio} messageinc="Ingresa el folio" />
                                            </div>                                   
                                        
                                        </div>
                                {   type !== 'edit_Registro Patronal' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.patronal.placeholder} value = { form.adjuntos.patronal.value } name = 'patronal' id = 'patronal'
                                                files = { form.adjuntos.patronal.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                       : <></>
                                }
                                    </div>
                                </div>
                                : <></>
                            }

                            {
                                type === 'siroc'  || type === 'edit_Siroc' ?

                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-4 text-center align-self-center">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                <label className="text-center font-weight-bold text-dark-60">FECHA DE ALTA</label>
                                            </div>
                                            <CalendarDay date = { form.fecha } onChange = { this.onChange } name = 'fecha' requirevalidation = { 1 } />
                                        </div>
                                        
                                    </div>
                                     <div className="col-md-8">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-5">
                                                <SelectSearchGray options = { options.proyectos } placeholder = 'Selecciona el proyecto' value = { form.proyecto } 
                                                    onChange = { (value) => { this.updateSelect(value, 'proyecto') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona el proyecto" 
                                                    formeditado = { formeditado }/>
                                            </div>
                                            <div className="col-md-5">
                                                <SelectSearchGray options = { options.repse } placeholder = 'Selecciona el repse' value = { form.repse } 
                                                    onChange = { (value) => { this.updateSelect(value, 'repse') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona el repse" 
                                                    formeditado = { formeditado }/>
                                              </div>
                                            <div className="col-md-5">
                                                <SelectSearchGray options = { options.patronal } placeholder = 'Selecciona el numero de registro patronal' value = { form.patronal } 
                                                    onChange = { (value) => { this.updateSelect(value, 'patronal') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona el numero de registro patronal" 
                                                    formeditado = { formeditado }/>
                                            </div>
                                            <div className="col-md-5">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='r_obra' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='NUMERO DE REGISTRO OBRA'onChange={this.onChange} 
                                                    value={form.r_obra} messageinc="Ingresa el numero de registro de obra." />
                                            </div>   
                                            
                                            <div className="col-md-5">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='folio' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='Folio'onChange={this.onChange} 
                                                    value={form.folio} messageinc="Ingresa el folio" />
                                            </div>                                
                                        
                                        </div>
                                {   type !== 'edit_Siroc' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.siroc.placeholder} value = { form.adjuntos.siroc.value } name = 'siroc' id = 'siroc'
                                                files = { form.adjuntos.siroc.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                    : <></>
                                }
                                    </div>
                                </div>
                                : <></>
                            }

                            {
                                 type === 'Colaborador'  || type === 'edit_Colaborador' ?

                                        <div className="row form-group-marginless mx-0">
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                                                <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                                    onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                                            </div>     
                                          <div className="col-md-4">
                                                <SelectSearchGray options = { options.siroc } placeholder = 'Selecciona el siroc' value = { form.siroc } 
                                                    onChange = { (value) => { this.updateSelect(value, 'siroc') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona el siroc" 
                                                    formeditado = { formeditado }/>

                                                <SelectSearchGray options = { options.repse } placeholder = 'Selecciona el repse' value = { form.repse } 
                                                    onChange = { (value) => { this.updateSelect(value, 'repse') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                    withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona el repse" 
                                                    formeditado = { formeditado }/>

                                            { type !== 'edit_Siroc' ?
                                                <div className="form-group row form-group-marginless">
                                                    <div className="col-md-6 offset-md-3 text-center">
                                                    <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                        placeholder = {form.adjuntos.colaborador.placeholder} value = { form.adjuntos.colaborador.value } name = 'colaborador' id = 'colaborador'
                                                        files = { form.adjuntos.colaborador.files } deleteAdjunto = { this.clearFiles } multiple
                                                        classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                        classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                                    
                                                    </div>
                                                </div>
                                                : <></>
                                            }
                                        </div>
                                        <div className="separator separator-dashed mt-112 mb-2"></div>

                                    <table className="table table-separate table-responsive-sm table_nominas_obras" id="tabla_obra">
                                        <thead> 
                                         <tr>
                                            <th className='border-bottom-0'></th>
                                            <th rowSpan="3"><div className="mt-2 pb-3">COLABORADOR</div></th>
                                            <th rowSpan="3"><div className="mt-2 pb-3">PUESTO</div></th>

                                         </tr>
                                        </thead>    
                                        <tbody>
                                            {
                                                form.nominasAdmin.map((nominaAdmin, key) => {

                                                    return (
                                                        <tr key={key}>
                                                            <td className='text-center' style={{ minWidth: "60px" }}>
                                                                <Button icon='' onClick={() => { this.deleteRowNominaAdmin(nominaAdmin, key) }}
                                                                    className="btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon="far fa-trash-alt icon-md text-danger" />
                                                            </td>
                                                            <td>
                                                                <InputGray withtaglabel={0} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                                    name='nominaAdmin.usuario' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='Nombre del empleado'onChange={this.onChange} 
                                                                    value={nominaAdmin.nombre}  />
                                                            </td>
                                                            <td>
                                                            <InputGray placeholder = 'Selecciona el empleado' value={nominaAdmin.puesto}
                                                                onChange = { (value) => { this.updateSelect(value, key) } } withtaglabel = { 0 } withtextlabel = { 0 } 
                                                                withicon = { 1 } iconclass = "fas fa-user-tie" 
                                                                customstyle={{ minWidth: "100px" }} customdiv="mb-0"   customclass="form-control-sm text-center" 
                                                                formeditado = { formeditado }/>

                                                            </td>
                                                        </tr>

                                                    )
                                                }) 
                                                
                                            }

                                        </tbody>                                   
                                    </table>
                                </div>
                                         
                                : <></>
                            }

                            {
                                type === 'Nomina' || type ===  'edit_Recibos nomina' ?

                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-3 offset-md-3 text-center align-self-center">
                                            <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                                                <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                                    onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                                            </div>                                                                                   
                                    </div>
                                     <div className="col-md-6">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                    <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                                        onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                        withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                                        formeditado = { formeditado }/>
                                                </div>
                                                           
                                        </div>
                                {   type !==  'edit_Recibos nomina' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.nomina.placeholder} value = { form.adjuntos.nomina.value } name = 'nomina' id = 'nomina'
                                                files = { form.adjuntos.nomina.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                  : <></>
                                }
                                    </div>
                                </div>
                                : <></>
                            }

                            {
                                type === 'Sipare'  || type ===  'edit_Sipare' ?

                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-3 offset-md-1 text-center align-self-center">
                                          <div className="col-md-6 text-center">
                                                <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                                                <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                                    onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                                            </div>
                                        
                                    </div>
                                  
                                     <div className="col-md-6">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                    <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                                        onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                        withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                                        formeditado = { formeditado }/>
                                                </div>
                                                           
                                                <div className="col-md-6">
                                                    <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                                        requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                                        name = "monto" value = { form.monto } onChange = { this.onChange } placeholder = "MONTO" 
                                                        iconclass = 'fas fa-money-check-alt' messageinc = "Incorrecto. ingresa el monto " />
                                                </div>

                                                <div className="col-md-5 offset-md-2">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='captura' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='LINEA DE CAPTURA'onChange={this.onChange} 
                                                    value={form.captura} messageinc="Ingresa la linea de captura." />
                                            </div>  
                                        </div>
                                    {   type !==  'edit_Sipare' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.sipare.placeholder} value = { form.adjuntos.sipare.value } name = 'sipare' id = 'sipare'
                                                files = { form.adjuntos.sipare.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                         : <></>
                                    }
            
                                    </div>
                                </div>
                                : <></>
                            }

                            {
                                type === 'claves'  || type ===  'edit_Accesos claves' ?

                                <div className="form-group row form-group-marginless">   
                                                                           
                                     <div className="col-md-10 offset-md-1">
                                        <div className="form-group row form-group-marginless">
                                              <div className="col-md-6">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='plataforma' iconclass="flaticon2-website" placeholder='NOMBRE DE LA PLATAFORMA'onChange={this.onChange} 
                                                    value={form.plataforma} messageinc="Ingresa el nombre de la plataforma." />   
                                                </div>
                                                <div className="col-md-6">
                                                    <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                        name='url' iconclass="fas fa-share-square" placeholder='LINK DE LA PLATAFORMA'onChange={this.onChange} 
                                                        value={form.url} messageinc="Ingresa el link de la plataforma." />   
                                                </div>

                                                <div className="col-md-6">
                                                    <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                        name='usuario' iconclass="far fa-user icon-md text-dark-50" placeholder='usuario'onChange={this.onChange} 
                                                        value={form.usuario} messageinc="Ingresa el usuario" />   
                                                </div>
                                                <div className="col-md-6">
                                                    <InputPassword withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                        name='password' iconclass="fab fa-diaspora" placeholder='CONTRASEÑA'onChange={this.onChange} 
                                                        value={form.password} messageinc="Ingresa el usuario" />   
                                                </div>

                                        </div>
                                    {   type !==  'edit_Accesos claves' ?

                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-10 offset-md-1 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.claves.placeholder} value = { form.adjuntos.claves.value } name = 'claves' id = 'claves'
                                                files = { form.adjuntos.claves.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                      : <></>
                                    }
                                    </div>
                                </div>
                                : <></>
                            }

                            {
                                type === 'isn'  || type === 'edit_Isn' ?

                                <div className="form-group row form-group-marginless">       
                                    <div className="col-md-3 offset-md-1 text-center align-self-center">
                                        <div className="col-md-6 text-center">
                                            <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                                            <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                                                onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                                        </div>
                                    </div>
                                     <div className="col-md-6">
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6">
                                                    <SelectSearchGray options = { options.empresas } placeholder = 'Selecciona la empresa' value = { form.empresa } 
                                                        onChange = { (value) => { this.updateSelect(value, 'empresa') } } withtaglabel = { 1 } withtextlabel = { 1 } 
                                                        withicon = { 1 } iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" 
                                                        formeditado = { formeditado }/>
                                                </div>
                                                           
                                                <div className="col-md-6">
                                                    <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                                        requirevalidation = { 1 } formeditado = { formeditado } thousandseparator = { true } prefix = '$' 
                                                        name = "monto" value = { form.monto } onChange = { this.onChange } placeholder = "MONTO" 
                                                        iconclass = 'fas fa-money-check-alt' messageinc = "Incorrecto. ingresa el monto " />
                                                </div>

                                                <div className="col-md-5 offset-md-3">
                                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                                    name='captura' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='LINEA DE CAPTURA'onChange={this.onChange} 
                                                    value={form.captura} messageinc="Ingresa la linea de captura." />
                                            </div>  
                                        </div>
                                    {   type !== 'edit_Isn' ?
                                    
                                        <div className="form-group row form-group-marginless">
                                            <div className="col-md-6 text-center">
                                            <FileInput requirevalidation = { 0 } formeditado = { formeditado } onChangeAdjunto = { this.onChangeAdjunto }
                                                placeholder = {form.adjuntos.isn.placeholder} value = { form.adjuntos.isn.value } name = 'isn' id = 'isn'
                                                files = { form.adjuntos.isn.files } deleteAdjunto = { this.clearFiles } multiple
                                                classinput = 'file-input' accept = '*/*'  iconclass='flaticon2-clip-symbol text-primary'
                                                classbtn = 'btn btn-sm btn-light font-weight-bolder mb-0' />
                                            
                                            </div>
                                        </div>
                                        : <></>
                                    }
                                    </div>
                                </div>
                                : <></>
                            }

                    </Col>
                </div>
                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                    <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type = 'submit' text="ENVIAR" />
                </div>
            </Form>
            
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(RepseFormulario);