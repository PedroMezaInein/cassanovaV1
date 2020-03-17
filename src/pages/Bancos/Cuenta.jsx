import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';

class Cuentas extends Component{

    state = {
        modal: false,
        modalDelete: false,
        bancos: [],
        tipos: [],
        estatus: [],
        form:{
            nombre: '',
            numero: '',
            descripcion: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: ''
        },
        cuentas: [],
        cuenta: null
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!leads)
            history.push('/')
        this.getCuentas()
    }

    //
    onChange = e => {
        const { name, value } = e.target
        console.log('Name', name)
        console.log('Value', value)
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        this.addCuentaAxios()
    }

    onEditSubmit = e => {
        e.preventDefault()
        this.editCuentaAxios()
    }

    safeDelete = e => () => {
        this.deleteCuentaAxios()
    }

    // Setters

    setEmptyForm = () => {
        return {
            nombre: '',
            numero: '',
            descripcion: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: ''
        }
    }

    setCuentas = cuentas => {

        const formatterDolar = new Intl.NumberFormat('en-MX', {
            style: 'currency',
            currency: 'USD'
        })

        let aux = []
        cuentas.map((cuenta, key) => {
            aux.push( {
                
                actions: this.setActions( cuenta ),

                nombre: this.setText( cuenta.nombre ),
                numero: this.setText( cuenta.numero ),

                /* balance: this.setText( formatterDolar.format(cuenta.balance) ), */
                balance: this.setMoney( cuenta.balance ),

                descripcion: this.setText( cuenta.descripcion ),

                banco: this.setText( cuenta.banco.nombre ),
                tipo: this.setText( cuenta.tipo.tipo ),
                estatus: this.setText( cuenta.estatus.estatus ),
                
                fecha: this.setDateTable( cuenta.created_at )
            } )
        })
        this.setState({
            ... this.state,
            cuentas: aux
        })
    }

    setDateTable = date => {
        return(
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setText = text => {
        return(
            <Small className="">
                { text }
            </Small>
        )
    }

    setMoney = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }

    setActions = cuenta => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(cuenta)}  text='' icon={faEdit} 
                        color="transparent" />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(cuenta) } text='' icon={faTrash} color="red" />
                </div>
            </>
        )
    }

    setOptions = (array, name) => {
        const { form } = this.state
        let aux = []
        array.map((element, key) => {
            if(key === 0)
            {
                switch(name){
                    case 'nombre':
                        form['banco'] = element.id
                        break;
                    default:
                        form[name] = element.id
                        break;
                }
                this.setState({
                    ... this.state,
                    form
                })
            }
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            cuenta: null
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            cuenta: null
        })
    }

    openModal = () => {
        this.setState({
            modal: true,
            cuenta: null
        })
    }

    openModalEdit = e => cuenta => {
        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : '',
            tipo: cuenta.tipo ? cuenta.tipo.id : '',
            estatus: cuenta.estatus ? cuenta.estatus.id : '',
        }
        
        this.setState({
            modal: true,
            cuenta:cuenta,
            form: aux
        })
    }

    openModalDelete = e => cuenta => {
        
        this.setState({
            modalDelete: true,
            cuenta:cuenta
        })
    }

    // Axios

    // Get

    async getCuentas(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { bancos, estatus, tipo, cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    bancos: this.setOptions(bancos, 'nombre'),
                    estatus: this.setOptions(estatus, 'estatus'),
                    tipos: this.setOptions(tipo, 'tipo')
                })
                
                console.log('state', this.state)
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
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    // Post

    async addCuentaAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'cuentas', form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modal: false,
                    form: this.setEmptyForm
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta agregada con éxito',
                    icon: 'success',
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
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    // PUT

    async editCuentaAxios(){
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.put(URL_DEV + 'cuentas/' + cuenta.id, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modal: false,
                    form: this.setEmptyForm,
                    cuenta: null
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta editada con éxito',
                    icon: 'success',
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
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    //delete
    async deleteCuentaAxios(){
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas } = response.data
                this.setCuentas(cuentas)
                this.setState({
                    modalDelete: false,
                    cuenta: null
                })
                swal({
                    title: '¡Felicidades!',
                    text: 'Cuenta eliminada con éxito',
                    icon: 'success',
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
                    });
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render(){
        const { modal, modalDelete, bancos, estatus, tipos, form, cuentas, cuenta } = this.state
        return(
            <Layout active={'leads'}  { ...this.props}>
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" />
                </div>
                <DataTable columns = { CUENTAS_COLUMNS } data = { cuentas } />
                
                <Modal show = { modal } handleClose={ this.handleClose } >
                    <CuentaForm title = { cuenta === null ? "Nueva cuenta" : 'Editar cuenta'} bancos = { bancos } estatus = { estatus } tipos = { tipos } 
                        form = { form }  onChange = { this.onChange } onSubmit = { cuenta === null ? this.onSubmit : this.onEditSubmit } />
                </Modal>
                <Modal show = { modalDelete } handleClose = { this.handleDeleteModal } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar la cuenta <B color="red">{cuenta && cuenta.nombre}</B>?
                    </Subtitle>
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick = { this.handleDeleteModal } text="Cancelar" className="mr-3" color="green"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cuentas);