import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { Button, InputSinText } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert, questionAlert2 } from '../../functions/alert'
import swal from 'sweetalert'
import { COLORES_GRAFICAS_3, IM_AZUL, INEIN_RED, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import { Pie, Bar, Line } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { setLabelTable, setOptions, setDateTableLG, setTextTable, setMoneyTable, setMoneyTableSinSmall } from '../../functions/setters';
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ReporteVentasInein from '../../components/pdfs/ReporteVentasInein'
import ReporteVentasIm from '../../components/pdfs/ReporteVentasIm'
import { Modal } from '../../components/singles'

class ReporteVentas extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        empresas: [],
        modal: false,
        mes: '',
        empresa : '',
        form:{
            empresa: '',
            mes: '',
            año: new Date().getFullYear(),
            leads: [],
            adjuntos:{
                reportes:{
                    value: '',
                    placeholder: 'Reporte',
                    files: []
                }
            }
        },
        data:{
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
        this.chartComparativaOrigenesReference = React.createRef();
        this.chartTotalServiciosReference = React.createRef();
        this.chartComparativaServiciosReference = React.createRef();
        this.chartTiposReference = React.createRef();
        this.chartComparativaTiposReference = React.createRef();
        this.chartProspectosReference = React.createRef();
        this.chartComparativaProspectosReference = React.createRef();
        this.chartEstatusReference = React.createRef();
        this.chartComparativaEstatusReference = React.createRef();
        /* this.chartCerradosReference = React.createRef(); */
    }

    componentDidMount() {
        this.getOptionsAxios()
    }

    handleCloseModal =  () => {
        this.setState({
            ...this.state,
            modal: false
        })
    }

    onClickEmpresa = select => {
        this.setState({
            ...this.state,
            empresaActive: select
        })
    }

    setReporte = ( images, lista ) => {
        const { empresa, form, leadsAnteriores, mes, data } = this.state
        switch(empresa){
            case 'INEIN':
                return(
                    <ReporteVentasInein form = { form } images = { images } anteriores = { leadsAnteriores }
                        lista = { lista } mes = { mes.toUpperCase() } data = { data } />
                )
            case 'INFRAESTRUCTURA MÉDICA':
                return(
                    <ReporteVentasIm form = { form } images = { images } anteriores = { leadsAnteriores }
                        lista = { lista } mes = { mes.toUpperCase() } data = { data } />
                )
            default:
                break;
        }
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

    setLabel = (estatus) => {
        let text = {}
        text.letra = estatus.color_texto
        text.fondo = estatus.color_fondo
        text.estatus = estatus.estatus
        return setLabelTable(text)
    }

    getBG = tamaño => {
        let aux = []
        for(let i = 0; i < tamaño; i++){
            aux.push(
                COLORES_GRAFICAS_3[i]
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

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
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

    onChangeObservaciones = e => {
        const { name, value } = e.target
        let { form } = this.state
        form.leads[name].observacion = value
        this.setState({
            ...this.state,
            form
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

    async saveReporteAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        data.append('empresa', form.empresa)
        data.append('mes', form.mes)
        data.append('año', form.año)

        for (var i = 0; i < form.adjuntos.reportes.files.length; i++) 
            data.append(`adjuntos[]`, form.adjuntos.reportes.files[i].file)

        await axios.post( URL_DEV + 'reportes/ventas/save', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) forbiddenAccessAlert()
                else errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
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
                const { leads, servicios, origenes, tipos, prospectos, estatus, cerrados, observaciones, observacionesAnteriores, mes } = response.data
                const { data, form } = this.state
                
                form.leads = observaciones
                form.leads.map((lead)=> {
                    lead.observacion = ''
                    return false
                })
                
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
                
                leads.map((element)=>{
                    arrayLabels.push(element.label.toUpperCase());
                    arrayData.push(element.leads)
                })

                colors = this.getBG(arrayData.length);

                data.comparativa = {
                    labels: arrayLabels,
                    datasets: [
                        {
                            label: 'TOTAL DE LEADS',
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
                        arrayLabels.push(element.toUpperCase())
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
                        arrayLabels.push(element.toUpperCase())
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
                        arrayLabels.push(element.toUpperCase())
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
                    arrayLabels.push(tipo.label.toUpperCase())
                    arrayData.push(tipo.leads)
                })

                arrayDataSets.push(
                    {
                        label: 'BASURA',
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
                        label: 'POTENCIAL',
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

                if(prospectos['Convertido'][0].leads > 0){
                    arrayLabels.push('CONVERTIDO')
                    arrayData.push(prospectos['Convertido'][0].leads)
                }
                if(tipos['Potencial'][0].leads > 0){
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
                            backgroundColor: colors,
                            hoverBackgroundColor: this.setOpacity(colors)
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

                for(let i = prospectos['Convertido'].length - 1; i >= 0; i--){
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
                for(let i = tipos['Potencial'].length - 1; i >= 0; i--){
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

                keys.map((element, key)=>{
                    arrayLabels.push(element.toUpperCase())
                    if(key === 0){
                        origenes[element].map((dataSet, index)=>{
                            if( index <= 2 )
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
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
                let contador = 0
                let contadorArray = []
                // console.log(arrayDataSets, 'arraydatasets')
                if(arrayDataSets.length){
                    arrayDataSets[0].data.map((element, index)=>{
                        contador = 0
                        arrayDataSets.map((newElement, key)=>{
                            contador += newElement.data[index]
                        })
                        if(contador === 0 )
                            contadorArray.push(index)
                    })
                }

                contadorArray.map((element)=>{
                    arrayDataSets.map((newElement)=>{
                        newElement.data.splice(element, 1)
                    })
                    arrayLabels.splice(element, 1)
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
                    arrayLabels.push(element.toUpperCase())
                    if(key === 0){
                        servicios[element].map((dataSet, index)=>{
                            if( index <= 2 )
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
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
                        arrayLabels.push(element.toUpperCase())
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
                keys = Object.keys(estatus)
                arrayLabels = []
                arrayData = []
                colors = []
                arrayDataSets = []
                keys.map((element, key)=>{
                    arrayLabels.push(element.toUpperCase())
                    if(key === 0){
                        estatus[element].map((dataSet, index)=>{
                            if( index <= 2 )
                                arrayDataSets.push(
                                    {
                                        label: dataSet.label.toUpperCase(),
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
                        arrayData.push(estatus[origen][key].leads)
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]
                })
                contador = 0
                contadorArray = []
                // console.log(arrayDataSets, 'arraydatasets')
                if(arrayDataSets.length){
                    arrayDataSets[0].data.map((element, index)=>{
                        contador = 0
                        arrayDataSets.map((newElement, key)=>{
                            contador += newElement.data[index]
                        })
                        if(contador === 0 )
                            contadorArray.push(index)
                    })
                }

                contadorArray.map((element)=>{
                    arrayDataSets.map((newElement)=>{
                        newElement.data.splice(element, 1)
                    })
                    arrayLabels.splice(element, 1)
                })

                data.estatusComparativa = {
                    labels: arrayLabels,
                    datasets: arrayDataSets
                }
                
                this.setState({
                    ...this.state,
                    data,
                    key: 'one',
                    form,
                    leadsAnteriores: observacionesAnteriores,
                    mes: mes
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

    async getReporteAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/ventas/guardados', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas } = response.data
                swal.close()
                this.setState({
                    ...this.state,
                    modal: true,
                    empresas: empresas
                })
            },
            (error) => {
                swal.close()
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            swal.close()
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async generarPDF(){
        waitAlert()
        let aux = []
        const { form, editorState, empresa } = this.state
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

        let lista = convertToRaw(editorState.getCurrentContent())
        
        let _lista = []
        
        lista.blocks.map((element)=>{
            _lista.push(element.text.toUpperCase())
        })
        
        const blob = await pdf((
            this.setReporte( aux, _lista )
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

        swal.close()
        
        questionAlert2(
            '¿ESTÁS SEGURO?', '',
            () => this.saveReporteAxios(),
            this.getTextAlert()
        )
        
    }

    getTextAlert = () => {
        const { empresa, form  } = this.state
        let meses = [ '', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return (
            <div>
                <span className="text-dark-50 font-weight-bolder">
                    ¿DESEAS GUARDAR EL 
                        <u>
                            <a href = { form.adjuntos.reportes.files[0].url } target='_blank' className='text-primary mx-2'>
                                REPORTE DE VENTAS
                            </a>
                        </u>
                    { ' ' + empresa + ' ' + meses[parseInt(form.mes)] + ' ' + form.año + '?' }
                </span>
            </div>
        )
    }

    setComentario = lead => {
        let aux = '-'
        if(lead){
            if(lead.prospecto){
                if(lead.prospecto.estatus_prospecto){
                    switch(lead.prospecto.estatus_prospecto.estatus){
                        case 'Cancelado':
                        case 'Rechazado':
                            aux = lead.prospecto.estatus_prospecto.estatus
                            break;
                    }
                }else{
                    if(lead.estatus){
                        switch(lead.estatus.estatus){
                            case 'Cancelado':
                            case 'Rechazado':
                                aux = lead.motivo
                                break;
                        }
                    }
                }
            }
        }
        if( aux  === '-' ){
            if(lead){
                if(lead.prospecto){
                    if(lead.prospecto.contactos){
                        if(lead.prospecto.contactos.length){
                            aux = lead.prospecto.contactos[0].comentario
                        }
                    }
                }
            }
        }
        return aux
    }

    render() {
        const { form, data, options: opciones, key, editorState, leadsAnteriores, mes, modal, empresas, empresaActive } = this.state

        const optionsPie = {
            plugins: {
                datalabels: {
                    color: '#fff',
                    font: {
                        size: 25,
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
                                fontColor: '#000'
                            }
                        },
                    ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 20,
                            fontColor: '#000',
                            lineWidth: 10,
                            padding: 15,
                            position: 'bottom',
                            autoSkip: false,
                            callback: function(value, index, values) {
                                let auxiliar = ''
                                switch(value){
                                    case 'AÚN NO LO SE':
                                        auxiliar = ['AÚN NO','LO SE']
                                        break;
                                    case 'ORGÁNICO THANK YOU':
                                        auxiliar = ['ORGÁNICO','THANK YOU']
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
                                }
                                if(auxiliar !== '')
                                    return auxiliar
                                let aux = value.split(' ')
                                return aux
                            }
                        }
                    },
                ]
            },
            legend:{
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 20,
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
                            fontColor: '#000'
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 20,
                            fontColor: '#000',
                            padding: 15,
                            position: 'bottom',
                            autoSkip: false,
                            maxRotation: 0,
                            callback: function(value, index, values) {
                                let auxiliar = ''
                                switch(value){
                                    case 'AÚN NO LO SE':
                                        auxiliar = ['AÚN NO','LO SE']
                                        break;
                                    case 'ORGÁNICO THANK YOU':
                                        auxiliar = ['ORGÁNICO','THANK YOU']
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
                                }
                                if(auxiliar !== '')
                                    return auxiliar
                                let aux = value.split(' ')
                                return aux
                            }
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
        }

        const optionsBarStacked = {
            scales: {
                yAxes: [
                    {
                        /* stacked: true, */
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
        }

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
                            fontColor: '#000'
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 20,
                            fontColor: '#000',
                            padding: 15,
                            position: 'bottom',
                            autoSkip: false,
                            maxRotation: 0,
                            callback: function(value, index, values) {
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
            legend:{
                fullWidth: true,
                labels: {
                    boxWidth: 20,
                    padding: 5,
                    fontSize: 18,
                }
            },
        }

        const mesesEspañol = [ '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        
        return (
            <Layout active = 'reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title w-100 d-flex justify-content-between">
                            <h3 className="card-label">Reporte de ventas</h3>
                            <div>
                                <Button icon =''
                                    className = "btn btn-icon btn-xs p-3 btn-light-primary mr-2"
                                    onClick = { () => { this.getReporteAxios() } }
                                    only_icon = "far fa-file-pdf icon-15px"
                                    tooltip = { { text: 'REPORTES DE VENTAS GENERADOS' } }/>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="row mx-0">
                            <div className="col-md-12">
                                <FlujosReportesVentas
                                    form = { form }
                                    options = { opciones }
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
                                            ENTRADA TOTAL DE LEADS ({mes})
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
                                            COMPARATIVA DE LEADS TOTALES (MESES ANTERIORES)
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
                                            ORIGEN DE LEADS ({mes})
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
                                            COMPARATIVA ORIGEN LEADS (MESES ANTERIORES)
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartComparativaOrigenesReference } data = { data.origenesComparativa } options = { optionsBarGroup } />
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
                                            SERVICIOS SOLICITADOS ({mes})
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
                                            COMPARATIVA SERVICIOS SOLICITADOS (MESES ANTERIORES)
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-12" >
                                            <Bar ref = { this.chartComparativaServiciosReference } data = { data.serviciosComparativa } options = { optionsBarGroup } />
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
                                            TIPO DE LEAD ({mes})
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
                                            COMPARATIVA TIPO DE LEAD (MESES ANTERIORES)
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-11" >
                                            <Bar ref = { this.chartComparativaTiposReference } data = { data.tiposComparativa } options = { optionsBarGroup } />
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
                                            TOTAL DE PROSPECTOS ({mes})
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
                                            COMPARATIVA TOTAL DE PROSPECTOS (MESES ANTERIORES)
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
                                            STATUS DE PROSPECTOS ({mes})
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
                                            COMPARATIVA STATUS DE PROSPECTOS (MESES ANTERIORES)
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Bar ref = { this.chartComparativaEstatusReference } data = { data.estatusComparativa } options = { optionsBarGroup } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'thirteen'>
                                    {this.setButtons('twelve', 'fourteen', null)}
                                    <div className = " my-3 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                13
                                            </strong>
                                            PROSPECTOS CONTRATADOS ({mes})
                                        </h3>
                                    </div>
                                    {/* <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Pie ref = { this.chartCerradosReference } data = { data.cerrados } options = { optionsPie } />
                                        </div>
                                    </div> */}
                                    <table className="table table-separate table-responsive-sm">
                                        <thead>
                                            <tr className = 'border-bottom'>
                                                <th className="border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        NOMBRE DE LEAD
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        COSTO
                                                    </div>
                                                </th>
                                                <th className="border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        VENDEDOR
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        FECHA DE CONTRATACION
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        ORIGEN
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.cerrados.map((element, index)=>{
                                                    return(
                                                        <tr key = { index } >
                                                            <td className="font-size-sm text-center">
                                                                {
                                                                    element.prospecto ?
                                                                        element.prospecto.lead ?
                                                                            element.prospecto.lead.nombre
                                                                        : '-'
                                                                    : '-'
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
                                                                {
                                                                    element.prospecto ?
                                                                        element.prospecto.vendedores ?
                                                                            element.prospecto.vendedores.length > 0 ?
                                                                                <ul className = 'no-list'>
                                                                                    {
                                                                                        element.prospecto.vendedores.map((vendedor, index)=>{
                                                                                            return(
                                                                                                <li key = { index }>
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
                                                            <td className="font-size-sm text-center">
                                                                { setDateTableLG(element.created_at) }
                                                            </td>
                                                            <td className="font-size-sm text-center">
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
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {
                                                data.cerrados.length === 0 ?
                                                    <tr>
                                                        <td className = 'font-size-sm text-center' colSpan = "5">
                                                            No hubo prospectos cerrados
                                                        </td>
                                                    </tr>
                                                : ''
                                            }
                                        </tbody>
                                    </table>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'fourteen'>
                                    {this.setButtons('thirteen', 'fifteen', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                14
                                            </strong>
                                            OBSERVACIONES DE PROSPECTOS ({mes})
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                form.leads.map((lead, index)=>{
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
                                                                        lead.prospecto.tipoProyecto ?
                                                                            lead.prospecto.tipoProyecto.tipo
                                                                        : 
                                                                            lead.servicios.map((serv, index) => {
                                                                                return serv.servicio
                                                                            })
                                                                    }
                                                                </td>
                                                                <td className="font-size-sm text-center">
                                                                    {
                                                                        this.setComentario(lead)
                                                                    }
                                                                </td>
                                                                <td className='text-center'>
                                                                    {
                                                                        lead.prospecto.estatus_prospecto ?
                                                                            this.setLabel(lead.prospecto.estatus_prospecto)
                                                                        : ''
                                                                    }
                                                                </td>
                                                                <td className = 'text-center'>
                                                                    {
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                            : 'Sin contacto'
                                                                        : 'Sin contacto'
                                                                    }
                                                                </td>
                                                                <td className = 'text-center'>
                                                                    {
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                            : 'Sin contacto'
                                                                        : 'Sin contacto'
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
                                <Tab.Pane eventKey = 'fifteen'>
                                    {this.setButtons('fourteen', 'sixteen', null)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                15
                                            </strong>
                                            LISTADO DE PROSPECTO (MESE ANTERIORES)
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
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        STATUS
                                                    </div>
                                                </th>
                                                <th className="clave border-0 center_content">
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        MOTIVO
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                leadsAnteriores.map((lead, index)=>{
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
                                                                        lead.prospecto.tipoProyecto ?
                                                                            lead.prospecto.tipoProyecto.tipo
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
                                                                <td className="font-size-sm text-center">
                                                                    {
                                                                        this.setComentario(lead)
                                                                    }
                                                                </td>
                                                                <td className = 'text-center'>
                                                                    {
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                            : 'Sin contacto'
                                                                        : 'Sin contacto'
                                                                    }
                                                                </td>
                                                                <td className = 'text-center'>
                                                                    {
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[0].created_at)
                                                                            : 'Sin contacto'
                                                                        : 'Sin contacto'
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
                                <Tab.Pane eventKey = 'sixteen'>
                                    {this.setButtons('fifteen', null, true)}
                                    <div className = "my-3">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong>
                                                16
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
                                        editorState = { editorState }
                                        onEditorStateChange={this.onEditorStateChange}
                                        />
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Card.Body>
                </Card>
                <Modal size="lg" title = "Reportes de ventas" show = { modal } handleClose = { this.handleCloseModal } >
                    <Tab.Container activeKey = { empresaActive } 
                        onSelect = { (select) => this.onClickEmpresa(select) }>
                        <div className="d-flex justify-content-end">
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
                            empresas.map((empresa)=>{
                                console.log(empresaActive, 'active')
                                console.log(empresa.id, 'id')
                                if(empresaActive.toString() === empresa.id.toString())
                                    return(
                                        <table className="table table-responsive-lg table-vertical-center text-center mt-3" id="esquemas">
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
                                                        return(
                                                            <tr key = { key }>
                                                                <td> { reporte.año } </td>
                                                                <td> { mesesEspañol[reporte.mes] } </td>
                                                                <td>
                                                                    < a href = { reporte.adjunto.url}>
                                                                        <i className="far fa-file-pdf icon-15px"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    )
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