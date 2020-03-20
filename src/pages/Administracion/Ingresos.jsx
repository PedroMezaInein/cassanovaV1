import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal } from '../../components/singles'
import { Button } from '../../components/form-components'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { IngresosForm } from '../../components/forms'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import swal from 'sweetalert'

class Ingresos extends Component{

    state = {
        modal: false,
        empresas: [],
        clientes: [],
        areas: [],
        subareas: [],
        cuentas: [],
        tiposImpuestos: [],
        tiposPagos: [],
        estatusCompras: [],
        form:{
            empresa: '',
            area: '',
            subarea: '',
            cliente: '',
            cuenta: '',
            tipoImpuesto: 0,
            tipoPago: 0,
            estatusCompra: 0
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

    openModal = () => {
        this.setState({
            modal: true
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal
        })
    }

    async getIngresos(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'ingresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { clientes, areas, empresas, tiposImpuestos, tiposPagos, estatusCompras } = response.data
                this.setState({
                    ... this.state,
                    areas: this.setSelectOptions(areas, 'id', 'nombre'),
                    clientes: this.setSelectOptions(clientes, 'id', 'empresa'),
                    empresas: this.setSelectOptions(empresas, 'id', 'name'),
                    tiposImpuestos: this.setOptions( tiposImpuestos, 'tipo' ),
                    tiposPagos: this.setOptions( tiposPagos, 'tipo' ),
                    estatusCompras: this.setOptions( estatusCompras, 'estatus' )
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
        const { modal, empresas, cuentas, clientes, areas, subareas, tiposImpuestos, tiposPagos, estatusCompras, form } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>
                <Modal show = { modal } handleClose = { this.handleClose }>
                    <IngresosForm title = "Agregar un ingreso" empresas = { empresas } cuentas = { cuentas } clientes = { clientes } 
                        areas = { areas } subareas = { subareas } form = { form } onChange = {this.onChange} setCuentas = { this.setCuentas }
                        setSubareas = { this.setSubareas } tiposImpuestos = { tiposImpuestos }
                        tiposPagos = { tiposPagos } estatusCompras = { estatusCompras }/>
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