import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, PROVEEDORES_COLUMNS, EGRESOS_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, createAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { Button, FileInput } from '../../../components/form-components'
import { Modal, ModalDelete } from '../../../components/singles'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { EgresosForm, FacturaForm } from '../../../components/forms'
import { DataTable, FacturaTable } from '../../../components/tables'
import { Subtitle } from '../../../components/texts'
import { Form, ProgressBar } from 'react-bootstrap'
import NewTable from '../../../components/tables/NewTable'

class egresos extends Component{

    state = {
        egresos: [],
        title: 'Nuevo egreso',
        egreso: '',
        modalDelete: false,
        modalFacturas: false,
        facturas: [],
        porcentaje: 0,
        data: {
            proveedores: [],
            empresas: [],
            egresos: []
        },
        form:{
            formaPago: '',
            metodoPago: '',
            estatusFactura: '',
            facturaObject: '',
            adjuntos:{
                factura:{
                    value: '',
                    placeholder: 'Factura',
                    files: []
                }
            }
        },
        options:{
            formasPagos: [],
            metodosPagos: [],
            estatusFacturas: []
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!egresos)
            history.push('/')
        this.getEgresosAxios()
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'adjuntos':
                    form[element] = {
                        factura:{
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    onChangeAdjunto = e => {
        const { form, data, options } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            if(name === 'factura')
            {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if(extension === 'xml'){
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => { 
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        let obj = {
                            rfc_receptor: receptor.attributes.Rfc ? receptor.attributes.Rfc : '',
                            nombre_receptor: receptor.attributes.Nombre ? receptor.attributes.Nombre : '',
                            uso_cfdi: receptor.attributes.UsoCFDI ? receptor.attributes.UsoCFDI : '',
                            rfc_emisor: emisor.attributes.Rfc ? emisor.attributes.Rfc : '',
                            nombre_emisor: emisor.attributes.Nombre ? emisor.attributes.Nombre : '',
                            regimen_fiscal: emisor.attributes.RegimenFiscal ? emisor.attributes.RegimenFiscal : '',
                            lugar_expedicion: xml.attributes.LugarExpedicion ? xml.attributes.LugarExpedicion : '',
                            fecha: xml.attributes.Fecha ? new Date(xml.attributes.Fecha) : '',
                            metodo_pago: xml.attributes.MetodoPago ? xml.attributes.MetodoPago : '',
                            tipo_de_comprobante: xml.attributes.TipoDeComprobante ? xml.attributes.TipoDeComprobante : '',
                            total: xml.attributes.Total ? xml.attributes.Total : '',
                            subtotal: xml.attributes.SubTotal ? xml.attributes.SubTotal : '',
                            tipo_cambio: xml.attributes.TipoCambio ? xml.attributes.TipoCambio : '',
                            moneda: xml.attributes.Moneda ? xml.attributes.Moneda : '',
                            numero_certificado: xml.attributes.NoCertificado ? xml.attributes.NoCertificado : '',
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        if(obj.numero_certificado === ''){
                            let NoCertificado = text.search('NoCertificado="')
                            if(NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado+15, NoCertificado + 35)
                        }
                        let aux = ''
                        if(obj.subtotal === ''){
                            let Subtotal = text.search('SubTotal="')
                            if(Subtotal)
                                Subtotal = text.substring(Subtotal+10)
                                aux = Subtotal.search('"')
                                Subtotal = Subtotal.substring(0,aux)
                                obj.subtotal = Subtotal
                        }
                        if(obj.fecha === ''){
                            let Fecha = text.search('Fecha="')
                            if(Fecha)
                                Fecha = text.substring(Fecha+7)
                                aux = Fecha.search('"')
                                Fecha = Fecha.substring(0,aux)
                                obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        data.empresas.find(function(element, index) {
                            if(element.rfc === obj.rfc_receptor){
                                auxEmpresa = element
                            }
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function(element, index) {
                            if(element.razon_social === obj.nombre_emisor){
                                auxProveedor = element
                            }
                        });
                        if(auxEmpresa){
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        }else{
                            errorAlert('No existe la empresa')
                        }
                        if(auxProveedor){
                            form.proveedor = auxProveedor.id.toString()
                        }else{
                            createAlert('No existe el proveedor', '¿Lo quieres crear?', () => this.addProveedorAxios(obj))
                        }
                        if(auxEmpresa && auxProveedor){
                            swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_emisor
                        this.setState({
                            ... this.state,
                            options,
                            form
                        })
                    }
                    reader.readAsText(files[counter])
                }
            }
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
            if(name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    // TABLA
    setEgresos = egresos => {
        let aux = []
        egresos.map( (egreso) => {
            aux.push(
                {
                    actions: this.setActions(egreso),
                    cuenta: renderToString(setArrayTable(
                        [
                            {name:'Empresa', text: egreso.empresa ? egreso.empresa.name : ''},
                            {name:'Cuenta', text: egreso.cuenta ? egreso.cuenta.nombre : ''},
                            {name:'No. de cuenta', text: egreso.cuenta ? egreso.cuenta.numero : ''}
                        ]
                    )),
                    cliente: renderToString(setTextTable(egreso.proveedor ? egreso.proveedor.nombre : '')),
                    factura: renderToString(setTextTable(egreso.facturas.length ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(egreso.monto)),
                    comision: renderToString(setMoneyTable(egreso.comision)),
                    total: renderToString(setMoneyTable(egreso.comision)),
                    impuesto: renderToString(setTextTable( egreso.tipo_impuesto ? egreso.tipo_impuesto.tipo : 'Sin definir')),
                    tipoPago: renderToString(setTextTable( egreso.tipo_pago ? egreso.tipo_pago.tipo: '')),
                    descripcion: renderToString(setTextTable( egreso.descripcion)),
                    area: renderToString(setTextTable( egreso.subarea ? egreso.subarea.area.nombre : '' )),
                    subarea: renderToString(setTextTable( egreso.subarea ? egreso.subarea.nombre : '' )),
                    estatusCompra: renderToString(setTextTable( egreso.estatus_compra ? egreso.estatus_compra.estatus : '' )),
                    adjuntos: renderToString(setAdjuntosList([
                        egreso.pago ? {name: 'Pago', url: egreso.pago.url} : '',
                        egreso.presupuesto ? {name: 'Presupuesto', url: egreso.presupuesto.url} : '',
                    ])),
                    fecha: renderToString(setDateTable(egreso.created_at)),
                    id: egreso.id
                }
            )
        })
        return aux
    }

    setActions= egreso => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                }
        )
        
        if(egreso.factura)
            {
                aux.push({
                text: 'Facturas',
                btnclass: 'primary',
                iconclass: 'flaticon2-medical-records',
                action: 'facturas',
                tooltip: {id:'taxes', text:'Facturas'},
            })
        }
        return aux
            
        /* return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.changePageEdit(e)(egreso) } text='' icon={faEdit} color="transparent"
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(egreso) } text='' icon={faTrash} color="red"
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                {
                    egreso.factura ?
                        <div className="d-flex align-items-center flex-column flex-md-row my-1">
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalFacturas(egreso)} } text='' icon={faReceipt} color="transparent" 
                                tooltip={{id:'taxes', text:'Facturas'}} />
                        </div>
                    : ''
                }
            </>
        ) */
        return(
            [
                {
                    text: 'Editar',
                    action: 'edit',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'}
                },
                {
                    text: 'Eliminar',
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'}
                }
            ]
        )
    }

    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/egresos/add'
        });
    }

    changePageEdit = (egreso) => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/egresos/edit',
            state: { egreso: egreso}
        });
    }

    openModalDelete = egreso => {
        this.setState({
            ... this.state,
            modalDelete: true,
            egreso: egreso
        })
    }

    openModalFacturas = egreso => {
        let { porcentaje } = this.state
        porcentaje = 0
        egreso.facturas.map((factura)=>{
            porcentaje = porcentaje + factura.total
        })
        porcentaje = porcentaje * 100 / (egreso.total - egreso.comision)
        porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
        this.setState({
            ... this.state,
            modalFacturas: true,
            egreso: egreso,
            facturas: egreso.facturas,
            porcentaje,
            form: this.clearForm()
        })
    }

    handleCloseFacturas = () => {
        this.setState({
            ... this.state,
            modalFacturas: false,
            venta: '',
            facturas: [],
            porcentaje: 0,
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

    deleteFactura = id => {
        waitAlert()
        this.deleteFacturaAxios(id)
    }

    async addProveedorAxios(obj){

        const { access_token } = this.props.authUser

        const data = new FormData();

        data.append('nombre', obj.nombre_receptor)
        data.append('razonSocial', obj.nombre_receptor)
        data.append('rfc', obj.rfc_receptor)

        await axios.post(URL_DEV + 'proveedores', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                this.getEgresosAxios()
                
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
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getEgresosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'egresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { egresos, proveedores, empresas } = response.data
                data.proveedores = proveedores
                data.empresas = empresas
                data.egresos = egresos
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteEgresoAxios(){
        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(URL_DEV + 'egresos/' + egreso.id, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { egresos } = response.data
                const { data } = this.state
                data.egresos = egresos
                this.setState({
                    ... this.state,
                    egresos: this.setEgresos(egresos),
                    modalDelete: false,
                    egreso: '',
                    data
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    // Factura
    async sendFacturaAxios(){

        const { access_token } = this.props.authUser
        const { form, egreso } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== '' && element === 'factura'){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        data.append('id', egreso.id )
        
        await axios.post(URL_DEV + 'egresos/factura', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {

                const { egreso, egresos } = response.data
                let { porcentaje, data } = this.state
                porcentaje = 0
                egreso.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (egreso.total - egreso.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    egreso: egreso,
                    facturas: egreso.facturas,
                    porcentaje,
                    egresos: this.setEgresos(egresos)
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
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    async deleteFacturaAxios(id){

        const { access_token } = this.props.authUser
        const { egreso } = this.state
        await axios.delete(URL_DEV + 'egresos/' + egreso.id + '/facturas/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const { egreso, egresos } = response.data
                let { porcentaje, data } = this.state
                porcentaje = 0
                egreso.facturas.map((factura)=>{
                    porcentaje = porcentaje + factura.total
                })
                porcentaje = porcentaje * 100 / (egreso.total - egreso.comision)
                porcentaje = parseFloat(Math.round(porcentaje * 100) / 100).toFixed(2);
                data.egresos = egresos
                this.setState({
                    ... this.state,
                    form: this.clearForm(),
                    egreso: egreso,
                    egresos: this.setEgresos(egresos),
                    facturas: egreso.facturas,
                    data,
                    porcentaje
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
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { egresos, modalDelete, modalFacturas, egreso, facturas, porcentaje, form, data } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                {/* <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.changePageAdd() } } text='' icon = { faPlus } color="green"
                        tooltip={{id:'add', text:'Nuevo'}} />
                </div> */}
                {/* <DataTable columns = {EGRESOS_COLUMNS} data= {egresos}/> */}
                <NewTable columns = { EGRESOS_COLUMNS } data = { egresos } 
                            title = 'Egresos' subtitle = 'Listado de egresos'
                            url = '/administracion/egresos/add'
                            mostrar_boton={true}
                            abrir_modal={false}
                            mostrar_acciones={true}
                            actions = {{
                                'edit': {function: this.changePageEdit},
                                'delete': {function: this.openModalDelete},
                                'facturas': {function: this.openModalFacturas}
                            }}
                            elements = { data.egresos }
                            idTable = 'egresos'
                            />
                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteEgresoAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el egreso?
                    </Subtitle>
                </ModalDelete>

                <Modal show = { modalFacturas } handleClose = { this.handleCloseFacturas }>
                    <Subtitle className="text-center" color = 'gold' >
                        Facturas
                    </Subtitle>
                        <div className="px-3 my-2">
                                        <ProgressBar animated label={`${porcentaje}%`} 
                                            variant = { porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'} 
                                            now = {porcentaje} />
                                    </div>
                                    <Form onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}}>
                                        <div className="row mx-0">
                                            <div className="col-md-6 px-2">
                                                
                                                <FileInput 
                                                    onChangeAdjunto = { this.onChangeAdjunto } 
                                                    placeholder = { form['adjuntos']['factura']['placeholder'] }
                                                    value = { form['adjuntos']['factura']['value'] }
                                                    name = { 'factura' } 
                                                    id = { 'factura' }
                                                    accept = "text/xml, application/pdf" 
                                                    files = { form['adjuntos']['factura']['files'] }
                                                    deleteAdjunto = { this.clearFiles } multiple/>
                                            </div>
                                            {
                                                form.adjuntos.factura.files.length ?
                                                    <div className="col-md-6 px-2 align-items-center d-flex">
                                                        <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                                                    </div>
                                                : ''
                                            }
                                        </div>
                                    </Form>
                    
                    <FacturaTable deleteFactura = { this.deleteFactura } facturas = { facturas } />
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

export default connect(mapStateToProps, mapDispatchToProps)(egresos);