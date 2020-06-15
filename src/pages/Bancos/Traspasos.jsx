import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Button, Select, SelectSearch } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS_2, DARK_BLUE, TRASPASOS_COLUMNS } from '../../constants'
import { CuentaForm, TraspasoForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';
import { Form, Badge } from 'react-bootstrap'
import Input from '../../components/form-components/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NewTable from '../../components/tables/NewTable'

import { setOptions, setSelectOptions, setTextTable, setDateTable,setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

class Traspasos extends Component{

    state = {
        modal: false,
        modalDelete: false,
        cuentas: [],
        form:{
            cantidad: '',
            comentario: '',
            origen: '',
            destino: '',
            fecha: new Date(),
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        },
        data:{
            traspasos: []
        },
        traspasos: [],
        traspaso: ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if(!leads)
            history.push('/')
        this.getTraspasos()
    }

    // Form

    onchange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { value, files } = e.target
        const { form } = this.state
        form['adjunto'] = value
        form['adjuntoFile'] = files[0]
        form['adjuntoName'] = files[0].name
        this.setState({
            ... this.state,
            form
        })
    }

    deleteAdjunto = () => {
        const { form } = this.state
        form['adjunto'] = ''
        form['adjuntoFile'] = ''
        form['adjuntoName'] = ''
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e =>{
        e.preventDefault()
        const { origen, destino } = this.state.form
        console.log(origen, destino)
        if(origen === destino){
            swal({
                title: '¡Error!',
                text: 'La cuenta destino y origen son la misma',
                icon: 'error'
            })
        }else{
            swal({
                title: '¡Un momento!',
                text: 'Se está efectuando el traspaso.',
                buttons: false
            })
            this.addTraspasosAxios()
        }
            
    }

    onSubmitEdit = e =>{
        e.preventDefault()
        const { origen, destino } = this.state.form
        if(origen === destino){
            swal({
                title: '¡Error!',
                text: 'La cuenta destino y origen son la misma',
                icon: 'error'
            })
        }else{
            swal({
                title: '¡Un momento!',
                text: 'Se está efectuando el traspaso.',
                buttons: false
            })
            this.editTraspasosAxios()
        }
            
    }

    safeDelete = e => () =>{
        this.deleteTraspasoAxios()
    }


    cleanForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    form[element] = new Date()
                default:
                    form[element] = ''
                    break;
            }
        })
        return form
    }

    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
            traspaso: '',
            form: this.cleanForm()

        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            traspaso: '',
            form: this.cleanForm()

        })
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true
        })
    }

    openEdit = traspaso => {
       
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'cantidad':
                case 'comentario':
                    form[element] = traspaso[element]
                    break;
                case 'origen':
                case 'destino':
                    form[element] = {value: traspaso[element].numero, name: traspaso[element].nombre}
                    form[element] = traspaso[element].nombre
                    break;
                case 'fecha':
                    form[element] = new Date(traspaso['created_at'])
                    break;
                case 'adjunto':
                    form['adjuntoName'] = traspaso['adjunto'] && traspaso['adjunto'].name
                    break;
                default:
                    form[element] = traspaso[element]
                    break;
            }
        })
        form['origen'] = traspaso['origen'].numero
        form['destino'] = traspaso['destino'].numero
        this.setState({
            ... this.state,
            modal: true,
            traspaso: traspaso,
            form
        })
    }
    adjuntoTranspaso = (traspaso) => {
       /* const { history } = this.props
        history.push({
            pathname: traspaso.adjunto.url
         });*/
         var win = window.open( traspaso.adjunto.url, '_blank');
        win.focus();
    }

    openDelete =  (traspaso) => {
       
        this.setState({
            ... this.state,
            modalDelete: true,
            traspaso: traspaso
        })
    }

    // Setters
    setTraspasos = traspasos => {
        let _aux = []
        traspasos.map( (traspaso) => {
            _aux.push({
                actions: this.setActions(traspaso),
                origen: renderToString(setArrayTable(
                    traspaso.origen ?
                        [
                            {name: 'Nombre', text: traspaso.origen.nombre},
                            {name: '# cuenta', text: traspaso.origen.numero}
                        ]
                    : ''
                )),
                destino: renderToString(setArrayTable(
                    traspaso.destino ?
                        [
                            {name: 'Nombre', text: traspaso.destino.nombre},
                            {name: '# cuenta', text: traspaso.destino.numero}
                        ]
                    : ''
                )),
                monto: renderToString(setMoneyTable(traspaso.cantidad)),
                comentario: renderToString(setTextTable(traspaso.comentario)),
                usuario: renderToString(setTextTable(traspaso.user.name)),
                fecha: renderToString(setDateTable(traspaso.created_at)),
                id: traspaso.id
            })
        })
        this.setState({
            ... this.state,
            traspasos: _aux
        })
    }

   /* setActions = traspaso => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openEdit(e)(traspaso)}  text='' icon={faEdit} 
                        color="transparent" tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openDelete(e)(traspaso) } text='' icon={faTrash} 
                        color="red" tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    {
                        traspaso.adjunto && 
                        <a href={traspaso.adjunto.url} target="_blank" className="">
                            <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => console.log(traspaso)}  text='' icon={faPaperclip} 
                                color="transparent" tooltip={{id:'adjuntos', text:'Mostrar adjunto'}} />
                        </a>
                    }
                </div>
            </>
        )
    }
    */

    setActions = traspaso => {
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
            if (traspaso.adjunto) {
                aux.push(                    
                {
                    text: 'Transpasos',
                    btnclass: 'primary',
                    iconclass: 'flaticon-refresh', 
                    action: 'adjuntos',
                    tooltip: {id:'adjuntos', text:'Mostrar adjuntos'}
                }
            )
        }
        
        return aux
    }

    setCuenta = cuenta => {
        return(
            <>
                <div>
                    <Small className="mr-2">
                        Nombre: 
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.nombre}
                        </B>
                    </Small>
                </div>
                <div>
                    <Small className="mr-2">
                        Número
                    </Small>
                    <Small color="gold">
                        <B>
                            {cuenta.numero}
                        </B>
                    </Small>
                </div>
            </>
        )
    }

    setText = text => {
        return(
            <Small>
                { text }
            </Small>
        )
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

    setMoney = value => {
        return(
            <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                    renderText = { value => <Small> { value } </Small> } />
        )
    }

    // AXIOS

    async getTraspasos(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'traspasos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = this.state
                const { cuentas, traspasos } = response.data                
                data.traspasos = traspasos
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta, key) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    cuentas: aux,   
                    data                
                    //traspasos:this.setTraspasos(traspasos)
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async addTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        const aux = Object.keys(form)
        aux.map((element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                data.append(element, form[element])
            }
        })
        await axios.post(URL_DEV + 'traspasos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal.close()
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async deleteTraspasoAxios(){
        const { access_token } = this.props.authUser
        const { traspaso } = this.state
        await axios.delete(URL_DEV + 'traspasos/' + traspaso.id, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste el traspaso con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async editTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form, traspaso } = this.state
        const data = new FormData();
        const aux = Object.keys(form)
        aux.map((element) => {
            if(element === 'fecha')
                data.append(element, (new Date(form[element])).toDateString())
            else{
                data.append(element, form[element])
            }
        })
        await axios.post(URL_DEV + 'traspasos/' + traspaso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { cuentas, traspasos } = response.data
                this.setTraspasos(traspasos)
                let aux =  []
                cuentas.map((cuenta) => {
                    aux.push({value: cuenta.numero, name: cuenta.nombre})
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    cuentas: aux,
                    form: this.cleanForm,
                    traspaso: ''
                })
                swal.close()
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
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    render(){

        const { modal, modalDelete, cuentas, form, traspasos, traspaso, data} = this.state

        return(
            <Layout active={'bancos'}  { ...this.props}>
                {/* <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={ (e) => { this.openModal() } } text='' icon={faPlus} color="green" />
                </div>
                <DataTable columns = { TRASPASOS_COLUMNS } data = { traspasos } />
                */}
                <NewTable columns={TRASPASOS_COLUMNS} data={traspasos}
                    title='Traspasos' subtitle='Listado de traspasos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    onClick={this.openModal}
                    mostrar_acciones={true}

                    actions={{
                        'edit': { function: this.openEdit },
                        'delete': { function: this.openDelete },
                        'adjuntos': { function: this.adjuntoTranspaso },
                    }}
                    elements={data.traspasos} />


                <Modal title = { traspaso === '' ? "Nuevo traspaso" : 'Editar traspaso'}  show = { modal } handleClose={ this.handleClose } >
                    <TraspasoForm cuentas = { cuentas } form = { form } onChange = { this.onchange } onChangeAdjunto = { this.onChangeAdjunto } 
                        deleteAdjunto = { this.deleteAdjunto }
                        onSubmit = { traspaso === '' ? this.onSubmit : this.onSubmitEdit } />
                </Modal>
                <Modal show = { modalDelete } handleClose={ this.handleCloseDelete } >
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el traspaso?
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

export default connect(mapStateToProps, mapDispatchToProps)(Traspasos);