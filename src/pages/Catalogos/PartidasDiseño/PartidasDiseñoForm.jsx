import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { forbiddenAccessAlert, errorAlert, waitAlert, doneAlert } from '../../../functions/alert'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { Card } from 'react-bootstrap'
import { PartidasDiseñoForm as PartidasDiseoFormulario } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions } from '../../../functions/setters'
const $ = require('jquery');

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
        data:{
            partidas:[],
        },
        formeditado: 0,
        options:{
            rubro:
            [
                {
                    name: "ACABADOS E INSTALACIONES", value: "1", label: "ACABADOS E INSTALACIONES"
                },
                {
                    name: "OBRA CIVIL", value: "2", label: "OBRA CIVIL"
                },
                {
                    name: "MOBILIARIO", value: "3", label: "MOBILIARIO"
                },
            ],
            empresas: [],
        }
    }

    componentDidMount(){
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
                this.setState({
                    ...this.state,
                    title: 'Nueva partida',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.partida)
                    {
                        const { form,  } = this.state
                        const { partida } = state
                        
                        form.nombre = partida.nombre
                        form.empresa = partida.empresa

                        this.setState({
                            ...this.state,
                            form,
                            partida: partida,
                            title: 'Editar partida',
                            formeditado:1
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
        await axios.get(URL_DEV + 'contratos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addPartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { deleteForm} = this.props
        const { form} = this.state

        await axios.post(URL_DEV + 'partidas-diseño', form,  { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {

                deleteForm()

                const { partidas } = response.data
                const { key} = this.state

                if(key === 'inein'){
                    this.getIneinAxios()
                }
                if(key === 'im'){
                    this.getImAxios()
                }
                
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    partidas: partidas                 
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.')

                const { history } = this.props
                    history.push({
                    pathname: '/catalogos/partidas-diseño'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updatePartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { deleteForm } = this.props
        const { form, partida } = this.state
        await axios.put(URL_DEV + 'partidas-diseño/' + partida.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                deleteForm()

                const { partidas } = response.data
                const { key } = this.state

                if(key === 'inein'){
                    this.getIneinAxios()
                }
                if(key === 'im'){
                    this.getImAxios()
                }
                
                this.setState({
                    ...this.state,
                    partidas: partidas,
                    partida: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito al usuario.')
                
                const { history } = this.props
                    history.push({
                    pathname: '/catalogos/partidas-diseño'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    
    clearForm = () => {
        const { form, key } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'empresa':
                    if(key === 'inein')
                    form[element] = 'inein'
                    else
                    form[element] = 'im'
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
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

    async getIneinAxios() {
        $('#kt_datatable_partida_inein').DataTable().ajax.reload();
    }

    async getImAxios() {
        $('#kt_datatable_partida_im').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if(value === 'inein'){
            this.getIneinAxios()
        }
        if(value === 'im'){
            this.getImAxios()
            form.empresa = 'im'
        }
        this.setState({
            ...this.state,
            key: value,
            form
        })
    }

    save = () => {
        const { form } = this.state
        const { save } = this.props
        let auxObject = {}
        let aux = Object.keys(form)
        aux.map((element) => {
            auxObject[element] = form[element]
            return false
        })
        save({
            form: auxObject,
            page: '/catalogos/partidas-diseño'
        })
    }

    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ...this.state,
            form: formulario.form
        })
        deleteForm()
    }

    tagInputChange = (nuevasPartidas) => {
        const uppercased = nuevasPartidas.map(tipo => tipo.toUpperCase());
        const { form } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.partidas = uppercased ? Object.keys(unico) : [];
        this.setState({
            form
        })
    }
    

    render(){
        const { title, form, formeditado, options} = this.state
        return (
            <Layout active = { 'catalogos' }  { ...this.props } >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PartidasDiseoFormulario
                            form={form}
                            formeditado={formeditado}   
                            onSubmit = { this.onSubmit } 
                            onChange = { this.onChange }
                            options = {options}
                            tagInputChange={(e) => this.tagInputChange(e)}
                        />
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