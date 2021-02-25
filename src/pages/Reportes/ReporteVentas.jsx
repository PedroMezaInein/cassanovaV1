import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { Button } from '../../components/form-components'
import { waitAlert, errorAlert, printResponseErrorAlert, questionAlert2, doneAlert } from '../../functions/alert'
import Swal from 'sweetalert2'
import { COLORES_GRAFICAS_IM, COLORES_GRAFICAS_INEIN, COLORES_GRAFICAS_MESES, IM_AZUL, INEIN_RED, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import { Pie, Bar, Line } from 'react-chartjs-2'
import "chartjs-plugin-datalabels";
import { setLabelVentas, setOptions, setDateTableLG, setMoneyTableSinSmall } from '../../functions/setters'
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import RVAnualInein from '../../components/pdfs/ReporteVentasAnual/RVAnualInein'
import RVAnualIm from '../../components/pdfs/ReporteVentasAnual/RVAnualIm'
import ReporteVentasInein from '../../components/pdfs/ReporteVentasInein'
import ReporteVentasIm from '../../components/pdfs/ReporteVentasIm'
import { Modal } from '../../components/singles'
import { dataSimpleBar, monthGroupBar, percentBar } from '../../constantes/barOptions'
import { optionsPie } from '../../constantes/pieOptions'

class ReporteVentas extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        empresas: [],
        modal: false,
        mes: '',
        empresa: '',
        form: {
            rango: '',
            empresa: '',
            mes: '',
            año: new Date().getFullYear(),
            leads: [],
            adjuntos: {
                reportes: {
                    value: '',
                    placeholder: 'Reporte',
                    files: []
                }
            },
            si_adjunto: false,
            no_adjunto: true,
            periodo: '1',
            listados: {
                conclusiones: EditorState.createEmpty(),
                sugerencias: EditorState.createEmpty(),
            }
        },
        data: {
            total: {},
            comparativa: {},
            origenes: {},
            servicios: {},
            tipos: {},
            prospectos: {},
            estatus: {},
            origenesComparativa: {},
            serviciosComparativa: {},
            tiposComparativa: {},
            prospectosComparativa: {},
            estatusComparativa: {},
            cerrados: []
        },
        leads: [],
        leadsAnteriores: [],
        options: {
            empresas: []
        },
        empresaActive: ''
    }

    constructor(props) {
        super(props);
        this.chartTotalReference = React.createRef();
        this.chartTotalComparativaReference = React.createRef();
        this.chartTotalOrigenesReference = React.createRef();
        this.chartOrigenesOrganicosReference = React.createRef();
        this.chartOrigenesAdsReference = React.createRef();
        this.chartComparativaOrigenesReference = React.createRef();
        this.chartServiciosReference = React.createRef();
        this.chartServiciosComparativaReference = React.createRef();
        this.chartTiposReference = React.createRef();
        this.chartOrigenesNoPotencialesReference = React.createRef();
        this.chartOrigenesPotencialesReference = React.createRef();
        this.chartOrigenesDuplicadosReference = React.createRef();
        this.chartTiposComparativaReference = React.createRef();
        this.chartTiposProyectosReference = React.createRef();
        this.chartTiposProyectosComparativaReference = React.createRef();
        this.chartContactadosReference = React.createRef();
        this.chartEstatusReference = React.createRef();
        this.chartMotivosCancelacionReference = React.createRef();
        this.chartMotivosRechazoReference = React.createRef();

        this.chartTotalServiciosReference = React.createRef();
        this.chartComparativaServiciosReference = React.createRef();
        this.chartComparativaTiposReference = React.createRef();
        this.chartProspectosReference = React.createRef();
        this.chartComparativaProspectosReference = React.createRef();
        this.chartComparativaEstatusReference = React.createRef();
        /* this.chartCerradosReference = React.createRef(); */
    }

    componentDidMount() { this.getOptionsAxios() }

    handleCloseModal = () => { this.setState({...this.state,modal: false}) }

    onClickEmpresa = select => {
        this.setState({...this.state, empresaActive: select})
    }

    setReporte = (images, lista, sugerencias) => {
        const { empresa, form, leadsAnteriores, mes, data } = this.state
        switch (empresa) {
            case 'INEIN':
                if(form.rango === 'semestral' || form.rango === 'anual')
                    return(
                        <RVAnualInein form = { form } images = { images } data = { data }
                            conclusiones = { lista } sugerencias = { sugerencias } mes = { mes.toUpperCase() } />
                    )
                else
                    return (
                        <ReporteVentasInein form={form} images={images} anteriores={leadsAnteriores}
                            lista={lista} mes={mes.toUpperCase()} data={data} />
                    )
            case 'INFRAESTRUCTURA MÉDICA':
                if(form.rango === 'semestral' || form.rango === 'anual')
                    return(
                        <RVAnualIm form = { form } images = { images } data = { data }
                            conclusiones = { lista } sugerencias = { sugerencias } mes = { mes.toUpperCase() } />
                    )
                else
                return (
                    <ReporteVentasIm form={form} images={images} anteriores={leadsAnteriores}
                        lista={lista} mes={mes.toUpperCase()} data={data} />
                )
            default:
                break;
        }
    }

    setOpacity = array => {
        let aux = [];
        array.map((element) => {
            aux.push(element + 'D9')
            return false
        })
        return aux
    }

    setOpacity75 = array => {
        let aux = [];
        array.map((element) => {
            aux.push(element + 'BF')
            return false
        })
        return aux
    }

    setOpacity65 = array => {
        let aux = [];
        array.map((element) => {
            aux.push(element + 'A6')
            return false
        })
        return aux
    }

    setOpacity2 = array => {
        let aux = [];
        array.map((element) => {
            aux.push(element + '5F')
            return false
        })
        return aux
    }

    setLabel = (estatus) => {
        let text = {}
        text.letra = estatus.color_texto
        text.fondo = estatus.color_fondo
        text.estatus = estatus.estatus
        return setLabelVentas(text)
    }

    getBG = tamaño => {
        const { empresa } = this.state
        let aux = []
        switch (empresa) {
            case 'INEIN':
                for (let i = 0; i < tamaño; i++) {
                    aux.push(
                        COLORES_GRAFICAS_INEIN[i]
                    )
                }
                break;
            case 'INFRAESTRUCTURA MÉDICA':
                for (let i = 0; i < tamaño; i++) {
                    aux.push(
                        COLORES_GRAFICAS_IM[i]
                    )
                }
                break;
            default:
                break;
        }
        return aux
    }

    setButtons = (left, right, generar, empresa, page, textHeader) => {
        return (
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="card-label title-reporte-ventas" >
                        <strong className={empresa === 'INEIN' ? "colorInein" : empresa === 'INFRAESTRUCTURA MÉDICA' ? "colorIMAzul" : 'text-info'}>
                            {page}
                        </strong>
                        {textHeader}
                    </h3>
                </div>
                <div className="d-flex justify-content-between">
                    {
                        left !== null ?
                            <div>
                                <Button
                                    icon=''
                                    onClick={() => { this.changeTabe(left) }}
                                    className={`btn btn-icon btn-30px mr-2 ${empresa === 'INEIN' ? 'btn-light-inein' : empresa === 'INFRAESTRUCTURA MÉDICA' ? 'btn-light-im' : 'btn-light-info'}`}
                                    only_icon="fas fa-angle-left"
                                // tooltip={{ text: 'ANTERIOR' }}
                                />
                            </div>
                            : ''
                    }
                    {
                        right !== null ?
                            <div>
                                <Button
                                    icon=''
                                    onClick={() => { this.changeTabe(right) }}
                                    className={`btn btn-icon btn-30px ${empresa === 'INEIN' ? 'btn-light-inein' : empresa === 'INFRAESTRUCTURA MÉDICA' ? 'btn-light-im' : 'btn-light-info'}`}
                                    only_icon="fas fa-angle-right"
                                // tooltip={{ text: 'SIGUIENTE' }}
                                />
                            </div>
                            : ''
                    }
                    {
                        generar !== null ?
                            <div>
                                <Button
                                    icon=''
                                    onClick={(e) => { e.preventDefault(); waitAlert(); this.generarPDF() }}
                                    className="btn btn-icon btn-30px btn-light-success"
                                    only_icon="far fa-file-pdf icon-md"
                                    tooltip={{ text: 'GENERAR PDF' }}
                                />
                            </div>
                            : ''
                    }
                </div>
            </div>
        )
    }

    changeTabe = value => {
        this.setState({
            ...this.state,
            key: value
        })
    }

    setColor = () => {
        const { empresa } = this.state
        switch (empresa) {
            case 'INEIN':
                return INEIN_RED
            case 'INFRAESTRUCTURA MÉDICA':
                return IM_AZUL
            default:
                break;
        }
    }

    onEditorStateChange = (editorState, value) => {
        const { form } = this.state
        form.listados[value] = editorState
        this.setState({...this.state,form});
    };

    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form, options } = this.state
        let { empresa } = this.state
        form[name] = value
        if (type === 'radio') {
            if (name === "si_adjunto") {
                form["no_adjunto"] = false
            }
            else if (name === "no_adjunto") {
                form["si_adjunto"] = false
            }
            form[name] = checked
        }
        if (name === 'empresa') {
            options.empresas.map((emp) => {
                if (emp.value === value)
                    empresa = emp.name
                return false
            })
        }
        this.setState({
            ...this.state,
            form,
            empresa
        })
    }

    onChangeObservaciones = e => {
        const { name, value } = e.target
        let { form } = this.state
        form.leads[name].observacion = value
        this.setState({
            ...this.state,
            form
        })
    }

    addOpacityToColors = (arreglo, string) => {
        let aux = []
        arreglo.map((elemento) => {
            aux.push(elemento + string)
        })
        return aux
    }

    onSubmit = e => {
        e.preventDefault();
        const { form } = this.state
        if(form.empresa !== '' && form.año !== '' && form.rango !== ''){
            switch(form.rango){
                case 'mensual':
                    if(form.mes !== '') this.getReporteVentasAxios()
                    else errorAlert('No completaste todos los campos.')
                    break;
                case 'semestral':
                    if(form.periodo !== '') this.getReporteVentasAxios2()
                    else errorAlert('No completaste todos los campos.')
                    break;
                case 'anual':
                    this.getReporteVentasAxios2()
                    break;
                default: 
                    errorAlert('No completaste todos los campos.')
                    break;
            }
        }
        else errorAlert('No completaste todos los campos.')
    }

    saveReporteAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        data.append('empresa', form.empresa)
        data.append('mes', form.mes)
        data.append('año', form.año)

        form.adjuntos.reportes.files.map((file) => {
            data.append(`adjuntos[]`, file.file)
            return ''
        })

        await axios.post(`${URL_DEV}reportes/ventas/save`, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.empresa = ''
                form.mes = ''
                form.año = ''
                form.adjuntos.reportes.value = ''
                form.adjuntos.reportes.files = []
                this.setState({ ...this.state, form })
                doneAlert('Reporte de ventas guardado con éxito')

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')

                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getReporteVentasAxios2 = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}reportes/ventas/add/${form.rango}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data: result, meses } = response.data;
                const { data } = this.state
                Swal.close()

                /* -------------------------------------------------------------------------- */
                /* ------------------------- ENTRADA TOTAL DE LEADS ------------------------- */
                /* -------------------- ANCHOR GET TOTAL DE LEADS ANUALES ------------------- */
                /* -------------------------------------------------------------------------- */

                data.total = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [result.total],
                        backgroundColor: [
                            this.setColor() + 'BF'
                        ],
                        hoverBackgroundColor: [
                            this.setColor() + 'D9'
                        ],
                        borderWidth: 3,
                        borderColor: this.setColor(),
                        maxBarThickness: 500
                    }]
                }

                let aux = []
                let auxPercent = []
                let auxLabels = []

                result.total_meses.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: meses[index], value: element.total })
                })

                data.comparativa = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: this.setColor() + 'BF',
                        hoverBackgroundColor: this.setColor() + 'D9',
                        borderWidth: 3,
                        borderColor: this.setColor(),
                    }]
                }

                data.origenes = {
                    labels: [
                        {label: 'Orgánico', value: result.origen.organico.total},
                        {label: 'ADS', value: result.origen.ads.total},
                    ],
                    datasets: [{
                        data: [result.origen.organico.total, result.origen.ads.total],
                        percent: [result.origen.organico.porcentaje.toFixed(2), result.origen.ads.porcentaje.toFixed(2)],
                        backgroundColor: ['#4F81BDBF', '#FFC000BF'],
                        hoverBackgroundColor: ['#4F81BDD9', '#FFC000D9'],
                        borderWidth: 3,
                        borderColor: ['#4F81BD', '#FFC000'],
                        maxBarThickness: 250
                    }]
                }

                aux = []
                auxPercent = []
                auxLabels = []

                result.origenes_organicos.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.origenesOrganicos = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: '#4F81BDBF',
                        hoverBackgroundColor: '#4F81BDD9',
                        borderWidth: 3,
                        borderColor: '#4F81BD',
                        maxBarThickness: 200
                    }]
                }

                aux = []
                auxPercent = []
                auxLabels = []

                result.origenes_ads.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.origenesAds = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: '#FFC000BF',
                        hoverBackgroundColor: '#FFC000D9',
                        borderWidth: 3,
                        borderColor: '#FFC000',
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                let auxColors = []
                result.origenes_meses.map( (mes, index) => {
                    mes.map( (origen) => {
                        auxLabels.push(origen.nombre+';'+meses[index])
                        aux.push(origen.total)
                        if(origen.nombre.includes('ADS')) auxColors.push('#FFC000')
                        else auxColors.push('#4F81BD')
                    })
                })

                data.origenesComparativa = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        xAxisID:'xAxis1',
                        maxBarThickness: 200
                    }]
                }

                aux = []
                auxPercent = []
                auxLabels = []
                auxColors = []

                result.servicios.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                    switch(element.nombre){
                        case 'Quiero ser proveedor':
                        case 'Bolsa de trabajo':
                        case 'Otro':
                        case 'Spam':
                        case 'SPAM':
                        case 'Aún no lo se':
                            auxColors.push('#A6A6A6');
                            break;
                        default:
                            auxColors.push('#4F81BD');
                            break;
                    }
                })

                data.servicios = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                auxColors = []
                result.servicios_meses.map( (mes, index) => {
                    mes.map( (servicio) => {
                        auxLabels.push(servicio.nombre+';'+meses[index])
                        aux.push(servicio.total)
                        switch(servicio.nombre){
                            case 'Quiero ser proveedor':
                            case 'Bolsa de trabajo':
                            case 'Otro':
                            case 'Spam':
                            case 'SPAM':
                            case 'Aún no lo se':
                                auxColors.push('#A6A6A6');
                                break;
                            default:
                                auxColors.push('#4F81BD');
                                break;
                        }
                    })
                })

                data.serviciosComparativa = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        xAxisID:'xAxis1',
                        maxBarThickness: 200
                    }]
                }

                if(result.tipos.duplicados.total){
                    data.tipos = {
                        labels: [
                            {label: 'No potencial', value: result.tipos.noPotenciales.total},
                            {label: 'Potencial', value: result.tipos.potenciales.total},
                            {label: 'Duplicados', value: result.tipos.duplicados.total},
                        ],
                        datasets: [{
                            data: [result.tipos.noPotenciales.total, result.tipos.potenciales.total, result.tipos.duplicados.total],
                            percent: [result.tipos.noPotenciales.porcentaje.toFixed(2), result.tipos.potenciales.porcentaje.toFixed(2), result.tipos.duplicados.porcentaje.toFixed(2)],
                            backgroundColor: ['#F79646BF', '#8064A2BF', '#A6A6A6BF'],
                            hoverBackgroundColor: ['#F79646D9', '#8064A2D9', '#A6A6A6D9'],
                            borderWidth: 3,
                            borderColor: ['#F79646', '#8064A2', '#A6A6A6'],
                            maxBarThickness: 250
                        }]
                    }
                }else{
                    data.tipos = {
                        labels: [
                            {label: 'No potencial', value: result.tipos.noPotenciales.total},
                            {label: 'Potencial', value: result.tipos.potenciales.total},
                        ],
                        datasets: [{
                            data: [result.tipos.noPotenciales.total, result.tipos.potenciales.total],
                            percent: [result.tipos.noPotenciales.porcentaje.toFixed(2), result.tipos.potenciales.porcentaje.toFixed(2)],
                            backgroundColor: ['#F79646BF', '#8064A2BF'],
                            hoverBackgroundColor: ['#F79646D9', '#8064A2D9'],
                            borderWidth: 3,
                            borderColor: ['#F79646', '#8064A2'],
                            maxBarThickness: 250
                        }]
                    }
                }

                aux = []
                auxPercent = []
                auxLabels = []

                result.origenes_no_potenciales.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.origenesNoPotenciales = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: '#F79646BF',
                        hoverBackgroundColor: '#F79646D9',
                        borderWidth: 3,
                        borderColor: '#F79646',
                        maxBarThickness: 200
                    }]
                }

                aux = []
                auxPercent = []
                auxLabels = []

                result.origenes_potenciales.map((element, index)=>{
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.origenesPotenciales = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: '#8064A2BF',
                        hoverBackgroundColor: '#8064A2D9',
                        borderWidth: 3,
                        borderColor: '#8064A2',
                        maxBarThickness: 200
                    }]
                }

                if(result.origenes_duplicados.length > 0){
                    aux = []
                    auxPercent = []
                    auxLabels = []
    
                    result.origenes_duplicados.map((element, index)=>{
                        aux.push(element.total)
                        auxPercent.push(element.porcentaje.toFixed(2))
                        auxLabels.push({ label: element.nombre, value: element.total })
                    })
    
                    data.origenesDuplicados = {
                        labels: auxLabels,
                        datasets: [{
                            data: aux,
                            percent: auxPercent,
                            backgroundColor: '#A6A6A6BF',
                            hoverBackgroundColor: '#A6A6A6D9',
                            borderWidth: 3,
                            borderColor: '#A6A6A6',
                            maxBarThickness: 200
                        }]
                    }
                }else{ data.origenesDuplicados = {} }

                auxLabels = []
                aux = []
                auxColors = []
                result.tipos_meses.map( (mes, index) => {
                    if(mes.potenciales){
                        auxLabels.push('Potencial'+';'+meses[index])
                        aux.push(mes.potenciales)
                        auxColors.push('#F79646')
                    }
                    if(mes.noPotenciales){
                        auxLabels.push('No potencial'+';'+meses[index])
                        aux.push(mes.noPotenciales)
                        auxColors.push('#8064A2')
                    }
                    if(mes.duplicados){
                        auxLabels.push('Duplicado'+';'+meses[index])
                        aux.push(mes.duplicados)
                        auxColors.push('#A6A6A6')
                    }
                })

                data.tipoLeadsComparativa = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        xAxisID:'xAxis1',
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                result.tipos_proyectos.map( (element, index) => {
                    aux.push(element.total)
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.tiposProyectos = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.setColor() + 'BF',
                        hoverBackgroundColor: this.setColor() + 'D9',
                        borderColor: this.setColor(),
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                auxColors = [];
                result.tipos_proyectos_meses.map( (mes, index) => {
                    mes.map( (proy) => {
                        auxLabels.push(proy.nombre+';'+meses[index])
                        aux.push(proy.total)
                        auxColors.push( COLORES_GRAFICAS_MESES[index] )
                    })
                })

                data.tiposProyectosComparativa = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                data.contactados = {
                    labels: [
                        {label: 'Sin convertir', value: result.contactados.sinConvertir.total},
                        {label: 'Convertidos', value: result.contactados.contactados.total},
                    ],
                    datasets: [{
                        data: [
                            result.contactados.sinConvertir.total, 
                            result.contactados.contactados.total],
                        percent: [
                            result.contactados.sinConvertir.porcentaje.toFixed(2), 
                            result.contactados.contactados.porcentaje.toFixed(2)],
                        backgroundColor: ['#A6A6A6BF', this.setColor() + 'BF'],
                        hoverBackgroundColor: ['#A6A6A6D9', this.setColor() + 'D9'],
                        borderColor: ['#A6A6A6', this.setColor()],
                        borderWidth: 3,
                        maxBarThickness: 250
                    }]
                }

                auxLabels = []
                aux = []
                auxColors = []
                auxPercent = []
                result.estatus.map( (element, index) => {
                    aux.push(element.total)
                    auxPercent.push(element.porcentaje.toFixed(2))
                    auxLabels.push({ label: element.nombre, value: element.total })
                    switch(element.nombre){
                        case 'Cancelado':
                        case 'Rechazado':
                            auxColors.push('#FF0000');
                            break;
                        case 'Contratado':
                            auxColors.push('#92D050');
                            break;
                        default:
                            auxColors.push('#4F81DB');
                            break;
                    }
                })

                data.estatus = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        percent: auxPercent,
                        backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                        hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                        borderColor: auxColors,
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                auxPercent = []
                result.motivos_cancelacion.map( (element, index) => {
                    aux.push(element.total)
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.motivosCancelacion = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.setColor() + 'BF',
                        hoverBackgroundColor: this.setColor() + 'D9',
                        borderColor: this.setColor(),
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                auxLabels = []
                aux = []
                auxPercent = []
                result.motivos_rechazo.map( (element, index) => {
                    aux.push(element.total)
                    auxLabels.push({ label: element.nombre, value: element.total })
                })

                data.motivosRechazo = {
                    labels: auxLabels,
                    datasets: [{
                        data: aux,
                        backgroundColor: this.setColor() + 'BF',
                        hoverBackgroundColor: this.setColor() + 'D9',
                        borderColor: this.setColor(),
                        borderWidth: 3,
                        maxBarThickness: 200
                    }]
                }

                data.proyectos = result.proyectos
                
                this.setState({...this.state, data, key: '1'})

            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getReporteVentasAxios = async() => {

        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'reportes/ventas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, servicios, origenes, tipos, prospectos, estatus, cerrados, observaciones, observacionesAnteriores, mes } = response.data
                const { data, form } = this.state

                form.leads = observaciones
                form.leads.map((lead) => {
                    lead.observacion = ''
                    return false
                })

                /* -------------------------------------------------------------------------- */
                /*                    ANCHOR GET REPORTES VENTAS MENSUALES                    */
                /* -------------------------------------------------------------------------- */

                Swal.close()
                data.total = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [leads[0].leads],
                        backgroundColor: [
                            this.setColor() + 'BF'
                        ],
                        hoverBackgroundColor: [
                            this.setColor() + 'D9'
                        ],
                        borderWidth: 3,
                        borderColor: this.setColor(),
                        maxBarThickness: 500
                    }]
                }

                data.cerrados = cerrados
                /* {
                    labels: ['CERRADOS'],
                    datasets: [{
                        data: [cerrados],
                        backgroundColor: [
                            this.setColor()
                        ],
                        hoverBackgroundColor: [
                            this.setColor()+'D9'
                        ]
                    }]
                } */

                let arrayLabels = []
                let arrayData = []
                let colors = []

                leads.map((element) => {
                    arrayLabels.push(element.label.toUpperCase());
                    arrayData.push(element.leads)
                    return ''
                })

                colors = this.getBG(arrayData.length);

                data.comparativa = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TOTAL DE LEADS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderColor: colors,
                            borderWidth: 3
                        }
                    ]
                }

                arrayLabels = []
                arrayData = []
                colors = []

                let keys = Object.keys(origenes)

                keys.map((element) => {
                    if (origenes[element][0].leads > 0) {
                        arrayLabels.push(element.toUpperCase())
                        arrayData.push(origenes[element][0].leads)
                    }
                    return ''
                })

                colors = this.getBG(arrayData.length);

                data.origenes = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'ORIGEN DE LEADS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth: 3
                        }
                    ]
                }

                keys = Object.keys(servicios)

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element) => {
                    if (servicios[element][0].leads > 0) {
                        arrayLabels.push(element.toUpperCase())
                        arrayData.push(servicios[element][0].leads)
                    }
                    return ''
                })

                colors = this.getBG(arrayData.length);

                data.servicios = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'SERVICIOS SOLICITADOS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth: 3
                        }
                    ]
                }

                keys = ['Basura', 'Potencial']

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element) => {
                    if (tipos[element][0].leads > 0) {
                        arrayLabels.push(element.toUpperCase())
                        arrayData.push(tipos[element][0].leads)
                    }
                    return ''
                })

                colors = this.getBG(arrayData.length);

                data.tipos = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TIPO DE LEADS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth: 3
                        }
                    ]
                }

                //Comparativa tipo leads
                arrayLabels = []
                arrayData = []
                let arrayDataSets = []

                tipos['Basura'].map((tipo) => {
                    arrayLabels.push(tipo.label.toUpperCase())
                    arrayData.push(tipo.leads)
                    return ''
                })

                arrayDataSets.push(
                    {
                        label: 'BASURA',
                        data: arrayData,
                        backgroundColor: colors[0] + 'A6',
                        hoverBackgroundColor: colors[0] + 'BF',
                        borderWidth: 3
                    }
                );

                arrayData = []
                tipos['Potencial'].map((element) => {
                    arrayData.push(element.leads)
                    return ''
                })

                arrayDataSets.push(
                    {
                        label: 'POTENCIAL',
                        data: arrayData,
                        backgroundColor: colors[1] + 'A6',
                        hoverBackgroundColor: colors[1] + 'BF',
                        borderWidth: 3
                    }
                );

                data.tiposComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                //Prospectos
                keys = ['Convertido', 'Sin convertir']

                arrayLabels = []
                arrayData = []
                colors = []

                if (prospectos['Convertido'][0].leads > 0) {
                    arrayLabels.push('CONVERTIDO')
                    arrayData.push(prospectos['Convertido'][0].leads)
                }
                if (tipos['Potencial'][0].leads > 0) {
                    arrayLabels.push('POTENCIAL')
                    arrayData.push(tipos['Potencial'][0].leads)
                }

                colors = this.getBG(arrayData.length)
                let colors2 = this.setOpacity2(colors)

                data.prospectos = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TOTAL DE PROSPECTOS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth: 3
                        }
                    ]
                }

                //Comparativa prospectos
                arrayLabels = []
                arrayData = []
                arrayDataSets = []

                /* prospectos['Convertido'].map((prospecto) => {
                    arrayLabels.push(prospecto.label.toUpperCase())
                    arrayData.push(prospecto.leads)
                }) */

                for (let i = prospectos['Convertido'].length - 1; i >= 0; i--) {
                    arrayData.push(prospectos['Convertido'][i].leads)
                }

                arrayDataSets.push(
                    {
                        label: 'CONVERTIDO',
                        data: arrayData,
                        backgroundColor: colors[0],
                        borderColor: colors2[0],
                        fill: false,
                        yAxisID: 'y-axis-1',
                    }
                );

                arrayData = []
                /* tipos['Potencial'].map((element)=>{
                    arrayData.push(element.leads)
                }) */
                for (let i = tipos['Potencial'].length - 1; i >= 0; i--) {
                    arrayLabels.push(tipos['Potencial'][i].label.toUpperCase())
                    arrayData.push(tipos['Potencial'][i].leads)
                }

                arrayDataSets.push(
                    {
                        label: 'POTENCIAL',
                        data: arrayData,
                        backgroundColor: colors[1],
                        borderColor: colors2[1],
                        fill: false,
                        yAxisID: 'y-axis-1',
                    }
                );

                data.prospectosComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                // Origenes comparativas
                arrayLabels = []
                colors = []
                arrayDataSets = []

                //Grouped bar origenes
                keys = Object.keys(origenes)

                keys.map((element, key) => {
                    arrayLabels.push(element.toUpperCase())
                    if (key === 0) {
                        origenes[element].map((dataSet, index) => {
                            if (index <= 2)
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
                                        data: [],
                                        backgroundColor: '',
                                    }
                                )
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);

                arrayDataSets.map((element, key) => {
                    arrayData = []
                    keys.map((origen) => {
                        arrayData.push(origenes[origen][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key] + 'B3'
                    element.hoverBackgroundColor = colors[key] + 'BF'
                    element.borderWidth = 3
                    return ''
                })
                let contador = 0
                let contadorArray = []
                if (arrayDataSets.length) {
                    arrayDataSets[0].data.map((element, index) => {
                        contador = 0
                        arrayDataSets.map((newElement, key) => {
                            contador += newElement.data[index]
                            return ''
                        })
                        if (contador === 0)
                            contadorArray.push(index)
                        return ''
                    })
                }

                contadorArray.map((element) => {
                    arrayDataSets.map((newElement) => {
                        newElement.data.splice(element, 1)
                        return ''
                    })
                    arrayLabels.splice(element, 1)
                    return ''
                })

                data.origenesComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                // Servicios comparativas
                arrayLabels = []
                colors = []
                arrayDataSets = []

                keys = Object.keys(servicios)

                keys.map((element, key) => {
                    arrayLabels.push(element.toUpperCase())
                    if (key === 0) {
                        servicios[element].map((dataSet, index) => {
                            if (index <= 2)
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
                                        data: [],
                                        backgroundColor: '',
                                    }
                                )
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);

                arrayDataSets.map((element, key) => {
                    arrayData = []
                    keys.map((servicio) => {
                        arrayData.push(servicios[servicio][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key] + 'B3'
                    element.hoverBackgroundColor = colors[key] + 'BF'
                    element.borderWidth = 3
                    return ''
                })

                data.serviciosComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                keys = Object.keys(estatus)

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element) => {
                    if (estatus[element][0].leads > 0) {
                        arrayLabels.push(element.toUpperCase())
                        arrayData.push(estatus[element][0].leads)
                    }
                    return ''
                })

                colors = this.getBG(arrayData.length);

                data.estatus = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'ESTATUS DE PROSPECTOS',
                            data: arrayData,
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth: 3
                        }
                    ]
                }

                //Comparativa status prospectos
                keys = Object.keys(estatus)
                arrayLabels = []
                arrayData = []
                colors = []
                arrayDataSets = []
                keys.map((element, key) => {
                    arrayLabels.push(element.toUpperCase())
                    if (key === 0) {
                        estatus[element].map((dataSet, index) => {
                            if (index <= 2)
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
                                        data: [],
                                        backgroundColor: '',
                                    }
                                )
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);

                arrayDataSets.map((element, key) => {
                    arrayData = []
                    keys.map((origen) => {
                        arrayData.push(estatus[origen][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key] + 'B3'
                    element.hoverBackgroundColor = colors[key] + 'BF'
                    element.borderWidth = 3
                    return ''
                })
                contador = 0
                contadorArray = []
                if (arrayDataSets.length) {
                    arrayDataSets[0].data.map((element, index) => {
                        contador = 0
                        arrayDataSets.map((newElement, key) => {
                            contador += newElement.data[index]
                            return ''
                        })
                        if (contador === 0)
                            contadorArray.push(index)
                        return ''
                    })
                }

                contadorArray.map((element) => {
                    arrayDataSets.map((newElement) => {
                        newElement.data.splice(element, 1)
                        return ''
                    })
                    arrayLabels.splice(element, 1)
                    return ''
                })

                data.estatusComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                this.setState({
                    ...this.state,
                    data,
                    key: '1',
                    form,
                    leadsAnteriores: observacionesAnteriores,
                    mes: mes
                })

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getReporteAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/ventas/guardados', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                let { empresaActive } = this.state
                Swal.close()
                if (empresas.length)
                    empresaActive = empresas[0].id
                this.setState({
                    ...this.state,
                    modal: true,
                    empresas: empresas,
                    empresaActive
                })
            },
            (error) => {
                Swal.close()
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            Swal.close()
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async generarPDF() {

        /* -------------------------------------------------------------------------- */
        /*                  ANCHOR LLAMADA ASYNC PARA GENERAR EL PDF                  */
        /* -------------------------------------------------------------------------- */

        waitAlert()
        let aux = []
        let imagenes = []
        const { form, data } = this.state
        if(form.rango === 'semestral' || form.rango === 'anual'){
            imagenes = {
                total: this.chartTotalReference.current === null ? null : this.chartTotalReference.current.chartInstance.toBase64Image(),
                totalMeses: this.chartTotalComparativaReference.current === null ? null : this.chartTotalComparativaReference.current.chartInstance.toBase64Image(),
                origenes: this.chartTotalOrigenesReference.current === null ? null : this.chartTotalOrigenesReference.current.chartInstance.toBase64Image(),
                origenesOrganicos: this.chartOrigenesOrganicosReference.current === null ? null : this.chartOrigenesOrganicosReference.current.chartInstance.toBase64Image(),
                origenesAds: this.chartOrigenesAdsReference.current === null ? null : this.chartOrigenesAdsReference.current.chartInstance.toBase64Image(),
                origenesMeses: this.chartComparativaOrigenesReference.current === null ? null : this.chartComparativaOrigenesReference.current.chartInstance.toBase64Image(),
                servicios: this.chartServiciosReference.current === null ? null : this.chartServiciosReference.current.chartInstance.toBase64Image(),
                serviciosMeses: this.chartServiciosComparativaReference.current === null ? null : this.chartServiciosComparativaReference.current.chartInstance.toBase64Image(),
                tipos: this.chartTiposReference.current === null ? null : this.chartTiposReference.current.chartInstance.toBase64Image(),
                origenesNoPotenciales: this.chartOrigenesNoPotencialesReference.current === null ? null : this.chartOrigenesNoPotencialesReference.current.chartInstance.toBase64Image(),
                origenesPotenciales: this.chartOrigenesPotencialesReference.current === null ? null : this.chartOrigenesPotencialesReference.current.chartInstance.toBase64Image(),
                origenesDuplicados: this.chartOrigenesDuplicadosReference.current === null ? null : this.chartOrigenesDuplicadosReference.current.chartInstance.toBase64Image(),
                tiposMeses: this.chartTiposComparativaReference.current === null ? null : this.chartTiposComparativaReference.current.chartInstance.toBase64Image(),
                tiposProyectos: this.chartTiposProyectosReference.current === null ? null : this.chartTiposProyectosReference.current.chartInstance.toBase64Image(),
                tiposProyectosMeses: this.chartTiposProyectosComparativaReference.current === null ? null : this.chartTiposProyectosComparativaReference.current.chartInstance.toBase64Image(),
                contactados: this.chartContactadosReference.current === null ? null : this.chartContactadosReference.current.chartInstance.toBase64Image(),
                estatus: this.chartEstatusReference.current === null ? null : this.chartEstatusReference.current.chartInstance.toBase64Image(),
                motivosCancelacion: this.chartMotivosCancelacionReference.current === null ? null : this.chartMotivosCancelacionReference.current.chartInstance.toBase64Image(),
                motivosRechazo: this.chartMotivosRechazoReference.current === null ? null : this.chartMotivosRechazoReference.current.chartInstance.toBase64Image(),
            }
        }else{
            aux.push(
                { name: 'total', url: this.chartTotalReference.current.chartInstance.toBase64Image() },
                { name: 'total-comparativa', url: this.chartTotalComparativaReference.current.chartInstance.toBase64Image() },
                { name: 'origenes', url: this.chartTotalOrigenesReference.current.chartInstance.toBase64Image() },
                { name: 'origenes-comparativa', url: this.chartComparativaOrigenesReference.current.chartInstance.toBase64Image() },
                { name: 'servicios', url: this.chartTotalServiciosReference.current.chartInstance.toBase64Image() },
                { name: 'servicios-comparativa', url: this.chartComparativaServiciosReference.current.chartInstance.toBase64Image() },
                { name: 'tipos', url: this.chartTiposReference.current.chartInstance.toBase64Image() },
                { name: 'tipos-comparativa', url: this.chartComparativaTiposReference.current.chartInstance.toBase64Image() },
                { name: 'prospectos', url: this.chartProspectosReference.current.chartInstance.toBase64Image() },
                { name: 'prospectos-comparativa', url: this.chartComparativaProspectosReference.current.chartInstance.toBase64Image() },
                { name: 'estatus', url: this.chartEstatusReference.current.chartInstance.toBase64Image() },
                { name: 'estatus-comparativa', url: this.chartComparativaEstatusReference.current.chartInstance.toBase64Image() },
                /* { name: 'cerrados', url: this.chartCerradosReference.current.chartInstance.toBase64Image() } */
            )
        }

        let lista = convertToRaw(form.listados.conclusiones.getCurrentContent())
        let conclusiones = []
        lista.blocks.map((element) => {
            conclusiones.push(element.text.toUpperCase())
            return ''
        })
        lista = convertToRaw(form.listados.sugerencias.getCurrentContent())
        let sugerencias = []
        lista.blocks.map((element) => {
            sugerencias.push(element.text.toUpperCase())
            return ''
        })

        const blob = await pdf((
            this.setReporte(imagenes, conclusiones, sugerencias, data)
        )).toBlob();

        form.adjuntos.reportes.files = [
            {
                name: 'reporte.pdf',
                file: new File([blob], "reporte.pdf"),
                url: URL.createObjectURL(blob)
            }
        ]

        this.setState({
            ...this.state,
            form
        })

        Swal.close()

        questionAlert2(
            '¿ESTÁS SEGURO?', '',
            () => this.saveReporteAxios(),
            this.getTextAlert()
        )

    }

    getTextAlert = () => {
        const { empresa, form } = this.state
        let meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return (
            <div>
                <span className="text-dark-50 font-weight-bolder">
                    ¿DESEAS GUARDAR EL
                        <u>
                        <a rel="noopener noreferrer" href={form.adjuntos.reportes.files[0].url} target='_blank' className='text-primary mx-2'>
                            REPORTE DE VENTAS
                            </a>
                    </u>
                    {' ' + empresa + ' ' + meses[parseInt(form.mes)] + ' ' + form.año + '?'}
                </span>
            </div>
        )
    }

    setComentario = lead => {
        let aux = '';
        if (lead.estatus) {
            switch (lead.estatus.estatus) {
                case 'Rechazado':
                case 'Cancelado':
                    if (lead.motivo === '' || lead.motivo === null) {
                        if (lead.rh)
                            aux += "RR.HH.\n "
                        if (lead.proveedor)
                            aux += "PROVEEDOR.\n "
                    }
                    else
                        aux += lead.motivo + "\n"
                    break;
                default: break;
            }
        }
        if (lead.prospecto) {
            if (aux === '') {
                if (lead.prospecto.estatus_prospecto) {
                    switch (lead.prospecto.estatus_prospecto.estatus) {
                        case 'Rechazado':
                        case 'Cancelado':
                            if (lead.motivo === '' || lead.motivo === null) {
                                if (lead.rh)
                                    aux += "RR.HH.\n "
                                if (lead.proveedor)
                                    aux += "PROVEEDOR.\n "
                            }
                            else
                                aux += lead.motivo + "\n"
                            aux += lead.motivo + "\n"
                            break;
                        default: break;
                    }
                }
            }
            if (lead.prospecto.contactos) {
                if (lead.prospecto.contactos.length) {
                    aux += lead.prospecto.contactos[0].comentario
                }
            }
        }
        return aux
    }

    handleChange = (files, item) => {
        const { form } = this.state
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
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmitAdjunto = e => {
        e.preventDefault();
        const { form } = this.state
        if (form.empresa !== '' && form.año !== '' && form.mes !== null && form.adjuntos.reportes.files.length > 0)
            this.saveReporteAxios()
        else
            errorAlert('No completaste todos los campos.')
    }

    isActivePane = (dato) => {
        if(dato){
            if(Object.keys(dato).length > 0){
                return true
            }
        }
        return false
    }

    hasElementOnArray = dato => {
        if(dato){
            if(dato.length){
                return true
            }
        }
        return false
    }

    render() {
        const { form, data, options: opciones, key, editorState, leadsAnteriores, mes, modal, empresas, empresaActive } = this.state

        const optionsBar = {
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 22,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            fontSize: 16,
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 16,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            lineWidth: 10,
                            padding: 10,
                            position: 'bottom',
                            autoSkip: false,
                            callback: function (value, index, values) {
                                let auxiliar = ''
                                switch (value) {
                                    case 'AÚN NO LO SE':
                                        auxiliar = ['AÚN NO', 'LO SE']
                                        break;
                                    case 'ORGÁNICO THANK YOU':
                                        auxiliar = ['ORGÁNICO', 'THANK YOU']
                                        break;
                                    case 'ADS THANK YOU':
                                        auxiliar = ['ADS THANK', 'YOU']
                                        break;
                                    case 'REMODELACIÓN DE OFICINAS':
                                        auxiliar = ['REMODELACIÓN', 'DE OFICINAS']
                                        break;
                                    case 'CONSTRUCCIÓN DE OFICINAS':
                                        auxiliar = ['CONSTRUCCIÓN', 'DE OFICINAS']
                                        break;
                                    case 'DISEÑO DE OFICINAS':
                                        auxiliar = ['DISEÑO', 'DE OFICINAS']
                                        break;
                                    case 'QUIERO SER PROVEEDOR':
                                        auxiliar = ['QUIERO SER', 'PROVEEDOR']
                                        break;
                                    case 'BOLSA DE TRABAJO':
                                        auxiliar = ['BOLSA DE', 'TRABAJO']
                                        break;
                                    case 'SERVICIO DE INTERÉS':
                                        auxiliar = ['SERVICIO DE', 'INTERÉS']
                                        break;
                                    default: break;
                                }
                                if (auxiliar !== '')
                                    return auxiliar
                                let aux = value.split(' ')
                                return aux
                            }
                        }
                    },
                ],
            },
            legend: {
                display: false,
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 12,
                    fontColor: '#000'
                }
            },
        }

        const optionsBarGroup = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            fontSize: 16,
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 16,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            padding: 10,
                            position: 'bottom',
                            autoSkip: false,
                            /* callback: function (value, index, values) {
                                let auxiliar = ''
                                switch (value) {
                                    case 'AÚN NO LO SE':
                                        auxiliar = ['AÚN NO', 'LO SE']
                                        break;
                                    case 'ORGÁNICO THANK YOU':
                                        auxiliar = ['ORGÁNICO', 'THANK YOU']
                                        break;
                                    case 'ADS THANK YOU':
                                        auxiliar = ['ADS THANK', 'YOU']
                                        break;
                                    case 'REMODELACIÓN DE OFICINAS':
                                        auxiliar = ['REMODELACIÓN', 'DE OFICINAS']
                                        break;
                                    case 'CONSTRUCCIÓN DE OFICINAS':
                                        auxiliar = ['CONSTRUCCIÓN', 'DE OFICINAS']
                                        break;
                                    case 'DISEÑO DE OFICINAS':
                                        auxiliar = ['DISEÑO', 'DE OFICINAS']
                                        break;
                                    case 'QUIERO SER PROVEEDOR':
                                        auxiliar = ['QUIERO SER', 'PROVEEDOR']
                                        break;
                                    case 'BOLSA DE TRABAJO':
                                        auxiliar = ['BOLSA DE', 'TRABAJO']
                                        break;
                                    case 'SERVICIO DE INTERÉS':
                                        auxiliar = ['SERVICIO DE', 'INTERÉS']
                                        break;
                                    default: break;
                                }
                                if (auxiliar !== '')
                                    return auxiliar
                                let aux = value.split(' ')
                                return aux
                            } */
                        }
                    },
                ]
            },
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 13,
                        weight: 'bold'
                    }
                }
            },
            legend: {
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 12,
                }
            },
        }

        /* const optionsBarStacked = {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#000'
                        }
                    },
                ],
                xAxes: [
                    {
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            fontSize: 20,
                            fontColor: '#000',
                            padding: 5,
                            lineWidth: 10,
                        }
                    },
                ]
            },
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },
            legend:{
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 20,
                }
            },
        } */

        const optionsLine = {
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            fontSize: 16,
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 16,
                            fontColor: '#808080',
                            fontStyle: "bold",
                            padding: 10,
                            position: 'bottom',
                            autoSkip: false,
                            maxRotation: 0,
                            callback: function (value, index, values) {
                                let aux = value.split(' ')
                                return aux
                            }
                        }
                    },
                ]
            },
            plugins: {
                datalabels: {
                    align: '-45',
                    offset: 2,
                    anchor: 'end',
                    rotation: 0,
                    color: '#000',
                    font: {
                        size: 18,
                        backgroundColor: '#fff'
                    },
                }
            },
            legend: {
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 18,
                }
            },
        }

        const mesesEspañol = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

        const { empresa } = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Reporte de ventas</h3>
                        </div>
                        <div className="card-toolbar">
                            <Button
                                icon=''
                                className="btn btn-icon btn-xs w-auto p-3 btn-light"
                                onClick={() => { this.getReporteAxios() }}
                                only_icon="far fa-file-pdf mr-2"
                                text='REPORTES GENERADOS'
                            />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FlujosReportesVentas
                            form={form}
                            options={opciones}
                            onChange={this.onChange}
                            className="mb-3"
                            onSubmit={this.onSubmit}
                            onSubmitAdjunto={this.onSubmitAdjunto}
                            handleChange={this.handleChange}
                        />

                        {
                            form.rango === "anual" || form.rango === 'semestral' ?
                                <>

                                   {/* -------------------------------------------------------------------------- */
                                    /* ------------------------- ANCHOR GRAFICAS ANUALES ------------------------ */
                                    /* -------------------------------------------------------------------------- */}

                                    {/* Nota: Aqui trabajaré con el reporte anual */}
                                    <Tab.Container activeKey={key}>
                                        <Tab.Content>
                                            <div className="separator separator-solid separator-border-1 my-4"></div>
                                            {
                                                this.isActivePane(data.total) ?
                                                    <Tab.Pane eventKey='1'>
                                                        {this.setButtons(null, '2', null, empresa, '01', 'ENTRADA TOTAL DE LEADS')}
                                                        <Bar ref={this.chartTotalReference} data={data.total} options = { dataSimpleBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.comparativa) ?
                                                    <Tab.Pane eventKey='2'>
                                                        {this.setButtons('1', '3', null, empresa, '02', 'ENTRADA DE LEADS MENSUAL')}
                                                        <Bar ref = { this.chartTotalComparativaReference } data = { data.comparativa } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenes) ?
                                                    <Tab.Pane eventKey='3'>
                                                        {this.setButtons('2', '4', null, empresa, '03', 'ORIGEN DE LEADS')}
                                                        <Bar ref={this.chartTotalOrigenesReference} data={data.origenes} options = { percentBar }/>
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesComparativa) ?
                                                    <Tab.Pane eventKey='4'>
                                                        {this.setButtons('3', '5', null, empresa, '04', 'ORIGEN DE LEADS ORGÁNICOS')}
                                                        <Bar ref={this.chartOrigenesOrganicosReference} data={data.origenesOrganicos} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesAds) ?
                                                    <Tab.Pane eventKey='5'>
                                                        {this.setButtons('4', '6', null, empresa, '05', 'ORIGEN DE LEADS ADS')}
                                                        <Bar ref = { this.chartOrigenesAdsReference } data = { data.origenesAds } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesComparativa) ?
                                                    <Tab.Pane eventKey='6'>
                                                        {this.setButtons('5', '7', null, empresa, '06', 'ORIGEN DE LEADS MENSUAL')}
                                                        <Bar ref = { this.chartComparativaOrigenesReference } data = { data.origenesComparativa } options = { monthGroupBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.servicios) ?
                                                    <Tab.Pane eventKey='7'>
                                                        {this.setButtons('6', '8', null, empresa, '07', 'SERVICIOS SOLICITADOS')}
                                                        <Bar ref = { this.chartServiciosReference } data = { data.servicios } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.serviciosComparativa) ?
                                                    <Tab.Pane eventKey='8'>
                                                        {this.setButtons('7', '9', null, empresa, '08', 'SERVICIOS SOLICITADOS MENSUAL')}
                                                        <Bar ref = { this.chartServiciosComparativaReference } data = { data.serviciosComparativa } options = { monthGroupBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.tipos) ? 
                                                    <Tab.Pane eventKey='9'>
                                                        {this.setButtons('8', '10', null, empresa, '09', 'TIPO DE LEADS')}
                                                        <Bar ref = { this.chartTiposReference } data = { data.tipos } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesNoPotenciales) ?
                                                    <Tab.Pane eventKey='10'>
                                                        {this.setButtons('9', '11', null, empresa, '10', 'ORIGEN DE LEADS NO POTENCIALES')}
                                                        <Bar ref = { this.chartOrigenesNoPotencialesReference } data = { data.origenesNoPotenciales } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesPotenciales) ?
                                                    <Tab.Pane eventKey='11'>
                                                        {this.setButtons('10', this.isActivePane(data.origenesDuplicados) ? '12' : '13', null, empresa, '11', 'ORIGEN DE LEADS POTENCIALES')}
                                                        <Bar ref = { this.chartOrigenesPotencialesReference } data = { data.origenesPotenciales } options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.origenesDuplicados) ?
                                                    <Tab.Pane eventKey='12'>
                                                        {this.setButtons('11', '13', null, empresa, '12', 'ORIGEN DE LEADS DUPLICADOS')}
                                                        <Bar ref={this.chartOrigenesDuplicadosReference} data={data.origenesDuplicados} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.tipoLeadsComparativa) ?
                                                    <Tab.Pane eventKey = '13'>
                                                        {this.setButtons(this.isActivePane(data.origenesDuplicados) ? '12' : '11', '14', null, empresa, this.isActivePane(data.origenesDuplicados) ? '13' : '12', 'TIPO DE LEADS MESUAL')}
                                                        <Bar ref={this.chartTiposComparativaReference} data={data.tipoLeadsComparativa} options = { monthGroupBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.tiposProyectos) ?
                                                    <Tab.Pane eventKey = '14'>
                                                        { this.setButtons( '13', '15', null, empresa, this.isActivePane(data.origenesDuplicados) ? '14' : '13',  'TIPOS DE PROYECTOS' ) }
                                                        <Bar ref={this.chartTiposProyectosReference} data={data.tiposProyectos} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.tiposProyectosComparativa) ?
                                                    <Tab.Pane eventKey = '15'>
                                                        { this.setButtons( '14', '16', null, empresa, this.isActivePane(data.origenesDuplicados) ? '15' : '14',  'TIPO DE PROYECTO MENSUAL' ) }
                                                        <Bar ref={this.chartTiposProyectosComparativaReference} data={data.tiposProyectosComparativa} options = { monthGroupBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.contactados) ?
                                                    <Tab.Pane eventKey = '16'>
                                                        { this.setButtons( '15', '17', null, empresa, this.isActivePane(data.origenesDuplicados) ? '16' : '15',  'LEADS CONVERTIDOS A PROSPECTOS' ) }
                                                        <Bar ref={this.chartContactadosReference} data={data.contactados} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.estatus) ?
                                                    <Tab.Pane eventKey='17'>
                                                        {this.setButtons('16', '18', null, empresa, this.isActivePane(data.origenesDuplicados) ? '17' : '16', 'STATUS DE PROSPECTOS')}
                                                        <Bar ref = { this.chartEstatusReference } data = {data.estatus} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.motivosCancelacion) ?
                                                    <Tab.Pane eventKey='18'>
                                                        {this.setButtons('17', '19', null, empresa, this.isActivePane(data.origenesDuplicados) ? '18' : '17', 'PRINCIPALES MOTIVOS DE CANCELACIÓN')}
                                                        <Bar ref = { this.chartMotivosCancelacionReference } data = {data.motivosCancelacion} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            {
                                                this.isActivePane(data.motivosRechazo) ?
                                                    <Tab.Pane eventKey='19'>
                                                        {this.setButtons('18', '20', null, empresa, this.isActivePane(data.origenesDuplicados) ? '19' : '18', 'PRINCIPALES MOTIVOS DE RECHAZO')}
                                                        <Bar ref = { this.chartMotivosRechazoReference } data = {data.motivosRechazo} options = { percentBar } />
                                                    </Tab.Pane>
                                                : <></>
                                            }
                                            <Tab.Pane eventKey='20'>
                                                {this.setButtons('19', '21', null, empresa, this.isActivePane(data.origenesDuplicados) ? '20' : '19', 'OBSERVACIONES CONTRATADOS')}
                                                <div className="table-responsive d-flex justify-content-center">
                                                    <table className="table table-responsive-lg table-vertical-center w-100">
                                                        <thead>
                                                            <tr className="bg-light-gray text-dark-75">
                                                                <th colSpan="6" className="py-0"></th>
                                                                <th colSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">FECHA</th>
                                                                <th></th>
                                                            </tr>
                                                            <tr className="bg-light-gray text-dark-75">
                                                                <th className="py-0 font-size-lg font-weight-bolder text-justify">
                                                                    NOMBRE
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-justify">
                                                                    PROYECTO
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-justify">
                                                                    SERVICIOS
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-justify">
                                                                    ORIGEN
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                    MONTO
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                    M²
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                    INGRESO
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                    CONTRATO
                                                                </th>
                                                                <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                    VENDEDOR
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.hasElementOnArray(data.proyectos) ?
                                                                    data.proyectos.map((proy, index) => {
                                                                        return(
                                                                            <tr key = { `${index}-proyectos` } >
                                                                                <td className="font-size-sm text-justify white-space-nowrap">
                                                                                    { proy.prospecto.lead.nombre }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify white-space-nowrap">
                                                                                    { proy.nombre }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify white-space-nowrap">
                                                                                    {
                                                                                        proy.prospecto.lead.servicios ?
                                                                                            proy.prospecto.lead.servicios.length ?
                                                                                                proy.prospecto.lead.servicios.map((servicio)=>{
                                                                                                    return(
                                                                                                        <>
                                                                                                            {servicio.servicio}
                                                                                                            <br />
                                                                                                        </>
                                                                                                    )
                                                                                                })
                                                                                            : '-'
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify white-space-nowrap">
                                                                                    {
                                                                                        proy.prospecto.lead.origen ?
                                                                                            proy.prospecto.lead.origen.origen
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-center white-space-nowrap">
                                                                                    {
                                                                                        proy.prospecto.lead.presupuesto_diseño ?
                                                                                            setMoneyTableSinSmall(proy.prospecto.lead.presupuesto_diseño.total)
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-center white-space-nowrap">
                                                                                    {
                                                                                        proy.prospecto.lead.presupuesto_diseño ?
                                                                                            `${proy.prospecto.lead.presupuesto_diseño.m2}`
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-center white-space-nowrap">
                                                                                    {setDateTableLG(proy.prospecto.lead.created_at)}
                                                                                </td>
                                                                                <td className="font-size-sm text-center white-space-nowrap">
                                                                                    {setDateTableLG(proy.created_at)}
                                                                                </td>
                                                                                <td className="font-size-sm text-center white-space-nowrap">
                                                                                    {
                                                                                        proy.prospecto.vendedores.map((vendedor)=>{
                                                                                            return(
                                                                                                <>
                                                                                                    {vendedor.name}
                                                                                                    <br />
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </td>                    
                                                                            </tr>
                                                                        )
                                                                    })
                                                                :   
                                                                    <tr>
                                                                        <td colSpan = "9" className="font-size-sm text-center white-space-nowrap">
                                                                            NO SE CONTRATARON LEADS EN ESTE PERIODO
                                                                        </td>
                                                                    </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey='21'>
                                                { this.setButtons('20', '22', null, empresa, this.isActivePane(data.origenesDuplicados) ? '21' : '20', 
                                                    'CONCLUSIONES')}
                                                <Editor editorClassName = "editor-class" editorState = { form.listados.conclusiones }
                                                    toolbar = { { options: ['list'], list: { inDropdown: false, options: ['unordered'], }, } }
                                                    onEditorStateChange = { (editorState) => this.onEditorStateChange(editorState, 'conclusiones') } />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey='22'>
                                                { this.setButtons('21', null, true, empresa, this.isActivePane(data.origenesDuplicados) ? '22' : '21', 
                                                    'SUGERENCIAS') }
                                                <Editor editorClassName = "editor-class"  editorState = { form.listados.sugerencias }
                                                    toolbar = { { options: ['list'], list: { inDropdown: false, options: ['unordered'], }, } }
                                                    onEditorStateChange = { (editable) => this.onEditorStateChange(editable, 'sugerencias') } />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </>
                                : form.rango === "mensual" ?
                                    <>
                                       {/* -------------------------------------------------------------------------- */
                                        /* ------------------------- ANCHOR GRAFICAS MESUAL ------------------------- */
                                        /* -------------------------------------------------------------------------- */}
                                        <Tab.Container activeKey={key}>
                                            <Tab.Content>
                                                <div className="separator separator-solid separator-border-1 my-4"></div>
                                                {
                                                    this.isActivePane(data.total) ?
                                                        <Tab.Pane eventKey='1'>
                                                            {this.setButtons(null, '2', null, empresa, '01', 'ENTRADA TOTAL DE LEADS')}
                                                            <Bar ref={this.chartTotalReference} data={data.total} options = { dataSimpleBar } />
                                                        </Tab.Pane>
                                                    : <></>
                                                }
                                                <Tab.Pane eventKey='2'>
                                                    {this.setButtons('1', '3', null, empresa, '02', 'COMPARATIVA DE LEADS TOTALES (MESES ANTERIORES)')}
                                                    <Bar ref={this.chartTotalComparativaReference} data={data.comparativa} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='3'>
                                                    {this.setButtons('2', '4', null, empresa, '03', `ORIGEN DE LEADS (${mes} ${form.año})`)}
                                                    <Bar ref={this.chartTotalOrigenesReference} data={data.origenes} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='4'>
                                                    {this.setButtons('3', '5', null, empresa, '04', 'COMPARATIVA ORIGEN LEADS (MESES ANTERIORES)')}
                                                    <Bar ref={this.chartComparativaOrigenesReference} data={data.origenesComparativa} options={optionsBarGroup} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='5'>
                                                    {this.setButtons('4', '6', null, empresa, '05', `SERVICIOS SOLICITADOS (${mes} ${form.año})`)}
                                                    <Bar ref={this.chartTotalServiciosReference} data={data.servicios} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='6'>
                                                    {this.setButtons('5', '7', null, empresa, '06', 'COMPARATIVA SERVICIOS SOLICITADOS (MESES ANTERIORES)')}
                                                    <Bar ref={this.chartComparativaServiciosReference} data={data.serviciosComparativa} options={optionsBarGroup} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='7'>
                                                    {this.setButtons('6', '8', null, empresa, '07', `TIPO DE LEAD (${mes} ${form.año})`)}
                                                    <Bar ref={this.chartTiposReference} data={data.tipos} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='8'>
                                                    {this.setButtons('7', '9', null, empresa, '08', 'COMPARATIVA TIPO DE LEAD (MESES ANTERIORES)')}
                                                    <Bar ref={this.chartComparativaTiposReference} data={data.tiposComparativa} options={optionsBarGroup} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='9'>
                                                    {this.setButtons('8', '10', null, empresa, '09', `TOTAL DE PROSPECTOS (${mes} ${form.año})`)}
                                                    <Bar ref={this.chartProspectosReference} data={data.prospectos} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='10'>
                                                    {this.setButtons('9', '11', null, empresa, '10', 'COMPARATIVA TOTAL DE PROSPECTOS (MESES ANTERIORES)')}
                                                    <Line ref={this.chartComparativaProspectosReference} data={data.prospectosComparativa} options={optionsLine} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='11'>
                                                    {this.setButtons('10', '12', null, empresa, '11', `ESTATUS DE PROSPECTOS (${mes} ${form.año})`)}
                                                    <Bar ref={this.chartEstatusReference} data={data.estatus} options={optionsBar} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='12'>
                                                    {this.setButtons('11', '13', null, empresa, '12', 'COMPARATIVA ESTATUS DE PROSPECTOS (MESES ANTERIORES)')}
                                                    <Bar ref={this.chartComparativaEstatusReference} data={data.estatusComparativa} options={optionsBarGroup} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='13'>
                                                    {this.setButtons('12', '14', null, empresa, '13', `PROSPECTOS CONTRATADOS (${mes} ${form.año})`)}
                                                    <table className="table table-separate table-responsive-sm table-borderless table-vertical-center">
                                                        <thead>
                                                            <tr className="bg-light-gray text-dark-75">
                                                                <th className="border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-justify">
                                                                        NOMBRE DE LEAD
                                                            </div>
                                                                </th>
                                                                <th className="border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-justify">
                                                                        VENDEDOR
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-justify">
                                                                        ORIGEN
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        COSTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content" style={{ minWidth: "100px" }}>
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        FECHA DE CONTRATACION
                                                            </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                data.cerrados.map((element, index) => {
                                                                    return (
                                                                        <tr key={index} >
                                                                            <td className="font-size-sm text-justify">
                                                                                {
                                                                                    element.prospecto ?
                                                                                        element.prospecto.lead ?
                                                                                            element.prospecto.lead.nombre
                                                                                            : '-'
                                                                                        : '-'
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-justify">
                                                                                {
                                                                                    element.prospecto ?
                                                                                        element.prospecto.vendedores ?
                                                                                            element.prospecto.vendedores.length > 0 ?
                                                                                                <ul className='no-list'>
                                                                                                    {
                                                                                                        element.prospecto.vendedores.map((vendedor, index) => {
                                                                                                            return (
                                                                                                                <li key={index}>
                                                                                                                    {vendedor.name}
                                                                                                                </li>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </ul>
                                                                                                : '-'
                                                                                            : '-'
                                                                                        : '-'
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-justify">
                                                                                {
                                                                                    element.prospecto ?
                                                                                        element.prospecto.lead ?
                                                                                            element.prospecto.lead.origen ?
                                                                                                element.prospecto.lead.origen.origen
                                                                                                : ''
                                                                                            : ''
                                                                                        : ''
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-center">
                                                                                {
                                                                                    element.prospecto ?
                                                                                        element.prospecto.lead ?
                                                                                            element.prospecto.lead.presupuesto_diseño ?
                                                                                                setMoneyTableSinSmall(element.prospecto.lead.presupuesto_diseño.total)
                                                                                                : '-'
                                                                                            : '-'
                                                                                        : '-'
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-center">
                                                                                {setDateTableLG(element.created_at)}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                data.cerrados.length === 0 ?
                                                                    <tr>
                                                                        <td className='font-size-sm text-center' colSpan="5">
                                                                            No hubo prospectos cerrados
                                                                </td>
                                                                    </tr>
                                                                    : ''
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='14'>
                                                    {this.setButtons('13', '15', null, empresa, '14', `OBSERVACIONES DE PROSPECTOS (${mes} ${form.año})`)}
                                                    <table className="table table-separate table-responsive-sm table-borderless table-vertical-center">
                                                        <thead>
                                                            <tr className="bg-light-gray text-dark-75">
                                                                <th className="border-0 center_content text-justify">
                                                                    <div className="font-size-lg font-weight-bolder">
                                                                        NOMBRE DE LEAD
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content text-justify" style={{ minWidth: "121px" }}>
                                                                    <div className="font-size-lg font-weight-bolder">
                                                                        PROYECTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        ESTATUS
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        PRIMER CONTACTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        ÚLTIMO CONTACTO
                                                            </div>
                                                                </th>
                                                                <th className="border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        OBSERVACIONES
                                                            </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                form.leads.map((lead, index) => {
                                                                    if (lead.prospecto)
                                                                        return (
                                                                            <tr key={index} >
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        lead.nombre
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        lead.prospecto.tipo_proyecto ?
                                                                                            lead.prospecto.tipo_proyecto.tipo
                                                                                            :
                                                                                            lead.servicios.map((serv, index) => {
                                                                                                return serv.servicio
                                                                                            })
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {
                                                                                        lead.prospecto.estatus_prospecto ?
                                                                                            this.setLabel(lead.prospecto.estatus_prospecto)
                                                                                            : ''
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center font-size-sm'>
                                                                                    {
                                                                                        lead.prospecto.contactos ?
                                                                                            lead.prospecto.contactos.length ?
                                                                                                setDateTableLG(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                                                : 'SIN CONTACTO'
                                                                                            : 'SIN CONTACTO'
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center font-size-sm'>
                                                                                    {
                                                                                        lead.prospecto.contactos ?
                                                                                            lead.prospecto.contactos.length ?
                                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                                                : 'SIN CONTACTO'
                                                                                            : 'SIN CONTACTO'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        this.setComentario(lead)
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    return false
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='15'>
                                                    {this.setButtons('14', '16', null, empresa, '15', 'LISTADO DE PROSPECTO (MESES ANTERIORES)')}
                                                    <table className="table table-separate table-responsive-sm table-borderless table-vertical-center">
                                                        <thead>
                                                            <tr className="bg-light-gray text-dark-75">
                                                                <th className="border-0 center_content" style={{ minWidth: "133px" }}>
                                                                    <div className="font-size-lg font-weight-bolder text-justify">
                                                                        NOMBRE DE LEAD
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-justify">
                                                                        PROYECTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        ESTATUS
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        PRIMER CONTACTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        ÚLTIMO CONTACTO
                                                            </div>
                                                                </th>
                                                                <th className="clave border-0 center_content">
                                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                                        MOTIVO
                                                            </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                leadsAnteriores.map((lead, index) => {
                                                                    if (lead.prospecto)
                                                                        return (
                                                                            <tr key={index} >
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        lead.nombre
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        lead.prospecto.tipo_proyecto ?
                                                                                            lead.prospecto.tipo_proyecto.tipo
                                                                                            :
                                                                                            lead.servicios.map((serv, index) => {
                                                                                                return serv.servicio
                                                                                            })
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center'>
                                                                                    {
                                                                                        lead.prospecto.estatus_prospecto ?
                                                                                            this.setLabel(lead.prospecto.estatus_prospecto)
                                                                                            : ''
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center font-size-sm'>
                                                                                    {
                                                                                        lead.prospecto.contactos ?
                                                                                            lead.prospecto.contactos.length ?
                                                                                                setDateTableLG(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                                                : 'SIN CONTACTO'
                                                                                            : 'SIN CONTACTO'
                                                                                    }
                                                                                </td>
                                                                                <td className='text-center font-size-sm'>
                                                                                    {
                                                                                        lead.prospecto.contactos ?
                                                                                            lead.prospecto.contactos.length ?
                                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                                                : 'SIN CONTACTO'
                                                                                            : 'SIN CONTACTO'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        this.setComentario(lead)
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    return false
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey='16'>
                                                    {this.setButtons('15', null, true, empresa, '16', 'CONCLUSIONES')}
                                                    <Editor
                                                        editorClassName="editor-class"
                                                        toolbar={
                                                            {
                                                                options: ['list'],
                                                                list: {
                                                                    inDropdown: false,
                                                                    options: ['unordered'],
                                                                },
                                                            }
                                                        }
                                                        editorState={editorState}
                                                        onEditorStateChange={this.onEditorStateChange}
                                                    />
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Tab.Container>
                                    </>
                                    : ""
                        }

                    </Card.Body>
                </Card>
                <Modal size="lg" title="Reportes de ventas" show={modal} handleClose={this.handleCloseModal} >
                    <Tab.Container activeKey={empresaActive}
                        onSelect={(select) => this.onClickEmpresa(select)}>
                        <div className="d-flex justify-content-end mt-2">
                            <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                {
                                    empresas.map((empresa, key) => {
                                        return (
                                            <Nav.Item className="navi-item" key={key}>
                                                <Nav.Link eventKey={empresa.id}>{empresa.name}</Nav.Link>
                                            </Nav.Item>
                                        )
                                    })
                                }
                            </Nav>
                        </div>
                        {
                            empresas.map((empresa) => {
                                if (empresaActive.toString() === empresa.id.toString())
                                    return (
                                        <div className="d-flex justify-content-center mt-4">
                                            <table className="table table-vertical-center text-center mt-3" id="reportes">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th>
                                                            Año
                                                        </th>
                                                        <th>
                                                            Mes
                                                        </th>
                                                        <th>
                                                            Archivo
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        empresa.reportes.map((reporte, key) => {
                                                            return (
                                                                <tr key={key}>
                                                                    <td> {reporte.año} </td>
                                                                    <td> {mesesEspañol[parseInt(reporte.mes)]} </td>
                                                                    <td>
                                                                        <a href = { reporte.adjunto.url} rel="noopener noreferrer" target = '_blank'
                                                                            className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-primary" >
                                                                            <span className="svg-icon svg-icon-md">
                                                                                <i className="far fa-file-pdf icon-15px"></i>
                                                                            </span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        empresa.reportes.length === 0 ?
                                                            <tr>
                                                                <td colSpan="3">
                                                                    No hay reportes generados
                                                                </td>
                                                            </tr>
                                                            : ''
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    )
                                return ''
                            })
                        }
                    </Tab.Container>
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReporteVentas)