import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, GOLD, INGRESOS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle } from '../../components/texts'
import { FileInput } from '../../components/form-components'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Ingresos extends Component{

    state = {
        ingresos: [],
        title: 'Nuevo ingreso',
        ingreso: '',
        modal: false,
        modalDelete: false,
        modalFile: false,
        clientes: [],
        form:{
            factura: 'Sin factura',
            
            rfc: '',
            cliente: '',
            empresa: '',
            cuenta: '',
            area:'',
            subarea: '',
            total: '',
            descripcion: '',
            facturaObject: '',

            fileFactura: {
                value: '',
                adjuntos: [],
            },

            tipoPago: 0,
            tipoImpuesto: 0,
            estatusCompra: 0,
            
            fecha: new Date(),
            
            presupuesto:{
                name: '',
                file: '',
                value: ''
            },
            pago:{
                name: '',
                file: '',
                value: ''
            },
        },
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            tiposPagos:[],
            tiposImpuestos:[],
            estatusCompras:[],
            clientes: [],
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const ingresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!ingresos)
            history.push('/')
        this.getIngresosAxios()
    }

    // TABLA
    setIngresos = ingresos => {
        let aux = []
        ingresos.map( (ingreso) => {
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    cuenta: this.setCuentaTable(ingreso.cuenta, ingreso.empresa),
                    cliente: this.setTextTable(ingreso.cliente.nombre),
                    factura: this.setFacturaTable(ingreso),
                    monto: this.setMoneyTable(ingreso.monto),
                    impuesto: this.setTextTable( ingreso.tipo_impuesto ? ingreso.tipo_impuesto.tipo : 'Sin definir'),
                    tipoPago: this.setTextTable(ingreso.tipo_pago.tipo),
                    descripcion: this.setTextTable(ingreso.descripcion),
                    area: this.setTextTable(ingreso.subarea.area.nombre),
                    subarea: this.setTextTable(ingreso.subarea.nombre),
                    estatusCompra: this.setTextTable(ingreso.estatus_compra.estatus),
                    total: this.setMoneyTable(ingreso.total),
                    adjuntos: this.setAdjuntosTable(ingreso),
                    fecha: this.setDateTable(ingreso.created_at)
                }
            )
        })
        return aux
    }

    setActions= ingreso => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(ingreso) } text='' icon={faEdit} color="transparent" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(ingreso) } text='' icon={faTrash} color="red" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalFile(e)(ingreso) } text='' icon={faFileArchive} color="transparent" />
                </div>
            </>
        )
    }

    setAdjuntosTable = ingreso => {
        
        return(
            <ul>
                {
                    ingreso.pago === null && ingreso.presupuesto === null ?
                        <li>
                            <Small>
                                Sin adjuntos
                            </Small>
                        </li>
                    : ''
                }
                {
                    ingreso.pago !== null ?
                        <li>
                            <a href={ingreso.pago.url} target="_blank">
                                <Small>
                                    Pago
                                </Small>
                            </a>
                        </li>
                    : ''
                }
                {
                    ingreso.presupuesto !== null ?
                        <li>
                            <a href={ingreso.presupuesto.url} target="_blank">
                                <Small>
                                    Presupuesto
                                </Small>
                            </a>
                        </li>
                    : ''
                }
            </ul>
        )
    }
    
    setCuentaTable = (cuenta, empresa) => {
        return(
            <div>
                <Small className = "mr-1" >
                    <B color = "gold">
                        Empresa: 
                    </B>
                </Small>
                <Small>
                    {empresa.name}
                </Small>
                <br />
                <Small className = "mr-1" >
                    <B color = "gold">
                        Cuenta: 
                    </B>
                </Small>
                <Small>
                    {cuenta.nombre}
                </Small>
                <br />
                <Small className = "mr-2" >
                    <B color = "gold">
                        # de cuenta: 
                    </B>
                </Small>
                <Small>
                    {cuenta.numero}
                </Small>
            </div>
        )
    }

    setTextTable = text => {
        return(
            <Small>
                {text}
            </Small>
        )
    }

    setFacturaTable = ingreso => {
        if(ingreso.factura){
            return(
                <Small>
                    {
                        ingreso.facturas ? 
                            ingreso.facturas.xml
                            && <a href={ingreso.facturas.xml.url} target="_blank">
                                <Small>
                                    <FontAwesomeIcon color = { GOLD } icon = { faFileAlt } className="mr-2" />
                                    Factura.xml
                                    <br/>
                                </Small>
                                </a>
                            : ''
                    }
                    {
                        ingreso.facturas ? 
                            ingreso.facturas.pdf
                            && <a href={ingreso.facturas.pdf.url} target="_blank">
                                <Small>
                                    <FontAwesomeIcon color = { GOLD } icon = { faFileAlt } className="mr-2" />
                                    Factura.pdf
                                </Small>
                                <br />
                            </a>
                            : ''
                    }
                </Small>
            )
        }
        else{
            return(
                <Small>
                    Sin factura
                </Small>
            )
        }
    }

    setMoneyTable = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }
    setDateTable = date => {
        return(
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'rfc':
                case 'cliente':
                case 'empresa':
                case 'cuenta':
                case 'area':
                case 'subarea':
                case 'total':
                case 'descripcion':
                case 'facturaObject':
                    form[element] = ''
                    break;
                case 'tipoImpuesto':
                case 'tipoPago':
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'presupuesto':
                case 'pago':
                    form[element].file = ''
                    form[element].name = ''
                    form[element].value = ''
                    break;
                case 'fileFactura':
                    form[element].value = ''
                    form[element].adjuntos = []
                    break;
                default:
                    break;
            }
        })
        return form;
    }

    openModal = () => {
        this.setState({
            ... this.state,
            title: 'Nuevo ingreso',
            modal: true,
            form: this.clearForm()
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            ingreso: ''
        })
    }

    openModalDelete = e => (ingreso) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            ingreso: ingreso
        })
    }

    openModalEdit = e => (ingreso) => {
        const { form, options } = this.state
        if(ingreso.factura){
            form.factura = 'Con factura'
            if(ingreso.facturas){
                form['rfc'] = ingreso.facturas.rfc_emisor
                form['cliente'] = ingreso.facturas.nombre_emisor
                form['empresa'] = ingreso.facturas.nombre_receptor
                form['fecha'] =  new Date(ingreso.facturas.fecha)
                form['total'] = ingreso.facturas.subtotal
                form['facturaObject'] = ingreso.facturas
                let aux = []
                if(ingreso.facturas.xml){
                    aux.push({
                        name: 'factura.xml',
                        file: '',
                        key: aux.length + 1
                    })
                }
                if(ingreso.facturas.pdf){
                    aux.push({
                        name: 'factura.pdf',
                        file: '',
                        key: aux.length + 1
                    })
                }
                form['fileFactura'] = {
                    value: '',
                    adjuntos: aux
                }
            }else{
                if(ingreso.empresa){
                    form.empresa = ingreso.empresa.name
                }
                if(ingreso.cliente){
                    form.cliente = ingreso.cliente.id.toString()
                }
                form.total = ingreso.monto
            }
        }else{
            form.factura = 'Sin factura'
            if(ingreso.empresa){
                form.empresa = ingreso.empresa.name
            }
            if(ingreso.cliente){
                form.cliente = ingreso.cliente.id.toString()
            }
            form.total = ingreso.monto
        }
        if(ingreso.tipo_pago){
            form.tipoPago = ingreso.tipo_pago.id.toString()
        }
        if(ingreso.tipo_impuesto){
            form.tipoImpuesto = ingreso.tipo_impuesto.id.toString()
        }
        if(ingreso.estatus_compra){
            form.estatusCompra = ingreso.estatus_compra.id.toString()
        }
        if(ingreso.subarea){
            if(ingreso.subarea.area){
                form.area = ingreso.subarea.area.id.toString()
                options['subareas'] = this.setOptions(ingreso.subarea.area.subareas, 'nombre', 'id')
            }
            form.subarea = ingreso.subarea.id.toString()
        }
        if(ingreso.empresa){
            if(ingreso.empresa.cuentas){
                options['cuentas'] = this.setOptions(ingreso.empresa.cuentas, 'nombre', 'id')
            }
        }
        if(ingreso.cuenta){
            form.cuenta = ingreso.cuenta.id.toString()
        }
        if(ingreso.pago){
            form.pago.name = ingreso.pago.name
        }
        if(ingreso.presupuesto){
            form.presupuesto.name = ingreso.presupuesto.name
        }
        if(ingreso.descripcion){
            form.descripcion = ingreso.descripcion
        }
        if(ingreso.created_at){
            form.fecha = new Date(ingreso.created_at)
        }
        this.setState({
            ... this.state,
            title: 'Editar ingreso',
            modal: true,
            ingreso: ingreso,
            options,
            form
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            ingreso: ''
        })
    }

    openModalFile = e => ingreso => {
        const { form } = this.state
        if(ingreso.pago){
            form['pago']['name'] = ingreso.pago.name
        }
        if(ingreso.presupuesto){
            form['presupuesto']['name'] = ingreso.presupuesto.name
        }
        this.setState({
            ... this.state,
            modalFile: true,
            ingreso: ingreso,
            form
        })
    }

    handleCloseFile = () => {
        const { modalFile } = this.state
        this.setState({
            ... this.state,
            modalFile: !modalFile,
            ingreso: '',
            form: this.clearForm()
        })
    }

    onChange = e => {
        const {name, value} = e.target
        const {form} = this.state
        form[name] = value
        if(name === 'factura' && value === 'Sin factura'){
            form['facturaObject'] = ''
            form['fileFactura'].value = ''
            form['fileFactura'].adjuntos = []
        }
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeFile = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    key: counter
                }
            )
        }
        form[name].value = value
        form[name].adjuntos = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        form[name].file = files[0]
        form[name].value = value
        form[name].name = files[0].name
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const{ title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar ingreso'){
            this.editIngresosAxios()
        }else
            this.addIngresosAxios()
    }

    onSubmitFile = e => {
        e.preventDefault()
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        this.updateIngresosFile()
    }

    safeDelete = (e) => () => {
        e.preventDefault();
        this.deleteIngresoAxios();
    }

    clearFile = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form[name].adjuntos.length; counter ++){
            if(counter !== key){
                aux.push(form[name].adjuntos[counter])
            }
        }
        if(aux.length === 0){
            form['facturaObject'] = ''
        }
        form[name].adjuntos = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearAdjunto = name => {
        const { form } = this.state
        form[name].file = ''
        form[name].name = ''
        form[name].value = ''
        this.setState({
            ... this.state,
            form
        })
    }

    setFactura = factura => {
        const {form} = this.state
        form['rfc'] = factura.rfc_emisor[0]
        form['cliente'] = factura.nombre_emisor[0]
        form['empresa'] = factura.nombre_receptor[0]
        form['fecha'] =  new Date(factura.fecha[0])
        form['total'] = factura.subtotal[0]
        form['facturaObject'] = factura
        this.setState({
            ... this.state,
            form
        })
    }

    setCuentas = cuentas => {
        const { options  } = this.state
        options['cuentas'] = this.setOptions(cuentas, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    setSubareas = subareas => {
        const { options  } = this.state
        options['subareas'] = this.setOptions(subareas, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    setOptions = ( arreglo, name, value ) => {
        let aux = []
        arreglo.map( (element) => {
            if( element.hasOwnProperty('cuentas') ){
                aux.push({ name: element[name], value: element[value].toString(), cuentas: element['cuentas'] } )
            }else
            {
                if(element.hasOwnProperty('subareas')){
                    aux.push({ name: element[name], value: element[value].toString(), subareas: element['subareas'] } )
                }else
                    aux.push({ name: element[name], value: element[value].toString() } )
            }
        })
        return aux
    }

    setSelectOptions = (arreglo, name) => {
        let aux = []
        arreglo.map((element) => {
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    async getIngresosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { clientes, ingresos, empresas, areas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options } = this.state
                options['empresas'] = this.setOptions(empresas, 'name', 'name')
                options['areas'] = this.setOptions(areas, 'nombre', 'id')
                options['clientes'] = this.setOptions(clientes, 'nombre', 'id')
                options['tiposPagos'] = this.setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = this.setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = this.setSelectOptions( estatusCompras, 'estatus' )
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            console.log('Catch error', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async addIngresosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map( (element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                if(element === 'presupuesto' || element === 'pago')
                {
                    data.append(element.toString() +'_file' , form[element].file)
                    data.append(element.toString() +'_name' , form[element].name)
                    data.append(element.toString() +'_value' , form[element].value)
                }
                else{
                    if(element === 'fileFactura'){
                        for (var i = 0; i < form.fileFactura.adjuntos.length; i++) {
                            data.append('filesName[]', form.fileFactura.adjuntos[i].name)
                            data.append('files[]', form.fileFactura.adjuntos[i].file)
                        }
                    }else
                        data.append(element, form[element])
                }
            }
        })
        await axios.post(URL_DEV + 'ingresos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingresos } = response.data
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async editIngresosAxios(){
        const { access_token } = this.props.authUser
        const { form, ingreso } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map( (element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                if(element === 'presupuesto' || element === 'pago')
                {
                    data.append(element.toString() +'_file' , form[element].file)
                    data.append(element.toString() +'_name' , form[element].name)
                    data.append(element.toString() +'_value' , form[element].value)
                }
                else{
                    if(element === 'fileFactura'){
                        for (var i = 0; i < form.fileFactura.adjuntos.length; i++) {
                            data.append('filesName[]', form.fileFactura.adjuntos[i].name)
                            data.append('files[]', form.fileFactura.adjuntos[i].file)
                        }
                    }else
                        data.append(element, form[element])
                }
            }
        })
        await axios.post(URL_DEV + 'ingresos/' + ingreso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingresos } = response.data
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async updateIngresosFile(){
        const { access_token } = this.props.authUser
        const { form,ingreso } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map( (element) => {
            if(element === 'presupuesto' || element === 'pago')
            {
                data.append(element.toString() +'_file' , form[element].file)
                data.append(element.toString() +'_name' , form[element].name)
                data.append(element.toString() +'_value' , form[element].value)
            }
        })
        await axios.post(URL_DEV + 'ingresos/files/' +ingreso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingresos } = response.data
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    modalFile: false,
                    ingreso: '',
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Los archivos fueron adjuntados con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async deleteIngresoAxios(){
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingresos } = response.data
                this.setState({
                    ... this.state,
                    ingresos: this.setIngresos(ingresos),
                    modalDelete: false,
                    ingreso: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async readFactura(){

        const { access_token } = this.props.authUser
        const {form} = this.state
        
        const data = new FormData()
        
        for (var i = 0; i < form.fileFactura.adjuntos.length; i++) {
            data.append('filesName[]', form.fileFactura.adjuntos[i].name)
            data.append('files[]', form.fileFactura.adjuntos[i].file)
        }

        swal({
            title: '¡Un momento!',
            text: 'Se está enviando tu mensaje.',
            buttons: false
        })

        await axios.post(URL_DEV + 'facturas/read/ingresos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { factura, empresa, clientes } = response.data
                const { options } = this.state
                options['cuentas'] = this.setOptions(empresa.cuentas, 'nombre', 'id')
                options['clientes'] = this.setOptions(clientes, 'nombre', 'id')
                this.setFactura(factura)
                swal.close();
                this.setState({
                    ... this.state,
                    options
                })
                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            console.log('Catch error', error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    

    render(){
        const { ingresos, form, options,modal, modalDelete, modalFile, title } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = {INGRESOS_COLUMNS} data= {ingresos}/>
                <Modal show = {modal} handleClose = {this.handleClose}>
                    <IngresosForm title={title} form={form} onChange={this.onChange} sendFactura = { () => {this.readFactura() }}
                        onChangeFile = {this.onChangeFile} onChangeAdjunto = {this.onChangeAdjunto} clearAdjunto = {this.clearAdjunto} clearFile = {this.clearFile} 
                        options={options} setCuentas = { this.setCuentas } setSubareas = { this.setSubareas } onSubmit = {this.onSubmit}/>
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el ingreso?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleCloseDelete } text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick = { (e) => { this.safeDelete(e)() }} text="Continuar" color="red"/>
                    </div>
                </Modal>
                <Modal show = {modalFile} handleClose = {this.handleCloseFile}>
                    <Subtitle className="my-3 text-center" color ="gold">
                        Edita o agrega adjuntos
                    </Subtitle>
                    <Form onSubmit = {this.onSubmitFile}>
                        <div className="row mx-0">
                            <div className="col-md-6">
                                <FileInput 
                                    onChangeAdjunto = { this.onChangeAdjunto } 
                                    placeholder = "Presupuesto"
                                    value = {form.presupuesto.value}
                                    name = "presupuesto"
                                    id = "presupuesto"
                                    accept = "application/pdf, image/*" 
                                    files = { form.presupuesto.name === '' ? [] : [ {name: form.presupuesto.name, key: 1}] }
                                    deleteAdjunto = { (e) => { this.clearAdjunto('presupuesto') }}
                                    />
                            </div>
                            <div className="col-md-6">
                                <FileInput 
                                    onChangeAdjunto = { this.onChangeAdjunto } 
                                    placeholder = "Pago"
                                    value = {form.pago.value}
                                    name = "pago"
                                    id = "pago"
                                    accept = "application/pdf, image/*" 
                                    files = { form.pago.name === '' ? [] : [ {name: form.pago.name, key: 1}] }
                                    deleteAdjunto = { (e) => { this.clearAdjunto('pago') }}
                                    />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                        </div>
                    </Form>
                </Modal>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Ingresos);