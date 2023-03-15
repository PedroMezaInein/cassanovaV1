import React, { Component } from 'react' 
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout' 
import { Modal, ModalDelete} from '../../../components/singles' 
import { NOMINA_OBRA_COLUMNS, URL_DEV, ADJUNTOS_COLUMNS} from '../../../constants'
import NewTableServerRender from '../../../components/tables/NewTableServerRender' 
import { AdjuntosForm} from '../../../components/forms'
import { setOptions, setDateTable, setMoneyTable, setTextTable, setAdjuntosList, setTextTableCenter} from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, deleteAlert, doneAlert} from '../../../functions/alert'
import TableForModals from '../../../components/tables/TableForModals'
import $ from "jquery";
import { setSingleHeader } from '../../../functions/routers'

import ExportarNominaObra from './ExportarNominaObra'

class NominaObra extends Component {
    state = {  
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
            filterExport: false,
        },
        data:{
            adjuntos: []
        },
        title: 'Nueva nómina de obra',
        form:{
            periodo : '',
            empresas: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nominasObra:[{
                usuario: '',
                proyecto: '',
                salario_hr: '',
                salario_hr_extra: '',
                hr_trabajadas: '',
                hr_extra: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }],
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: { 
            proyectos: [],
            usuarios: [],
            empresas:[]
        }
    }

    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const nominaobra = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!nominaobra)
            history.push('/')
            this.getOptionsAxios()
    }

    openModalExportarFiltrar = () => {
        const { modal } = this.state
        modal.filterExport = true
        this.setState({ ...this.state, modal })
    }
    
    changeSinglePage = (nomina) => {
        const { history } = this.props
        history.push({
            pathname: '/rh/nomina-obras/single/'+nomina.id,
            state: { nomina: nomina }
        });
    }

    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/rh/nomina-obras/add'
        });
    }

    changePageEdit = (nomina) => {
        const { history } = this.props
        history.push({
            pathname: '/rh/nomina-obras/edit',
            state: { nomina: nomina}
        });
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ...this.state,
            modal,
            form: this.clearForm(),
            formeditado:0,
            title: 'Nueva nómina obra',
        })
    }

    openModalEdit = nomina => {
        const { modal, form } = this.state
        modal.form = true

        form.periodo = nomina.periodo
        form.empresa = nomina.empresa ? nomina.empresa.id.toString() : ''
        form.fechaInicio = new Date(nomina.fecha_inicio)
        form.fechaFin = nomina.fecha_fin ? new Date(nomina.fecha_fin) : ''

        let aux = [] 
        nomina.nominas_obras.map( (nom, key) => {
            aux.push(
                {
                    usuario: nom.empleado ? nom.empleado.id.toString() : '',
                    proyecto: nom.proyecto ? nom.proyecto.id.toString() : '',
                    salario_hr: nom.salario_hr,
                    salario_hr_extra: nom.salario_hr_extra,
                    hr_trabajadas: nom.hr_trabajadas,
                    hr_extra: nom.hr_extra,
                    nominImss: nom.nomina_imss,
                    restanteNomina:nom.restante_nomina,
                    extras:nom.extras
                }
            )
            return false
        })

        if(aux.length){
            form.nominasObra = aux
        }else{
            form.nominasObra = [{
                usuario: '',
                proyecto: '',
                salario_hr: '',
                salario_hr_extra: '', 
                hr_trabajadas: '',
                hr_extra: '',
                nominImss: '',
                restanteNomina: '',
                extras: ''
            }]
        }

        this.setState({
            ...this.state,
            modal,
            title: 'Editar nómina obra',
            nomina: nomina,
            form,
            formeditado:1
        })
    }

    openModalDelete = nomina => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            nomina: nomina
        })
    }

    openModalAdjuntos = nomina => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = nomina.adjuntos
        this.setState({
            ...this.state,
            modal,
            nomina: nomina,
            data,
            form: this.clearForm(),
            adjuntos: this.setAdjuntosTable(data.adjuntos)
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', '', () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                actions: this.setActionsAdjuntos(adjunto),
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                tipo: renderToString(setTextTable(adjunto.pivot.tipo)),
                id: 'adjuntos-' + adjunto.id
            })
            return false
        })
        return aux
    }

    setActionsAdjuntos = adjunto => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
            })
        return aux
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'rh/nomina-obra/options', { responseType:'json', headers: {Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                Swal.close()
                const { proyectos, usuarios, empresas} = response.data
                const { options, data} = this.state
                data.usuarios = usuarios
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['usuarios'] = setOptions( usuarios, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    } 

    async addNominaObraAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'nominasObra':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'adjuntos':
                    break; 
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'rh/nomina-obra', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                this.handleCloseModal()
                this.getNominasAxios()

                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    } 

    async updateNominaObraAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, nomina} = this.state
        
        await axios.put(URL_DEV + 'rh/nomina-obra/' + nomina.id , form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                
                this.getNominasAxios()

                modal.form = false

                this.setState({                    
                    ...this.state,
                    modal,
                    nomina: '',
                    form: this.clearForm()
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue modificado con éxito.')

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteNominaObraAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { nomina} = this.state
        await axios.delete(`${URL_DEV}v2/rh/nomina-obra/${nomina.id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { modal } = this.state
                this.getNominasAxios()
                modal.delete = false
                this.setState({                    
                    ...this.state,
                    modal,
                    nomina: '',
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nomina fue eliminada con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addAdjuntoNominaAdminAxios() {

        const { access_token } = this.props.authUser
        const { form, nomina } = this.state
        const data = new FormData();

        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })

        data.append('id', nomina.id)

        await axios.post(URL_DEV + 'rh/nomina-obra/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { nomina } = response.data
                const { data } = this.state
                data.adjuntos = nomina.adjuntos
                //AQUI
                this.getNominasAxios()

                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { nomina } = this.state
        await axios.delete(URL_DEV + 'rh/nomina-obra/' + nomina.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { nomina } = response.data
                const { data } = this.state
                data.adjuntos = nomina.adjuntos
                
                this.getNominasAxios()
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    nomina: nomina,
                    adjuntos: this.setAdjuntosTable(data.adjuntos),
                    data
                })
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state 
        modal.form = false
        this.setState({
            ...this.state,
            modal, 
            form: this.clearForm()
        })
    }

    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal, 
            nomina: ''
        })
    }

    handleCloseAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal, 
            nomina: ''
        })
    }

    handleCloseExport = () => {
        const { modal } = this.state
        modal.filterExport = false
        this.setState({
            ...this.state,
            modal,
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break; 
                case 'nominasObra':
                    form[element] = [{
                        usuarios: '',
                        proyecto: '',
                        empresa:''
                    }]
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
                            files: []
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

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    setNominaObra = nominas => {
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    actions: this.setActions(nomina),
                    periodo: renderToString(setTextTableCenter(nomina.periodo)),
                    fechaInicio: renderToString(setDateTable(nomina.fecha_inicio)),
                    fechaFin: renderToString(setDateTable(nomina.fecha_fin)),
                    totalPagoNomina: renderToString(setMoneyTable(nomina.totalNominaImss)),
                    restanteNomina: renderToString(setMoneyTable(nomina.totalRestanteNomina)),
                    extras: renderToString(setMoneyTable(nomina.totalExtras)),
                    granTotal: renderToString(setMoneyTable(nomina.totalNominaImss + nomina.totalRestanteNomina + nomina.totalExtras)),
                    id: nomina.id
                }
            )
            return false
        })
        return aux
    }

    setActions = nomina => {
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
                tooltip: {id:'delete', text:'Eliminar', type:'error'},
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'show',
                tooltip: { id: 'show', text: 'Mostrar'}
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if(title === 'Editar nómina obra')
            this.updateNominaObraAxios()
        else    
            this.addNominaObraAxios() 
    }

    onChangeNominasObra = (key, e, name) => {
        const { value } = e.target
        const { form, data} = this.state
        if(name === 'usuario'){
            data.usuarios.map( (empleado) => {
                if(value.toString() === empleado.id.toString()){
                    form['nominasObra'][key].nominImss  = empleado.nomina_imss
                    form['nominasObra'][key].salario_hr  = empleado.salario_hr
                    form['nominasObra'][key].salario_hr_extra  = empleado.salario_hr_extra
                }
                return false
            }) 
        }
        form['nominasObra'][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    deleteRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.pop(
            {
                nominasObra:[{
                    usuario: '',
                    proyecto: '',
                    salario_hr: '',
                    salario_hr_extra: '',
                    hr_trabajadas: '',
                    hr_extra: '',
                    nominImss: '',
                    restanteNomina: '',
                    extras: ''
                }]
            }
        )
        this.setState({
            ...this.state,
            form
        })
    }

    async getNominasAxios(){
        $('#kt_datatable2_nomina_obra').DataTable().ajax.reload();
    }
    
    render() {
        const { modal, form, adjuntos, data, options } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <NewTableServerRender   
                    columns = { NOMINA_OBRA_COLUMNS }
                    title = 'Nómina de obra' subtitle = 'Listado de nómina de obra'
                    mostrar_boton={true}
                    url = '/rh/nomina-obras/add'
                    abrir_modal={false} 
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': {function: this.openModalDelete},
                        'adjuntos': { function: this.openModalAdjuntos },
                        'show': { function: this.changeSinglePage }
                    }}
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setNominaObra }
                    urlRender = {URL_DEV + 'rh/nomina-obra'}
                    idTable = 'kt_datatable2_nomina_obra'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                    filtrar_exportar={true}
                    exportarFiltrar={this.openModalExportarFiltrar}
                />
                <ModalDelete title={'¿Desea eliminar la nómina?'} show = { modal.delete } handleClose = { this.handleCloseModalDelete } onClick=  { (e) => { e.preventDefault(); waitAlert(); this.deleteNominaObraAxios() }}>
                </ModalDelete>

                <Modal size="lg" title={"Adjuntos"} show={modal.adjuntos} handleClose={this.handleCloseAdjuntos}>
                    <AdjuntosForm form={form} onChangeAdjunto={this.onChangeAdjunto} clearFiles={this.clearFiles}
                        onSubmit={(e) => { e.preventDefault(); waitAlert(); this.addAdjuntoNominaAdminAxios() }} 
                        adjuntos = {['adjunto']}/>
                    <div className="separator separator-dashed separator-border-2 mb-6 mt-5"></div>
                    <TableForModals
                        columns={ADJUNTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjuntos }
                        }}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
                <Modal size='md' show={modal.filterExport} handleClose={this.handleCloseExport} title='Exportar nómina de obra'>
                    <ExportarNominaObra data={options} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaObra);