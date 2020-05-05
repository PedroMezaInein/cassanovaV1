import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, VENTAS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { VentasForm } from '../../components/forms'
import { DataTable } from '../../components/tables'
import Subtitle from '../../components/texts/Subtitle'

class Ventas extends Component{

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nueva venta',
        ventas: [],
        venta: '',
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            clientes: [],
            proyectos: []
        },
        form:{
            factura: 'Sin factura',
            facturaObject: '',
            rfc: '',
            total: '',
            cliente: '',
            proyecto: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
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
        this.getVentasAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva venta',
            form: this.clearForm()
        })
    }

    openModalEdit = (venta) => {
        const { form, options } = this.state
        form.factura = venta.factura ? 'Con factura' : 'Sin factura'
        if(venta.cliente){
            form.cliente = venta.cliente.id.toString()
            options['proyectos'] = setOptions(venta.cliente.proyectos, 'nombre', 'id')
            form.proyecto = venta.proyecto.id.toString()
        }
        if(venta.empresa){
            form.empresa = venta.empresa.id.toString()
            options['cuentas'] = setOptions(venta.empresa.cuentas, 'nombre', 'id')
            form.cuenta = venta.cuenta.id.toString()
        }
        if(venta.subarea){
            form.area = venta.subarea.area.id.toString()
            options['subareas'] = setOptions(venta.subarea.area.subareas, 'nombre', 'id')
            form.subarea = venta.subarea.id.toString()
        }
        
        form.tipoPago = venta.tipo_pago ? venta.tipo_pago.id : 0
        form.tipoImpuesto = venta.tipo_impuesto ? venta.tipo_impuesto.id : 0
        form.estatusCompra = venta.estatus_compra ? venta.estatus_compra.id : 0
        form.total = venta.monto
        form.fecha = new Date(venta.created_at)
        form.descripcion = venta.descripcion
        if(venta.pago){
            form.adjuntos.pago.files = [{
                name: venta.pago.name, url: venta.pago.url
            }]
        }
        if(venta.presupuesto){
            form.adjuntos.presupuesto.files = [{
                name: venta.presupuesto.name, url: venta.presupuesto.url
            }]
        }
        if(venta.facturas){
            form.facturaObject = venta.facturas
            let aux = []
            if(venta.facturas.xml){
                aux.push({
                    name: 'factura.xml', url: venta.facturas.xml.url
                })
            }
            if(venta.facturas.pdf){
                aux.push({
                    name: 'factura.pdf', url: venta.facturas.pdf.url
                })
            }
            form.adjuntos.factura.files = aux
            form.rfc = venta.facturas.rfc_emisor
            form.cliente = venta.cliente.nombre
            form.empresa = venta.empresa.name
        }
        this.setState({
            ... this.state,
            modal: true,
            venta: venta,
            form,
            options,
            title: 'Editar venta'
        })
    }

    openModalDelete = (venta) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            venta: venta
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            form: this.clearForm(),
            title: 'Nueva venta'
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            venta: ''
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
        if(title === 'Editar venta')
            this.editVentaAxios()
        else
            this.addVentaAxios()
    }

    // Setters
    setOptions = (name, array) => {
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

    setVentas = ventas => {
        let aux = []
        ventas.map( (venta) => {
            aux.push(
                {
                    actions: this.setActions(venta),
                    cuenta: setArrayTable(
                        [
                            {name:'Empresa', text:venta.empresa.name},
                            {name:'Cuenta', text:venta.cuenta.nombre},
                            {name:'# de cuenta', text:venta.cuenta.numero}
                        ]
                    ),
                    proyecto: setTextTable(venta.proyecto.nombre),
                    cliente: setTextTable(venta.cliente.nombre),
                    factura: setFacturaTable(venta),
                    monto: setMoneyTable(venta.monto),
                    impuesto: setTextTable( venta.tipo_impuesto ? venta.tipo_impuesto.tipo : 'Sin definir'),
                    tipoPago: setTextTable(venta.tipo_pago.tipo),
                    descripcion: setTextTable(venta.descripcion),
                    area: setTextTable(venta.subarea.area.nombre),
                    subarea: setTextTable(venta.subarea.nombre),
                    estatusCompra: setTextTable(venta.estatus_compra.estatus),
                    total: setMoneyTable(venta.total),
                    adjuntos: setAdjuntosList([
                        venta.pago ? {name: 'Pago', url: venta.pago.url} : '',
                        venta.presupuesto ? {name: 'Presupuesto', url: venta.presupuesto.url} : '',
                    ]),
                    fecha: setDateTable(venta.created_at)
                }
            )
        })
        return aux
    }

    setActions = venta => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(venta)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(venta)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
            </>
        )
    }

    // Async
    async getVentasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ventas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, clientes, ventas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                this.setState({
                    ... this.state,
                    options,
                    form: this.clearForm(),
                    ventas: this.setVentas(ventas)
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

    async addVentaAxios(){

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
        
        await axios.post(URL_DEV + 'ventas', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { ventas } = response.data
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    ventas: this.setVentas(ventas)
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

    async editVentaAxios(){

        const { access_token } = this.props.authUser
        const { form, venta } = this.state
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
        
        await axios.post(URL_DEV + 'ventas/update/' + venta.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { ventas } = response.data
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    modal: false,
                    ventas: this.setVentas(ventas)
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

    async deleteVentaAxios(){

        const { access_token } = this.props.authUser
        const { venta } = this.state
        await axios.delete(URL_DEV + 'ventas/' + venta.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { ventas } = response.data

                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    ventas: this.setVentas(ventas),
                    modalDelete: false,
                    venta: ''
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

        await axios.post(URL_DEV + 'facturas/read/ingresos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { factura, empresa, clientes, cliente } = response.data
                const { options, form } = this.state
                options['cuentas'] = setOptions(empresa.cuentas, 'nombre', 'id')
                options['clientes'] = setOptions(clientes, 'nombre', 'id')
                options['proyectos'] = setOptions(cliente.proyectos, 'nombre', 'id')
                form['rfc'] = factura.rfc_emisor[0]
                form['cliente'] = factura.nombre_emisor[0]
                form['empresa'] = factura.nombre_receptor[0]
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

        const { modal, modalDelete, title, options, form, ventas } = this.state

        return(
            <Layout active={'proyectos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = { VENTAS_COLUMNS } data= { ventas }/>
                <Modal show = {modal} handleClose = { this.handleClose } >
                    <VentasForm title = { title } options = {options} form = {form} setOptions = {this.setOptions} 
                        onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto } clearFiles = {this.clearFiles}
                        sendFactura = { () => { this.sendFactura() } } onSubmit = { this.onSubmit } />
                </Modal>
                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteVentaAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la venta?
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

export default connect(mapStateToProps, mapDispatchToProps)(Ventas);