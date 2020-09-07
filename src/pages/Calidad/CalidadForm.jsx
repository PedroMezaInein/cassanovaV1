import React, { Component } from 'react' 
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV} from '../../constants'
import { setOptions} from '../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert,questionAlert, deleteAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { CalidadView} from '../../components/forms'


class CalidadForm extends Component{

    state = {
        ticket: '',
        form: {
            adjuntos:{
                presupuesto:{
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                },
                reporte_problema_reportado:{
                    value: '',
                    placeholder: 'Reporte fotográfico del problema reportado',
                    files: []
                },
                reporte_problema_solucionado:{
                    value: '',
                    placeholder: 'Reporte fotográfico del problema solucionado',
                    files: []
                }
            },
            fechaProgramada: new Date(),
            empleado: '',
            recibe: ''
        },
        options:{
            empleados: []
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        this.getTicketsOptions()
        switch(action){
            
            case 'see':
                if(state){
                    if(state.calidad)
                    {
                        const { calidad } = state
                        if(calidad.estatus_ticket.estatus === 'En espera')
                            this.changeEstatusAxios({id: calidad.id})
                        else{
                            this.setState({
                                ... this.state,
                                ticket: calidad,
                                form: this.setForm(calidad)
                            })
                        }
                        window.history.replaceState(null, '')
                    }
                    else
                        history.push('/calidad/calidad')
                }
                else
                    history.push('/calidad/calidad')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
    }

    setForm = ticket => {
        const { form } = this.state
        let aux = []
        ticket.presupuesto.map( (presupuesto) => {
            aux.push({
                name: presupuesto.name,
                url: presupuesto.url,
                file: ''
            })
        })
        form.adjuntos.presupuesto.files = aux
        aux = []
        ticket.reporte_problema_reportado.map( (element) => {
            aux.push({
                name: element.name,
                url: element.url,
                file: '',
                id: element.id
            })
        })
        form.adjuntos.reporte_problema_reportado.files = aux
        aux = []
        ticket.reporte_problema_solucionado.map( (element) => {
            aux.push({
                name: element.name,
                url: element.url,
                file: '',
                id: element.id
            })
        })
        form.adjuntos.reporte_problema_solucionado.files = aux
        form.fechaProgramada = new Date(ticket.fecha_programada)
        if(ticket.tecnico)
            form.empleado = ticket.tecnico.id.toString()
        form.descripcion = ticket.descripcion_solucion
        form.recibe = ticket.recibe
        return form
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
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

    handleChange = (files, item) => {
        if(item === 'presupuesto')
            questionAlert('¿DESEAS ENVIAR EL PRESUPUESTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.sendPresupuestoTicketAxios( files, item ))
        else
            this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }

    deleteFile = element => {
        deleteAlert('¿Deseas eliminar el archivo?', () => this.deleteAdjuntoAxios(element.id))
    }

    changeEstatus = estatus =>  {
        const { ticket } = this.state
        // this.changeEstatusAxios({id: ticket.id, estatus: estatus})
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({id: ticket.id, estatus: estatus}))
    }

    onSubmit = e => {
        e.preventDefault();
        this.saveProcesoTicketAxios('')
    }

    generateEmail = value => {
        this.saveProcesoTicketAxios(value)
    }

    async deleteAdjuntoAxios(id){
        const { access_token } = this.props.authUser
        const { ticket } = this.state
        await axios.delete(URL_DEV + 'calidad/' + ticket.id + '/adjuntos/' + id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')

                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                doneAlert('Adjunto eliminado con éxito.')
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

    async saveProcesoTicketAxios( email ){

        waitAlert()

        const { access_token } = this.props.authUser
        const { ticket, form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaProgramada':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '' && element !== 'presupuesto') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        if(email !== '')
            data.append('email', email)

        await axios.post(URL_DEV + 'calidad/proceso/' + ticket.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')

                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                doneAlert('Presupuesto adjuntado con éxito.')
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

    async sendPresupuestoTicketAxios( files, item ){

        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })

        waitAlert()

        const { access_token } = this.props.authUser
        const { ticket, form } = this.state
        const data = new FormData();

        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'calidad/presupuesto/' + ticket.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')

                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                doneAlert('Presupuesto adjuntado con éxito.')
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

    async changeEstatusAxios(data){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'calidad/estatus/' + data.id, data, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { ticket } = response.data
                
                window.history.replaceState(ticket, 'calidad')
                
                this.setState({
                    ... this.state,
                    ticket: ticket,
                    form: this.setForm(ticket)
                })
                if(data.estatus){
                    doneAlert('El ticket fue actualizado con éxito.')
                }
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

    async getTicketsOptions(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'calidad/options', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empleados } = response.data
                const { options } = this.state
                options['empleados'] = setOptions(empleados, 'nombre', 'id')
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

        const { ticket, form, options } = this.state

        return(
            <Layout active={'proyectos'}  {...this.props}>
                <CalidadView
                    data = { ticket } 
                    form = { form }
                    options = { options }
                    handleChange = { this.handleChange }
                    changeEstatus = { this.changeEstatus }
                    onChange = { this.onChange } 
                    onSubmit = { this.onSubmit }
                    generateEmail = { this.generateEmail } 
                    deleteFile = { this.deleteFile } />
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

export default connect(mapStateToProps, mapDispatchToProps)(CalidadForm);