import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, FLUJOS_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setMoneyTable} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { FlujosForm } from '../../components/forms'
import TableForModals from '../../components/tables/TableForModals'

class Flujos extends Component {

    state = {
        form: {
            cuentas: [],
            cuenta: '',
            fechaInicio: new Date,
            fechaFin: new Date
        },
        options: {
            cuentas: []
        },
        data:{
            cuentas: [],
            flujos: []
        },
        flujos: [],
        total: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        this.getFlujosAxios()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAndAdd = (e, arreglo) => {
        const { name, value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        options[arreglo] = aux
        form[arreglo] = auxArray
        this.setState({
            ... this.state,
            form,
            options
        })
    }

    deleteOption = (option, arreglo) => {
        const { form, options } = this.state
        let aux = []
        form[arreglo].map((element, key) => {
            if (option.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                options[arreglo].push(element)
            }
        })
        form[arreglo] = aux
        this.setState({
            ... this.state,
            options,
            form
        })
    }

    arraySuma = (array, name) => {
        let aux = 0
        array.map( (element) => {
            aux = aux + element[name];
        })
        return aux
    }

    traspasosSuma = (array) => {
        let aux = 0
        array.map( (element) => {
            aux = aux + (element.traspasos_destino_count - element.traspasos_origen_count);
        })
        return aux
    }

    setFlujos = flujos => {
        let aux = []
        if(flujos){
            aux.push({
                ingresos: renderToString(setMoneyTable(this.arraySuma(flujos, 'ingresos_count'))),
                egresos: renderToString(setMoneyTable(this.arraySuma(flujos, 'egresos_count'))),
                ventas: renderToString(setMoneyTable(this.arraySuma(flujos, 'ventas_count'))),
                compras: renderToString(setMoneyTable(this.arraySuma(flujos, 'compras_count'))),
                traspasos: renderToString(setMoneyTable(this.traspasosSuma(flujos))),
                total: renderToString(
                    setMoneyTable(
                        this.arraySuma(flujos, 'ingresos_count') +
                        this.arraySuma(flujos, 'ventas_count') -
                        this.arraySuma(flujos, 'egresos_count') -
                        this.arraySuma(flujos, 'compras_count') +
                        this.traspasosSuma(flujos)
                    )
                ),
                cuenta: renderToString(setTextTable('Total')),
                id: 0
            })   
        }
        flujos.map((flujo) => {
            aux.push({
                ingresos: renderToString(setMoneyTable(flujo.ingresos_count)),
                egresos: renderToString(setMoneyTable(flujo.egresos_count)),
                ventas: renderToString(setMoneyTable(flujo.ventas_count)),
                compras: renderToString(setMoneyTable(flujo.compras_count)),
                traspasos: renderToString(setMoneyTable(flujo.traspasos_destino_count - flujo.traspasos_origen_count)),
                total: renderToString(
                    setMoneyTable(
                        flujo.ingresos_count +
                        flujo.ventas_count -
                        flujo.egresos_count -
                        flujo.compras_count +
                        flujo.traspasos_destino_count - flujo.traspasos_origen_count
                    )
                ),
                cuenta: renderToString(setTextTable(flujo.nombre)),
                id: flujo.id
            })
        })
        return aux
    }

    clear = () => {
        const { data, form, options } = this.state
        options.cuentas = setOptions(data.cuentas, 'nombre', 'id')
        form.cuenta = ''
        form.cuentas = []
        form.fechaInicio = new Date
        form.fechaFin = new Date
        data.flujos = []
        this.setState({
            ... this.state,
            options,
            form,
            flujos: [],
            data
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.askFlujosAxios()
    }

    async getFlujosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'flujos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                const { options, data } = this.state
                data.cuentas = cuentas
                options.cuentas = setOptions(cuentas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options,
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

    async askFlujosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'flujos', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { flujos } = response.data
                data.flujos = flujos
                swal.close()
                this.setState({
                    ... this.state,
                    data,
                    flujos: this.setFlujos(flujos)
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

    render() {
        const { form, options, data, flujos, total } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Card className="m-2 p-2 m-md-4 p-md-4">
                    <Card.Body>
                        <FlujosForm form = { form } options = { options } onChange = { this.onChange }
                            onSubmit = { this.onSubmit } onChangeAndAdd = { this.onChangeAndAdd } 
                            deleteOption = { this.deleteOption } clear = { this.clear } onSubmit = { this.onSubmit } />
                        <TableForModals 
                            columns = { FLUJOS_COLUMNS } 
                            data = { flujos }
                            title = 'Flujos' 
                            subtitle = 'Listado de flujos'
                            mostrar_boton = { false }
                            abrir_modal = { false }
                            mostrar_acciones = { false }
                            elements={data.flujos}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Flujos);