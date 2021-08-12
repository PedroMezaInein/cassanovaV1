import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { printResponseErrorAlert, errorAlert, waitAlert, doneAlert} from '../../../functions/alert'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { Card } from 'react-bootstrap'
import { PartidasDiseñoForm as PartidasDiseoFormulario } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions } from '../../../functions/setters'
class PartidasDiseñoForm extends Component {

    state = {
        partidas: [],
        partida: '',
        title: 'Nueva partida',
        form: {
            nombre: '',
            empresa:'',
            rubro: '',
            partidas: []
        },
        type: 'add',
        data:{
            partidas:[],
        },
        formeditado: 0,
        options:{
            rubro:
            [
                {
                    name: "ACABADOS E INSTALACIONES", value: "Acabados e instalaciones", label: "ACABADOS E INSTALACIONES"
                },
                {
                    name: "OBRA CIVIL", value: "Obra civil", label: "OBRA CIVIL"
                },
                {
                    name: "MOBILIARIO", value: "Mobiliario", label: "MOBILIARIO"
                },
            ],
            empresas: [],
        }
    }

    componentDidMount(){
        let queryString = this.props.history.location.search
        let _empresa = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            if (params.get("empresa"))
                _empresa = params.get("empresa")
        }
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { match : { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const partida = permisos.find(function(element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                const { form } = this.state
                form.empresa = _empresa.toString()
                this.setState({
                    ...this.state,
                    title: 'Nueva partida',
                    formeditado:0,
                    form,
                    type: 'add'
                })
                break;
            case 'edit':
                if(state){
                    if(state.partida)
                    {
                        const { form,  } = this.state
                        const { partida } = state
                        form.nombre = partida.nombre
                        form.empresa = partida.empresa.id.toString()
                        form.rubro = partida.tipo
                        this.setState({
                            ...this.state,
                            form,
                            partida: partida,
                            title: 'Editar partida',
                            formeditado:1,
                            type: 'edit'
                        })
                    }
                    else
                        history.push('/catalogos/partidas-diseño')
                }else
                    history.push('/catalogos/partidas-diseño')
                break;
            default:
                break;
        }
        if (!partida)
            history.push('/')
            this.getOptionsAxios()
    }
    // Falta hacer el options
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'partidas-diseño', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addPartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { form} = this.state
        await axios.post(URL_DEV + 'partidas-diseño', form,  { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.')
                const { history } = this.props
                history.push({ pathname: '/catalogos/partidas-diseño' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async updatePartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { form, partida } = this.state
        await axios.put(URL_DEV + 'partidas-diseño/' + partida.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.')
                const { history } = this.props
                history.push({ pathname: '/catalogos/partidas-diseño' });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if (title === 'Editar partida')
            this.updatePartidaDiseñoAxios()
        else
            this.addPartidaDiseñoAxios()
    }

    tagInputChange = (nuevasPartidas) => {
        const uppercased = nuevasPartidas.map(tipo => tipo.toUpperCase());
        const { form } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.partidas = uppercased ? Object.keys(unico) : [];
        this.setState({ form })
    }
    
    render(){
        const { title, form, formeditado, options, type } = this.state
        return (
            <Layout active = { 'catalogos' }  { ...this.props } >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PartidasDiseoFormulario type = { type } form = { form } formeditado = { formeditado } onSubmit = { this.onSubmit } 
                            onChange = { this.onChange } options = { options } tagInputChange={(e) => this.tagInputChange(e)} />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}

const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PartidasDiseñoForm);