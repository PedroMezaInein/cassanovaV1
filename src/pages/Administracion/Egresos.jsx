import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive } from '@fortawesome/free-solid-svg-icons'
import { EgresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, GOLD, PROVEEDORES_COLUMNS, EGRESOS_COLUMNS } from '../../constants'
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
        egresos: [],
        egreso: '',
        modal: false,
        modalDelete: false,
        ModalFile: false,
        proveedores: [],
        form:{
            factura: 'Sin factura',
            
            rfc: '',
            proveedor: '',
            empresa: '',
            cuenta: '',
            area:'',
            subarea: '',
            total: '',
            comision: '',
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
            proveedores: [],
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!egresos)
            history.push('/')
        this.getEgresosAxios()
    }

    // TABLA
    setEgresos = egresos => {
        let aux = []
        egresos.map( (egreso) => {
            aux.push(
                {
                    actions: this.setActions(egreso),
                    cuenta: this.setCuentaTable(egreso.cuenta, egreso.empresa),
                    cliente: this.setTextTable(egreso.proveedor.nombre),
                    factura: this.setFacturaTable(egreso),
                    monto: this.setMoneyTable(egreso.monto),
                    impuesto: this.setTextTable( egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir'),
                    tipoPago: this.setTextTable(egreso.tipo_pago.tipo),
                    descripcion: this.setTextTable(egreso.descripcion),
                    area: this.setTextTable(egreso.subarea.area.nombre),
                    subarea: this.setTextTable(egreso.subarea.nombre),
                    estatusCompra: this.setTextTable(egreso.estatus_compra.estatus),
                    total: this.setMoneyTable(egreso.total),
                    comision: this.setMoneyTable(egreso.comision),
                    adjuntos: this.setAdjuntosTable(egreso),
                    fecha: this.setDateTable(egreso.created_at)
                }
            )
        })
        return aux
    }

    setActions= egreso => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(egreso) } text='' icon={faTrash} color="red" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalFile(e)(egreso) } text='' icon={faFileArchive} color="transparent" />
                </div>
            </>
        )
    }

    setAdjuntosTable = egreso => {
        
        return(
            <ul>
                {
                    egreso.pago === null && egreso.presupuesto === null ?
                        <li>
                            <Small>
                                Sin adjuntos
                            </Small>
                        </li>
                    : ''
                }
                {
                    egreso.pago !== null ?
                        <li>
                            <a href={egreso.pago.url} target="_blank">
                                <Small>
                                    Pago
                                </Small>
                            </a>
                        </li>
                    : ''
                }
                {
                    egreso.presupuesto !== null ?
                        <li>
                            <a href={egreso.presupuesto.url} target="_blank">
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

    setFacturaTable = egreso => {
        if(egreso.factura){
            return(
                <Small>
                    {
                        egreso.facturas ? 
                            egreso.facturas.xml
                            && <a href={egreso.facturas.xml.url} target="_blank">
                                <Small>
                                    <FontAwesomeIcon color = { GOLD } icon = { faFileAlt } className="mr-2" />
                                    Factura.xml
                                    <br/>
                                </Small>
                                </a>
                            : ''
                    }
                    {
                        egreso.facturas ? 
                            egreso.facturas.pdf
                            && <a href={egreso.facturas.pdf.url} target="_blank">
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
                case 'proveedor':
                case 'empresa':
                case 'cuenta':
                case 'area':
                case 'subarea':
                case 'total':
                case 'comision':
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
            modal: true,
            form: this.clearForm()
        })
    }

    openModalDelete = e => egreso => {
        this.setState({
            ... this.state,
            modalDelete: true,
            egreso: egreso
        })
    }

    openModalFile = e => egreso => {
        const { form } = this.state
        if(egreso.pago){
            form['pago']['name'] = egreso.pago.name
        }
        if(egreso.presupuesto){
            form['presupuesto']['name'] = egreso.presupuesto.name
        }
        this.setState({
            ... this.state,
            modalFile: true,
            egreso: egreso,
            form
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm()
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            egreso: ''
        })
    }

    handleCloseFile = () => {
        const { modalFile } = this.state
        this.setState({
            ... this.state,
            modalFile: !modalFile,
            egreso: '',
            form: this.clearForm()
        })
    }

    onChange = e => {
        const {name, value} = e.target
        const {form} = this.state
        form[name] = value
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
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        this.addEgresosAxios()
    }

    onSubmitFile = e => {
        e.preventDefault()
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        this.updateEgresosFile()
    }

    safeDelete = e => () => {
        e.preventDefault();
        this.deleteEgresoAxios();
    }

    clearFile = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form[name].adjuntos.length; counter ++){
            if(counter !== key){
                aux.push(form[name].adjuntos[counter])
            }
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
        form['rfc'] = factura.rfc_receptor[0]
        form['proveedor'] = factura.nombre_receptor[0]
        form['empresa'] = factura.serie[0]
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

    async getEgresosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'egresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores, egresos, empresas, areas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options } = this.state
                options['empresas'] = this.setOptions(empresas, 'name', 'name')
                options['areas'] = this.setOptions(areas, 'nombre', 'id')
                options['proveedores'] = this.setOptions(proveedores, 'nombre', 'id')
                options['tiposPagos'] = this.setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = this.setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = this.setSelectOptions( estatusCompras, 'estatus' )
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
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

        await axios.post(URL_DEV + 'facturas/read', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { factura, empresa, proveedores } = response.data
                const { options } = this.state
                options['cuentas'] = this.setOptions(empresa.cuentas, 'nombre', 'id')
                options['proveedores'] = this.setOptions(proveedores, 'nombre', 'id')
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
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

    async addEgresosAxios(){
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
        await axios.post(URL_DEV + 'egresos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { egresos } = response.data
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: 'El egreso fue registrado con éxito',
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
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

    async updateEgresosFile(){
        const { access_token } = this.props.authUser
        const { form,egreso } = this.state
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
        await axios.post(URL_DEV + 'egresos/files/' +egreso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { egresos } = response.data
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
                    modalFile: false,
                    egreso: '',
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: 'Los archivos fueron adjuntados con éxito',
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
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

    async deleteEgresoAxios(){
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(URL_DEV + 'egresos/' + egreso.id, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { egresos } = response.data
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
                    modalDelete: false,
                    egreso: ''
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: 'El egreso fue eliminado con éxito',
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
                        text: 'Ocurrió un error desconocido, intenta de nuevo.' + error.response.data.message,
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

    render(){
        const { egresos, form, options,modal, modalDelete, modalFile } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = {EGRESOS_COLUMNS} data= {egresos}/>
                <Modal show = {modal} handleClose = {this.handleClose}>
                    <EgresosForm title="Nuevo egreso" form={form} onChange={this.onChange} sendFactura = { () => {this.readFactura() }}
                        onChangeFile = {this.onChangeFile} onChangeAdjunto = {this.onChangeAdjunto} clearAdjunto = {this.clearAdjunto} clearFile = {this.clearFile} 
                        options={options} setCuentas = { this.setCuentas } setSubareas = { this.setSubareas } onSubmit = {this.onSubmit}/>
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el egreso?
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