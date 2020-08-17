import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import swal from 'sweetalert'
import { forbiddenAccessAlert, errorAlert, waitAlert } from '../../../functions/alert'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import { Card } from 'react-bootstrap'
import { PartidasDiseñoForm as PartidasDiseñoFormulario } from '../../../components/forms'
const $ = require('jquery');

class PartidasDiseñoForm extends Component {

    state = {
        partidas: [],
        partida: '',
        title: 'Nueva partida',
        form: {
            nombre: '',
            empresa:'inein'
        },
        data:{
            partidas:[],
        },
        formeditado: 0,
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const partida = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
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
                            ... this.state,
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
                    ... this.state,
                    form: this.clearForm(),
                    partidas: partidas                 
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Agregaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
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
                    ... this.state,
                    partidas: partidas,
                    partida: ''
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })

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
        })
        return form;
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        const { form, key } = this.state
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if (title === 'Editar usuario')
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
            ... this.state,
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
        })
        save({
            form: auxObject,
            page: '/catalogos/partidas-diseño'
        })
    }

    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ... this.state,
            form: formulario.form
        })
        deleteForm()
    }

    render(){
        const { title, form, formeditado} = this.state
        const { formulario, deleteForm } = this.props 
        return (
            <Layout active = { 'catalogos' }  { ...this.props } >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PartidasDiseñoFormulario
                            form={form}
                            formeditado={formeditado}   
                            onSubmit = { this.onSubmit } 
                            onChange = { this.onChange }
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