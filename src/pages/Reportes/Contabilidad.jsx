import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, UNIDADES_COLUMNS, GOLD } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setPercentTable, setArrayTable, setFacturaTable, setAdjuntosList, setListTable } from '../../functions/setters'
import { waitAlert, errorAlert, createAlert,forbiddenAccessAlert } from '../../functions/alert'
//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faReceipt, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { UnidadForm } from '../../components/forms'
import { Subtitle, Small } from '../../components/texts'
import NewTable from '../../components/tables/NewTable'
import { Card } from 'react-bootstrap'
import { ContabilidadForm } from '../../components/forms'

class Contabilidad extends Component {

    state = {
        form: {
            empresas: [],
            empresa: 0,
            fechaInicio: new Date,
            fechaFin: new Date
        },
        options: {
            empresas: []
        },
        modal:{
            form: false,
            delete: false,
        },
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
        this.getReportesContabilidadAxios()
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

    onChangeEmpresa = e => {
        const { name, value } = e.target
        const { options, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        options.empresas.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
        })

        options.empresas = aux
        form['empresas'] = auxEmpresa
        this.setState({
            ... this.state,
            form,
            options
        })
    }

    updateEmpresa = empresa => {
        const { form, options } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                options.empresas.push(element)
            }
        })
        form.empresas = aux
        this.setState({
            ... this.state,
            options,
            form
        })
    }

    async getReportesContabilidadAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'contabilidad', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setSelectOptions(empresas, 'name')
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
                        <ContabilidadForm form = { form } options = { options } onChangeEmpresa = { this.onChangeEmpresa } 
                            updateEmpresa = { this.updateEmpresa } onChange = { this.onChange } />
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

export default connect(mapStateToProps, mapDispatchToProps)(Contabilidad);