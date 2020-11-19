import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Tab } from 'react-bootstrap'
import { Button, InputSinText } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import swal from 'sweetalert'
import { COLORES_GRAFICAS_2, IM_AZUL, INEIN_RED, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import { Pie, Bar, Line } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { setLabelTable, setOptions } from '../../functions/setters';
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ReporteVentasInein from '../../components/pdfs/ReporteVentasInein'
import ReporteVentasIm from '../../components/pdfs/ReporteVentasIm'

class ReporteVentas extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        empresa : '',
        form:{
            fechaInicio: moment().startOf('month'),
            fechaFin: moment().endOf('month'),
            referencia: 'trimestral',
            empresa: '',
        },
        data:{
            total: {},
            comparativa: {}
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
        this.chartTotalComparativaReference = React.createRef();
        this.chartTotalOrigenesReference = React.createRef();
        this.chartComparativaOrigenesReference = React.createRef();
        this.chartTotalServiciosReference = React.createRef();
        this.chartComparativaServiciosReference = React.createRef();
        this.chartTiposReference = React.createRef();
        this.chartComparativaTiposReference = React.createRef();
        this.chartProspectosReference = React.createRef();
        this.chartComparativaProspectosReference = React.createRef();
        this.chartEstatusReference = React.createRef();
        this.chartComparativaEstatusReference = React.createRef();
    }

    componentDidMount() {
        this.getOptionsAxios()
    }

    setOpacity = array =>{
        let aux = [];
        array.map( (element) => {
            aux.push(element+'D9')
            return false
        })
        return aux
    }

    setOpacity2 = array =>{
        let aux = [];
        array.map( (element) => {
            aux.push(element+'5F')
            return false
        })
        return aux
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

    changeTabe = value => {
        this.setState({
            ...this.state,
            key: value
        })
    }

    setColor = () => {
        const { empresa } = this.state
        switch(empresa){
            case 'INEIN':
                return INEIN_RED
            case 'INFRAESTRUCTURA MÉDICA':
                return IM_AZUL
            default:
                break;
        }
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form, options } = this.state
        let { empresa } = this.state
        form[name] = value

        if(name === 'empresa'){
            options.empresas.map((emp)=>{
                if(emp.value === value)
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

    onSubmit = e => {
        e.preventDefault();
        const { form } = this.state
        if(form.empresa !== '' && form.referencia !== '' && form.fechaInicio !== null && form.fechaFin !== null )
            this.getReporteVentasAxios()
        else
            errorAlert('No completaste todos los campos.')
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

    async getReporteVentasAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'reportes/ventas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads, servicios, origenes, tipos, prospectos, estatus } = response.data
                const { data, form } = this.state
                swal.close()
                data.total = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [leads[0].leads],
                        backgroundColor: [
                            this.setColor()
                        ],
                        hoverBackgroundColor: [
                            this.setColor()+'D9'
                        ]
                    }]
                }

                let arrayLabels = []
                let arrayData = []
                let colors = []
                
                leads.map((element)=>{
                    arrayLabels.push(element.label);
                    arrayData.push(element.leads)
                })

                colors = this.getBG(arrayData.length);

                data.comparativa = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'Total de leads',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                arrayLabels = []
                arrayData = []
                colors = []

                let keys = Object.keys(origenes)

                keys.map((element)=>{
                    if(origenes[element][0].leads > 0){
                        arrayLabels.push(element)
                        arrayData.push(origenes[element][0].leads)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.origenes = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'ORIGEN DE LEADS',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                keys = Object.keys(servicios)

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element)=>{
                    if(servicios[element][0].leads > 0){
                        arrayLabels.push(element)
                        arrayData.push(servicios[element][0].leads)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.servicios = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'SERVICIOS SOLICITADOS',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                keys = ['Basura', 'Potencial']

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element)=>{
                    if(tipos[element][0].leads > 0){
                        arrayLabels.push(element)
                        arrayData.push(tipos[element][0].leads)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.tipos = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TIPO DE LEADS',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                //Comparativa tipo leads
                arrayLabels = []
                arrayData = []
                let arrayDataSets = []

                tipos['Basura'].map((tipo) => {
                    arrayLabels.push(tipo.label)
                    arrayData.push(tipo.leads)
                })

                arrayDataSets.push(
                    {
                        label: 'Basura',
                        data: arrayData,
                        backgroundColor: colors[0]
                    }
                );

                arrayData = []
                tipos['Potencial'].map((element)=>{
                    arrayData.push(element.leads)
                })

                arrayDataSets.push(
                    {
                        label: 'Potencial',
                        data: arrayData,
                        backgroundColor: colors[1]
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

                keys.map((element)=>{
                    if(prospectos[element][0].leads > 0){
                        arrayLabels.push(element)
                        arrayData.push(prospectos[element][0].leads)
                    }
                })

                colors = this.getBG(arrayData.length)
                let colors2 = this.setOpacity2(colors)

                data.prospectos = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TOTAL DE PROSPECTOS',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                //Comparativa prospectos
                arrayLabels = []
                arrayData = []
                arrayDataSets = []

                prospectos['Convertido'].map((prospecto) => {
                    arrayLabels.push(prospecto.label)
                    arrayData.push(prospecto.leads)
                })

                arrayDataSets.push(
                    {
                        label: 'Convertido',
                        data: arrayData,
                        backgroundColor: colors[0],
                        borderColor: colors2[0],
                        fill: false,
                        yAxisID: 'y-axis-1',
                    }
                );

                arrayData = []
                prospectos['Sin convertir'].map((element)=>{
                    arrayData.push(element.leads)
                })

                arrayDataSets.push(
                    {
                        label: 'Sin convertir',
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

                keys = Object.keys(origenes)

                keys.map((element, key)=>{
                    arrayLabels.push(element)
                    if(key === 0){
                        origenes[element].map((dataSet, index)=>{
                            if( index <= 2 )
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label,
                                        data: [],
                                        backgroundColor: '',
                                    }
                                )
                        })
                    }
                })

                colors = this.getBG(arrayDataSets.length);
                
                arrayDataSets.map((element, key)=>{
                    arrayData = []
                    keys.map((origen) => {
                        arrayData.push(origenes[origen][key].leads)
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]
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

                keys.map((element, key)=>{
                    arrayLabels.push(element)
                    if(key === 0){
                        servicios[element].map((dataSet, index)=>{
                            if( index <= 2 )
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label,
                                        data: [],
                                        backgroundColor: '',
                                    }
                                )
                        })
                    }
                })

                colors = this.getBG(arrayDataSets.length);
                
                arrayDataSets.map((element, key)=>{
                    arrayData = []
                    keys.map((servicio) => {
                        arrayData.push(servicios[servicio][key].leads)
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]
                })

                data.serviciosComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                keys = Object.keys(estatus)

                arrayLabels = []
                arrayData = []
                colors = []

                keys.map((element)=>{
                    if(estatus[element][0].leads > 0){
                        arrayLabels.push(element)
                        arrayData.push(estatus[element][0].leads)
                    }
                })

                colors = this.getBG(arrayData.length);

                data.estatus = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'ESTATUS DE PROSPECTOS',
                            data: arrayData,
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
                        }
                    ]
                }

                //Comparativa status prospectos
                arrayLabels = []
                arrayData = []
                arrayDataSets = []
                
                keys = Object.keys(estatus)

                colors = this.getBG(keys.length);
                colors2 = this.setOpacity2(colors)
                
                estatus[keys[0]].map((tipo) => {
                    arrayLabels.push(tipo.label)
                    arrayData.push(tipo.leads)
                })

                keys.map((element, index)=>{
                    if(index > 0){
                        arrayData = []
                        estatus[element].map((tipo) => {
                            arrayData.push(tipo.leads)
                        })
                    }
                    arrayDataSets.push(
                        {
                            label: element,
                            data: arrayData,
                            backgroundColor: colors[index],
                            borderColor: colors2[index],
                            fill: false,
                            yAxisID: 'y-axis-1',
                        }
                    );
                })

                data.estatusComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }

                this.setState({
                    ...this.state,
                    data,
                    key: 'ten'
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

    render() {
        const { form, leads, data, options: opciones, key, editorState } = this.state

        const optionsPie = {
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
                display: false,
            },
        }

        const optionsBar = {
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },
            scales: {
            yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        }

        const optionsBarStacked = {
            scales: {
                yAxes: [
                    {
                        stacked: false,
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
                xAxes: [
                    {
                        stacked: false,
                    },
                ],
            },
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 15,
                        weight: 'bold'
                    }
                }
            },
        }

        const optionsLine = {
            scales: {
                yAxes: [
                    {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1'
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
                        size: 15,
                        backgroundColor: '#fff'
                    },
                }
            },
        }
        
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
                                    options = { opciones }
                                    onChangeRange = { this.onChangeRange }
                                    onChangeRangeRef = { this.onChangeRangeRef }
                                    onChange = { this.onChange }
                                    className = "mb-3"
                                    onSubmit = { this.onSubmit }
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
                                        <div className = "col-md-11" >
                                            <Pie ref = { this.chartTotalReference } data = { data.total } options = { optionsPie } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'two'>
                                    {this.setButtons('one', 'three', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                02
                                            </strong>
                                            COMPARATIVA DE LEADS TOTALES
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartTotalComparativaReference } data = { data.comparativa } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'three'>
                                    {this.setButtons('two', 'four', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                03
                                            </strong>
                                            ORIGEN DE LEADSS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartTotalOrigenesReference } data = { data.origenes } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'four'>
                                    {this.setButtons('three', 'five', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                04
                                            </strong>
                                            COMPARATIVA ORIGEN LEADS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartComparativaOrigenesReference } data = { data.origenesComparativa } options = { optionsBarStacked } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'five'>
                                    {this.setButtons('four', 'six', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                05
                                            </strong>
                                            SERVICIOS SOLICITADOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartTotalServiciosReference } data = { data.servicios } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'six'>
                                    {this.setButtons('five', 'seven', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                06
                                            </strong>
                                            COMPARATIVA SERVICIOS SOLICITADOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartComparativaServiciosReference } data = { data.serviciosComparativa } options = { optionsBarStacked } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'seven'>
                                    {this.setButtons('six', 'eight', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                07
                                            </strong>
                                            TIPO DE LEAD
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Bar ref = { this.chartTiposReference } data = { data.tipos } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'eight'>
                                    {this.setButtons('seven', 'nine', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                08
                                            </strong>
                                            COMPARATIVA TIPO DE LEAD
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartComparativaTiposReference } data = { data.tiposComparativa } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'nine'>
                                    {this.setButtons('eight', 'ten', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                09
                                            </strong>
                                            TOTAL DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Bar ref = { this.chartProspectosReference } data = { data.prospectos } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'ten'>
                                    {this.setButtons('nine', 'eleven', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                10
                                            </strong>
                                            COMPARATIVA TOTAL DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Line ref = { this.chartComparativaProspectosReference } data = { data.prospectosComparativa } options = { optionsLine } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'eleven'>
                                    {this.setButtons('ten', 'twelve', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                11
                                            </strong>
                                            STATUS DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Bar ref = { this.chartEstatusReference } data = { data.estatus } options = { optionsBar } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'twelve'>
                                    {this.setButtons('eleven', 'thirteen', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                12
                                            </strong>
                                            COMPARATIVA STATUS DE PROSPECTOS
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Line ref = { this.chartComparativaEstatusReference } data = { data.estatusComparativa } options = { optionsLine } />
                                        </div>
                                    </div>
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