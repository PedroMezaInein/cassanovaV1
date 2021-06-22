import axios from 'axios'
import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { setOptions } from '../../../functions/setters'
import { EquipoForm as EquipoFormulario } from '../../../components/forms'

class Bodega extends Component {

    state = {
        options: { proveedores: [], partidas:  [] },
        title: 'Nuevo equipo',
        form: {
            partida: '',
            proveedor: '',
            equipo: '',
            marca: '',
            modelo: '',
            observaciones: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ficha técnica',
                    files: []
                }
            }
        },
        formeditado: 0
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const module = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        if (!module)
            history.push('/')
        this.getOptions()
        switch (action) {
            case 'add':
                this.setState({ ...this.state, title: 'Nuevo equipo', formeditado: 0 })
                break;
            case 'edit':
                const { equipo } = state
                if(equipo){
                    this.setState({ ...this.state, title: 'Editar equipo', formeditado: 1 })
                    this.getOneEquipoAxios(equipo.id)
                }else{
                    errorAlert('No hay equipo registrado')
                    history.push('/proyectos/equipos')
                }
                
                break;
            default:
                break;
        }
    }

    onSubmit = e => {
        waitAlert()
        const { title } = this.state
        if(title === 'Nuevo equipo')
            this.addEquipoAxios()
        else
            this.updateEquipoAxios()
    }

    getOptions = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/proyectos/equipos`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { partidas, proveedores } = response.data
                const { options } = this.state
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addEquipoAxios = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        form.adjuntos.adjunto.files.forEach((file) => {
            data.append(`files[]`, file.file)
        })
        await axios.post(`${URL_DEV}v1/proyectos/equipos`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Equipo registrado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/proyectos/equipos' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateEquipoAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, equipo } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        form.adjuntos.adjunto.files.forEach((file) => {
            if(file.id === undefined)
                data.append(`files[]`, file.file)
        })
        await axios.post(`${URL_DEV}v1/proyectos/equipos/${equipo.id}?_method=PUT`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Equipo editado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/proyectos/equipos' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOneEquipoAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v1/proyectos/equipos/${id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { equipo } = response.data
                const { form } = this.state
                if(equipo.proveedor)
                    form.proveedor = equipo.proveedor.id.toString()
                if(equipo.partida)
                    form.partida = equipo.partida.id.toString()
                form.equipo = equipo.equipo
                form.marca = equipo.marca
                form.modelo = equipo.modelo
                form.observaciones = equipo.observaciones
                if(equipo.ficha_tecnica){
                    let nombre = equipo.ficha_tecnica.split('/')
                    if(nombre.length > 0)
                        nombre = nombre[nombre.length - 1]
                    form.adjuntos.adjunto.files = [{
                        url: equipo.ficha_tecnica,
                        name: nombre,
                        id: id
                    }]
                }
                this.setState({...this.state, form, equipo: equipo})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state,form})
    }

    handleChangeFiles = (files, item) => {
        const { form } = this.state
        let aux = []
        files.forEach((file, index) => {
            aux.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
    }

    render(){
        const { title, form, options } = this.state
        return(
            <Layout active = 'proyectos'  {...this.props}>
                <Card>
                    <Card.Header> <div className="card-custom"> <h3 className="card-label"> { title } </h3> </div> </Card.Header>
                    <Card.Body>
                        <EquipoFormulario form = { form } options = { options } onChange = { this.onChange }
                            handleChange = { this.handleChangeFiles } onSubmit = { this.onSubmit } />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Bodega)