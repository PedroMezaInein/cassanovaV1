import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { Title, Subtitle, P, Small } from '../../components/texts'
import { EmpresasTable } from '../../components/tables'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import { EmpresaForm } from '../../components/forms'

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
        img: ''
    } 
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
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
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            empresas
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
            }
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            empresa: {}
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
            }
        })
    }

    //Delete Empresa
    safeDeleteEmpresa = (e) => (empresa) => {
        this.deleteEmpresaAxios(empresa);
        this.setState({
            ... this.state,
            modalDelete: false,
            empresa: {}
        })
    }

    //Axios
    async deleteEmpresaAxios(empresa){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'empresa/' +empresa, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {empresas: empresas} } = response
                this.setEmpresas(empresas)
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
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
            console.log('FORM IMAGE', img)
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
        const { empresas, modalDelete, modalEdit, empresa, form, img } = this.state
        return(
            <Layout { ...this.props}>
                <EmpresasTable data={empresas} />
                <Modal show={modalEdit} handleClose={this.handleEditModal}>
                    <EmpresaForm removeFile={this.removeFile} form={ form } img={img}  onSubmit={ this.handleSubmit} onChange={(e) => this.handleChange(e)} title="Editar empresa" />
                </Modal>
                <Modal show={modalDelete} handleClose={this.handleDeleteModal}>
                    <Title>
                        ¿Estás seguro que deseas eliminar a <P color="red">
                            {empresa.name}
                        </P>
                    </Title>
                    <div className="d-flex justify-content-center mt-3">
                        <Button onClick={this.handleDeleteModal} text="Cancelar" className="mr-2" color="green"/>
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