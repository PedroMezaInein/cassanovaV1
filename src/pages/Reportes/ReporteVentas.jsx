import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Tab } from 'react-bootstrap'
import { Button, InputSinText } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import swal from 'sweetalert'
import { COLORES_GRAFICAS_2, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import {Pie} from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { setLabelTable, setOptions } from '../../functions/setters';
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';
import ReporteVentasInein from '../../components/pdfs/ReporteVentasInein'
import ReporteVentasIm from '../../components/pdfs/ReporteVentasIm'

const options = {
    plugins: {
        datalabels: {
            color: '#000',
            font: '30',
            backgroundColor: '#fff',
		    font: {
                size: 30
            }
        }
    },
    legend:{
        display: true,
        position: "right",
        fullWidth: true,
        reverse: false,
        labels: {
            fontColor: '#000',
            fontSize: 20
        }
    },
}

const options2 = {
    plugins: {
        datalabels: {
            color: '#000',
            font: '30',
            backgroundColor: '#fff',
		    font: {
                size: 30
            }
        }
    },
    legend:{
        display: false,
    },
}

class ReporteVentas extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        empresa : '',
        url: [],
        form:{
            fechaInicio: null,
            fechaFin: null,
            fechaInicioRef: null,
            fechaFinRef: null,
            empresa: '',
            adjuntos:{
                reportes:{
                    value: '',
                    placeholder: 'Reporte',
                    files: []
                }
            },
            leads: []
        },
        data:{
            total: {}
        },
        leads: [],
        leadsAnteriores: [],
        options: {
            empresas: []
        }
    }

    constructor(props) {
        super(props);
        this.chartTotalReference = React.createRef();
        this.chartTotalAnterioresReference = React.createRef();
        this.chartTotalOrigenesReference = React.createRef();
        this.chartTotalOrigenesAnterioresReference = React.createRef();
        this.chartServiciosReference = React.createRef();
        this.chartServiciosAnterioresReference = React.createRef();
        this.chartTiposReference = React.createRef();
        this.chartTiposAnterioresReference = React.createRef();
        this.chartProspectosReference = React.createRef();
        this.chartEstatusProspectosReference = React.createRef();
    }

    componentDidMount() {
        this.getOptionsAxios()
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })
        if(form.empresa !== '' && form.fechaInicio !== null && form.fechaFin !== null && form.fechaInicioRef !== null && form.fechaFinRef !== null){
            this.getReporteVentasAxios()
        }
    }

    onChangeRangeRef = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicioRef = startDate
        form.fechaFinRef = endDate
        this.setState({
            ... this.state,
            form
        })
        if(form.empresa !== '' && form.fechaInicio !== null && form.fechaFin !== null && form.fechaInicioRef !== null && form.fechaFinRef !== null){
            this.getReporteVentasAxios()
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form, options } = this.state
        let { empresa } = this.state
        form[name] = value
        
        if(form.empresa !== '' && form.fechaInicio !== null && form.fechaFin !== null && form.fechaInicioRef !== null && form.fechaFinRef !== null){
            this.getReporteVentasAxios()
        }
        if(name === 'empresa'){
            options.empresas.map((emp)=>{
                
                if(emp.value === value)
                    empresa = emp.name
            })
        }
        this.setState({
            ... this.state,
            form,
            empresa
        })
    }

    onChangeObservaciones = e => {
        const { name, value } = e.target
        let { form } = this.state
        form.leads[name].observacion = value
        this.setState({
            ... this.state,
            form
        })
    }

    getBG = tamaño => {
        let aux = []
        for(let i = 0; i < tamaño; i++){
            aux.push(
                COLORES_GRAFICAS_2[i]
            )
        }
        return aux
    }

    setOpacity = array =>{
        let aux = [];
        array.map( (element) => {
            aux.push(element+'D9')
        })
        return aux
    }

    getMonth = () => {
        const { form } = this.state
        let fecha = moment(form.fechaInicio)
        let mes = fecha.month()
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return meses[mes]
    }

    getLastMonth = () => {
        const { form } = this.state
        let fecha = moment(form.fechaInicioRef)
        let mes = fecha.month()
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return meses[mes]
    }

    getYear = () => {
        const { form } = this.state
        let fecha = moment(form.fechaInicio)
        let año = fecha.year()
        return año
    }

    setReporte = ( images, lista ) => {
        const { empresa, form  } = this.state
        switch(empresa){
            case 'INEIN':
                return(
                    <ReporteVentasInein form = { form } images = { images }
                        lista = { lista } />
                )
            case 'INFRAESTRUCTURA MÉDICA':
                return(
                    <ReporteVentasIm form = { form } images = { images }
                        lista = { lista } />
                )
        }
    }

    setColor = () => {
        const { empresa } = this.state
        switch(empresa){
            case 'INEIN':
                return '#D8005A'
            case 'INFRAESTRUCTURA MÉDICA':
                return '#7096c1'
        }
    }

    async generarPDF(){
        waitAlert()
        let aux = []
        const { leads, form } = this.state
        aux.push(
            {
                name: 'total',
                url: this.chartTotalReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'total-anteriores',
                url: this.chartTotalAnterioresReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'origenes',
                url: this.chartTotalOrigenesReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'origenes-anteriores',
                url: this.chartTotalOrigenesAnterioresReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'servicios',
                url: this.chartServiciosReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'servicios-anteriores',
                url: this.chartServiciosAnterioresReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'tipos',
                url: this.chartTiposReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'tipos-anteriores',
                url: this.chartTiposAnterioresReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'prospectos',
                url: this.chartProspectosReference.current.chartInstance.toBase64Image()
            },
            {
                name: 'estatus-prospectos',
                url: this.chartEstatusProspectosReference.current.chartInstance.toBase64Image()
            }
        )
        let lista = draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent()))
        lista = lista.toUpperCase();
        lista = lista.replace(/\n|\r/g, "");
        lista = lista.split('-')
        const blob = await pdf((
            this.setReporte( aux, lista )
        )).toBlob();
        form.adjuntos.reportes.files = [
            {
                name: 'reporte.pdf',
                url: URL.createObjectURL(blob)
            }
        ]
        if(form.adjuntos.reportes.files.length > 0)
            window.open(form.adjuntos.reportes.files[0].url, '_blank');
        swal.close()
        this.setState({
            ... this.state,
            form,
            url: aux
        })
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')

                this.setState({
                    ... this.state,
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

    async getReporteVentasAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'reportes/ventas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, leadsAnteriores, servicios, origenes, estatus } = response.data
                const { data, form, empresa } = this.state
                data.total = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [leads.length],
                        backgroundColor: [
                            this.setColor()
                        ],
                        hoverBackgroundColor: [
                            this.setColor()+'D9'
                        ]
                    }]
                }

                data.totalAnteriores = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [leadsAnteriores.length],
                        backgroundColor: [
                            this.setColor()
                        ],
                        hoverBackgroundColor: [
                            this.setColor()+'D9'
                        ]
                    }]
                }

                let contador = 0
                let contador2 = 0
                let arrayLabes = []
                let arrayData = []
                let arrayLabes2 = []
                let arrayData2 = []
                origenes.map( (origen) => {
                    contador = 0
                    contador2 = 0
                    leads.map((lead)=> {
                        if(lead.origen)
                            if(lead.origen.origen === origen.origen)
                                contador ++
                    })
                    if(contador)
                    {
                        arrayLabes.push(origen.origen.toUpperCase())
                        arrayData.push(contador)
                    }
                    leadsAnteriores.map((lead)=> {
                        if(lead.origen)
                            if(lead.origen.origen === origen.origen)
                                contador2 ++
                    })
                    if(contador2)
                    {
                        arrayLabes2.push(origen.origen.toUpperCase())
                        arrayData2.push(contador2)
                    }
                })

                let colors = this.getBG(arrayData.length);

                data.totalOrigenes = {
                    labels: arrayLabes,
                    datasets: [{
                        data: arrayData,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                colors = this.getBG(arrayData2.length);

                data.totalOrigenesAnteriores = {
                    labels: arrayLabes2,
                    datasets: [{
                        data: arrayData2,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                contador = 0
                contador2 = 0
                arrayLabes = []
                arrayData = []
                arrayLabes2 = []
                arrayData2 = []
                
                servicios.map( (servicio) => {
                    contador = 0
                    contador2 = 0
                    leads.map( (lead) => {
                        lead.servicios.map( (serv) => {
                            if(servicio.servicio === serv.servicio){
                                contador ++
                            }
                        })
                    })
                    if(contador)
                    {
                        arrayLabes.push(servicio.servicio.toUpperCase())
                        arrayData.push(contador)
                    }
                    leadsAnteriores.map( (lead) => {
                        lead.servicios.map( (serv) => {
                            if(servicio.servicio === serv.servicio){
                                contador2 ++
                            }
                        })
                    })
                    if(contador2)
                    {
                        arrayLabes2.push(servicio.servicio.toUpperCase())
                        arrayData2.push(contador2)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.servicios = {
                    labels: arrayLabes,
                    datasets: [{
                        data: arrayData,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                colors = this.getBG(arrayData2.length);
                data.serviciosAnteriores = {
                    labels: arrayLabes2,
                    datasets: [{
                        data: arrayData2,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                contador = 0
                contador2 = 0
                
                leads.map((lead)=>{
                    if(lead.tipo_lead === 'basura')
                        contador++
                    if(lead.tipo_lead === 'potencial')
                        contador2++
                })

                colors = this.getBG(2);

                data.tipos = {
                    labels: ['BASURA', 'POTENCIAL'],
                    datasets: [{
                        data: [contador, contador2],
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                contador = 0
                contador2 = 0
                
                leadsAnteriores.map((lead)=>{
                    if(lead.tipo_lead === 'basura')
                        contador++
                    if(lead.tipo_lead === 'potencial')
                        contador2++
                })

                colors = this.getBG(2);

                data.tiposAnteriores = {
                    labels: ['BASURA', 'POTENCIAL'],
                    datasets: [{
                        data: [contador, contador2],
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                contador = 0
                arrayLabes = []
                arrayData = []

                estatus.map( (element) => {
                    contador = 0
                    leads.map((lead)=>{
                        if(lead.prospecto){
                            if(lead.prospecto.estatus_prospecto)
                            {
                                if(lead.prospecto.estatus_prospecto.estatus === element.estatus){
                                    contador ++
                                }
                            }
                        }
                    })
                    if(contador)
                    {
                        arrayLabes.push(element.estatus.toUpperCase())
                        arrayData.push(contador)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.estatusProspectos = {
                    labels: arrayLabes,
                    datasets: [{
                        data: arrayData,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                contador = 0
                contador2 = 0
                
                leads.map((lead)=>{
                    if(lead.contactado === 1)
                        contador++
                    else
                        contador2++
                })

                colors = ['#388E3C', '#F64E60']

                data.prospectos = {
                    labels: ['CONVERTIDO', 'SIN CONVERTIR'],
                    datasets: [{
                        data: [contador, contador2],
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }
                form.leads = leads
                form.leads.map((lead)=> {
                    lead.observacion = ''
                })

                swal.close()
                this.setState({
                    ... this.state,
                    leads: leads,
                    key: 'one',
                    form
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
    changeTabe = value => {
        this.setState({
            ... this.state,
            key: value
        })
    }
    setLabel = (estatus) => {
        let text = {}
        text.letra = estatus.color_texto
        text.fondo = estatus.color_fondo
        text.estatus = estatus.estatus
        return setLabelTable(text)
    }
    setButtons = (left, right, generar) => {
        return(
            <div className = { left !== null ? "d-flex justify-content-between" : 'd-flex justify-content-end'}>
                {
                    left !== null ?
                        <div>
                            <Button
                                icon=''
                                onClick={() => { this.changeTabe(left) }}
                                className = "btn btn-icon btn-primary-info btn-sm mr-2 ml-auto"
                                only_icon={"fas fa-chevron-circle-left icon-md"}
                                tooltip={{ text: 'SIGUIENTE' }}
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
                                className = "btn btn-icon btn-primary-info btn-sm mr-2 ml-auto"
                                only_icon={"fas fa-chevron-circle-right icon-md"}
                                tooltip={{ text: 'SIGUIENTE' }}
                                />
                        </div>
                    : ''
                }
                {
                    generar !== null ?
                        <div>
                            <Button
                                icon=''
                                onClick={ (e) => { e.preventDefault(); waitAlert(); this.generarPDF() }}
                                className = "btn btn-icon btn-light-success btn-sm mr-2 ml-auto"
                                only_icon={"far fas fa-file-pdf icon-md"}
                                tooltip={{ text: 'GENERAR PDF' }}
                                />
                        </div>
                    : ''
                }
            </div>
        )
    }
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    render() {
        const { form, leads, data, url, key } = this.state
        
        return (
            <Layout active = 'reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Reporte de ventas</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="row mx-0">
                            <div className="col-md-12">                                
                                <FlujosReportesVentas
                                    form = { form }
                                    options = { this.state.options }
                                    onChangeRange = { this.onChangeRange }
                                    onChangeRangeRef = { this.onChangeRangeRef }
                                    onChange = { this.onChange }
                                    className = "mb-3"
                                    />
                            </div>
                        </div>
                        <Tab.Container activeKey = { key }>
                            <Tab.Content>
                                <Tab.Pane eventKey = 'one'>
                                    {this.setButtons(null, 'two', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                01 
                                            </strong>
                                            ENTRADA TOTAL DE LEADS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Pie ref = { this.chartTotalReference } data = { data.total } options = { options2 } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'two'>
                                    {this.setButtons('one', 'three', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                02 
                                            </strong>
                                            COMPARATIVA LEADS ACTUALES VS { this.getLastMonth() }
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTotalReference } data = { data.total } options = { options2 } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getMonth()}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTotalAnterioresReference } data = { data.totalAnteriores } options = { options2 } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getLastMonth()}
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'three'>
                                    {this.setButtons('two', 'four', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                03
                                            </strong>
                                            ORIGEN DE LEADS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTotalOrigenesReference } data = { data.totalOrigenes } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'four'>
                                    {this.setButtons('three', 'five', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                04
                                            </strong>
                                            COMPARATIVA ORIGEN LEADS ACTUALES VS { this.getLastMonth() }
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTotalOrigenesReference } data = { data.totalOrigenes } options = { options } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getMonth()}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTotalOrigenesAnterioresReference } data = { data.totalOrigenesAnteriores } options = { options } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getLastMonth()}
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'five'>
                                    {this.setButtons('four', 'six', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                05
                                            </strong>
                                            SERVICIOS SOLICITADOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartServiciosReference } data = { data.servicios } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'six'>
                                    {this.setButtons('five', 'seven', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                06
                                            </strong>
                                            COMPARATIVA SERVICIOS SOLICITADOS VS { this.getLastMonth() }
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartServiciosReference } data = { data.servicios } options = { options } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getMonth()}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartServiciosAnterioresReference } data = { data.serviciosAnteriores } options = { options } />
                                            <div className = "text-reporte-ventas text-center">
                                                {this.getLastMonth()}
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'seven'>
                                    {this.setButtons('six', 'eight', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                07
                                            </strong>
                                            TIPO DE LEAD
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTiposReference } data = { data.tipos } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'eight'>
                                    {this.setButtons('seven', 'nine', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                08
                                            </strong>
                                            COMPARATIVA TIPO LEADS VS { this.getLastMonth() }
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTiposReference } data = { data.tipos } options = { options } />
                                        </div>
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartTiposAnterioresReference } data = { data.tiposAnteriores } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'nine'>
                                    {this.setButtons('eight', 'ten', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                09
                                            </strong>
                                            TOTAL DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartProspectosReference } data = { data.prospectos } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'ten'>
                                    {this.setButtons('nine', 'eleven', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                10
                                            </strong>
                                            STATUS DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className="col-md-6">
                                            <Pie ref = { this.chartEstatusProspectosReference } data = { data.estatusProspectos } options = { options } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'eleven'>
                                    {this.setButtons('ten', 'twelve', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                11
                                            </strong>
                                            OBSERVACIONES DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <table className="table table-separate table-responsive-sm">
                                        <thead>
                                            <tr>
                                                <th className="border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        NOMBRE DE LEAD
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        PROYECTO
                                                    </div>
                                                </th>
                                                <th className="border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        OBSERVACIONES
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        STATUS
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                leads.map((lead, index)=>{
                                                    if(lead.prospecto)
                                                        return(
                                                            <tr key = { index } >
                                                                <td className="font-size-sm text-center">
                                                                    {
                                                                        lead.nombre
                                                                    }
                                                                </td>
                                                                <td className="font-size-sm text-center">
                                                                    {
                                                                        lead.servicios.map((serv, index) => {
                                                                            return serv.servicio
                                                                        })
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        form.leads.length ?
                                                                            <InputSinText
                                                                                name = { index}
                                                                                as = 'textarea'
                                                                                rows = { 1 }
                                                                                onChange = { this.onChangeObservaciones }
                                                                                value = { form.leads[index].observacion }
                                                                                />
                                                                        :''
                                                                    }
                                                                    
                                                                </td>
                                                                <td>
                                                                    {
                                                                        lead.prospecto.estatus_prospecto ?
                                                                            this.setLabel(lead.prospecto.estatus_prospecto)
                                                                        : ''
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'twelve'>
                                    {this.setButtons('eleven', null, true)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                12
                                            </strong>
                                            CONCLUSIONES
                                        </h3>
                                    </div>
                                    <Editor 
                                        editorClassName = "editor-class"
                                        toolbar = { 
                                            {
                                                options: ['list'],
                                                list: {
                                                    inDropdown: false,
                                                    options: ['unordered'],
                                                },
                                            }
                                        }
                                        editorState = { this.state.editorState }
                                        onEditorStateChange={this.onEditorStateChange}
                                        />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReporteVentas)