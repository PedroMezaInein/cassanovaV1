import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux' 
import { Modal, ModalDelete } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, TRASPASOS_COLUMNS } from '../../constants'
import { TraspasoForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, B } from '../../components/texts' 
import NumberFormat from 'react-number-format'; 
import NewTable from '../../components/tables/NewTable'
import { forbiddenAccessAlert, errorAlert, waitAlert } from '../../functions/alert'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable} from '../../functions/setters'

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
        formeditado:0,
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
            modal: true,
            formeditado:0
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
            form,
            formeditado:1
        })
    }
    adjuntoTranspaso = (traspaso) => {
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

    setTraspasos = traspasos => {
        let _aux = []
        traspasos.map( (traspaso) => {
            _aux.push({
                actions: this.setActions(traspaso),
                identificador: renderToString(setTextTable(traspaso.id)),
                origen: renderToString(setArrayTable(
                    traspaso.origen ?
                        [
                            {name: 'Nombre', text: traspaso.origen.nombre},
                            {name: '# cuenta', text: traspaso.origen.numero}
                        ]
                    : []
                )),
                destino: renderToString(setArrayTable(
                    traspaso.destino ?
                        [
                            {name: 'Nombre', text: traspaso.destino.nombre},
                            {name: '# cuenta', text: traspaso.destino.numero}
                        ]
                    : []
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
                    text: 'Adjunto',
                    btnclass: 'primary',
                    iconclass: 'flaticon-file-2', 
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
            console.log(error, 'error catch')
            console.log(error, 'error catch')
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
                const { data } = this.state
                data.traspasos = traspasos
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
                    traspaso: '',
                    data
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
            console.log(error, 'error catch')
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
                const { data } = this.state
                data.traspasos = traspasos
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
                    traspaso: '',
                    data
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
            console.log(error, 'error catch')
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
                const { data } = this.state
                data.traspasos = traspasos
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
                    traspaso: '',
                    data
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
            console.log(error, 'error catch')
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.',
                icon: 'error'
            })
        })
    }

    async exportTraspasosAxios(){

        waitAlert()

        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'exportar/traspasos', { responseType:'blob', headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'traspasos.xlsx');
                document.body.appendChild(link);
                link.click();

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){

        const { modal, modalDelete, cuentas, form, traspasos, traspaso, data, formeditado} = this.state

        return(
            <Layout active={'bancos'}  { ...this.props}>
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
                    elements={data.traspasos} 
                    idTable = 'kt_datatable_transpasos'
                    exportar_boton={true} 
                    onClickExport={() => this.exportTraspasosAxios()}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />


                <Modal size="xl" title = { traspaso === '' ? "Nuevo traspaso" : 'Editar traspaso'}  show = { modal } handleClose={ this.handleClose } >
                    <TraspasoForm cuentas = { cuentas } form = { form } onChange = { this.onchange } onChangeAdjunto = { this.onChangeAdjunto } 
                        deleteAdjunto = { this.deleteAdjunto }
                        onSubmit = { traspaso === '' ? this.onSubmit : this.onSubmitEdit } 
                        formeditado={formeditado}/>
                </Modal>

                <ModalDelete title={"¿Estás seguro que deseas eliminar el traspaso?"} show = { modalDelete } handleClose={ this.handleCloseDelete }  onClick = { (e) => { this.safeDelete(e)() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Traspasos);