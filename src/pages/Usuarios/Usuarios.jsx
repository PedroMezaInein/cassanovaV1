import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import {URL_DEV} from '../../constants'
import { Title, Subtitle, P, Small } from '../../components/texts'
import { Button } from '../../components/form-components'
import { faUserPlus, faUserEdit, faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { Card, Modal } from '../../components/singles'
import { RegisterUserForm } from '../../components/forms'

class Usuarios extends Component{
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.addUserAxios = this.addUserAxios.bind(this);
    }

    state = {
        users: [],
        type_user: '',
        modalActive: false,
        form:{
            name: '',
            email: '',
            tipo:3
        },
        options: [],
        user_to_interact: '',
        modalSafeDeleteActive: false,
        edit_user: false,
    }

    componentDidMount(){
        this.getUsers();
    }

    setUsers = (data) => {
        this.setState({
            users: data
        })
    }

    async getUsers(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/users', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
                users.map((user, key) => {
                    const { id, tipo } = user
                    const { options } = this.state
                    options.push({
                        value: id,
                        text: tipo
                    })
                    this.setState({
                        ... this.state,
                        options
                    })
                })
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    addUser = (value) => (e) => {
        console.log('state', this.state)
        console.log(value)
        this.setState({
            modalActive: true
        })
    }

    handleCloseModal = () => {
        this.setState({
            modalActive: !this.state.modalActive
        })
    }

    handleCloseSafeModal = () => {
        const { modalSafeDeleteActive, user_to_interact } = this.state
        let old_user = user_to_interact
        if(modalSafeDeleteActive){
            old_user = {}
        }
        this.setState({
            ... this.state,
            modalSafeDeleteActive: !this.state.modalSafeDeleteActive,
            old_user
        })
    }

    handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target
        const { form }  = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    handleSubmitAddUser = (e) => {
        e.preventDefault();
        this.addUserAxios()
    }

    handleSubmitEditUser = (e) => {
        e.preventDefault();
        const { id } = this.state.user_to_interact
        this.updateUserAxios(id)
    }

    async addUserAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'user', form, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users);
                this.setState({
                    modalActive: false,
                    form:{
                        name: '',
                        email: '',
                        tipo:3
                    },
                })
                
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    deleteuser = (e) => (user) => {
        this.setState({
            ... this.state,
            modalSafeDeleteActive: true,
            user_to_interact: user
        })
    }

    updateUser = (e) => (user) => {
        const { name, email, tipo: {id: tipo}} = user
        let form = {
            name: name,
            email: email,
            tipo: tipo
        }
        this.setState({
            ... this.state,
            modalActive: true,
            edit_user: true,
            user_to_interact: user,
            form
        })
    }

    async updateUserAxios( user ){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.put(URL_DEV + 'user/' + user, form, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users);
                this.setState({
                    modalActive: false,
                    edit_user: false,
                    form:{
                        name: '',
                        email: '',
                        tipo:3,
                    },
                })
                
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    deleteSafeUser = (e) => (user) => {
        this.deleteUserAxios(user);
        this.setState({
            ... this.state,
            modalSafeDeleteActive: false,
            user_to_interact: ''
        })
    }

    async deleteUserAxios(user){
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'user/' +user, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: {users: users} } = response
                this.setUsers(users)
            },
            (error) => {
                console.log(error, 'error')
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    render(){
        const { users, modalActive, form, options, modalSafeDeleteActive, user_to_interact, edit_user } = this.state;
        return(
            <Layout { ...this.props}>
                <div className="d-flex align-items-center justify-content-between">
                    <Title>
                        Listado de usuarios registrados
                    </Title>
                    <Button onClick={this.addUser('admin')} text='' icon={faUserPlus} />
                </div>
                {
                    users.map((tipo_users, key) => {
                        return(
                            <div key={key} className="my-5">
                                <Subtitle>
                                    Usuarios {tipo_users.tipo}
                                </Subtitle>
                                <div className="d-flex border py-3">
                                    {
                                        tipo_users.usuarios.map((user, _key) => {
                                            return(
                                                <Card className="mx-3" key={_key}>
                                                    <div className="text-center">
                                                        <P>
                                                            {user.name}
                                                        </P>

                                                        <Small>
                                                            {user.email}
                                                        </Small>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-3">
                                                        <Button onClick={(e) => { this.updateUser(e)(user) }} icon={faUserEdit} className="mr-2" color="green"/>
                                                        <Button onClick={(e) => { this.deleteuser(e)(user) }} icon={faUserSlash} color="red"/>
                                                    </div>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                                <div className="d-flex justify-content-end my-2">
                                    <Button onClick={this.addUser(tipo_users.tipo)} text='' icon={faUserPlus} />
                                </div>
                            </div>
                        )
                    })
                }
                <Modal show={modalActive} handleClose={this.handleCloseModal}>
                    <RegisterUserForm form={ form } options={options} onSubmit={ edit_user ? this.handleSubmitEditUser : this.handleSubmitAddUser} onChange={(e) => this.handleChange(e)}/>
                </Modal>
                <Modal show={modalSafeDeleteActive} handleClose={this.handleCloseSafeModal}>
                    <Title>
                        ¿Estás seguro que deseas eliminar a <P color="red">
                            {user_to_interact.name}
                        </P>
                    </Title>
                    <div className="d-flex justify-content-center mt-3">
                        <Button onClick={this.handleCloseSafeModal} text="Cancelar" className="mr-2" color="green"/>
                        <Button onClick={(e) => { this.deleteSafeUser(e)(user_to_interact.id) }} text="Continuar" color="red"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);