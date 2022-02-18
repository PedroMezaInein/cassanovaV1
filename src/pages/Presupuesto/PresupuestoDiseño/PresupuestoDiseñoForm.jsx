import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { PresupuestoDiseñoForm as PresupuestoDisenoFormulario, PresupuestoGeneradoNoCrm } from '../../../components/forms'
import { Button } from '../../../components/form-components'
import { Card } from 'react-bootstrap'
import { Modal } from '../../../components/singles'
class PresupuestoDiseñoForm extends Component {
    state = {
        modalPdfs: false,
        presupuesto: '',
        formeditado: 0,
        data: {
            precios: [],
            empresas: [],
            planos: [],
            tipos: [],
            empresa: '',
            partidas: []
        },
        title: 'Presupuesto de diseño',
        form: {
            presupuesto: '',
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            tiempo_ejecucion_construccion: 0,
            descuento: 0.0,
            conceptos: [
                {
                    value: '',
                    text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y VISTO BUENO DEL DISEÑO ',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                    name: 'concepto7'
                },
            ],
            construccion_interiores_inf: '',
            construccion_interiores_sup: '',
            mobiliario_inf: '',
            mobiliario_sup: '',
            construccion_civil_inf: '',
            construccion_civil_sup: '',
            semanas: [
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            ],
            partidas: [],
            partidasAcabados: [],
            partidasMobiliario: [],
            partidasObra: [],
            planos: [],
            subtotal: 0.0,
            fase1: true,
            fase2: true,
            renders: '',
            empresa: '',
            tipoProyecto: '',
            proyecto: '',
            obra: true,
            mobiliario: true,
            acabados: true,
            si_desglose: true,
            si_renders: true,
        },
        activeKey: '',
        defaultKey: '',
        options: {
            empresas: [],
            precios: [],
            esquemas: [],
            tipos: []
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props

        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        const { form } = this.state
        switch (action) {
            case 'add':
                if(form.esquema === 'esquema_1')
                    form.tiempo_ejecucion_diseno = 7
                    form.semanas = this.calculateSemanas(form.tiempo_ejecucion_diseno)
                    form.conceptos = [
                        {
                            value: '1',
                            text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                            name: 'concepto1'
                        },
                        {
                            value: '1 AL 2',
                            text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                            name: 'concepto2'
                        },
                        {
                            value: '3',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                            name: 'concepto3'
                        },
                        {
                            value: '3 AL 4',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto4'
                        },
                        {
                            value: '5',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO, MODELO 3D Y VISTO BUENO DEL DISEÑO ',
                            name: 'concepto5'
                        },
                        {
                            value: '5 AL 6',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto6'
                        },
                        {
                            value: '7',
                            text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                            name: 'concepto7'
                        },
                    ]
                this.setState({
                    ...this.state,
                    title: 'Agregar presupuesto de diseño',
                    formeditado: 0,
                    form
                })
                break;
            case 'edit':
                if (state) {
                    if (state.presupuesto) {
                        const { presupuesto } = state
                        this.getOnePresupuesto(presupuesto)
                    }
                    else
                        history.push('/presupuesto/presupuesto-diseño')
                } else
                    history.push('/presupuesto/presupuesto-diseño')
                break;
            default:
                break;
        }
        if (!presupuesto)
            history.push('/')
        this.getOptionsAxios()
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    
    setPartidas = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id })
            return false
        })
        return checkBoxPartida
    }

    openModalPresupuesto = () => {
        this.setState({
            ...this.state,
            modalPdfs: true
        })
    }

    handleCloseModalPresupuesto = () => {
        this.setState({
            ...this.state,
            modalPdfs: false
        })
    }

    async getOnePresupuesto(presupuesto){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos-diseño/'+presupuesto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto, partidas } = response.data
                const { form, data, options } = this.state

                data.partidas = partidas
                
                form.presupuesto = presupuesto
                form.construccion_civil_inf = presupuesto.construccion_civil_inf
                form.construccion_civil_sup = presupuesto.construccion_civil_sup
                form.construccion_interiores_inf = presupuesto.construccion_interiores_inf
                form.construccion_interiores_sup = presupuesto.construccion_interiores_sup
                form.mobiliario_inf = presupuesto.mobiliario_inf
                form.mobiliario_sup = presupuesto.mobiliario_sup
                form.m2 = presupuesto.m2;
                form.subtotal = presupuesto.subtotal
                form.total = presupuesto.total
                form.descuento = presupuesto.descuento
                form.fase1 = presupuesto.fase1 === 1 ? true : false
                form.fase2 = presupuesto.fase2 === 1 ? true : false
                form.esquema = presupuesto.esquema
                form.renders = presupuesto.renders
                form.tiempo_ejecucion_diseno = presupuesto.tiempo_ejecucion_diseño
                form.fecha = new Date(presupuesto.fecha);
                form.tiempo_ejecucion_construccion = presupuesto.tiempo_ejecucion_construccion

                form.acabados = presupuesto.acabados_e_instalaciones;
                form.mobiliario = presupuesto.mobiliario;
                form.obra_civil = presupuesto.obra_civil;
                
                form.si_renders = presupuesto.con_renders === 1 ? true : false;
                form.si_desglose = presupuesto.desglose === 1 ? true : false;

                let aux = ''

                if(presupuesto.empresa){
                    data.empresa = presupuesto.empresa
                    form.empresa = presupuesto.empresa.id.toString()
                    data.tipos = presupuesto.empresa.tipos
                    options.tipos = setOptions(presupuesto.empresa.tipos, 'tipo', 'id')
                    aux = JSON.parse(presupuesto.partidas)
                    if (aux) {
                        aux = aux.partidas
                        let auxPartidasAcabados = []
                        let auxPartidasMobiliario = []
                        let auxPartidasObra = []
                        
                        presupuesto.empresa.partidas_diseño.map((partida) => {
                            switch(partida.tipo){
                                case 'Acabados e instalaciones':
                                    auxPartidasAcabados.push(partida)
                                    break;
                                case 'Mobiliario':
                                    auxPartidasMobiliario.push(partida)
                                    break;
                                case 'Obra civil':
                                    auxPartidasObra.push(partida)
                                    break;
                                default: break;
                            }
                            return ''
                        })

                        form.partidasAcabados = this.setOptionsCheckboxes(auxPartidasAcabados, true)
                        form.partidasMobiliario = this.setOptionsCheckboxes(auxPartidasMobiliario, true)
                        form.partidasObra = this.setOptionsCheckboxes(auxPartidasObra, true)

                        form.partidasAcabados.map((partida) => {
                            if(aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })

                        form.partidasMobiliario.map((partida) => {
                            if(aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })

                        form.partidasObra.map((partida) => {
                            if(aux.indexOf(partida.id) >= 0) partida.checked = true
                            else partida.checked = false
                            return ''
                        })
                    }
                }

                aux = JSON.parse(presupuesto.actividades)
                if (aux) {
                    aux = aux.actividades
                    form.conceptos = aux
                }
                aux = JSON.parse(presupuesto.semanas)
                if (aux) {
                    aux = aux.semanas
                    form.semanas = aux
                }
                let planos = []
                if (data.empresa)
                    data.empresa.planos.map((plano) => {
                        if (plano[presupuesto.esquema])
                            planos.push(plano)
                        return ''
                    })
                form.planos = this.setOptionsCheckboxes(planos, true)
                aux = JSON.parse(presupuesto.planos)
                if (aux) {
                    aux = aux.planos
                    aux.map((element) => {
                        form.planos.map((plano) => {
                            if (plano.id.toString() === element.toString())
                                plano.checked = true
                            else
                                plano.checked = false
                            return ''
                        })
                        return ''
                    })
                }
                aux = JSON.parse(presupuesto.planos)
                if (aux) {
                    aux = aux.planos
                    form.planos.map((plano) => {
                        let bandera = false
                        aux.map((element) => {
                            if (plano.id.toString() === element.toString())
                                bandera = true
                            return ''
                        })
                        plano.checked = bandera
                        return ''
                    })
                }

                if(presupuesto.lead){
                    if(presupuesto.lead.prospecto){
                        //form.proyecto = presupuesto.lead.prospecto.nombre_proyecto
                        if(presupuesto.lead.prospecto.tipo_proyecto)
                            form.tipoProyecto = presupuesto.lead.prospecto.tipo_proyecto.id.toString()
                    }
                }

                if( form.tipoProyecto === '' )
                    if(presupuesto.tipo_proyecto_id)
                        form.tipoProyecto = presupuesto.tipo_proyecto_id.toString()

                /* if( form.proyecto === '' || form.proyecto === null )
                    form.proyecto = presupuesto.nombre_proyecto */

                this.setState({
                    ...this.state,
                    form,
                    data,
                    options,
                    presupuesto: presupuesto
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

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos-diseño/options`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options, data, form } = this.state
                data.empresas = empresas
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options.esquemas = setOptions([
                    { name: 'Esquema 1', value: 'esquema_1' },
                    { name: 'Esquema 2', value: 'esquema_2' },
                    { name: 'Esquema 3', value: 'esquema_3' },
                ], 'name', 'value')
                this.setState({
                    ...this.state,
                    options,
                    data,
                    form
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

    async addPresupuestoDiseñoAxios(pdf) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state

        form.pdf = pdf

        await axios.post(`${URL_DEV}presupuestos-diseño`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                const { form } = this.state
                form.presupuesto = presupuesto
                if (pdf){
                    if (presupuesto.pdfs) {
                        var win = window.open(presupuesto.pdfs[0].url, '_blank');
                        if(win)
                            win.focus();
                        else{
                            const link = document.createElement('a');
                            link.href = presupuesto.pdfs[0].url;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
                this.setState({ ...this.state, presupuesto: presupuesto, form })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async updatePresupuestoDiseñoAxios(pdf) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state

        form.pdf = pdf

        await axios.put(URL_DEV + 'presupuestos-diseño/' + presupuesto.id, form, { headers: { Accept: '/', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                const { history } = this.props

                if (pdf)
                    if (presupuesto.pdfs) {
                        var win = window.open(presupuesto.pdfs[0].url, '_blank');
                        win.focus();
                    }
                doneAlert(response.data.message !== undefined ? response.data.message : 'La presupuesto fue eliminada con éxito.',)
                history.push({
                    pathname: '/presupuesto/presupuesto-diseño'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    checkButtonSemanas = (e, key, dia) => {
        const { form } = this.state
        const { checked } = e.target
        form.semanas[key][dia] = checked
        let count = 0;
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        form.semanas.map((semana) => {
            aux.map((element) => {
                if (semana[element])
                    count++;
                return false
            })
            return false
        })
        form.tiempo_ejecucion_diseno = count
        this.setState({
            ...this.state,
            form
        })
    }
    
    onChangeConceptos = (e, key) => {
        const { value } = e.target
        const { form } = this.state
        form.conceptos[key].value = value
        this.setState({
            ...this.state,
            form
        })
    }
    
    onChange = e => {
        const { name, value, type, checked } = e.target
        const { form, data, options } = this.state
        // let { defaultKey, activeKey } = this.state
        form[name] = value
        let planos = []
        switch (name) {
            case 'empresa':
                data.empresas.map((empresa)=>{
                    if(empresa.id.toString() === value){
                        options.tipos = setOptions(empresa.tipos, 'tipo', 'id')
                        data.tipos = empresa.tipos
                        form.tipoProyecto = ''
                        form.construccion_civil_inf = 0
                        form.construccion_civil_sup = 0
                        form.construccion_interiores_inf = 0
                        form.construccion_interiores_sup = 0
                        form.mobiliario_inf = 0
                        form.mobiliario_sup = 0
                        data.planos = empresa.planos
                        empresa.planos.map((plano)=>{
                            if(plano[form.esquema])
                                planos.push(plano)
                            return ''
                        })
                        form.planos = this.setOptionsCheckboxes(planos, true)
                        data.empresa = empresa
                        let auxPartidasAcabados = []
                        let auxPartidasMobiliario = []
                        let auxPartidasObra = []

                        empresa.partidas_diseño.map((partida) => {
                            switch(partida.tipo){
                                case 'Acabados e instalaciones':
                                    auxPartidasAcabados.push(partida)
                                    break;
                                case 'Mobiliario':
                                    auxPartidasMobiliario.push(partida)
                                    break;
                                case 'Obra civil':
                                    auxPartidasObra.push(partida)
                                    break;
                                default: break;
                            }
                            return ''
                        })

                        form.partidasAcabados = this.setOptionsCheckboxes(auxPartidasAcabados, true)
                        form.partidasMobiliario = this.setOptionsCheckboxes(auxPartidasMobiliario, true)
                        form.partidasObra = this.setOptionsCheckboxes(auxPartidasObra, true)

                    }
                    return ''
                })
                break;
            case 'esquema':
                switch(value){
                    case 'esquema_1':
                        form.tiempo_ejecucion_diseno = 7
                        form.semanas = this.calculateSemanas(7)
                        break;
                    case 'esquema_2':
                        form.tiempo_ejecucion_diseno = 10
                        form.semanas = this.calculateSemanas(10)
                        break;
                    case 'esquema_3':
                        form.tiempo_ejecucion_diseno = 15
                        form.semanas = this.calculateSemanas(15)
                        break;
                    default:
                        break;
                }
                data.planos.map((plano)=>{
                    if(plano[form.esquema])
                        planos.push(plano)
                    return ''
                })
                form.planos = this.setOptionsCheckboxes(planos, true)
                form.conceptos.map((concepto) => {
                    switch(concepto.name){
                        case 'concepto1':
                            concepto.value = "1";
                            break;
                        case 'concepto2':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "1 AL 2"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "2 AL 3"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "2 AL 4"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto3':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "3"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "4"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "5"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto4':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "3 AL 4"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "6 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto5':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "5"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "7"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "10"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto6':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "8 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "11 AL 14"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto7':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "7"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "10"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "15"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO EJECUTIVO EN DIGITAL'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    return false
                })
                break;
            case 'tiempo_ejecucion_diseno':
                form.conceptos.map((concepto) => {
                    if(concepto.name === 'concepto7'){
                        concepto.value = form.tiempo_ejecucion_diseno
                    }
                    return false
                })
                form.semanas = this.calculateSemanas(value)
                break;
            case 'tipoProyecto':
                data.tipos.map((tipo)=>{
                    if(tipo.id.toString() === value){
                        form.construccion_civil_inf = tipo.construccion_civil_inf
                        form.construccion_civil_sup = tipo.construccion_civil_sup
                        form.construccion_interiores_inf = tipo.construccion_interiores_inf
                        form.construccion_interiores_sup = tipo.construccion_interiores_sup
                        form.mobiliario_inf = tipo.mobiliario_inf
                        form.mobiliario_sup = tipo.mobiliario_sup
                    }
                    return ''
                })
                break;
            default:
                break;
        }
        if (name === 'm2' || name === 'esquema')
            if (form.m2 && form.esquema)
                form.subtotal = this.getSubtotal(form.m2, form.esquema)
        if (form.subtotal > 0)
            form.total = form.subtotal * (1 - (form.descuento / 100))

        if(type === 'radio'){
            if(name === 'si_desglose' || name === 'si_renders')
                form[name] = value === "true" ? true : false
        }

        if (type === 'checkbox')
            form[name] = checked
            
        switch (name) {
            case 'construccion_interiores_inf':
            case 'construccion_interiores_sup':
            case 'construccion_civil_inf':
            case 'construccion_civil_sup':
            case 'mobiliario_inf':
            case 'mobiliario_sup':
                form[name] = value.replace(/[,]/gi, '')
                break
            default:
                break;
        }
        this.setState({
            ...this.state,
            form,
            options,
            data
        })
    }

    calculateSemanas = tiempo => {
        let modulo = parseFloat(tiempo) % 5
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        let semanas = []
        for (let i = 0; i < Math.floor(parseFloat(tiempo) / 5); i++) {
            semanas.push({
                lunes: true,
                martes: true,
                miercoles: true,
                jueves: true,
                viernes: true,
                sabado: false,
                domingo: false
            })
        }
        semanas.push({
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false
        })
        aux.map((element, key) => {
            if (key < modulo) {
                semanas[semanas.length - 1][element] = true
            } else {
                semanas[semanas.length - 1][element] = false
            }
            return false
        })
        if (modulo > 2) {
            semanas.push({
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            })
        }
        return semanas
    }

    getSubtotal = (m2, esquema) => {

        if (m2 === '')
            return 0.0

        const { data } = this.state

        let precio_inicial = 0
        let incremento = 0
        let limiteInf = 0.0
        let limiteSup = 0.0
        let m2Aux = parseInt(m2)
        let acumulado = 0
        let total = 0
        let raiz = 0

        if (data.empresa)
            precio_inicial = data.empresa.precio_inicial_diseño
        else {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        if (data.empresa.variaciones.length === 0) {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        switch (esquema) {
            case 'esquema_2':
                incremento = data.empresa.incremento_esquema_2 / 100;
                break
            case 'esquema_3':
                incremento = data.empresa.incremento_esquema_3 / 100;
                break
            default:
                incremento = 0
                break
        }

        data.empresa.variaciones.sort(function (a, b) {
            return parseInt(a.inferior) - parseInt(b.inferior)
        })

        limiteInf = parseInt(data.empresa.variaciones[0].inferior)
        limiteSup = parseInt(data.empresa.variaciones[data.empresa.variaciones.length - 1].superior)

        if (limiteInf <= m2Aux && limiteSup >= m2Aux) {
            data.empresa.variaciones.map((variacion, index) => {
                if (index === 0) {
                    acumulado = parseFloat(precio_inicial) - ((parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(precio_inicial) - ((parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                } else {
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(acumulado) - ((parseInt(variacion.superior) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    else {
                        acumulado = parseFloat(acumulado) - ((parseInt(m2) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    }
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                }
                return ''
            })
            raiz= Math.sqrt(precio_inicial * m2 ) * precio_inicial;
            total = raiz.toFixed(3) *  (1 + incremento)

            return total 
        }

        if (limiteSup < m2Aux) {
            errorAlert('Los m2 no están considerados en los límites')
            return 0.0
        }

    }
    setOptionsCheckboxes = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            if((partida.nombre === 'PLANO DE LEVANTAMIENTO TOPOGRÁFICO') || (partida.nombre === 'PLANO CUADRO DE CARGAS') || (partida.nombre === 'PLANO DE DIAGRAMA UNIFILAR')){
                checkBoxPartida.push({ checked: false, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            }else{
                checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            }
            return false
        })
        return checkBoxPartida
    }
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar presupuesto de diseño')
            this.updatePresupuestoDiseñoAxios(false)
        else
            this.addPresupuestoDiseñoAxios(false)
    }
    submitPDF = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar presupuesto de diseño')
            this.updatePresupuestoDiseñoAxios(true)
        else
            this.addPresupuestoDiseñoAxios(true)
    }

    handleChangeCheckbox = (array, type) => {
        const { form} = this.state
        form[type] = array
        this.setState({
            ...this.state,
            form: form
        })
    }
    handleClickTab = (type) => { 
        let {defaultKey, form} = this.state
        defaultKey = form.acabados?"acabados":form.mobiliario?"mobiliario": form.obra?"obra":"vacio"
        this.setState({
            ...this.state,
            activeKey: type,
            defaultKey
        })
    }

    onChangePartidas = e => {
        const { name, type, value, checked } = e.target
        const { form } = this.state
        let { defaultKey, activeKey } = this.state
        form[name] = value
        if (type === 'checkbox'){
            form[name] = checked
        }
            defaultKey = form.acabados?"acabados":form.mobiliario?"mobiliario": form.obra?"obra":"vacio"
            activeKey = form.acabados?"acabados":form.mobiliario?"mobiliario": form.obra?"obra":"vacio"
        this.setState({
            ...this.state,
            form,
            defaultKey,
            activeKey
        })
    }
    render() {
        const { options, title, form, formeditado, presupuesto, modalPdfs, activeKey, defaultKey } = this.state
        return (
            <Layout active={'presupuesto'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title w-100 d-flex justify-content-between">
                            <h3 className="card-label">{title}</h3>
                            {
                                presupuesto ?
                                    presupuesto.pdfs ?
                                        presupuesto.pdfs.length ?
                                            <div>
                                                <Button
                                                    icon=''
                                                    className={"btn btn-icon btn-xs w-auto p-3 btn-light-gray"}
                                                    onClick={() => { this.openModalPresupuesto() }}
                                                    only_icon={"far fa-file-pdf icon-15px mr-2"}
                                                    text='COTIZACIONES GENERADAS'
                                                    />
                                            </div>
                                        : ''
                                    : ''
                                : ''
                            }
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PresupuestoDisenoFormulario
                            title = { title }
                            formeditado = { formeditado }
                            className = "px-3"
                            options = { options }
                            form = { form }
                            onChange = { this.onChange }
                            onSubmit = { this.onSubmit }
                            submitPDF = { this.submitPDF }
                            onChangeConceptos = { this.onChangeConceptos }
                            checkButtonSemanas = { this.checkButtonSemanas }
                            onChangeCheckboxes = { this.handleChangeCheckbox }
                            onClickTab = { this.handleClickTab }
                            activeKey={activeKey}
                            defaultKey={defaultKey}
                            onChangePartidas={this.onChangePartidas}
                            
                        />
                    </Card.Body>
                </Card>
                <Modal title = "Cotizaciones generadas" size = "lg" 
                    show = { modalPdfs } handleClose = { this.handleCloseModalPresupuesto } >
                    {
                        presupuesto ?
                            presupuesto.pdfs ?
                                presupuesto.pdfs.length ?
                                    <PresupuestoGeneradoNoCrm 
                                        pdfs = { presupuesto.pdfs } />
                                : ''
                            : ''
                        : ''
                    }
                </Modal>
            </Layout>
        )
    }

}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = () => ({})
export default connect(mapStateToProps, mapDispatchToProps)(PresupuestoDiseñoForm);