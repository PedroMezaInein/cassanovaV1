import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setPercentTable, setArrayTable, setFacturaTable, setAdjuntosList, setListTable } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert } from '../../functions/alert'
//
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { FlujosForm } from '../../components/forms'

class Flujos extends Component {

    state = {
        form: {
            empresas: [],
            empresa: '',
            cuentas: [],
            cuenta: '',
            fechaInicio: new Date,
            fechaFin: new Date
        },
        options: {
            empresas: [],
            cuentas: []
        }
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
                console.log(_aux, '_aux')
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

    updateEmpresa = (option, arreglo) => {
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

    async getFlujosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'flujos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')
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

    render() {
        const { form, options } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Card className="m-2 p-2 m-md-4 p-md-4">
                    <Card.Body>
                        <FlujosForm form = { form } options = { options } onChangeEmpresa = { this.onChangeEmpresa } 
                            updateEmpresa = { this.updateEmpresa } onChange = { this.onChange } onSubmit = { this.onSubmit }
                            onChangeAndAdd = { this.onChangeAndAdd } />
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