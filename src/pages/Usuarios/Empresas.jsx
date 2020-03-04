import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { Title, Subtitle, P, Small, B } from '../../components/texts'
import { EmpresasTable } from '../../components/tables'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import { EmpresaForm } from '../../components/forms'
import swal from 'sweetalert'
class Empresas extends Component{

    state= {
        empresas: [],
        modalDelete: false,
        modalEdit: false,
        empresa: {},
        form:{
            name: '',
            logo: '',
            file: []
        },
        img: '',
        formTitle: '',
        formAction: '',
    } 
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const empresas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!empresas)
            history.push('/')
        this.getEmpresas()

    }

    // Get Empresas
    async getEmpresas(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    // Set empresas
    setEmpresas = (empresas_list) => {
        let empresas = []
        empresas_list.map((empresa, key) => {
            empresas[key] = {
                actions: this.setActions(empresa),
                name: empresa.name,
                logo: empresa.logo !== null ? <img className="logo" src={URL_ASSETS + empresa.logo} alt={empresa.name} /> : 'No hay logo'
            }
        })
        this.setState({
            ... this.state,
            empresas,
            img: '',
            formAction: '',
            form:{
                name: '',
                logo: '',
                file: ''
            }
        })
    }

    setActions = (empresa) => {
        return(
            <div className="d-flex align-items-center">
                <Button className="mx-2 small-button" onClick={(e) => this.openModalEditEmpresa(e)(empresa)} text='' icon={faEdit} color="yellow" />
                <Button className="mx-2 small-button" onClick={(e) => this.openModalDeleteEmpresa(e)(empresa)} text='' icon={faTrash} color="red" />
            </div>
        )
    }

    // Modal
    openModalDeleteEmpresa = (e) => (emp) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            empresa: emp,
            formAction: 'Delete'
        })
    }
    openModalEditEmpresa = (e) => (emp) => {
        this.setState({
            ... this.state,
            modalEdit: true,
            empresa: emp,
            form: {
                name: emp.name,
                logo: '',
                file: emp.logo
            },
            formTitle: 'Editar la empresa',
            formAction: 'Edit'
        })
    }

    openModalAddEmpresa = () => {
        this.setState({
            ... this.state,
            modalEdit: true,
            empresa: {},
            form: {
                name: '',
                logo: '',
                file: ''
            },
            img: '',
            formTitle: 'Nueva empresa',
            formAction: 'Add'
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            empresa: {},
            formAction: ''
        })
    }
    handleEditModal = () => {
        const { modalEdit } = this.state
        const { name, logo, file } = this.state.empresa
        this.setState({
            ... this.state,
            modalEdit: !modalEdit,
            empresa: {},
            form:{
                name: name,
                logo: '',
                file: logo
            },
            formAction: ''
        })
    }

    //Delete Empresa
    safeDeleteEmpresa = (e) => (empresa) => {
        this.deleteEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            modalDelete: false,
            empresa: {},
            formAction: ''
        })
    }

    //Axios
    async deleteEmpresaAxios(empresa){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'empresa/' +empresa, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Listo!',
                    text: 'Eliminaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async updateEmpresaAxios(empresa){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('logo', form.file)
        await axios.post(URL_DEV + 'empresa/' +empresa, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Listo!',
                    text: 'Actualizaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async addEmpresaAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('logo', form.file)
        await axios.post(URL_DEV + 'empresa/', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Listo!',
                    text: 'Agregaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    // Form

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form }  = this.state
        if(name === 'logo'){
            form['logo'] = value
            form['file'] = e.target.files[0]
            let img = URL.createObjectURL(e.target.files[0]) 
            this.setState({
                ... this.state,
                form,
                img: img
            })
        }
        else{
            form[name] = value
            this.setState({
                ... this.state,
                form
            })
        }
        
        
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { empresa: {id: empresa} } = this.state
        this.updateEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            modalEdit: false,
            empresa: {}
        })
    }

    handleAddSubmit = (e) => {
        e.preventDefault()
        this.addEmpresaAxios();
        this.setState({
            ... this.state,
            modalEdit: false,
        })
    }

    removeFile = (e) => {
        e.preventDefault()
        const { name, logo, file } = this.state.empresa
        this.setState({
            ... this.state,
            form:{
                name: name,
                logo: '',
                file: logo
            },
            img: ''
        })
    }
    render(){
        const { empresas, modalDelete, modalEdit, empresa, form, img, formTitle, formAction } = this.state
        return(
            <Layout active={'usuarios'} { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={(e) => this.openModalAddEmpresa()} text='' icon={faPlus} color="green" />
                </div>
                <EmpresasTable data={empresas} />
                <Modal show={modalEdit} handleClose={this.handleEditModal}>
                    <EmpresaForm 
                        removeFile={this.removeFile} 
                        form={ form } 
                        img={img} 
                        onSubmit={ formAction === 'Add' ? this.handleAddSubmit : this.handleSubmit }
                        onChange={(e) => this.handleChange(e)} 
                        title={formTitle} />
                </Modal>
                <Modal show={modalDelete} handleClose={this.handleDeleteModal}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar a <B color="red">{empresa.name}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button onClick={this.handleDeleteModal} text="Cancelar" className="mr-3" color="green"/>
                        <Button onClick={(e) => { this.safeDeleteEmpresa(e)(empresa.id) }} text="Continuar" color="red"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Empresas);