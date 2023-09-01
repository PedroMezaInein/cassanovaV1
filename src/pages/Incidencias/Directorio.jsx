import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { NewTable } from '../../components/NewTables/crm'
import $ from 'jquery'
import { URL_DEV, DIRECTORIO_COLUMN } from '../../constants'
import { setTextTableCenter } from '../../functions/setters'
import { connect } from 'react-redux'

class Directorio extends Component {

    state = {
        idPropsAuth: this.props.authUser.user.tipo.id,
        modal: {
            filters: false,
            externa: false,
            see: false,
            revision: false,
            sugerencia: false,
        },
        form: {
            empleado_id: '',
            namePropio: this.props.authUser.user.name,
            sugerencia: '',
            nameSugerencia: '',
            usuarios_sugerencia_id:'',
            areas_id: '',
            id: '',

        },
        data: [],
        options: {
            departamentos: [],
            subareas: [],
            nombre: [],
        },
        filters: {},

    }
    componentDidMount() {
        this.setTableDirectorio()
    }
    updateSelect = (value, name) => {
        const { form, options, } = this.state
        form[name] = value
        this.setState({ ...this.state, form, options })

    }
    async reloadTableSugerencias() {   
        $('#TeEscuchamos').DataTable().ajax.reload();
    
    }

    setTableDirectorio = (datos) => {
        const { data } = this.state
        let aux = []
        if (datos) {
            datos.map((nombre) => {
                aux.push(
                    {
                        empleado: setTextTableCenter(nombre.empleado ? nombre.empleado.nombre : 'Sin registro'),
                        correo: setTextTableCenter(nombre.email ? nombre.email : 'Sin registro'),
                        telefono: setTextTableCenter(nombre.empleado.telefono_movil ? nombre.empleado.telefono_movil : 'Sin registro'),
                        // telefonocontacto: setTextTableCenter(nombre.empleado.telefono_emergencia ? nombre.empleado.telefono_emergencia : 'Sin registro'),
                        // nocontacto: setTextTableCenter(nombre.empleado.nombre_emergencia ? nombre.empleado.nombre_emergencia : 'Sin registro'),
                        departamento: setTextTableCenter(nombre.empleado.departamentos[0].nombre  ? nombre.empleado.departamentos[0].nombre  : 'Sin registro'),
                    }
                )
                return false
            }

            )
            return aux
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    render() {
        return (
            <Layout active='rh'  {...this.props}>
                <NewTable tableName = 'Directorio' subtitle = 'Listado de Directorio' title = 'Directorio'  mostrar_boton = { true }
                        abrir_modal = { false } columns = { DIRECTORIO_COLUMN }
                        accessToken = { this.props.authUser.access_token } setter = { this.setTableDirectorio }
                        urlRender = { `${URL_DEV}directorio` } 
                    /> 
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Directorio)
