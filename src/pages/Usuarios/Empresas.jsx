import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { Modal, ModalDelete } from '../../components/singles'
import { EmpresaForm } from '../../components/forms'
import swal from 'sweetalert'
import NewTable from '../../components/tables/NewTable'
import { EMPRESA_COLUMNS, DARK_BLUE } from '../../constants'
import { setTextTable } from '../../functions/setters'
class Empresas extends Component{

    state= {
        empresas: [],
        modalDelete: false,
        modalEdit: false,
        empresa: {},
        form:{
            name: '',
            razonSocial: '',
            logo: '',
            file: [],
            rfc: ''
        },
        data: {
            empresas: []
        },
        formeditado:0,
        img: '',
        title: '',
        formAction: '',
    } 
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        var element = document.getElementById("kt_datatable_empresas");
        element.classList.remove("table-responsive");
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const empresas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!empresas)
            history.push('/')
        this.getEmpresas()
    }

    async getEmpresas(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { data: {empresas: empresas} } = response                
                data.empresas = empresas
                this.setEmpresas(empresas)
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
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    setEmpresas = (empresas_list) => {
        const { data } = this.state
        data.empresas = empresas_list
        let empresas = []
        empresas_list.map((empresa, key) => {
            empresas[key] = {
                actions: this.setActions(empresa),
                name: renderToString(setTextTable(empresa.name)),
                razonSocial: renderToString(setTextTable(empresa.razon_social)),
                rfc: renderToString(setTextTable(empresa.rfc)),
                logo: renderToString(empresa.logo !== null ? <img className="img-empresa" src={empresa.logo} alt={empresa.name} /> : 'No hay logo'),
                id: empresa.id
            }
        })
        this.setState({
            ... this.state,
            empresas,
            img: '',
            formAction: '',
            form:{
                name: '',
                razonSocial: '',
                logo: '',
                file: ''
            },
            data
        })
    }

    setActions = proveedor => {
    let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: {id:'edit', text:'Editar'}
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin', 
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'}
            }
        )
    return aux
    }
    
    openModalDeleteEmpresa =  (emp) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            empresa: emp,
            formAction: 'Delete'
        })
    }
    openModalEditEmpresa = (emp) => {
        this.setState({
            ... this.state,
            modalEdit: true,
            empresa: emp,
            form: {
                name: emp.name,
                razonSocial: emp.razon_social,
                logo: '',
                file: emp.logo,
                rfc: emp.rfc
            },
            title: 'Editar la empresa',
            formAction: 'Edit',
            formeditado:1
        })
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modalEdit: true,
            empresa: {},
            form: {
                name: '',
                razonSocial: '',
                logo: '',
                file: '',
                rfc: ''
            },
            img: '',
            title: 'Nueva empresa',
            formAction: 'Add',
            formeditado:0
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
        const { name, logo, file, razon_social } = this.state.empresa
        this.setState({
            ... this.state,
            modalEdit: !modalEdit,
            empresa: {},
            form:{
                name: name,
                razonSocial: razon_social,
                logo: '',
                file: logo
            },
            formAction: ''
        })
    }

    safeDeleteEmpresa = (e) => (empresa) => {
        this.deleteEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            modalDelete: false,
            empresa: {},
            formAction: ''
        })
    }

    async deleteEmpresaAxios(empresa){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'empresa/' +empresa, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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
                    })
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
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async updateEmpresaAxios(empresa){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa/' +empresa, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Actualizaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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
                    })
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
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    async addEmpresaAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        data.append('name', form.name)
        data.append('razonSocial', form.razonSocial)
        data.append('logo', form.file)
        data.append('rfc', form.rfc)
        await axios.post(URL_DEV + 'empresa', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Agregaste con éxito la empresa.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
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
                    })
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
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

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
            if(name === 'razonSocial'){
                let cadena = value.replace(/,/g, '')
                cadena = cadena.replace(/\./g, '')
                form[name] = cadena
                this.setState({
                    ... this.state,
                    form
                })
            }else{
                form[name] = value
                this.setState({
                    ... this.state,
                    form
                })
            }
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
        const { name, logo, file, razon_social } = this.state.empresa
        this.setState({
            ... this.state,
            form:{
                name: name,
                razonSocial: razon_social,
                logo: '',
                file: logo
            },
            img: ''
        })
    }
    render(){
        const { empresas, modalDelete, modalEdit, empresa, form, img, title, formAction,data, formeditado} = this.state
        return(
            <Layout active={'usuarios'} { ...this.props}>

                <NewTable  columns={EMPRESA_COLUMNS} data = { empresas } 
                            title = 'Empresas' subtitle = 'Listado de empresas'
                            mostrar_boton={true}
                            abrir_modal={true}
                            onClick={this.openModal}
                            mostrar_acciones={true} 
                            
                            actions = {{
                                'edit': {function: this.openModalEditEmpresa},
                                'delete': {function: this.openModalDeleteEmpresa}
                            }}
                            elements = { data.empresas }
                            idTable = 'kt_datatable_empresas'
                            />

                <Modal size="xl" title = { title } show={modalEdit} handleClose={this.handleEditModal}>
                    <EmpresaForm 
                        removeFile={this.removeFile} 
                        form={ form } 
                        img={img} 
                        onSubmit={ formAction === 'Add' ? this.handleAddSubmit : this.handleSubmit }
                        onChange={(e) => this.handleChange(e)} 
                        title={title} 
                        formeditado={formeditado}
                        />
                </Modal>
                
                <ModalDelete title= {empresa === null ? "¿Estás seguro que deseas eliminar a ": "¿Estás seguro que deseas eliminar a "+empresa.name +" ?"} show={modalDelete} handleClose={this.handleDeleteModal} onClick={(e) => { this.safeDeleteEmpresa(e)(empresa.id) }}>
                </ModalDelete>

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