import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { EgresosForm as Formulario } from '../../../components/forms'
import NewTable from '../../../components/tables/NewTable'
 

class EgresosForm extends Component{

    state = {
        title: 'Nuevo egreso',
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            tiposPagos:[],
            tiposImpuestos:[],
            estatusCompras:[],
            proveedores: [],
        },form:{
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
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history } = this.props
        
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo Egreso'
                })
        }
        if(!egresos)
            history.push('/')
        this.getEgresosAxios()
    }

    //ASYNC
    async getEgresosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'egresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores, empresas, areas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                this.setState({
                    ... this.state,
                    options
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
        const { form, title, options } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                    {/* <Formulario title={title} form={form} onChange={this.onChange} sendFactura = { () => {this.readFactura() }}
                        onChangeFile = {this.onChangeFile} onChangeAdjunto = {this.onChangeAdjunto} clearAdjunto = {this.clearAdjunto} clearFile = {this.clearFile} 
                        options={options} setCuentas = { this.setCuentas } setSubareas = { this.setSubareas } onSubmit = {this.onSubmit}/> */}
                <NewTable headers = {['Proyecto', 'Proveedor', 'Cuenta','Factura','Monto','Comisión','Impuesto','Total','Tipo de pago','Descripción','Área','Sub-Área','Estatus compra','Adjuntos','Fecha','Opciones']} 

                    data = {
                        [
                            [
                                'Test3','GALT ASSET MANAGEMENT S.A.P.I. DE C.V.','Empresa:INEIN Cuenta:Afirme Omar  # de cuenta:AACA951213SQ1-2','Con factura','$18,750	','$1,000','IVA','$22,750','TOTAL','Testing factura','ACABADOS','EQUIPOS','COMPLETO','Pago Presupuesto','20/05/2020','1'
                            ],
                            [
                                'Test3','GALT ASSET MANAGEMENT S.A.P.I. DE C.V.','Empresa:INEIN Cuenta:Afirme Omar  # de cuenta:AACA951213SQ1-2','Con factura','$100,000','$1,000','IVA','$117,000','AVANCE','Nuevo test','ACCESORIOS','MANO DE OBRA','COMPLETO','Pago Presupuesto','20/05/2020','1'
                            ],
                        ]
                    }/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EgresosForm);