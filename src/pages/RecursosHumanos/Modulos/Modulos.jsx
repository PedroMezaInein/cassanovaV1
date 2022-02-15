import React, { Component } from 'react'
import $ from 'jquery'
import S3 from 'react-aws-s3'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Modal } from '../../../components/singles'
import Layout from '../../../components/layout/layout'
import { NewTable } from '../../../components/NewTables'
import { AdjuntosRForm} from '../../../components/forms'
import { setDateTableReactDom,setTextTableCenter,setNaviIcon,setEstatusTableReactDom, setOptionsWithLabel,setMoneyTable,setArrayTableReactDom,setClipboardArrayTableReactDom } from '../../../functions/setters'
import {  Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap'
import { URL_DEV, REPSE, PATRONAL,SIROC ,COLABORADOR ,RECIBOS , SIPARE, CLAVES } from '../../../constants'
import { apiDelete, apiPostFormResponseBlob, catchErrors,apiOptions, apiGet, apiPutForm} from '../../../functions/api'
import { deleteAlert, doneAlert, printResponseErrorAlert, waitAlert, questionAlert, errorAlert, createAlertSA2WithActionOnClose } from '../../../functions/alert'
import { RepseFilters } from '../../../components/filters'
import axios from 'axios'
import moment from 'moment'

class Modulo extends Component {

    state = {
        modal:{
            filters: false,
            adjuntos: false,
            see: false
        },
        title: 'Nueva Repse',
        licencia: '',
        key:'Repse',
        adjuntos: [],

        options: {
            empresas: [],
            patronal: [],
            repse: [],
            subareas: [],
            clientes: [],
            proyectos: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: []
        },
        form: {
            nombre_repse: '',  
            registro: '', 
            nombre_patronal: '',   
            r_obra: '',  
            proyecto: '',
            repse: '',  
            patronal: '',  
            empresas: '',  
            type: '',
            adjuntos: {
                repse: {
                    value: '',
                    placeholder: 'Adjunto repse',
                    files: []
                },
                siroc: {
                    value: '',
                    placeholder: 'Adjunto siroc',
                    files: []
                },
                patronal: {
                    value: '',
                    placeholder: 'Adjunto patronal',
                    files: []
                },
                nomina: {
                    value: '',
                    placeholder: 'Adjunto recibos de nomina',
                    files: []
                },
                sipare: {
                    value: '',
                    placeholder: 'Adjunto sipare',
                    files: []
                },
                claves: {
                    value: '',
                    placeholder: 'Adjunto claves y accesos',
                    files: []
                },
                isn: {
                    value: '',
                    placeholder: 'Adjunto ISN',
                    files: []
                },
            }
        },
        data: {
            clientes: [],
            empresas: [],
            repse: [],
            siroc: [],
            nomina: [],
            sipare: [],
            claves: [],
            isn: [],
            patronal: [], 
            proyectos: [],
            ventas: [],
            adjuntos: []
        },
        titulo1: 'Listado de Repse',
        titulo2: 'Listado de Patronal',
        titulo3: 'Listado de Siroc',
        titulo4: 'Listado de Colaborador de Obra',
        titulo5: 'Listado de Recibos de nomina',
        titulo6: 'Listado de Sipare',
        titulo7: 'Listado de Acceso y claves',
        titulo8: 'Listado de Isn',
        filters: {},

    }

    async getEmpleadosAxios() {
        $('#repse').DataTable().ajax.reload();
        $('#repse').DataTable().ajax.reload();
        $('#repse').DataTable().ajax.reload();
        $('#isn').DataTable().ajax.reload();
    }

    controlledTab = value => {
        const { form } = this.state
        if (value === 'repse') { 
            this.getEmpleadosAxios()
        }
        if (value === 'patronal') {
            this.getEmpleadosAxios()
        }
        if (value === 'siroc') {
            this.getEmpleadosAxios()
        }
        if (value === 'Colaborador') {
            this.getEmpleadosAxios()
        }
        if (value === 'Nomina') {
            this.getEmpleadosAxios()
        }
        if (value === 'sipare') {
            this.getEmpleadosAxios()
        }
        if (value === 'claves') {
            this.getEmpleadosAxios()
        }
        if (value === 'isn') {
            this.getEmpleadosAxios()
        }
        this.setState({ ...this.state, key: value, form })
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const ventas = permisos.find(function (venta, index) {
            const { modulo: { url } } = venta
            return pathname === url
        });
        if (!ventas)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { modal, filters } = this.state
                filters.identificador = id
                modal.see = true
                this.setState({ ...this.state, modal, filters })
                this.reloadTable(filters)
                this.getVentaAxios(id)
            }
        }
    }

    getOptionsAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions(`v2/proyectos/ventas`, access_token).then(
            (response) => {
                const { empresas, repse, patronal, proyectos } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptionsWithLabel(empresas, 'name', 'id')
                options['repse'] = setOptionsWithLabel(repse, 'name', 'id')
                options['patronal'] = setOptionsWithLabel(patronal, 'name', 'id')
                options['proyectos'] = setOptionsWithLabel(proyectos, 'nombre', 'id')
                data.empresas = empresas
                Swal.close()
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    setTableRepse = (datos) => {
        const { data } = this.state
        let aux = []
        this.setState({
            data
        })
        datos.forEach((repse) => {
            aux.push(
                {
                    actions: this.setActions(repse),
                    empresa: setTextTableCenter(repse.empresas ? repse.empresas.name : ''),
                    repse: setTextTableCenter(repse.name ? repse.name : '', this.doubleClick, repse, 'name', 'text-center'),
                    estatus: repse.estatus ? setEstatusTableReactDom(repse, this.changeEstatus ) : '',
                    fecha: setDateTableReactDom(repse.fecha_alta, this.doubleClick, repse, 'fecha', 'text-center'),
                    id: repse.id,
                }
            )
        })

        return aux        
    }

    setTablePatronal = (datos) => {
        const { data } = this.state
        let aux = []
        this.setState({
            data
        })
        datos.forEach((patronal) => {
            aux.push(
                {
                    actions: this.setActions(patronal),
                    empresa: setTextTableCenter(patronal.empresas ? patronal.empresas.name : ''),
                    patronal: setTextTableCenter(patronal.name_patronal ? patronal.name_patronal : '', this.doubleClick, patronal, 'patronal', 'text-center'),
                    folio: setTextTableCenter(patronal.folio ? patronal.folio : '', this.doubleClick, patronal, 'folio', 'text-center'),
                    fecha: setDateTableReactDom(patronal.fecha_alta, this.doubleClick, patronal, 'fecha', 'text-center'),
                    estatus: patronal.estatus ? setEstatusTableReactDom(patronal, this.changeEstatus ) : '',

                    id: patronal.id,
                }
            )
        })

        return aux        
    }

    setTableSiroc = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((siroc) => {
            aux.push(
                {
                    actions: this.setActions(siroc),
                    proyecto: setTextTableCenter(siroc.proyecto_id ? siroc.proyecto.nombre : '', this.doubleClick, siroc, 'proyecto', 'text-center'),
                    repse: setTextTableCenter(siroc.repse_id ? siroc.repse.name : '', this.doubleClick, siroc, 'repse', 'text-center'),
                    patronal: setTextTableCenter(siroc.repse_id ? siroc.patronal.name_patronal : '', this.doubleClick, siroc, 'patronal', 'text-center'),
                    fecha: setDateTableReactDom(siroc.fecha_alta, this.doubleClick, siroc, 'fecha', 'text-center'),
                    obra: setTextTableCenter(siroc.no_obra, this.doubleClick, siroc, 'obra', 'text-center'),
                    folio: setTextTableCenter(siroc.folio, this.doubleClick, siroc, 'folio', 'text-center'),
                    estatus: siroc.estatus ? setEstatusTableReactDom(siroc, this.changeEstatus ) : '',
                   
                    id: siroc.id,

                }
            )

        })

        return aux        
    }

    setTableColaborador = (datos) => {
       
    }

    setTableNomina = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((nomina) => {
            aux.push(
                {
                    actions: this.setActions(nomina),
                    empresa: setTextTableCenter(nomina.empresas ? nomina.empresas.name : ''),
                    periodo:setArrayTableReactDom(
                        [
                            { 'name': 'Fecha inicio', 'text': nomina.fecha_inicio ? moment(nomina.fecha_inicio).format("DD/MM/YYYY") : 'Sin definir' },
                            { 'name': 'Fecha Fin', 'text': nomina.fecha_fin ? moment(nomina.fecha_fin).format("DD/MM/YYYY") : 'Sin definir' },
                        ],'50px', this.doubleClick, nomina, 'periodo' ,'text-center'
                    ),
                    estatus: nomina.estatus ? setEstatusTableReactDom(nomina, this.changeEstatus ) : '',
                    id: nomina.id,
                }
            )

        })

        return aux        
    }

    setTableSipare = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((sipare) => {
            aux.push(
                {
                    actions: this.setActions(sipare),
                    empresa: setTextTableCenter(sipare.empresas ? sipare.empresas.name : ''),
                    periodo:setArrayTableReactDom(
                        [
                            { 'name': 'Fecha inicio', 'text': sipare.fecha_inicio ? moment(sipare.fecha_inicio).format("DD/MM/YYYY") : 'Sin definir' },
                            { 'name': 'Fecha Fin', 'text': sipare.fecha_fin ? moment(sipare.fecha_fin).format("DD/MM/YYYY") : 'Sin definir' },
                        ],'50px', this.doubleClick, sipare, 'periodo' ,'text-center'
                    ),
                    captura: setTextTableCenter(sipare.linea_captura ? sipare.linea_captura : 'Sin Linea de captura'),
                    monto: setMoneyTable(sipare.monto ? sipare.monto : ''),
                    estatus: sipare.estatus ? setEstatusTableReactDom(sipare, this.changeEstatus ) : '',
                    id: sipare.id,
                }
            )

        })

        return aux        
    }

    setTableAccesos = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((accesos) => {
            aux.push(
                {
                    actions: this.setActions(accesos),
                    estatus: accesos.estatus ? setEstatusTableReactDom(accesos, this.changeEstatus ) : '',
                    plataforma: setTextTableCenter(accesos.plataforma ? accesos.plataforma : ''),
                    liga: setTextTableCenter(accesos.url ? accesos.url : ''),
                    usuario: setClipboardArrayTableReactDom(
                        [
                            { 'name': 'USUARIO', 'text': accesos.usuario ? accesos.usuario : '-' },
                            { 'name': 'CONTRASEÑA', 'text': accesos.password ? accesos.password : '-', type: 'password' }
                        ],'186px', this.doubleClick, accesos, 'usuario_contraseña'
                    ),
                    id: accesos.id,
                }
            )

        })

        return aux        
    }

    setTableIsn = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((isn) => {
            aux.push(
                {
                    actions: this.setActions(isn),
                    empresa: setTextTableCenter(isn.empresas ? isn.empresas.name : ''),
                    periodo:setArrayTableReactDom(
                        [
                            { 'name': 'Fecha inicio', 'text': isn.fecha_inicio ? moment(isn.fecha_inicio).format("DD/MM/YYYY") : 'Sin definir' },
                            { 'name': 'Fecha Fin', 'text': isn.fecha_fin ? moment(isn.fecha_fin).format("DD/MM/YYYY") : 'Sin definir' },
                        ],'50px', this.doubleClick, isn, 'periodo' ,'text-center'
                    ),
                    captura: setTextTableCenter(isn.linea_captura ? isn.linea_captura : 'Sin Linea de captura'),
                    monto: setMoneyTable(isn.monto ? isn.monto : ''),
                    estatus: isn.estatus ? setEstatusTableReactDom(isn, this.changeEstatus ) : '',
                    id: isn.id,
                }
            )

        })

        return aux        
    }

    openModalAdjuntos = async (modulo) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, modal } = this.state
        const { type } = modulo.tabla
        form.type = modulo.tabla
        apiGet(`repse/adjuntos/${modulo.tabla+'_'+modulo.id}`, access_token).then(
            (response) => {
                const { modulo } = response.data

                if(form.type === 'Isn' ){
                    form.adjuntos.isn.files = modulo.adjuntos
                    form.type = 'isn'
                }
                if(form.type === 'Repse' ){
                    form.adjuntos.repse.files = modulo.adjuntos
                    form.type = 'repse'
                }
                if(form.type === 'Registro Patronal' ){
                    form.adjuntos.patronal.files = modulo.adjuntos
                    form.type = 'patronal'
                }
                if(form.type === 'Siroc' ){
                    form.adjuntos.siroc.files = modulo.adjuntos
                    form.type = 'siroc'
                }
                if(form.type === 'Recibos nomina' ){
                    form.adjuntos.nomina.files = modulo.adjuntos
                    form.type = 'nomina'
                }
                if(form.type === 'Sipare' ){
                    form.adjuntos.sipare.files = modulo.adjuntos
                    form.type = 'sipare'
                }
                if(form.type === 'Accesos claves' ){
                    form.adjuntos.claves.files = modulo.adjuntos
                    form.type = 'Accesos claves'
                }

                modal.adjuntos = true
                Swal.close()
                this.setState({ ...this.state, form, modulo, type })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
 
    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { modulo ,key} = this.state

        apiDelete(`repse/${modulo.id+'_'+key}/adjuntos/${id}`, access_token).then(
            (response) => {
                const { form } = this.state

                if(key === 'isn' ){
                    form.adjuntos.isn.files = response.data.isn.adjuntos
                    form.type = 'isn'
                }
                if(key === 'Repse' ){
                    form.adjuntos.repse.files = response.data.repse.adjuntos
                    form.type = 'repse'
                }
                if(key === 'Patronal' ){
                    form.adjuntos.patronal.files = response.data.patronal.adjuntos
                    form.type = 'patronal'
                }
                if(key === 'Siroc' ){
                    form.adjuntos.siroc.files = response.data.siroc.adjuntos
                    form.type = 'siroc'
                }
                if(key === 'Nomina' ){
                    form.adjuntos.nomina.files = response.data.nomina.adjuntos
                    form.type = 'nomina'
                }
                if(key === 'Sipare' ){
                    form.adjuntos.sipare.files = response.data.sipare.adjuntos
                    form.type = 'sipare'
                }
                if(key === 'claves' ){
                    form.adjuntos.claves.files = response.data.claves.adjuntos
                    form.type = 'Accesos claves'
                }

                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    getVentasAxios = tab => {
        $(`#respse`).DataTable().search(JSON.stringify({})).draw();
        this.setState({...this.state, key: tab, filters: {}})
    }

    setTableSipare = (datos) => {
        const { data } = this.state

        let aux = []
        this.setState({
            data
        })
        datos.forEach((isn) => {
            aux.push(
                {
                    actions: this.setActions(isn),
                    empresa: setTextTableCenter(isn.empresas ? isn.empresas.name : ''),
                    periodo:setArrayTableReactDom(
                        [
                            { 'name': 'Fecha Fnicio', 'text': isn.fecha_fin ? isn.fecha_fin : 'Sin definir' },
                            { 'name': 'Fecha Fin', 'text': isn.fecha_inicio ? isn.fecha_inicio : 'Sin definir' },
                        ],'50px', this.doubleClick, isn, 'periodo' ,'text-center'
                    ),
                    captura: setTextTableCenter(isn.linea_captura ? isn.linea_captura : 'Sin Linea de captura'),
                    monto: setMoneyTable(isn.monto ? isn.monto : ''),
                    estatus: isn.estatus ? setEstatusTableReactDom(isn, this.changeEstatus ) : '',
                    id: isn.id,
                }
            )

        })

        return aux        
    }

    handleClose = () => {
        const { modal, data } = this.state
        modal.filters = false
        modal.adjuntos = false
        modal.facturaExtranjera = false
        modal.see = false
        modal.facturas = false
        data.adjuntos = []
        this.setState({
            ...this.state,
            modal,
            data,
            venta: '',
            form: this.clearForm(),
            adjuntos: [],
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = form.adjuntos[item].files
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
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.attachFiles(files, item),
            () => this.cleanAdjuntos(item)
        )
    }

    cleanAdjuntos = (item) => {
        const { form } = this.state
        let aux = []
        form.adjuntos[item].files.map((file) => {
            if(file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        this.setState({...this.state,form})
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
            if (name === 'respse')
                form['respseObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    attachFiles = async(files, item) => {
        waitAlert()
        const { modulo } = this.state
        const { access_token } = this.props.authUser

        apiGet(`v1/constant/admin-proyectos`, access_token).then(
            (response) => {
                const { alma } = response.data
                let filePath = `rh/modulo/${modulo.id}/`
                let aux = ''
                switch(item){
                    case 'repse':
                    case 'sipare':
                    case 'isn':
                    case 'nomina':
                    case 'patronal':
                    case 'siroc':
                        aux = files.map( ( file ) => {
                            return {
                                name: `${filePath}${item}/${Math.floor(Date.now() / 1000)}-${file.name}`,
                                file: file,
                                tipo: item
                            }
                        })
                        break;
                        case 'claves':

                        aux = files.map( ( file ) => {
                            return {
                                name: `${filePath}claves_accesos/${Math.floor(Date.now() / 1000)}-${file.name}`,
                                file: file,
                                tipo: item
                            }
                        })
                        break;
                    default: break;
                }
                let auxPromises  = aux.map((file) => {
                    return new Promise((resolve, reject) => {
                        new S3(alma).uploadFile(file.file, file.name)
                            .then((data) =>{
                                const { location,status } = data
                                if(status === 204) resolve({ name: file.name, url: location, tipo: file.tipo })
                                else reject(data)
                            })
                            .catch((error) => {
                                catchErrors(error)
                                errorAlert(`Ocurrió un error al subir el archivo ${file.name}`)
                                reject(error)
                            })
                    })
                })
                Promise.all(auxPromises).then(values => { this.attachFilesS3(values, item)}).catch(err => console.error(err)) 
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    attachFilesS3 = async(files, item) => {
        const { modulo } = this.state
        const { access_token } = this.props.authUser
        modulo.type = item
        if(item === 'repse'){
            modulo.tabla = 'Repse'
        }
        if(item === 'patronal'){
            modulo.tabla = 'Registro Patronal'
        }
        if(item === 'siroc'){
            modulo.tabla = 'Siroc'
        }
        if(item === 'nomina'){
            modulo.tabla = 'Recibos nomina'
        }
        if(item === 'sipare'){
            modulo.tabla = 'Sipare'
        }
        if(item === 'claves'){
            modulo.tabla = 'Accesos claves'
        }
        if(item === 'isn'){
            modulo.tabla = 'Isn'
        }

        apiPutForm( `repse/${modulo.id}/archivos/s3`, { archivos: files }, access_token ).then(
            ( response ) => {
                doneAlert(`Archivos adjuntados con éxito`, 
                    () => { 
                        switch(item){
                            case 'repse':
                            case 'patronal':
                            case 'siroc':
                            case 'nomina':
                            case 'sipare':
                            case 'claves':
                            case 'isn':
                                this.openModalAdjuntos(modulo)         
                                break;
                            default: break;
                        }
                        
                    }
                )
            }, ( error ) => { printResponseErrorAlert( error ) }
        ).catch( ( error ) => { catchErrors( error ) } )
    }

    setActions = (venta) => {
        const { history } = this.props
        return(
            <div className="w-100 d-flex justify-content-center">
            <DropdownButton menualign="right" title = { <i className="fas fa-chevron-circle-down icon-md p-0"/> } id = 'dropdown-button-newtable' >
                <Dropdown.Item className="text-hover-success dropdown-success" 
                    onClick = { (e) => { 
                            e.preventDefault(); 
                            history.push({ pathname: '/rh/modulo/edit_'+venta.tabla, state: { venta: venta }, formeditado: 1 }) 
                        } } >
                    { setNaviIcon('flaticon2-pen', 'editar') }
                </Dropdown.Item>
                <Dropdown.Item className="text-hover-danger dropdown-danger" 
                    onClick = { (e) => { 
                            e.preventDefault(); 
                            deleteAlert(`¿Deseas continuar?`, `Eliminarás  ${venta.tabla}`, () => { this.deleteVentaAxios(venta.tabla+'_'+venta.id) })
                        } } >
                    { setNaviIcon('flaticon2-rubbish-bin', 'eliminar') }
                </Dropdown.Item>               
                <Dropdown.Item className="text-hover-info dropdown-info" 
                    onClick = { (e) => { 
                            e.preventDefault(); 
                            // this.openModalAdjuntos(venta.tabla+'_'+venta.id)
                            this.openModalAdjuntos(venta)
                        } } >
                    { setNaviIcon('flaticon-attachment', 'Adjuntos') }
                </Dropdown.Item>
                
            </DropdownButton>
        </div>
        )
    }

    async deleteVentaAxios(id) {
        const { access_token } = this.props.authUser
        apiDelete(`repse/${id}`, access_token).then(
            (response) => {

                this.setState({ ...this.state, form: this.clearForm() })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El Repse fue eliminado con éxito.', 
                    () => { this.getRepse() } )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    exportVentasAxios = async() => {
        waitAlert()
        const { key} = this.state
        const { access_token } = this.props.authUser

        apiPostFormResponseBlob(`repse/modulo/exportar`, { columnas: key }, access_token).then(
            (response) => {

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', key+'.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : key+' fueron exportados con éxito.'
                )
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })    
    }

    getRepse = tab => {
        $(`#Repse`).DataTable().search(JSON.stringify({})).draw();
        this.setState({...this.state, key: tab, filters: {}})
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoImpuesto':
                case 'tipoPago':
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        repse: {
                            value: '',
                            placeholder: 'Adjunto repse',
                            files: []
                        },
                        siroc: {
                            value: '',
                            placeholder: 'Adjunto siroc',
                            files: []
                        },
                        patronal: {
                            value: '',
                            placeholder: 'Adjunto patronal',
                            files: []
                        },
                        nomina: {
                            value: '',
                            placeholder: 'Adjunto recibos de nomina',
                            files: []
                        },
                        sipare: {
                            value: '',
                            placeholder: 'Adjunto sipare',
                            files: []
                        },
                        claves: {
                            value: '',
                            placeholder: 'Adjunto claves y accesos',
                            files: []
                        },
                        isn: {
                            value: '',
                            placeholder: 'Adjunto ISN',
                            files: []
                        },
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

    changeEstatus = (estatus, repse) =>  {
        estatus === '1'?
            questionAlert('¿ESTÁS SEGURO?', 'ACTIVARÁS EL COLABORADOR', () => this.changeEstatusAxios('1', repse))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'INHABILITARÁS EL COLABORADOR', () => this.changeEstatusAxios('2', repse))
    }

    async changeEstatusAxios(estatus, repse){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/update/${repse.id}/estatus`,{estatus: estatus}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estatus actualizado con éxito')
                const { key } = this.state
                if (key === 'administrativo')
                    this.getEmpleadosAxios()
                if (key === 'obra')
                    this.getEmpleadosObraAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openModalFiltros = () => {
        const { modal } = this.state
        modal.filters = true
        this.setState({ ...this.state, modal })
    }

    sendFilters = filter => {
        const { modal } = this.state
        modal.filters = false
        this.setState({
            ...this.state,
            filters: filter,
            modal
        })
        this.reloadTable(filter)
    }

    setOptionsArray = (name, array) => {
        const { options } = this.state
        options[name] = setOptionsWithLabel(array, 'nombre', 'id')
        this.setState({ ...this.state, options })
    }

    reloadTable = (filter) => {
        const { key } = this.state
        let arregloFilterKeys = Object.keys(filter)
        let aux = {}
        arregloFilterKeys.forEach((elemento) => {
            switch(elemento){
                case 'area':
                case 'cliente':
                case 'cuenta':
                case 'empresa':
                case 'estatusCompra':
                case 'proyecto':
                case 'subarea':
                case 'isn':
                    break;
                default:
                    aux[elemento] = filter[elemento]
                    break;
            }
        })
        $(`#ventas_${key}`).DataTable().search(JSON.stringify(aux)).draw();
    }

    render() {
        const { authUser: {access_token} } = this.props
        const { modal, options, form,  key, filters , titulo1,titulo2,titulo3,titulo4,titulo5,titulo6,titulo7,titulo8} = this.state

        return (
            <> 
            <Layout active={'rh'} {...this.props}>
                 <Tabs mountOnEnter = { true } unmountOnExit = { true } defaultActiveKey="Repse" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="Repse" title="Repse">
                        <NewTable 
                            tableName = "Repse" subtitle = 'Repse' title = {titulo1}  mostrar_boton = { true }
                            abrir_modal = { false } url = '/rh/modulo/repse' columns = { REPSE }
                            accessToken = { this.props.authUser.access_token } setter = { this.setTableRepse }
                            filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                            urlRender = { `${URL_DEV}repse?tab=Repse` } type='tab'
                        />
                    </Tab>
                    
                    <Tab eventKey="Patronal" title="REGISTRO PATRONAL">
                        <NewTable 
                            tableName = 'Patronal' subtitle = 'Listado de Patronal' title = {titulo2}  mostrar_boton = { true }
                            abrir_modal = { false } url = '/rh/modulo/patronal' columns = { PATRONAL }
                            accessToken = { this.props.authUser.access_token } setter = { this.setTablePatronal }
                            filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                            urlRender = { `${URL_DEV}patronal?tab=Patronal` } type='tab'
                        />
                        
                    </Tab>

                    <Tab eventKey="Siroc" title="SIROC">
                      <NewTable tableName = 'Siroc' subtitle = 'Listado de Siroc' title = {titulo3}  mostrar_boton = { true }
                            abrir_modal = { false } url = '/rh/modulo/siroc' columns = { SIROC }
                            accessToken = { this.props.authUser.access_token } setter = { this.setTableSiroc }
                            filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                            urlRender = { `${URL_DEV}siroc?tab=Siroc` } type='tab'
                        />
                    </Tab>

                    <Tab eventKey="Colaborador" title="COLABORADORES EN OBRA">
                        <NewTable tableName = 'Colaborador' subtitle = 'Listado de Colaborador de Obra' title = {titulo4}  mostrar_boton = { true }
                                abrir_modal = { false } url = '/rh/modulo/Colaborador' columns = { COLABORADOR }
                                accessToken = { this.props.authUser.access_token } setter = { this.setTableSiroc }
                                filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                                urlRender = { `${URL_DEV}siroc?tab=Colaborador` } type='tab'
                            />
                    </Tab>

                    <Tab eventKey="Nomina" title="RECIBOS DE NOMINA">
                        <NewTable tableName = 'Nomina' subtitle = 'Listado de Recibos de Nomina' title = {titulo5}  mostrar_boton = { true }
                                abrir_modal = { false } url = '/rh/modulo/Nomina' columns = { RECIBOS }
                                accessToken = { this.props.authUser.access_token } setter = { this.setTableNomina }
                                filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                                urlRender = { `${URL_DEV}recibos_nomina?tab=Nomina` } type='tab'
                            />
                    </Tab>

                    <Tab eventKey="Sipare" title="SIPARE">
                         <NewTable tableName = 'Sipare' subtitle = 'Listado de Sipare' title = {titulo6}  mostrar_boton = { true }
                                abrir_modal = { false } url = '/rh/modulo/Sipare' columns = { SIPARE }
                                accessToken = { this.props.authUser.access_token } setter = { this.setTableSipare }
                                filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                                urlRender = { `${URL_DEV}sipare?tab=Sipare` } type='tab'
                            />                        
                    </Tab>

                    <Tab eventKey="claves" title="ACCESOS Y CLAVES">
                        <NewTable tableName = 'claves' subtitle = 'Listado de accesos y claves' title = {titulo7}  mostrar_boton = { true }
                            abrir_modal = { false } url = '/rh/modulo/claves' columns = { CLAVES }
                            accessToken = { this.props.authUser.access_token } setter = { this.setTableAccesos }
                            filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                            urlRender = { `${URL_DEV}accesos_claves?tab=claves` } type='tab'
                        />  
                    </Tab>

                    <Tab eventKey="isn" title="ISN">
                       <NewTable tableName = 'claves' subtitle = 'Inpuesto sobre nomina' title = {titulo8}  mostrar_boton = { true }
                            abrir_modal = { false } url = '/rh/modulo/isn' columns = { SIPARE }
                            accessToken = { this.props.authUser.access_token } setter = { this.setTableIsn }
                            filterClick = { this.openModalFiltros } exportar_boton = { true } onClickExport = { () => { this.exportVentasAxios() } }
                            urlRender = { `${URL_DEV}isn?tab=isn` } type='tab'
                        /> 
                    </Tab>
              </Tabs>

                <Modal size = 'lg' show = { modal.filters } handleClose = { this.handleClose } title = 'Filtros'>
                    <RepseFilters at = { access_token } sendFilters = { this.sendFilters } filters = { filters } options={options} 
                        setOptions={this.setOptionsArray}/> 
                </Modal>

                <Modal size = "lg" title = "Adjuntos" show = { modal.adjuntos } handleClose = { this.handleClose } >
                    <AdjuntosRForm form = { form } onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>

            </Layout>
        </>
              
        )
    }
}

const mapStateToProps = state => { return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Modulo);
