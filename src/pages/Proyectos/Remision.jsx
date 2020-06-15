import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, REMISION_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import { Subtitle } from '../../components/texts'
import { RemisionForm } from '../../components/forms'
import { RemisionCard } from '../../components/cards'

class Remisiones extends Component{

    state = {
        modal: false,
        modalDelete: false,
        modalSingle: false,
        title: 'Nueva remisión',
        options:{
            proyectos: [],
            areas: [],
            subareas: []
        },
        form:{
            proyecto: '',
            fecha: new Date(),
            area: '',
            subarea: '',
            descripcion: ''
        },
        remisiones: [],
        remision: ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!remisiones)
            history.push('/')
        this.getRemisionesAxios()
        let queryString = this.props.history.location.search
        if(queryString){
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if(id){
                
                this.setState({
                    ... this.state,
                    modalSingle: true
                })
                this.getRemisionAxios(id)
            }
        }
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nueva remisión',
            form: this.clearForm()
        })
    }

    openModalEdit = (remision) => {
        const { form, options } = this.state

        if(remision.subarea){
            if(remision.subarea.area)
                if(remision.subarea.area.subareas){
                    options.subareas = setOptions(remision.subarea.area.subareas, 'nombre', 'id')
                    form.subarea = remision.subarea.id.toString()
                    form.area = remision.subarea.area.id.toString()
                }
        }

        if(remision.proyecto){
            form.proyecto = remision.proyecto.id.toString()
        }

        form.descripcion = remision.descripcion
        form.fecha = new Date(remision.created_at)
        
        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar remisión',
            form,
            options,
            remision: remision
        })
    }

    openModalDelete = (remision) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            remision: remision
        })
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            title: 'Nueva remisión',
            remision: '',
            form: this.clearForm()
        })
    }

    handleCloseSingle = () => {
        this.setState({
            ... this.state,
            modalSingle: false,
            remision: ''
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            remision: '',
        })
    }

    // Setters
    setRemisiones = remisiones => {
        let aux = []
        remisiones.map( (remision) => {
            aux.push(
                {
                    actions: this.setActions(remision),
                    fecha: setDateTable(remision.created_at),
                    proyecto: setTextTable(remision.proyecto ? remision.proyecto.nombre : ''),
                    area: setTextTable( remision.subarea ? remision.subarea.area ? remision.subarea.area.nombre : '' : ''),
                    subarea: setTextTable( remision.subarea ? remision.subarea.nombre : ''),
                    descripcion: setTextTable(remision.descripcion)
                }
            )
        })
        return aux
    }

    setActions = remision => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(remision)} } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(remision)} } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.convertir(remision)} } text='' icon={faSync} color="transparent" 
                        tooltip={{id:'convertir', text:'Convertir', type:'success'}} />
                </div>
            </>
        )
    }

    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    form[element] = new Date()
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if(title === 'Editar remisión')
            this.editRemisionAxios()
        else
            this.addRemisionAxios()
    }

    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    convertir = remision => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/solicitud-compra',
            state: { remision: remision}
        });
    }

    async getRemisionesAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proyectos, areas, remisiones } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options,
                    remisiones: this.setRemisiones(remisiones)
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async getRemisionAxios(id){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision/'+id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remision } = response.data
                this.setState({
                    ... this.state,
                    remision: remision,
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addRemisionAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'remision', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remisiones } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La remisión fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    remisiones: this.setRemisiones(remisiones),
                    modal:false,
                    title: 'Nueva remisión',
                    form: this.clearForm()
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async editRemisionAxios(){
        const { access_token } = this.props.authUser
        const { form, remision } = this.state
        await axios.put(URL_DEV + 'remision/' + remision.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remisiones } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La remisión fue editada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    remisiones: this.setRemisiones(remisiones),
                    modal:false,
                    title: 'Nueva remisión',
                    form: this.clearForm()
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async deleteRemisionAxios(){
        const { access_token } = this.props.authUser
        const { remision } = this.state
        await axios.delete(URL_DEV + 'remision/' + remision.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remisiones } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La remisión fue eliminada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    remisiones: this.setRemisiones(remisiones),
                    modalDelete:false,
                    remision: ''
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    render(){

        const { modal, modalDelete, modalSingle, title, form, remisiones, remision, options } = this.state

        return(
            <Layout active={'administracion'}  { ...this.props}>

                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" />
                </div>

                <Modal show = {modal} handleClose = { this.handleClose } >
                    <RemisionForm form = { form } options = { options } onSubmit = { this.onSubmit }
                        title = { title } setOptions = { this.setOptions } onChange = { this.onChange }/>
                </Modal>

                <DataTable columns = { REMISION_COLUMNS } data = { remisiones } />

                <ModalDelete show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); this.deleteRemisionAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la remisión?
                    </Subtitle>
                </ModalDelete>

                <Modal show = { modalSingle } handleClose = { this.handleCloseSingle } >

                    <RemisionCard data = { remision }>
                        {
                            remision.convertido ? '' :
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.convertir(remision)} } text='' icon={faSync} color="transparent" 
                                        tooltip={{id:'convertir', text:'Comprar', type:'success'}} />
                                </div>
                        }
                        
                    </RemisionCard>
                    
                </Modal>

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

export default connect(mapStateToProps, mapDispatchToProps)(Remisiones);