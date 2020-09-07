//React
import React, { Component } from 'react';
import { connect } from 'react-redux'

// Componentes
import { Card, Accordion } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Components Propios
import Layout from '../../../components/layout/layout'
import { ProyectosForm as ProyectoFormulario } from '../../../components/forms'
import { URL_DEV, CP_URL } from '../../../constants';
import { Button } from '../../../components/form-components'
import { ProyectoCard } from '../../../components/cards'

// Funciones
import { waitAlert, forbiddenAccessAlert, errorAlert, doneAlert } from '../../../functions/alert';
import { setOptions } from '../../../functions/setters';

class ProyectosForm extends Component {

    state = {
        title: 'Nuevo proyecto',
        prospecto: '',
        formeditado: 1,
        options: {
            empresas: [],
            clientes: [],
            colonias: []
        },
        data:{
            proyectos: []
        },
        form:{
            fechaInicio: new Date(),
            fechaFin: new Date(),
            semana: '',
            nombre: '',
            cliente: '',
            contacto: '',
            numeroContacto: '',
            empresa: '',
            cp: '',
            estado: '',
            municipio: '',
            calle: '',
            colonia: '',
            porcentaje: '',
            descripcion: '',
            correo: '',
            correos: [],
            clientes: [],
            adjuntos_grupo:[
                {
                    text: 'Inicio y planeación',
                    id: 'inicio_y_planeacion',
                    adjuntos:[
                        {
                            placeholder: 'Fotografías levantamiento',
                            id: 'fotografias_levantamiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Manuales de adaptación',
                            id: 'manuales_de_adaptacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas',
                            id: 'minutas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Oficios',
                            id: 'oficios',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos entregados por cliente',
                            id: 'planos_entregados_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Propuestas arquitectónicas preliminares',
                            id: 'propuestas_arquitectonicas_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Referencias del diseño del proyecto',
                            id: 'referencias_del_diseño_del_proyecto',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders',
                            id: 'renders',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up',
                            id: 'sketch_up',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos preliminares',
                            id: 'presupuestos_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carta oferta',
                            id: 'carta_oferta',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Ejecución de obra',
                    id: 'ejecucion_de_obra',
                    adjuntos:[
                        {
                            placeholder: 'Datos de cliente',
                            id: 'datos_de_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato cliente',
                            id: 'contrato_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato proveedores y contratistas',
                            id: 'contrato_proveedores_y_contratistas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Firmas de aprobación',
                            id: 'firmas_de_aprobacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte fotográfico de avance de obra',
                            id: 'reporte_fotografico_de_avance_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de materiales',
                            id: 'reporte_de_materiales',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de proyecto vs ejecutado',
                            id: 'reporte_de_proyecto_vs_ejecutado',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas de obra',
                            id: 'minutas_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuesto aprobado por cliente',
                            id: 'presupuesto_aprobado_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Programa de obra',
                            id: 'programa_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos durante obra',
                            id: 'planos_durante_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up aprobados',
                            id: 'sketch_up_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders aprobados',
                            id: 'renders_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estados de cuenta',
                            id: 'estados_de_cuenta',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estimaciones y cierre',
                            id: 'estimaciones_y_cierre',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fianzas y seguros',
                            id: 'fianzas_y_seguros',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Permisos de obra ante dependencias',
                            id: 'permisos_de_obra_ante_dependencias',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos extras',
                            id: 'presupuestos_extras',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Entrega',
                    id: 'entrega',
                    adjuntos:[
                        {
                            placeholder: 'Catálogo de conceptos ASBUILT',
                            id: 'catalogo_de_conceptos_asbuilt',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Consignas de matenimiento',
                            id: 'consignas_de_matenimiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos aprobados',
                            id: 'planos_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de los equipos',
                            id: 'garantia_de_los_equipos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de vicios ocultos',
                            id: 'garantia_de_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias de cálculo',
                            id: 'memorias_de_calculo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias descriptivas',
                            id: 'memorias_descriptivas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fichas técnicas',
                            id: 'fichas_tecnicas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Pruebas de instalaciones',
                            id: 'pruebas_de_instalaciones',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fotografías fin de obra',
                            id: 'fotografias_fin_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Acta de entrega',
                            id: 'acta_de_entrega',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carpeta de entrega ZIP',
                            id: 'carpeta_de_entrega_zip',
                            value: '',
                            files: []
                        },
                    ]
                },
                {
                    text: 'Mantenimiento',
                    id: 'mantenimiento',
                    adjuntos:[
                        {
                            placeholder: 'Fallas y reparaciones por vicios ocultos',
                            id: 'fallas_y_reparaciones_por_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento preventivo',
                            id: 'mantenimiento_preventivo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento correctivo',
                            id: 'mantenimiento_correctivo',
                            value: '',
                            files: []
                        },
                    ]
                },

            ],
            adjuntos: {
                image: {
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                }
            },
            avances:[
                {
                    descripcion: '',
                    avance: '',
                    adjuntos: {
                        value: '',
                        placeholder: 'Fotos del avance',
                        files: []
                    }
                }
            ]
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo proyecto',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.proyecto)
                    {
                        const { proyecto } = state
                        const { form, options } = this.state
                        console.log(proyecto, 'proyecto')
                        form.cp = proyecto.cp;
                        this.cpAxios(proyecto.cp)
                        form.calle = proyecto.calle
                        form.nombre = proyecto.nombre
        
                        form.contacto = proyecto.contacto
                        form.numeroContacto = proyecto.numero_contacto

                        form.fechaInicio = new Date(proyecto.fecha_inicio)
                        form.fechaFin = new Date(proyecto.fecha_fin)

                        form.porcentaje = proyecto.porcentaje
                        form.descripcion = proyecto.descripcion

                        let aux = []

                        if(proyecto.clientes){
                            proyecto.clientes.forEach(cliente => {
                                aux.push(
                                    {
                                        value: cliente.id.toString(),
                                        name: cliente.empresa
                                    }
                                )
                            });
                            form.clientes = aux
                        }

                        if (proyecto.imagen) {
                            form.adjuntos.image.files = [{ name: proyecto.imagen.name, file: '', url: proyecto.imagen.url, key: 0 }]
                        }

                        if(proyecto.empresa)     
                            form.empresa = proyecto.empresa.id.toString()

                        form.colonia = proyecto.colonia
                        
                        aux = []
                        if(proyecto.contactos){
                            proyecto.contactos.map( (contacto)=>{
                                aux.push(contacto.correo)
                            })
                            form.correos = aux
                        }

                        this.setState({
                            ... this.state,
                            proyecto: proyecto,
                            form,
                            formeditado: 1,
                            title: 'Editar proyecto'
                        })
                    }
                    else
                        history.push('/proyectos/proyectos')
                }else
                    history.push('/proyectos/proyectos')

                break;
            case 'convert':
                if(state){
                    if(state.prospecto)
                    {
                        this.getProspectoAxios(state.prospecto.id)
                    }
                    else
                        history.push('/proyectos/proyectos')
                }else
                    history.push('/proyectos/proyectos')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    // Change adjuntos
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeOptions = (e, arreglo) => {
        const { name, value } = e.target
        const { form, options } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
        })
        form[arreglo] = auxArray
        this.setState({
            ... this.state,
            form,
            options
        })
    }
    deleteOption = (element, array) => {
        let { form } = this.state
        let auxForm = []
        form[array].map( ( elemento, key ) => {
            if(element !== elemento){
                auxForm.push(elemento)
            }
        })
        form[array] = auxForm
        this.setState({
            ... this.state,
            form
        })
    }
    removeCorreo = value => {
        const { form } = this.state
        let aux = []
        form.correos.map( (correo, key) => {
            if(correo !== value){
                aux.push(correo)
            }
        })
        form.correos = aux
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeAdjuntoGrupo = (e) => {
        const { form } = this.state
        const { files, value, name } = e.target
        let grupo = 0
        let adjunto = 0
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
        for(let i = 0; i < form.adjuntos_grupo.length; i++){
            for(let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++){
                if(form.adjuntos_grupo[i].adjuntos[j].id === name){
                    grupo = i;
                    adjunto = j;
                }
            }
        }

        form.adjuntos_grupo[grupo].adjuntos[adjunto].value = value
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        
        this.setState({
            ... this.state,
            form
        })
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
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    clearFilesGrupo = (name, key) => {
        const { form } = this.state
        let aux = []
        let grupo = 0
        let adjunto = 0
        for(let i = 0; i < form.adjuntos_grupo.length; i++){
            for(let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++){
                if(form.adjuntos_grupo[i].adjuntos[j].id === name){
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        for (let counter = 0; counter < form.adjuntos_grupo[grupo].adjuntos[adjunto].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos_grupo[grupo].adjuntos[adjunto].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos_grupo[grupo].adjuntos[adjunto].value = ''
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    //Submits
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar proyecto')
            this.editProyectoAxios()
        else
            this.addProyectoAxios()
    }

    // Eventos asyncornos
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/opciones', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                
                const { clientes, empresas } = response.data
                const { options } = this.state

                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')

                this.setState({
                    ...this.state,
                    options
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
    async addProyectoAxios() {
        const { access_token } = this.props.authUser
        const { form, prospecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'adjuntos_grupo':
                    break;
                case 'correos':
                case 'clientes':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
            }
        })
        if (prospecto) {
            data.append('prospecto', prospecto.id)
        }
        form.adjuntos_grupo.map( (grupo) => {
            grupo.adjuntos.map( (adjunto) => {
                adjunto.files.map((file)=> {
                    data.append(`files_name_${adjunto.id}[]`, file.name)
                    data.append(`files_${adjunto.id}[]`, file.file)
                })
                if(adjunto.files.length)
                    data.append('adjuntos[]', adjunto.id)
            })
        })
        await axios.post(URL_DEV + 'proyectos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue creado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/proyectos'
                });
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
    async editProyectoAxios() {
        const { access_token } = this.props.authUser
        const { form, prospecto, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                case 'correos':
                case 'clientes':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                    
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                if (element.toString() !== 'image')
                    data.append('adjuntos[]', element)
            }
        })
        if (prospecto) {
            data.append('prospecto', prospecto.id)
        }
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/proyectos'
                });
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
    async getProspectoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prospecto } = response.data
                const { form, options } = this.state
                if (prospecto.cliente.cp) {
                    form.cp = prospecto.cliente.cp
                    this.cpAxios(prospecto.cliente.cp)
                }
                form.calle = prospecto.cliente.calle
                form.cliente = prospecto.cliente.id.toString()
                form.empresa = prospecto.lead.empresa.id.toString()
                form.contacto = prospecto.lead.nombre
                form.numeroContacto = prospecto.lead.telefono
                this.setState({
                    ... this.state,
                    prospecto: prospecto,
                    form,
                    title: 'Convertir Prospecto'
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

    //CP
    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { error } = response.data
                const { form, options } = this.state
                if (!error) {
                    const { municipio, estado, asentamiento } = response.data.response
                    form['municipio'] = municipio.toUpperCase()
                    form['estado'] = estado.toUpperCase()
                    let aux = []
                    asentamiento.map((element) => {
                        aux.push({ name: element.toString().toUpperCase(), value: element.toString().toUpperCase() })
                    })
                    options['colonias'] = aux
                    this.setState({
                        ... this.state,
                        form,
                        options
                    })
                }
            },
            (error) => {

            }
        ).catch((error) => {
            console.log('error catch', error)
        })
    }

    render() {
        const { title, form, options, formeditado, prospecto } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ProyectoFormulario 
                            title = { title } form = { form } options = { options } formeditado = { formeditado } 
                            onChange = { this.onChange } onChangeAdjunto = { this.onChangeAdjunto }
                            deleteOption = { this.deleteOption } onChangeOptions = { this.onChangeOptions }
                            clearFiles = { this.clearFiles } onChangeCP = { this.onChangeCP }
                            onSubmit = { this.onSubmit } onChangeAdjuntoGrupo = { this.onChangeAdjuntoGrupo } 
                            clearFilesGrupo = { this.clearFilesGrupo } removeCorreo = {this.removeCorreo}>
                            {
                                prospecto !== '' ? 
                                    <Accordion>
                                        <div className="d-flex justify-content-end">
                                            <Accordion.Toggle as={Button} icon={faEye} color="transparent" eventKey={0} />
                                        </div>
                                        <Accordion.Collapse eventKey={0} className="px-md-5 px-2" >
                                            <div>
                                                <ProyectoCard data = { prospecto } />
                                            </div>
                                        </Accordion.Collapse>
                                    </Accordion>
                                : ''
                            }
                        </ProyectoFormulario>
                    </Card.Body>    
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ProyectosForm)