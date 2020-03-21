import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV, INGRESOS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, B, Subtitle } from '../../components/texts'
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'

class Ingresos extends Component{

    state = {
        modal: false,
        modalDelete: false,
        empresas: [],
        clientes: [],
        areas: [],
        subareas: [],
        cuentas: [],
        tiposImpuestos: [],
        tiposPagos: [],
        estatusCompras: [],
        ingresos: [],
        ingreso:'',
        form:{
            empresa: '',
            area: '',
            subarea: '',
            cliente: '',
            cuenta: '',
            rfc: '',
            descripcion: '',
            numeroFactura: '',
            monto: '',
            comision: '',
            tipoImpuesto: 0,
            tipoPago: 0,
            estatusCompra: 0,
            factura: 'Sin factura',
            fecha: new Date()
        }
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'empresa':
                case 'area':
                case 'subarea':
                case 'cliente':
                case 'cuenta':
                case 'rfc':
                case 'descripcion':
                case 'numeroFactura':
                case 'monto':
                case 'comision':
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
                default:
                    break;
            }
        })
        this.setState({
            ... this.state,
            form
        })
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
        this.getIngresos()
    }

    setSelectOptions = (arreglo, value, name) => {
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

    setOptions = (arreglo, name) => {
        let aux = []
        arreglo.map((element) => {
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    setCuentas = (cuentas) => {
        let aux = []
        cuentas.map( (element) => {
            aux.push({ name: element['nombre'], value: element['id'].toString() } )
        })
        this.setState({
            ... this.state,
            cuentas: aux
        })
    }
    setSubareas = (subareas) => {
        let aux = []
        subareas.map( (element) => {
            aux.push({ name: element['nombre'], value: element['id'].toString() } )
        })
        this.setState({
            ... this.state,
            subareas: aux
        })
    }
    setIngresos = ingresos => {
        let aux = []
        ingresos.map( (ingreso) => {
            aux.push(
                {
                    actions: this.setActions(ingreso),
                    cuenta: this.setCuentaTable(ingreso.cuenta),
                    cliente: this.setTextTable(ingreso.cliente.empresa),
                    factura: this.setFacturaTable(ingreso),
                    monto: this.setMoneyTable(ingreso.monto),
                    comision: this.setTextTable(ingreso.comision + ' %'),
                    impuesto: this.setTextTable(ingreso.tipo_impuesto.tipo),
                    tipoPago: this.setTextTable(ingreso.tipo_pago.tipo),
                    descripcion: this.setTextTable(ingreso.descripcion),
                    area: this.setTextTable(ingreso.subarea.area.nombre),
                    subarea: this.setTextTable(ingreso.subarea.nombre),
                    estatusCompra: this.setTextTable(ingreso.estatus_compra.estatus),
                    total: this.setMoneyTable(ingreso.total),
                    fecha: this.setDateTable(ingreso.created_at)
                }
            )
        })
        return aux
    }

    setActions = ingreso => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" /* onClick={(e) => this.openModalEdit(e)(cuenta)} */  text='' icon={faEdit} 
                        color="transparent" />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" 
                         onClick={(e) => this.openModalDelete(e)(ingreso) } 
                        text='' icon={faTrash} color="red" />
                </div>
            </>
        )
    }

    setCuentaTable = (cuenta) => {
        return(
            <div>
                <Small className = "mr-1" >
                    <B color = "gold">
                        Empresa: 
                    </B>
                </Small>
                <Small>
                    {cuenta.empresa.name}
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
        if(ingreso.factura)
            return(
                <div>
                    <Small className = "mr-1" >
                        <B color = "gold">
                            RFC: 
                        </B>
                    </Small>
                    <Small>
                        {ingreso.rfc}
                    </Small>
                    <br />
                    <Small className = "mr-2" >
                        <B color = "gold">
                            # de factura: 
                        </B>
                    </Small>
                    <Small>
                        {ingreso.numero_factura}
                    </Small>
                </div>
            )
        else
            return(
                <Small>
                    No requiere factura
                </Small>
            )
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

    onChange = e => {
        const { form } = this.state
        const { value, name } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
        console.log(name, value, 'Ingresos on change')
    }

    onSubmit = e => {
        e.preventDefault()
        this.addIngresos()
    }

    openModal = () => {
        this.clearForm()
        this.setState({
            modal: true
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.clearForm()
        this.setState({
            modal: !modal
        })
    }

    openModalDelete = e => ingreso =>{
        this.setState({
            ... this.state,
            ingreso: ingreso,
            modalDelete: true
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

    safeDelete = (e) => () => {
        e.preventDefault();
        this.deleteIngreso();
    }

    async getIngresos(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { clientes, areas, empresas, tiposImpuestos, tiposPagos, estatusCompras, ingresos } = response.data
                this.setState({
                    ... this.state,
                    areas: this.setSelectOptions(areas, 'id', 'nombre'),
                    clientes: this.setSelectOptions(clientes, 'id', 'empresa'),
                    empresas: this.setSelectOptions(empresas, 'id', 'name'),
                    tiposImpuestos: this.setOptions( tiposImpuestos, 'tipo' ),
                    tiposPagos: this.setOptions( tiposPagos, 'tipo' ),
                    estatusCompras: this.setOptions( estatusCompras, 'estatus' ),
                    ingresos: this.setIngresos(ingresos)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async addIngresos(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'ingresos', form,  { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async deleteIngreso(){
        const { access_token } = this.props.authUser
        const { ingreso } = this.state
        await axios.delete(URL_DEV + 'ingresos/' + ingreso.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ingresos } = response.data
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    ingreso: '',
                    ingresos: this.setIngresos(ingresos)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render(){
        const { modal, modalDelete, ingresos, empresas, cuentas, clientes, areas, subareas, tiposImpuestos, tiposPagos, estatusCompras, form } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <DataTable columns = { INGRESOS_COLUMNS } data = { ingresos } />
                <Modal show = { modal } handleClose = { this.handleClose }>
                    <IngresosForm title = "Agregar un ingreso" empresas = { empresas } cuentas = { cuentas } clientes = { clientes } 
                        areas = { areas } subareas = { subareas } form = { form } onChange = {this.onChange} setCuentas = { this.setCuentas }
                        setSubareas = { this.setSubareas } tiposImpuestos = { tiposImpuestos }
                        tiposPagos = { tiposPagos } estatusCompras = { estatusCompras } onSubmit = { this.onSubmit } />
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