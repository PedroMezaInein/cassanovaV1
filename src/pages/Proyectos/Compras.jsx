import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, COMPRAS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ComprasForm } from '../../components/forms'
import { DataTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'

class Compras extends Component{

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nueva compra',
        compras: [],
        compra: '',
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            clientes: [],
            proyectos: [],
            proveedores: []
        },
        form:{
            factura: 'Sin factura',
            facturaObject: '',
            rfc: '',
            total: '',
            cliente: '',
            proveedor: '',
            proyecto: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            comision: '',
            tipoImpuesto: 0,
            tipoPago: 0,
            estatusCompra: 0,
            fecha: new Date(),
            adjuntos:{
                factura:{
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                pago:{
                    value: '',
                    placeholder: 'Pago',
                    files: []
                },
                presupuesto:{
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
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
        this.getComprasAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva compra',
            form: this.clearForm()
        })
    }

    openModalEdit = (compra) => {
        console.log('Compra - ', compra, ' - ')
        const { form, options } = this.state
        form.factura = compra.factura ? 'Con factura' : 'Sin factura'
        if(compra.proyecto){
            if(compra.proyecto.cliente){
                form.cliente = compra.proyecto.cliente.id.toString()
                options['proyectos'] = setOptions(compra.proyecto.cliente.proyectos, 'nombre', 'id')
                form.proyecto = compra.proyecto.id.toString()
            }
        }
        if(compra.empresa){
            form.empresa = compra.empresa.id.toString()
            options['cuentas'] = setOptions(compra.empresa.cuentas, 'nombre', 'id')
            form.cuenta = compra.cuenta.id.toString()
        }
        if(compra.subarea){
            form.area = compra.subarea.area.id.toString()
            options['subareas'] = setOptions(compra.subarea.area.subareas, 'nombre', 'id')
            form.subarea = compra.subarea.id.toString()
        }
        
        form.tipoPago = compra.tipo_pago ? compra.tipo_pago.id : 0
        form.tipoImpuesto = compra.tipo_impuesto ? compra.tipo_impuesto.id : 0
        form.estatusCompra = compra.estatus_compra ? compra.estatus_compra.id : 0
        form.total = compra.monto
        form.fecha = new Date(compra.created_at)
        form.descripcion = compra.descripcion
        form.comision = compra.comision
        if(compra.proveedor)
            form.proveedor = compra.proveedor.id.toString()
        if(compra.pago){
            form.adjuntos.pago.files = [{
                name: compra.pago.name, url: compra.pago.url
            }]
        }
        if(compra.presupuesto){
            form.adjuntos.presupuesto.files = [{
                name: compra.presupuesto.name, url: compra.presupuesto.url
            }]
        }
        if(compra.facturas){
            form.facturaObject = compra.facturas
            let aux = []
            if(compra.facturas.xml){
                aux.push({
                    name: 'factura.xml', url: compra.facturas.xml.url
                })
            }
            if(compra.facturas.pdf){
                aux.push({
                    name: 'factura.pdf', url: compra.facturas.pdf.url
                })
            }
            form.adjuntos.factura.files = aux
            form.rfc = compra.facturas.rfc_emisor
            form.cliente = compra.proyecto.cliente.nombre
            form.empresa = compra.empresa.name
        }
        this.setState({
            ... this.state,
            modal: true,
            compra: compra,
            form,
            options,
            title: 'Editar compra'
        })
    }

    openModalDelete = (compra) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            compra: compra
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            title: 'Nueva compra'
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            compra: ''
        })
    }

    //Handle change
    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]) ,
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form['adjuntos'][name].files.length; counter ++){
            if(counter !== key){
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if(aux.length < 1){
            form['adjuntos'][name].value = ''    
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'rfc':
                case 'cliente':
                case 'proyecto':
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
                case 'adjuntos':
                    form[element] = {
                        factura:{
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        },
                        pago:{
                            value: '',
                            placeholder: 'Pago',
                            files: []
                        },
                        presupuesto:{
                            value: '',
                            placeholder: 'Presupuesto',
                            files: []
                        }
                    }
                default:
                    break;
            }
        })
        return form;
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar compra')
            this.editCompraAxios()
        else
            this.addCompraAxios()
    }

    // Setters
    setOptions = (name, array) => {
        console.log(name, array, 'set options')
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
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

    setCompras = compras => {
        let aux = []
        compras.map( (compra) => {
            aux.push(
                {
                    actions: this.setActions(compra),
                    cuenta: setArrayTable(
                        [
                            {name:'Empresa', text:compra.empresa.name},
                            {name:'Cuenta', text:compra.cuenta.nombre},
                            {name:'# de cuenta', text:compra.cuenta.numero}
                        ]
                    ),
                    proyecto: setTextTable(compra.proyecto.nombre),
                    proveedor: setTextTable(compra.proveedor.nombre),
                    factura: setFacturaTable(compra),
                    monto: setMoneyTable(compra.monto),
                    comision: setMoneyTable(compra.comision),
                    impuesto: setTextTable( compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir'),
                    tipoPago: setTextTable(compra.tipo_pago.tipo),
                    descripcion: setTextTable(compra.descripcion),
                    area: setTextTable(compra.subarea.area.nombre),
                    subarea: setTextTable(compra.subarea.nombre),
                    estatusCompra: setTextTable(compra.estatus_compra.estatus),
                    total: setMoneyTable(compra.total),
                    adjuntos: setAdjuntosList([
                        compra.pago ? {name: 'Pago', url: compra.pago.url} : '',
                        compra.presupuesto ? {name: 'Presupuesto', url: compra.presupuesto.url} : '',
                    ]),
                    fecha: setDateTable(compra.created_at)
                }
            )
        })
        return aux
    }

    setActions = compra => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(compra)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(compra)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }

    // Async
    async getComprasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'compras', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, clientes, compras, proveedores } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                console.log('-OPTIONS-', options)
                this.setState({
                    ... this.state,
                    options,
                    form: this.clearForm(),
                    compras: this.setCompras(compras)
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addCompraAxios(){

        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'facturaObject':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        
        await axios.post(URL_DEV + 'compras', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { compras } = response.data
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    compras: this.setCompras(compras)
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

    async editCompraAxios(){

        const { access_token } = this.props.authUser
        const { form, compra } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'facturaObject':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'compras/update/' + compra.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { compras } = response.data
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    compras: this.setCompras(compras)
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

    async deleteCompraAxios(){

        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { compras } = response.data

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    compras: this.setCompras(compras),
                    modalDelete: false,
                    compra: ''
                })

                swal({
                    title: '¡Felicidades 🥳!',
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
            console.log('Error', error, 'catch')
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    //Factura
    async sendFactura(){

        const { access_token } = this.props.authUser
        const {form} = this.state
        
        const data = new FormData()
        
        for (var i = 0; i < form.adjuntos.factura.files.length; i++) {
            data.append('filesName[]', form.adjuntos.factura.files[i].name)
            data.append('files[]', form.adjuntos.factura.files[i].file)
        }

        swal({
            title: '¡Un momento!',
            text: 'Se está enviando tu mensaje.',
            buttons: false
        })

        await axios.post(URL_DEV + 'facturas/read', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { factura, empresa, clientes, cliente, proveedores, proveedor } = response.data
                const { options, form } = this.state
                options['cuentas'] = setOptions(empresa.cuentas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'nombre', 'id')
                options['proyectos'] = setOptions(cliente.proyectos, 'nombre', 'id')
                form['cliente'] = cliente.empresa
                form['rfc'] = factura.rfc_receptor[0]
                form['proveedor'] = proveedor.id.toString()
                form['empresa'] = factura.serie[0]
                form['fecha'] =  new Date(factura.fecha[0])
                form['total'] = factura.subtotal[0]
                form['facturaObject'] = factura
                swal.close();
                this.setState({
                    ... this.state,
                    options, form
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

        const { modal, modalDelete, title, options, form, compras } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = { COMPRAS_COLUMNS } data= { compras }/>
                <Modal show = {modal} handleClose = { this.handleClose } >
                    <ComprasForm title = { title } options = {options} form = {form} setOptions = {this.setOptions} 
                        onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = {this.clearFiles}
                        sendFactura = { () => { this.sendFactura() } } onSubmit = { this.onSubmit } />
                </Modal>
                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteCompraAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la compra?
                    </Subtitle>
                </ModalDelete>
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

export default connect(mapStateToProps, mapDispatchToProps)(Compras);