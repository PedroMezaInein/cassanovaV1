import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { AreasForm } from '../../components/forms'
import { URL_DEV, GOLD, AREAS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, Subtitle } from '../../components/texts'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'

class Areas extends Component{

    state = {
        form: {
            nombre: '',
            subarea: '',
            subareas: []
        },
        areas: [],
        modal: false,
        modalDelete: false,
        title: 'Nueva área',
        area: ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!areas)
            history.push('/')
        this.getAreasAxios()
    }

    addSubarea = () => {
        const { form } = this.state
        if(form['subarea'] !== ''){
            let aux = false;
            aux = form.subareas.find(function(element, index) {
                if(element === form.subarea)
                    return true
            });
            if(aux !== true){
                form.subareas.push(form.subarea)
                form.subarea = ''
                this.setState({
                    ... this.state,
                    form
                })
            }
        }
    }

    deleteSubarea = value => {
        const { form } = this.state
        let aux = []
        form.subareas.find(function(element, index) {
            if(element.toString() !== value.toString())
                aux.push(element)
        });
        form.subareas = aux
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

    setAreas = areas => {
        let aux = []
        areas.map((area) => {
            aux.push({
                actions: this.setActions(area),
                area: this.setTextTable(area.nombre),
                subareas: this.setListTable(area.subareas)
            })
        })
        return aux
    }

    setActions= area => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(area) } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(area) } text='' icon={faTrash} color="red"
                        tooltip={{id:'delete', text:'Eliminar', type: 'error'}} />
                </div>
            </>
        )
    }

    setTextTable = text => {
        return(
            <Small>
                {text}
            </Small>
        )
    }

    setListTable = lista => {
        return(
            <ul>
                {
                    lista.map((element) => {
                        return(
                            <li>
                                <Small>
                                    {element.nombre}
                                </Small>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'subareas':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleClose = () => {
        const {modal} = this.state
        this.setState({
            modal: !modal,
            title: 'Nueva área',
            form: this.clearForm(),
            area: ''
        })
    }

    handleCloseDelete = () => {
        const {modalDelete} = this.state
        this.setState({
            modalDelete: !modalDelete,
            area: ''
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm()
        })
    }

    openModalDelete = e => area => {
        this.setState({
            modalDelete: true,
            area: area
        })
    }

    openModalEdit = e => area => {
        const {form} = this.state
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { form, title } = this.state
        if(title === 'Nueva área')
            this.addAreaAxios()
        if(title === 'Editar área')
            this.updateAreaAxios()
    }

    safeDelete = e => () => {
        this.deleteAreaAxios()
    }

    async getAreasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'areas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { areas } = response.data
                this.setState({
                    ... this.state,
                    areas: this.setAreas(areas)
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
            console.log('Catch error')
            console.log(error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async addAreaAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'areas', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { areas } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
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
            console.log('Catch error')
            console.log(error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async updateAreaAxios(){
        const { access_token } = this.props.authUser
        const { form, area } = this.state
        await axios.put(URL_DEV + 'areas/' + area.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { areas } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
                    area: ''
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
            console.log('Catch error')
            console.log(error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    async deleteAreaAxios(){
        const { access_token } = this.props.authUser
        const { area } = this.state
        await axios.delete(URL_DEV + 'areas/' + area.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { areas } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
                    area: ''
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
            console.log('Catch error')
            console.log(error)
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error',
                
            })
        })
    }

    render(){
        const { form, areas, modal, modalDelete, title } = this.state
        return(
            <Layout active={'catalogos'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon = { faPlus } color="green" 
                        tooltip={{id:'add', text:'Nuevo'}} />
                </div>área
                <DataTable columns = {AREAS_COLUMNS} data= {areas}/>
                <Modal show = {modal} handleClose = {this.handleClose}>
                    <AreasForm form = {form} onChange = { this.onChange } 
                        addSubarea = { this.addSubarea } deleteSubarea = { this.deleteSubarea } 
                        title = {title} onSubmit={this.onSubmit}/>
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el área?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleCloseDelete } text="Cancelar" className="mr-3" color="green"/>
                        <Button icon='' onClick = { (e) => { this.safeDelete(e)() }} text="Continuar" color="red"/>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Areas);