import { connect } from 'react-redux'
import { URL_DEV, S3_CONFIG } from '../../../constants'
import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import axios from 'axios'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert} from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { FormNuevoTicket } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';

const ReactS3Client = new S3(S3_CONFIG);
class AddTicket extends Component {
    state = {
        form: {
            proyecto: '',
            tipo_trabajo: '',
            descripcion: '',
            adjuntos: {
                fotos: {
                    value: '',
                    placeholder: 'Fotos del incidente',
                    files: []
                }
            }
        },
        options: {
            proyectos: [],
            tiposTrabajo: []
        }
    }

    componentDidMount() { this.getOptionsAxios() }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}calidad/options`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { proyectos, tiposTrabajo } = response.data
                const { options } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.tiposTrabajo = setOptions(tiposTrabajo, 'nombre', 'id')
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSubmit = async() => {
        waitAlert()
        let { form } = this.state
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}v3/calidad/tickets`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { ticket, proyecto } = response.data
                if(form.adjuntos.fotos.value){
                    this.addFotosS3(form.adjuntos.fotos.files, ticket.id, proyecto.id)
                }else{
                    doneAlert('Ticket creado con éxito')
                    const { history } = this.props
                    history.push({ pathname: '/calidad/tickets/detalles-ticket2' }); 
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addFotosS3 = async(arreglo, id, proyecto) => {
        let filePath = `proyecto/${proyecto}/tickets/${id}/`
        let auxPromises  = arreglo.map((file) => {
            return new Promise((resolve, reject) => {
                ReactS3Client.uploadFile(file.file, `${filePath}${Math.floor(Date.now() / 1000)}-${file.name}`)
                    .then((data) =>{
                        const { location,status } = data
                        if(status === 204) resolve({ name: file.name, url: location })
                        else reject(data)
                    }).catch(err => reject(err))
            })
        })
        Promise.all(auxPromises).then(values => { this.addFotosToTicket(values, id)}).catch(err => console.error(err))
    }

    addFotosToTicket = async(values, id) => {
        const { access_token } = this.props.authUser
        let form = {}
        form.archivos = values
        form.type = 'fotos'
        await axios.post(`${URL_DEV}v3/calidad/tickets/${id}/s3`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Ticket creado con éxito')
                const { history } = this.props
                history.push({ pathname: '/calidad/tickets/detalles-ticket2' }); 
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        if(files.length)
            this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        files.forEach((file, key) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: key } ) })
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({ ...this.state, form })
    }

    render() {
        const { form, options } = this.state
        return (
            <Layout active = 'calidad' {...this.props}>
                <Card className="card-custom">
                    <Card.Header className="border-0">
                        <Card.Title> <span className="card-label">Nuevo levantamiento de ticket</span> </Card.Title>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <FormNuevoTicket form = { form } options = { options } onChange = { this.onChange } handleChange = { this.handleChange }
                            onSubmit = { this.onSubmit } />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(AddTicket)