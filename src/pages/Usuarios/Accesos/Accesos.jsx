import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert, customInputAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV, ACCESOS_COLUMNS, TEL } from '../../../constants'
import Swal from 'sweetalert2';
import $ from "jquery";
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { setTextTableReactDom, setClipboardArrayTableReactDom, setTextTableCenter, setTagLabelReactDom } from '../../../functions/setters'
import { ModalDelete } from '../../../components/singles'
import { printSwalHeader } from '../../../functions/printers'
import { InputPasswordGray, InputGray, InputPhoneGray } from '../../../components/form-components'
import { Update } from '../../../components/Lottie'
import { setSingleHeader } from '../../../functions/routers'
class Accesos extends Component {

    state = {
        modalDelete: false,
        accesos: [],
        acceso:'',
        form: {
            plataforma: '',
            url: '',
            usuario: '',
            responsable: '',
            contraseña: '',
            usuarios: [],
            correo: '',
            numero: '',
            empresas: [],
            descripcion: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            },
            departamentos: []
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const accessos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!accessos)
            history.push('/')
    }

    changePageEdit = acceso => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/accesos/edit',
            state: { acceso: acceso }
        });
    }
    

    setAccesos = accesos => {
        let aux = []
        accesos.map((acceso) => {
            aux.push(
                {
                    actions: this.setActions(acceso),
                    plataforma: setTextTableReactDom(acceso.plataforma, this.doubleClick, acceso, 'plataforma', 'text-justify'),
                    usuario: setClipboardArrayTableReactDom(
                        [
                            { 'name': 'USUARIO', 'text': acceso.usuario ? acceso.usuario : '-' },
                            { 'name': 'CONTRASEÑA', 'text': acceso.contraseña ? acceso.contraseña : '-', type: 'password' }
                        ],'186px', this.doubleClick, acceso, 'usuario_contraseña'
                    ),
                    correo: setClipboardArrayTableReactDom(
                        [
                            { 'name': 'CORREO', 'text': acceso.correo ? acceso.correo : '-' },
                            { 'name': 'TELÉFONO', 'text': acceso.numero ? acceso.numero : '-' }
                        ],'170px', this.doubleClick, acceso, 'correo_telefono'
                    ),
                    empresa: acceso.empresas.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.empresas, 'empresa_acceso', this.deleteElementAxios, ''),
                    responsables: acceso.usuarios.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.usuarios, 'responsables_acceso', this.deleteElementAxios, 'min-width-136px'),
                    departamento: acceso.departamentos.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.departamentos, 'departamento_acceso', this.deleteElementAxios,''),
                    descripcion: setTextTableReactDom(acceso.descripcion, this.doubleClick, acceso, 'descripcion', 'text-justify'),
                    id: acceso.id
                }
            )
            return false
        })
        return aux
    }

    deleteElementAxios = async(acceso, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/usuarios/accesos/${acceso.id}/${tipo}/${element.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                this.getAccesoTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El acceso fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAccesoAxios () {
        const { access_token } = this.props.authUser
        const { acceso } = this.state
        await axios.delete(URL_DEV + 'accesos/' + acceso.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getAccesoTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La acceso fue eliminado con éxito.')
                this.setState({ ...this.state, modalDelete: false })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    patchAcceso = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'usuario_contraseña':
                value = { usuario: form.usuario, contraseña: form.contraseña }
                break
            case 'correo_telefono':
                value = { correo: form.correo, telefono: form.telefono }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/accesos/${tipo}/${data.id}`, { value: value }, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                this.getAccesoTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El acceso fue editada con éxito') 
            }, 
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    async getAccesoTable() {
        $('#kt_datatable_acceso').DataTable().ajax.reload();
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'usuario_contraseña':
                form.usuario = data.usuario
                form.contraseña = data.contraseña
                break;
            case 'correo_telefono':
                form.correo = data.correo
                form.telefono = data.numero
                break;
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form, options})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    (tipo === 'plataforma') ?
                        <InputGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                    :<></>
                }
                {
                    tipo === 'usuario_contraseña' &&
                    <>
                        <InputGray withformgroup = { 1 } withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="USUARIO"
                            requirevalidation = { 0 }  value = { form.usuario} name = { 'usuario' } letterCase = { false } iconclass={"fas fa-user"}
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'usuario')} } swal = { true } />
                        
                        <InputPasswordGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="CONTRASEÑA"
                            requirevalidation = { 0 } value = { form.contraseña } name = "contraseña" letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'correo')} } swal = { true }  />
                    </>
                }
                {
                    tipo === 'correo_telefono' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="CORREO ELECTRÓNICO"
                            requirevalidation = { 0 }  value = { form.correo} name = { 'correo' } letterCase = { false } iconclass={"fas fa-envelope"}
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'correo')} } swal = { true } />
                        
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="telefono" value={form.telefono} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'telefono')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }/>
                }
                </div>,
            <Update />,
            () => { this.patchAcceso(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    
    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }

    openModalDelete = acceso => { this.setState({ ...this.state, modalDelete: true, acceso: acceso }) }

    handleCloseDelete = () => { this.setState({ ...this.state, modalDelete: false, acceso: '' }) }

    render() {
        const { modalDelete } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <NewTableServerRender columns = { ACCESOS_COLUMNS } title = 'Accesos' subtitle = 'Listado de accesos' mostrar_boton = { true } 
                    abrir_modal = { false } url = '/usuarios/accesos/add' mostrar_acciones = { true } exportar_boton = { false }
                    actions = { {  'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete } } }
                    accessToken = { this.props.authUser.access_token } setter = { this.setAccesos } urlRender = { `${URL_DEV}v2/usuarios/accesos` }
                    idTable = 'kt_datatable_acceso' cardTable = 'cardTable' cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' />
                <ModalDelete title="¿Estás seguro que deseas eliminar el acceso?" show={modalDelete} handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); this.deleteAccesoAxios() }} />
            </Layout >
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Accesos);