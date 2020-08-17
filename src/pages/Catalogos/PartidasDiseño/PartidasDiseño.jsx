import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Title, Subtitle, P, Small, B } from '../../../components/texts'
import { Button } from '../../../components/form-components'
import { Card, Modal, ModalDelete } from '../../../components/singles'
import { RegisterUserForm, PermisosForm, ClienteUserForm } from '../../../components/forms'
import swal from 'sweetalert'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { forbiddenAccessAlert, errorAlert, waitAlert } from '../../../functions/alert'
import modal from '../../../components/singles/Modal'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { USUARIOS, PARTIDAS_DISEÑO_COLUMNS } from '../../../constants'
import { save, deleteForm } from '../../../redux/reducers/formulario'
import FloatButtons from '../../../components/singles/FloatButtons'
import { setTextTable,setListTable } from '../../../functions/setters'
import { renderToString } from 'react-dom/server'
import { Tabs, Tab } from 'react-bootstrap' 

const $ = require('jquery');

class PartidasDiseño extends Component {

    state = {
        key: 'inein',
        partidas: [],
        partida: '',
        modal: {
            delete: false,
        },
        title: 'Nueva partida',
        form: {
            partida: '',
            empresa: 'inein',
        },
        data:{
            partidas:[],
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const partidas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!partidas)
            history.push('/')
    }

    changePageEdit = partida => {
        const { history } = this.props
        history.push({
            pathname: '/catalogos/partidas-diseño/edit',
            state: { partida: partida}
        });
    }

    openModalDelete = (partida) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            partida: partida
        })
    }

    async deletePartidaDiseñoAxios() {
        const { access_token } = this.props.authUser
        const { partida } = this.state
        await axios.delete(URL_DEV + 'partidas-diseño/' + partida.id, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                
                const { partidas } = response.data
                const { modal, key } = this.state

                if(key === 'inein'){
                    this.getIneinAxios()
                }
                if(key === 'im'){
                    this.getImAxios()
                }

                modal.delete = false
                
                this.setState({
                    ... this.state,
                    modal,
                    form: this.clearForm(),
                    partida: ''
                })
                
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito al usuario.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            modal,
            partida: ''
        })
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'empresa':
                    form[element] = 'inein'
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    setPartidaDiseño = ( partidas ) => {
        let aux = []
        partidas.map((partida) => {
            aux.push({
                actions: this.setActions(partida),
                partida: renderToString(setTextTable(partida.nombre)),
                id: partida.id
            })
        })
        return aux
    }

    setActions= () => {
        let aux = []
            aux.push(
                {
                    text: 'Editar',
                    btnclass: 'success',
                    iconclass: 'flaticon2-pen',
                    action: 'edit',
                    tooltip: {id:'edit', text:'Editar'},
                },
                {
                    text: 'Eliminar',
                    btnclass: 'danger',
                    iconclass: 'flaticon2-rubbish-bin',                  
                    action: 'delete',
                    tooltip: {id:'delete', text:'Eliminar', type:'error'},
                }       
        ) 
        return aux 
    }

    onChange = (e) => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        const { form, key} = this.state
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if(title === 'Editar usuario'){
            if(key === 'inein'){
                form.empresa = key
                this.updatePartidaDiseñoAxios()
            }    
        }else{
            if(key === 'im'){
                this.addPartidaDiseñoAxios()
                form.empresa = key
            }
        }
    }

    async getIneinAxios() {
        $('#kt_datatable_partida_inein').DataTable().ajax.reload();
    }

    async getImAxios() {
        $('#kt_datatable_partida_im').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if(value === 'inein'){
            this.getIneinAxios()
        }
        if(value === 'im'){
            this.getImAxios()
        }
        this.setState({
            ... this.state,
            key: value,
            form
        })
    }


    render(){
        const { modal, title, partida, form, key, formeditado} = this.state
        const { formulario } = this.props
        return (
            <Layout active = { 'usuarios' }  { ...this.props } >
                <Tabs defaultActiveKey="inein" activeKey={key} onSelect = { (value) =>  { this.controlledTab(value)} }>
                    <Tab eventKey="inein" title="INEIN">
                        <NewTableServerRender
                            columns={PARTIDAS_DISEÑO_COLUMNS}
                            title='Partida de diseño'
                            subtitle='Listado de partidas'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/catalogos/partidas-diseño/add'
                            mostrar_acciones={true}
                            actions={
                                {
                                    'edit': { function:this.changePageEdit},
                                    'delete': { function: this.openModalDelete }
                                }
                            }
                            accessToken={this.props.authUser.access_token}
                            setter={this.setPartidaDiseño}
                            urlRender={URL_DEV + 'partidas-diseño/inein'}
                            idTable='kt_datatable_partida_inein'
                            cardTable='cardTable_partida_INEIN'
                            cardTableHeader='cardTableHeader_partida_INEIN'
                            cardBody='cardBody_partida_INEIN'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="im" title="IM">
                        <NewTableServerRender
                            columns={PARTIDAS_DISEÑO_COLUMNS}
                            title='Partida de diseño'
                            subtitle='Listado de partidas'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url = '/catalogos/partidas-diseño/add'
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function:this.changePageEdit},
                                'delete': { function: this.openModalDelete }
                            }}
                            accessToken={this.props.authUser.access_token}
                            setter={this.setPartidaDiseño}
                            urlRender={URL_DEV + 'partidas-diseño/im'}
                            idTable='kt_datatable_partida_im'
                            cardTable='cardTable_partida_IM'
                            cardTableHeader='cardTableHeader_partida_IM'
                            cardBody='cardBody_partida_IM'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>

                <ModalDelete 
                    title =  "¿Estás seguro que deseas eliminar la partida?"
                    show = { modal.delete } handleClose = { this.handleCloseDelete } 
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deletePartidaDiseñoAxios() }}>
                </ModalDelete>

            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}

const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PartidasDiseño);