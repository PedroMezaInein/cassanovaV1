import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { Button } from '../../components/form-components'
import { waitAlert, errorAlert, printResponseErrorAlert, questionAlert2, doneAlert, deleteAlert } from '../../functions/alert'
import Swal from 'sweetalert2'
import { COLORES_GRAFICAS_MESES, IM_AZUL, INEIN_RED, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import { Bar } from 'react-chartjs-2'
import "chartjs-plugin-datalabels";
import { setLabelVentas, setOptions, setDateTableLG, setMoneyTableSinSmall } from '../../functions/setters'
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import RVAnualInein from '../../components/pdfs/ReporteVentasAnual/RVAnualInein'
import RVAnualIm from '../../components/pdfs/ReporteVentasAnual/RVAnualIm'
import RVMensualIm from '../../components/pdfs/ReporteVentasMensual/RVMensualIm'
import RVMensualInein from '../../components/pdfs/ReporteVentasMensual/RVMensualInein'
import { Modal } from '../../components/singles'
import { dataSimpleBar, monthGroupBar, percentBar, percentBarReplaceAds, monthGroupBarBreak2, monthGroupBarServicios } from '../../constantes/barOptions'

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
            cerrados: [],
            listado_prospectos:{},
            listado_prospectos_anteriores:{}
        },
        leads: [],
        leadsAnteriores: [],
        options: {
            empresas: []
        },
        empresaActive: '',
        tipo: '',
        table_observaciones:false,
        table_prospecto_anteriores:false,
        meses: []
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
    }

    componentDidMount() { this.getOptionsAxios() }
    handleCloseModal = () => { this.setState({...this.state,modal: false}) }
    onClickEmpresa = select => { this.setState({...this.state, empresaActive: select}) }

    setReporte = (images, lista, sugerencias ) => {
        const { empresa, form, leadsAnteriores, mes, data, meses } = this.state
        switch (empresa) {
            case 'INEIN':
                if(form.rango === 'semestral' || form.rango === 'anual')
                    return(
                        <RVAnualInein form = { form } images = { images } data = { data } meses = { meses }
                            conclusiones = { lista } sugerencias = { sugerencias } mes = { mes.toUpperCase() } />
                    )
                else
                    return (
                        <RVMensualInein form={form} images={images} anteriores={leadsAnteriores} meses = { meses }
                            conclusiones = { lista } sugerencias = { sugerencias } mes={mes.toUpperCase()} data={data} />
                    )
            case 'INFRAESTRUCTURA MÉDICA':
                if(form.rango === 'semestral' || form.rango === 'anual')
                    return(
                        <RVAnualIm form = { form } images = { images } data = { data } meses = { meses }
                            conclusiones = { lista } sugerencias = { sugerencias } mes = { mes.toUpperCase() } />
                    )
                else
                return (
                    <RVMensualIm form={form} images={images} anteriores={leadsAnteriores} meses = { meses }
                        conclusiones = { lista } sugerencias = { sugerencias } mes={mes.toUpperCase()} data={data} />
                )
            default:
                break;
        }
    }

    setLabel = (estatus) => {
        let text = {}
        text.letra = estatus.color_texto
        text.fondo = estatus.color_fondo
        text.estatus = estatus.estatus
        return setLabelVentas(text)
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

    changeTabe = value => { this.setState({ ...this.state, key: value }) }

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
        if (name === 'empresa')
            options.empresas.map((emp) => {
                if (emp.value === value)
                    empresa = emp.name
                return false
            })
        this.setState({ ...this.state, form, empresa })
    }

    addOpacityToColors = (arreglo, string) => {
        let aux = []
        arreglo.map((elemento) => {
            aux.push(elemento + string)
            return '';
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

    deleteReporteAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}reportes/ventas/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getReporteAxios()
            },(error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    saveReporteAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        data.append('empresa', form.empresa)
        data.append('mes', form.mes)
        data.append('año', form.año)
        data.append('rango', form.rango)
        data.append('periodo', form.periodo)

        form.adjuntos.reportes.files.map((file) => {
            data.append(`adjuntos[]`, file.file)
            return ''
        })

        await axios.post(`${URL_DEV}reportes/ventas/save`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                form.empresa = ''
                form.mes = ''
                form.año = ''
                form.adjuntos.reportes.value = ''
                form.adjuntos.reportes.files = []
                form.rango = ''
                form.periodo = ''
                this.setState({ ...this.state, form })
                doneAlert('Reporte de ventas guardado con éxito')

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
            console.error(error, 'error')
        })
    }

    getReporteVentasAxios2 = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}reportes/ventas/add/${form.rango}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data: result, meses } = response.data;
                Swal.close()

                /* -------------------------------------------------------------------------- */
                /* ------------------------- ENTRADA TOTAL DE LEADS ------------------------- */
                /* -------------------- ANCHOR GET TOTAL DE LEADS ANUALES ------------------- */
                /* -------------------------------------------------------------------------- */
                this.setState({ ...this.state,  data: this.setData(result, meses, 'anual'),  key: '1', tipo: 'anual', meses: meses })

            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    getReporteVentasAxios = async() => {

        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v2/reportes/ventas`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { data: result, meses } = response.data;
                meses = meses.map(function (e) { 
                    return e.toUpperCase()
                });
                Swal.close()
                /* -------------------------------------------------------------------------- */
                /* ------------------------- ENTRADA TOTAL DE LEADS ------------------------- */
                /* -------------------- ANCHOR GET TOTAL DE LEADS ANUALES ------------------- */
                /* -------------------------------------------------------------------------- */
                let auxData = this.setData(result, meses, 'mensual')
                this.setState({ ...this.state,  data: auxData,  key: '1', tipo: 'mensual', meses: meses })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getReporteAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/ventas/guardados', { responseType: 'json', headers: { 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
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
            console.error(error, 'error')
        })
    }

    async generarPDF() {

        /* -------------------------------------------------------------------------- */
        /*                  ANCHOR LLAMADA ASYNC PARA GENERAR EL PDF                  */
        /* -------------------------------------------------------------------------- */

        waitAlert()
        // let aux = []
        let imagenes = []
        const { form, data } = this.state
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

        let lista = convertToRaw(form.listados.conclusiones.getCurrentContent())
        let conclusiones = []
        lista.blocks.map((element) => {
            let estilos = [];
            element.inlineStyleRanges.map((estilo) => {
                if(estilo.style === 'BOLD')
                    for(let i = 0; i < estilo.length; i++){
                        estilos.push(i + estilo.offset)
                    }
                return ''
            })
            conclusiones.push({
                estilos: estilos,
                texto: element.text.toUpperCase()
            })
            return ''
        })
        lista = convertToRaw(form.listados.sugerencias.getCurrentContent())
        let sugerencias = []
        lista.blocks.map((element) => {
            let estilos = [];
            element.inlineStyleRanges.map((estilo) => {
                if(estilo.style === 'BOLD')
                    for(let i = 0; i < estilo.length; i++){
                        estilos.push(i + estilo.offset)
                    }
                return ''
            })
            sugerencias.push({
                estilos: estilos,
                texto: element.text.toUpperCase()
            })
            return ''
        })

        const blob = await pdf((this.setReporte(imagenes, conclusiones, sugerencias, data))).toBlob();
        form.adjuntos.reportes.files = [
            {
                name: 'reporte.pdf',
                file: new File([blob], "reporte.pdf"),
                url: URL.createObjectURL(blob)
            }
        ]

        this.setState({...this.state,form})
        Swal.close()
        questionAlert2('¿ESTÁS SEGURO?', '',() => this.saveReporteAxios(),this.getTextAlert())
    }

    setData = (result, meses, tipo) => {
        const mesesEspañol = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        const { form } = this.state
        // ENTRADA TOTAL DE LEADS
        let data = {}
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
                maxBarThickness: 400
            }]
        }
        // ENTRADA DE LEADS MENSUAL
        let aux = []
        let auxPercent = []
        let auxLabels = []
        let auxColors = []
        result.total_meses.forEach((element, index)=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
            auxLabels.push({ label: meses[index], value: element.total })
        })
        
        auxColors = [];
        result.total_meses.forEach( (color, index) => {
            if(tipo === 'mensual'){
                if(index===0){
                    auxColors.push(this.setColor());
                }
                if(index!==0){
                    auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
                }
            }else{
                auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
            }
        })
        data.comparativa = {
            labels: auxLabels,
            datasets: [{
                data: aux,
                percent: auxPercent,
                backgroundColor: this.addOpacityToColors(auxColors, 'BF'),
                hoverBackgroundColor: this.addOpacityToColors(auxColors, 'D9'),
                borderWidth: 3,
                borderColor: auxColors,
            }]
        }
        // ORIGEN DE LEADS
        data.origenes = {
            labels: [
                {label: 'Orgánico', value: result.origen.organico.total},
                {label: 'ADS', value: result.origen.ads.total},
            ],
            datasets: [{
                data: [result.origen.organico.total, result.origen.ads.total],
                percent: [result.origen.organico.porcentaje ? result.origen.organico.porcentaje.toFixed(2) : null, 
                    result.origen.ads.porcentaje ? result.origen.ads.porcentaje.toFixed(2) : null],
                backgroundColor: ['#34A853BF', '#FBBC04BF'],
                hoverBackgroundColor: ['#34A853D9', '#FBBC04D9'],
                borderWidth: 3,
                borderColor: ['#34A853', '#FBBC04'],
                maxBarThickness: 250
            }]
        }
        // ORIGEN DE LEADS ORGÁNICOS
        aux = []
        auxPercent = []
        auxLabels = []
        result.origenes_organicos.forEach(element=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
            auxLabels.push({ label: element.nombre, value: element.total })
        })

        data.origenesOrganicos = {
            labels: auxLabels,
            datasets: [{
                data: aux,
                percent: auxPercent,
                backgroundColor: '#34A853BF',
                hoverBackgroundColor: '#34A853D9',
                borderWidth: 3,
                borderColor: '#34A853',
                maxBarThickness: 200
            }]
        }
        // ORIGEN DE LEADS ADS
        aux = []
        auxPercent = []
        auxLabels = []

        result.origenes_ads.forEach(element=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
            auxLabels.push({ label: element.nombre, value: element.total })
        })

        data.origenesAds = {
            labels: auxLabels,
            datasets: [{
                data: aux,
                percent: auxPercent,
                backgroundColor: '#FBBC04BF',
                hoverBackgroundColor: '#FBBC04D9',
                borderWidth: 3,
                borderColor: '#FBBC04',
                maxBarThickness: 200
            }]
        }
        // ORIGEN DE LEADS MENSUAL
        auxLabels = []
        aux = []
        auxColors = []
        result.origenes_meses.forEach((mes, index) => {
            mes.forEach(origen => {
                auxLabels.push(origen.nombre+';'+meses[index])
                aux.push(origen.total)
                if(origen.nombre.includes('ADS')) auxColors.push('#FBBC04')
                else auxColors.push('#34A853')
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
        // SERVICIOS SOLICITADOS
        aux = []
        auxPercent = []
        auxLabels = []
        auxColors = []

        result.servicios.forEach(element=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
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
                    auxColors.push(this.setColor());
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
        // SERVICIOS SOLICITADOS MENSUAL
        auxLabels = []
        aux = []
        auxColors = []
        result.servicios_meses.forEach((mes, index) => {
            mes.forEach(servicio => {
                if(tipo === 'mensual'){
                    if(index===0){
                        auxColors.push(this.setColor());
                    }
                    if(index!==0){
                        auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
                    }
                }else{
                    auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
                }
                auxLabels.push(servicio.nombre+';'+meses[index])
                aux.push(servicio.total)
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
        // TIPOS DE LEADS
        if(result.tipos.duplicados.total){
            data.tipos = {
                labels: [
                    {label: 'No potencial', value: result.tipos.noPotenciales.total},
                    {label: 'Potencial', value: result.tipos.potenciales.total},
                    {label: 'Duplicados', value: result.tipos.duplicados.total},
                ],
                datasets: [{
                    data: [result.tipos.noPotenciales.total, result.tipos.potenciales.total, result.tipos.duplicados.total],
                    percent: [
                        result.tipos.noPotenciales.porcentaje ? result.tipos.noPotenciales.porcentaje.toFixed(2) : null, 
                        result.tipos.potenciales.porcentaje ? result.tipos.potenciales.porcentaje.toFixed(2) : null, 
                        result.tipos.duplicados.porcentaje ? result.tipos.duplicados.porcentaje.toFixed(2) : null],
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
                    percent: [
                        result.tipos.noPotenciales.porcentaje ? result.tipos.noPotenciales.porcentaje.toFixed(2) : null, 
                        result.tipos.potenciales.porcentaje ? result.tipos.potenciales.porcentaje.toFixed(2) : null],
                    backgroundColor: ['#F79646BF', '#8064A2BF'],
                    hoverBackgroundColor: ['#F79646D9', '#8064A2D9'],
                    borderWidth: 3,
                    borderColor: ['#F79646', '#8064A2'],
                    maxBarThickness: 250
                }]
            }
        }
        // ORIGEN DE LEADS NO POTENCIALES
        aux = []
        auxPercent = []
        auxLabels = []

        result.origenes_no_potenciales.forEach(element=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
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
        // ORIGEN DE LEADS POTENCIALES
        aux = []
        auxPercent = []
        auxLabels = []

        result.origenes_potenciales.forEach(element=>{
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
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
        // ORIGEN DE LEADS DUPLICADOS
        if(result.origenes_duplicados.length > 0){
            aux = []
            auxPercent = []
            auxLabels = []

            result.origenes_duplicados.forEach(element=>{
                aux.push(element.total)
                if(element.porcentaje)
                    auxPercent.push(element.porcentaje.toFixed(2))
                else
                    auxPercent.push(null)
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
        // TIPOS DE LEADS MENSUAL
        auxLabels = []
        aux = []
        auxColors = []
        result.tipos_meses.forEach((mes, index) => {
            if(mes.potenciales){
                auxLabels.push('POTENCIAL;'+meses[index])
                aux.push(mes.potenciales)
                auxColors.push('#8064A2')
            }
            if(mes.noPotenciales){
                auxLabels.push('NO POTENCIAL;'+meses[index])
                aux.push(mes.noPotenciales)
                auxColors.push('#F79646')
            }
            if(mes.duplicados){
                auxLabels.push('DUPLICADO;'+meses[index])
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
        // TIPOS DE PROYECTOS
        auxLabels = []
        aux = []
        result.tipos_proyectos.forEach(element => {
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
        result.tipos_proyectos_meses.forEach((mes, index) => {
            mes.forEach(proy => {
                auxLabels.push(proy.nombre+';'+meses[index])
                aux.push(proy.total)
                if(form.rango === 'mensual'){
                    if(index===0){
                        auxColors.push(this.setColor());
                    }
                    if(index!==0){
                        auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
                    }
                }else{
                    auxColors.push( COLORES_GRAFICAS_MESES[ mesesEspañol.findIndex( elemento => elemento.toUpperCase() === meses[index]) - 1 ] )
                }
            })
        })
        // TIPOS DE PROYECTOS MENSUAL
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
        // LEADS CONVERTIDOS A PROSPECTOS
        data.contactados = {
            labels: [
                {label: 'SIN RESPUESTA', value: result.contactados.sinConvertir.total},
                {label: 'CONTACTADOS', value: result.contactados.contactados.total},
            ],
            datasets: [{
                data: [
                    result.contactados.sinConvertir.total, 
                    result.contactados.contactados.total],
                percent: [
                    result.contactados.sinConvertir.porcentaje ? result.contactados.sinConvertir.porcentaje.toFixed(2) : null, 
                    result.contactados.contactados.porcentaje ? result.contactados.contactados.porcentaje.toFixed(2) : null],
                backgroundColor: ['#A6A6A6BF', this.setColor() + 'BF'],
                hoverBackgroundColor: ['#A6A6A6D9', this.setColor() + 'D9'],
                borderColor: ['#A6A6A6', this.setColor()],
                borderWidth: 3,
                maxBarThickness: 250
            }]
        }
         // ESTATUS DE PROSPECTOS
        auxLabels = []
        aux = []
        auxColors = []
        auxPercent = []
        result.estatus.forEach(element => {
            aux.push(element.total)
            if(element.porcentaje)
                auxPercent.push(element.porcentaje.toFixed(2))
            else
                auxPercent.push(null)
            auxLabels.push({ label: element.nombre, value: element.total })
            switch(element.nombre){
                case 'Cancelado':
                case 'Rechazado':
                    auxColors.push('#ef3145');
                    break;
                case 'En proceso':
                    auxColors.push('#3699FF');
                    break;
                case 'Detenido':
                    auxColors.push('#b6b8b9');
                    break;
                case 'En negociación':
                    auxColors.push('#82594d');
                    break;
                case 'Contratado':
                    auxColors.push('#388e3c');
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
        // PRINCIPALES MOTIVOS DE CANCELACIÓN
        auxLabels = []
        aux = []
        auxPercent = []
        result.motivos_cancelacion.forEach(element => {
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
        // PRINCIPALES MOTIVOS DE RECHAZO
        auxLabels = []
        aux = []
        auxPercent = []
        result.motivos_rechazo.forEach(element => {
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
        data.listado_prospectos = result.listado_prospectos
        data.listado_prospectos_anteriores = result.listado_prospectos_anteriores
        return data
    }

    getTextAlert = () => {
        const { empresa, form } = this.state
        let meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let mes = meses[parseInt(form.mes)]
        return (
            <div>
                <span className="text-dark-50 font-weight-bolder">
                    ¿DESEAS GUARDAR EL
                        <u>
                            <a rel="noopener noreferrer" href={form.adjuntos.reportes.files[0].url} target='_blank' className='text-primary mx-1'>
                                REPORTE DE VENTAS
                            </a>
                        </u>
                    { form.rango === 'mensual' ? `${empresa} ${mes} ${form.año}?` : ''}
                    {
                        form.rango === 'semestral' ?
                            form.periodo === '1' ? 
                                `${empresa} ENERO - JUNIO ${form.año}?`
                            : `${empresa} JULIO - DICIEMBRE ${form.año}?`
                        : ''
                    }
                    { form.rango === 'anual' ? `${empresa} anual ${form.año}?` : '' }
                </span>
            </div>
        )
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
        this.setState({ ...this.state, form })
    }

    onSubmitAdjunto = e => {
        e.preventDefault();
        const { form } = this.state
        if (form.empresa !== '' && form.año !== '' && form.adjuntos.reportes.files.length > 0)
            this.saveReporteAxios()
        else
            errorAlert('No completaste todos los campos.')
    }

    isActivePane = (dato) => {
        if(dato){
            if(Object.keys(dato).length > 0) return true
        }
        return false
    }

    hasElementOnArray = dato => {
        if(dato){
            if(dato.length) return true
        }
        return false
    }

    setPageNumber = numero => {
        if(numero < 10)
            return '0'+numero.toString()
        return numero.toString()
    }

    setComentario = element => {
        let aux = '';
        if(element.lead.rh || element.lead.proveedor){
            if(element.estatus_prospecto){
                switch(element.estatus_prospecto.estatus){
                    case 'Rechazado':
                    case 'Cancelado':
                        if(element.lead.motivo === '' || element.lead.motivo === null){
                            if(element.lead.rh)
                                aux += "RR.HH.\n "
                            if(element.lead.proveedor)
                                aux += "PROVEEDOR.\n "
                        }
                            else
                            aux += element.lead.motivo + "\n"
                        break;
                    default: break;
                }
            }
        }else{
            if(element.contactos){
                if(element.contactos.length){
                    aux += element.contactos[0].comentario
                }
            }
        }
        return aux
    }

    render() {
        const { form, data, options: opciones, key, modal, empresas, empresaActive, tipo, empresa } = this.state
        let { table_observaciones, table_prospecto_anteriores } = this.state
        const mesesEspañol = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        let valor = 0;
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className = "card-custom">
                    <Card.Header>
                        <div className = "card-title">  <h3 className = "card-label">Reporte de ventas</h3> </div>
                        <div className="card-toolbar">
                            <Button icon = '' className = "btn btn-icon btn-xs w-auto p-3 btn-light" only_icon = "far fa-file-pdf mr-2"
                                onClick = { () => { this.getReporteAxios() } } text = 'REPORTES GENERADOS' />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <FlujosReportesVentas form = { form } options = { opciones } onChange = { this.onChange }
                            className = "mb-3" onSubmit = { this.onSubmit } onSubmitAdjunto = { this.onSubmitAdjunto }
                            handleChange = { this.handleChange } />
                        {/* -------------------------------------------------------------------------- */
                        /*                               ANCHOR GRAFICAS                              */
                        /* -------------------------------------------------------------------------- */}
                        <Tab.Container activeKey = { key } >
                            <Tab.Content>
                                <div className="separator separator-solid separator-border-1 my-4"></div>
                                {
                                    this.isActivePane(data.total) ?
                                        <Tab.Pane eventKey='1'>
                                            {this.setButtons(null, '2', null, empresa, this.setPageNumber(++valor), 'ENTRADA TOTAL DE LEADS')}
                                            <Bar ref={this.chartTotalReference} data={data.total} options = { dataSimpleBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.comparativa) ?
                                        <Tab.Pane eventKey='2'>
                                            {this.setButtons('1', '3', null, empresa, this.setPageNumber(++valor), 'ENTRADA DE LEADS MENSUAL')}
                                            <Bar ref = { this.chartTotalComparativaReference } data = { data.comparativa } options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenes) ?
                                        <Tab.Pane eventKey='3'>
                                            {this.setButtons('2', '4', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS')}
                                            <Bar ref={this.chartTotalOrigenesReference} data={data.origenes} options = { percentBar }/>
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesOrganicos) ?
                                        <Tab.Pane eventKey='4'>
                                            {this.setButtons('3', '5', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS ORGÁNICOS')}
                                            <Bar ref={this.chartOrigenesOrganicosReference} data={data.origenesOrganicos} options = { percentBarReplaceAds } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesAds) ?
                                        <Tab.Pane eventKey='5'>
                                            {this.setButtons('4', '6', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS ADS')}
                                            <Bar ref = { this.chartOrigenesAdsReference } data = { data.origenesAds } options = { percentBarReplaceAds } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesComparativa) ?
                                        <Tab.Pane eventKey='6'>
                                            {this.setButtons('5', '7', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS MENSUAL')}
                                            <Bar ref = { this.chartComparativaOrigenesReference } data = { data.origenesComparativa } options = { monthGroupBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.servicios) ?
                                        <Tab.Pane eventKey='7'>
                                            {this.setButtons('6', '8', null, empresa, this.setPageNumber(++valor), 'SERVICIOS SOLICITADOS')}
                                            <Bar ref = { this.chartServiciosReference } data = { data.servicios } options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.serviciosComparativa) ?
                                        <Tab.Pane eventKey='8'>
                                            {this.setButtons('7', '9', null, empresa, this.setPageNumber(++valor), 'SERVICIOS SOLICITADOS MENSUAL')}
                                            <Bar ref = { this.chartServiciosComparativaReference } data = { data.serviciosComparativa } 
                                                options = { tipo === 'mensual' ? monthGroupBarServicios(this.setColor()) : monthGroupBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.tipos) ? 
                                        <Tab.Pane eventKey='9'>
                                            {this.setButtons('8', '10', null, empresa, this.setPageNumber(++valor), 'TIPO DE LEADS')}
                                            <Bar ref = { this.chartTiposReference } data = { data.tipos } options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesNoPotenciales) ?
                                        <Tab.Pane eventKey='10'>
                                            {this.setButtons('9', '11', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS NO POTENCIALES')}
                                            <Bar ref = { this.chartOrigenesNoPotencialesReference } data = { data.origenesNoPotenciales } options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesPotenciales) ?
                                        <Tab.Pane eventKey='11'>
                                            {this.setButtons('10', this.isActivePane(data.origenesDuplicados) ? '12' : '13', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS POTENCIALES')}
                                            <Bar ref = { this.chartOrigenesPotencialesReference } data = { data.origenesPotenciales } options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.origenesDuplicados) ?
                                        <Tab.Pane eventKey='12'>
                                            {this.setButtons('11', '13', null, empresa, this.setPageNumber(++valor), 'ORIGEN DE LEADS DUPLICADOS')}
                                            <Bar ref={this.chartOrigenesDuplicadosReference} data={data.origenesDuplicados} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.tipoLeadsComparativa) ?
                                        <Tab.Pane eventKey = '13'>
                                            {this.setButtons(this.isActivePane(data.origenesDuplicados) ? '12' : '11', '14', null, empresa, this.setPageNumber(++valor), 'TIPO DE LEADS MENSUAL')}
                                            <Bar ref={this.chartTiposComparativaReference} data={data.tipoLeadsComparativa} 
                                                options = { tipo === 'mensual' ? monthGroupBar : monthGroupBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.tiposProyectos) ?
                                        <Tab.Pane eventKey = '14'>
                                            { this.setButtons( '13', '15', null, empresa, this.setPageNumber(++valor),  'TIPOS DE PROYECTOS' ) }
                                            <Bar ref={this.chartTiposProyectosReference} data={data.tiposProyectos} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.tiposProyectosComparativa) ?
                                        <Tab.Pane eventKey = '15'>
                                            { this.setButtons( '14', '16', null, empresa, this.setPageNumber(++valor),  'TIPO DE PROYECTO MENSUAL' ) }
                                            <Bar ref={this.chartTiposProyectosComparativaReference} data={data.tiposProyectosComparativa} 
                                                options = { tipo === 'mensual' ? monthGroupBarBreak2 : monthGroupBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.contactados) ?
                                        <Tab.Pane eventKey = '16'>
                                            { this.setButtons( '15', '17', null, empresa, this.setPageNumber(++valor),  'LEADS CONVERTIDOS A PROSPECTOS' ) }
                                            <Bar ref={this.chartContactadosReference} data={data.contactados} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.estatus) ?
                                        <Tab.Pane eventKey='17'>
                                            {this.setButtons('16', '18', null, empresa, this.setPageNumber(++valor), 'ESTATUS DE PROSPECTOS')}
                                            <Bar ref = { this.chartEstatusReference } data = {data.estatus} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    
                                    form.rango === 'mensual' ?
                                    <Tab.Pane eventKey='18'>
                                        {
                                            table_observaciones=true
                                        }
                                        {this.setButtons('17', '19', null, empresa, this.setPageNumber(++valor), 'OBSERVACIONES DE PROSPECTOS')}
                                            <div className="table-responsive d-flex justify-content-center">
                                                <table className="table table-responsive-lg table-vertical-center w-100">
                                                    <thead>
                                                        <tr className="bg-light-gray text-dark-75">
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify" style={{minWidth:"170px"}}>
                                                                NOMBRE
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify" style={{minWidth:"132px"}}>
                                                                PROYECTO
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">
                                                                OBSERVACIONES
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center" style={{minWidth:"112px"}}>
                                                                ESTATUS
                                                            </th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">PRIMER</th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">ÚLTIMO</th>
                                                        </tr>
                                                        <tr className="bg-light-gray text-dark-75">
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                CONTACTO
                                                            </th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                CONTACTO
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.hasElementOnArray(data.listado_prospectos) ?
                                                                data.listado_prospectos.map((element, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td className="font-size-sm text-justify">
                                                                                {element.lead.nombre.toUpperCase()}
                                                                            </td>
                                                                            <td className="font-size-sm text-justify">
                                                                                {
                                                                                    element.tipo_proyecto !== null ?
                                                                                        element.tipo_proyecto.tipo : '-'
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-justify">
                                                                                {this.setComentario(element)}
                                                                            </td>
                                                                            <td className="font-size-sm text-center">
                                                                                {
                                                                                    element.estatus_prospecto ?
                                                                                        <span style={
                                                                                            {
                                                                                                backgroundColor: element.estatus_prospecto.color_fondo, color: element.estatus_prospecto.color_texto, border: 'transparent', padding: '2.8px 5.6px',
                                                                                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                                                fontWeight: 500, borderRadius:'.25rem'
                                                                                            }
                                                                                        }>{element.estatus_prospecto.estatus.toUpperCase()}</span>
                                                                                        : ''
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-center">
                                                                                {
                                                                                    element.contactos ?
                                                                                        element.contactos.length ?
                                                                                            setDateTableLG(element.contactos[element.contactos.length - 1].created_at)
                                                                                            : '-'
                                                                                        : '-'
                                                                                }
                                                                            </td>
                                                                            <td className="font-size-sm text-center">
                                                                                {
                                                                                    element.contactos ?
                                                                                        element.contactos.length ?
                                                                                            setDateTableLG(element.contactos[0].created_at)
                                                                                            : '-'
                                                                                        : '-'
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                                :
                                                                <tr>
                                                                    <td colSpan="6" className="font-size-sm text-center">
                                                                        NO SE ENCONTRARON OBSERVACIONESN DE PROSPECTOS DURANTE ESTE MES
                                                                    </td>
                                                                </tr>
                                                        }
                                                        </tbody>
                                                </table>
                                            </div>
                                    </Tab.Pane>
                                    :''
                                }
                                {
                                    this.isActivePane(data.motivosCancelacion) ?
                                        <Tab.Pane eventKey={table_observaciones?'19':'18'}>
                                            {this.setButtons(table_observaciones?'18':'17', table_observaciones?'20':'19', null, empresa, this.setPageNumber(++valor), 'PRINCIPALES MOTIVOS DE CANCELACIÓN')}
                                            <Bar ref = { this.chartMotivosCancelacionReference } data = {data.motivosCancelacion} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    this.isActivePane(data.motivosRechazo) ?
                                        <Tab.Pane eventKey={table_observaciones?'20':'19'}>
                                            {this.setButtons(table_observaciones?'19':'18', table_observaciones?'21':'20', null, empresa, this.setPageNumber(++valor), 'PRINCIPALES MOTIVOS DE RECHAZO')}
                                            <Bar ref = { this.chartMotivosRechazoReference } data = {data.motivosRechazo} options = { percentBar } />
                                        </Tab.Pane>
                                    : <></>
                                }
                                {
                                    form.rango === 'mensual' ?
                                        <Tab.Pane eventKey='21'>
                                            {
                                                table_prospecto_anteriores=true
                                            }
                                            {this.setButtons('20', '22', null, empresa, this.setPageNumber(++valor), 'LISTADO DE PROSPECTO DE MESES ANTERIORES')}
                                            <div className="table-responsive d-flex justify-content-center">
                                                <table className="table table-responsive-lg table-vertical-center w-100">
                                                    <thead>
                                                        <tr className="bg-light-gray text-dark-75">
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify" style={{minWidth:"170px"}}>
                                                                NOMBRE
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify" style={{minWidth:"132px"}}>
                                                                PROYECTO
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">
                                                                OBSERVACIONES
                                                            </th>
                                                            <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center" style={{minWidth:"112px"}}>
                                                                ESTATUS
                                                            </th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">PRIMER</th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">ÚLTIMO</th>
                                                        </tr>
                                                        <tr className="bg-light-gray text-dark-75">
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                CONTACTO
                                                            </th>
                                                            <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                                CONTACTO
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            this.hasElementOnArray(data.listado_prospectos_anteriores) ?
                                                                data.listado_prospectos_anteriores.map((element, index) => {
                                                                    return(
                                                                            <tr key= {index}>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {element.lead.nombre.toUpperCase()}
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    {
                                                                                        element.tipo_proyecto!==null?
                                                                                        element.tipo_proyecto.tipo:'-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-justify">
                                                                                    { this.setComentario(element) }
                                                                                </td>
                                                                                <td className="font-size-sm text-center">
                                                                                    {
                                                                                        element.estatus_prospecto ?
                                                                                            <span style={
                                                                                                {
                                                                                                    backgroundColor: element.estatus_prospecto.color_fondo, color: element.estatus_prospecto.color_texto, border: 'transparent', padding: '2.8px 5.6px',
                                                                                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                                                    fontWeight: 500, borderRadius:'.25rem'
                                                                                                }
                                                                                            }>{element.estatus_prospecto.estatus.toUpperCase()}</span>
                                                                                            : ''
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-center">
                                                                                    {
                                                                                        element.contactos ?
                                                                                            element.contactos.length ?
                                                                                                setDateTableLG(element.contactos[element.contactos.length - 1].created_at)
                                                                                            : '-'
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                                <td className="font-size-sm text-center">
                                                                                    {
                                                                                        element.contactos ?
                                                                                            element.contactos.length ?
                                                                                                setDateTableLG(element.contactos[0].created_at)
                                                                                            : '-'
                                                                                        : '-'
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                    )
                                                                })
                                                            :
                                                            <tr>
                                                                <td colSpan = "6" className="font-size-sm text-center">
                                                                    NO SE ENCONTRARON PROSPECTOS LOS MESES ANTERIORES
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab.Pane>
                                    :''
                                }
                                <Tab.Pane eventKey={table_prospecto_anteriores?'22':'20'}>
                                    {this.setButtons(table_prospecto_anteriores?'21':'19', table_prospecto_anteriores?'23':'21', null, empresa, this.setPageNumber(++valor), 'OBSERVACIONES CONTRATADOS')}
                                    <div className="table-responsive d-flex justify-content-center">
                                        <table className="table table-responsive-lg table-vertical-center w-100">
                                            <thead>
                                                <tr className="bg-light-gray text-dark-75">
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify">
                                                        NOMBRE
                                                    </th>
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify">
                                                        PROYECTO
                                                    </th>
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify">
                                                        SERVICIOS
                                                    </th>
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-align-last-justify">
                                                        ORIGEN
                                                    </th>
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">
                                                        MONTO
                                                    </th>
                                                    <th rowSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">
                                                        M²
                                                    </th>
                                                    <th colSpan="2" className="py-0 font-size-lg font-weight-bolder text-center">FECHA</th>
                                                    <th rowSpan = "2" className="py-0 font-size-lg font-weight-bolder text-center">
                                                        VENDEDOR
                                                    </th>
                                                </tr>
                                                <tr className="bg-light-gray text-dark-75">
                                                    <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                        INGRESO
                                                    </th>
                                                    <th className="py-0 font-size-lg font-weight-bolder text-center">
                                                        CONTRATO
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
                                <Tab.Pane eventKey={table_prospecto_anteriores?'23':'21'}>
                                    { this.setButtons(table_prospecto_anteriores?'22':'20', table_prospecto_anteriores?'24':'22', null, empresa, this.setPageNumber(++valor), 'CONCLUSIONES')}
                                    <Editor editorClassName = "editor-class" editorState = { form.listados.conclusiones }
                                        toolbar = { { options: ['list', 'inline'], list: { inDropdown: false, options: ['unordered'], },
                                            inline: { options: ['bold']} } }
                                        onEditorStateChange = { (editorState) => this.onEditorStateChange(editorState, 'conclusiones') } />
                                </Tab.Pane>
                                <Tab.Pane eventKey={table_prospecto_anteriores?'24':'22'}>
                                    { this.setButtons(table_prospecto_anteriores?'23':'21', null, true, empresa, this.setPageNumber(++valor), 'SUGERENCIAS') }
                                    <Editor editorClassName = "editor-class"  editorState = { form.listados.sugerencias }
                                        toolbar = { { options: ['list', 'inline'], list: { inDropdown: false, options: ['unordered'], },
                                            inline: { options: ['bold']} } }
                                        onEditorStateChange = { (editable) => this.onEditorStateChange(editable, 'sugerencias') } />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
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
                                                        <th></th>
                                                        <th>
                                                            Año
                                                        </th>
                                                        <th>
                                                            Mes
                                                        </th>
                                                        <th>
                                                            Rango
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
                                                                    <td>
                                                                        <span onClick = { (e) => { e.preventDefault(); deleteAlert(
                                                                            '¿ESTÁS SEGURO?', 'ELIMINARÁS EL REPORTE ¡NO PODRÁS REVERTIR ESTO!', () => this.deleteReporteAxios(reporte.id)
                                                                        ) } }
                                                                            className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-danger" >
                                                                            <span className="svg-icon svg-icon-md">
                                                                                <i className="fas fa-minus-circle icon-15px"></i>
                                                                            </span>
                                                                        </span>
                                                                    </td>
                                                                    <td> {reporte.año} </td>
                                                                    <td> {mesesEspañol[parseInt(reporte.mes)]} 
                                                                        {
                                                                            reporte.mes_fin !== null ?
                                                                                ` - ${mesesEspañol[parseInt(reporte.mes_fin)]}`
                                                                            : ''
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {reporte.rango}
                                                                    </td>
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
                                                                <td colSpan="5">
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