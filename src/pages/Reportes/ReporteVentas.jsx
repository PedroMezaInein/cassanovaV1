import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { Button } from '../../components/form-components';
// import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert, questionAlert2,doneAlert } from '../../functions/alert'
import Swal from 'sweetalert2'
import { COLORES_GRAFICAS_IM, COLORES_GRAFICAS_INEIN, IM_AZUL, INEIN_RED, URL_DEV } from '../../constants'
import axios from 'axios'
import { pdf } from '@react-pdf/renderer'
import { Pie, Bar, Line } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { setLabelVentas, setOptions, setDateTableLG,setMoneyTableSinSmall } from '../../functions/setters';
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
            rango: '2',
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
            },
            si_adjunto:'',
            no_adjunto:'',
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

    setOpacity75 = array =>{
        let aux = [];
        array.map( (element) => {
            aux.push(element+'BF')
            return false
        })
        return aux
    }

    setOpacity65 = array =>{
        let aux = [];
        array.map( (element) => {
            aux.push(element+'A6')
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
        return setLabelVentas(text)
    }

    getBG = tamaño => {
        const { empresa} = this.state
        let aux = []
        switch(empresa){
            case 'INEIN':
                for(let i = 0; i < tamaño; i++){
                    aux.push(
                        COLORES_GRAFICAS_INEIN[i]
                    )
                }
                break;
            case 'INFRAESTRUCTURA MÉDICA':
                for(let i = 0; i < tamaño; i++){
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
                                tooltip={{ text: 'ANTERIOR' }}
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
                Swal.close()
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
                
                Swal.close()
                data.total = {
                    labels: ['TOTAL'],
                    datasets: [{
                        data: [leads[0].leads],
                        backgroundColor: [
                            this.setColor()+'BF'
                        ],
                        hoverBackgroundColor: [
                            this.setColor()+'D9'
                        ],
                        borderWidth:3,
                        borderColor:this.setColor()
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
                            borderColor:colors,
                            borderWidth:3
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
                            borderWidth:3
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
                            borderWidth:3
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
                            borderWidth:3
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
                        backgroundColor: colors[0]+'A6',
                        hoverBackgroundColor: colors[0]+'BF',
                        borderWidth:3
                    }
                );

                arrayData = []
                tipos['Potencial'].map((element)=>{
                    arrayData.push(element.leads)
                    return ''
                })

                arrayDataSets.push(
                    {
                        label: 'POTENCIAL',
                        data: arrayData,
                        backgroundColor: colors[1]+'A6',
                        hoverBackgroundColor: colors[1]+'BF',
                        borderWidth:3
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
                            backgroundColor: this.setOpacity65(colors),
                            hoverBackgroundColor: this.setOpacity75(colors),
                            borderWidth:3
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
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);
                
                arrayDataSets.map((element, key)=>{
                    arrayData = []
                    keys.map((origen) => {
                        arrayData.push(origenes[origen][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]+'B3'
                    element.hoverBackgroundColor = colors[key]+'BF'
                    element.borderWidth=3
                    return ''
                })
                let contador = 0
                let contadorArray = []
                if(arrayDataSets.length){
                    arrayDataSets[0].data.map((element, index)=>{
                        contador = 0
                        arrayDataSets.map((newElement, key)=>{
                            contador += newElement.data[index]
                            return ''
                        })
                        if(contador === 0 )
                            contadorArray.push(index)
                        return ''
                    })
                }

                contadorArray.map((element)=>{
                    arrayDataSets.map((newElement)=>{
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
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);
                
                arrayDataSets.map((element, key)=>{
                    arrayData = []
                    keys.map((servicio) => {
                        arrayData.push(servicios[servicio][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]+'B3'
                    element.hoverBackgroundColor = colors[key]+'BF'
                    element.borderWidth=3
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

                keys.map((element)=>{
                    if(estatus[element][0].leads > 0){
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
                            borderWidth:3
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
                            return ''
                        })
                    }
                    return ''
                })

                colors = this.getBG(arrayDataSets.length);
                
                arrayDataSets.map((element, key)=>{
                    arrayData = []
                    keys.map((origen) => {
                        arrayData.push(estatus[origen][key].leads)
                        return ''
                    })
                    element.data = arrayData
                    element.backgroundColor = colors[key]+'B3'
                    element.hoverBackgroundColor = colors[key]+'BF'
                    element.borderWidth=3
                    return ''
                })
                contador = 0
                contadorArray = []
                if(arrayDataSets.length){
                    arrayDataSets[0].data.map((element, index)=>{
                        contador = 0
                        arrayDataSets.map((newElement, key)=>{
                            contador += newElement.data[index]
                            return ''
                        })
                        if(contador === 0 )
                            contadorArray.push(index)
                        return ''
                    })
                }

                contadorArray.map((element)=>{
                    arrayDataSets.map((newElement)=>{
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
                let { empresaActive } = this.state
                Swal.close()
                if(empresas.length)
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
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            Swal.close()
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async generarPDF(){
        waitAlert()
        let aux = []
        const { form, editorState } = this.state
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
            return ''
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

        Swal.close()
        
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
                            <a rel="noopener noreferrer" href = { form.adjuntos.reportes.files[0].url } target='_blank' className='text-primary mx-2'>
                                REPORTE DE VENTAS
                            </a>
                        </u>
                    { ' ' + empresa + ' ' + meses[parseInt(form.mes)] + ' ' + form.año + '?' }
                </span>
            </div>
        )
    }

    setComentario = lead => {
        let aux = '';
        if(lead.estatus){
            switch(lead.estatus.estatus){
                case 'Rechazado':
                case 'Cancelado':
                    if(lead.motivo === '' || lead.motivo === null){
                        if(lead.rh)
                            aux += "RR.HH.\n "
                        if(lead.proveedor)
                            aux += "PROVEEDOR.\n "
                    }
                        else
                        aux += lead.motivo + "\n"
                    break;
                default: break;
            }
        }
        if( lead.prospecto ){
            if(aux === ''){
                if(lead.prospecto.estatus_prospecto){
                    switch(lead.prospecto.estatus_prospecto.estatus){
                        case 'Rechazado':
                        case 'Cancelado':
                            if(lead.motivo === '' || lead.motivo === null){
                                if(lead.rh)
                                    aux += "RR.HH.\n "
                                if(lead.proveedor)
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
            if(lead.prospecto.contactos){
                if(lead.prospecto.contactos.length){
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
        if(form.empresa !== '' && form.referencia !== '' && form.fechaInicio !== null && form.fechaFin !== null && form.adjuntos.reportes.files.length > 0)
            this.addReporteAdjuntoAxios()
        else
            errorAlert('No completaste todos los campos.')
    }
    async addReporteAdjuntoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + '', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito el nuevo reporte.')

                this.setState({
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
                            fontSize: 14,
                            fontColor: '#000',
                            lineWidth: 10,
                            padding: 10,
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
                                    default: break;
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
                            fontColor: '#000'
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 14,
                            fontColor: '#000',
                            padding: 10,
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
                                    default: break;
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
                        size: 13,
                        weight: 'bold'
                    }
                }
            },
            legend:{
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
                            fontColor: '#000'
                        }
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            fontSize: 15,
                            fontColor: '#000',
                            padding: 10,
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
        
        const { empresa } = this.state
        return (
            <Layout active = 'reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Reporte de ventas</h3>
                        </div>
                        <div className="card-toolbar">
                            <Button
                                icon =''
                                className = "btn btn-icon btn-xs w-auto p-3 btn-light"
                                onClick = { () => { this.getReporteAxios() } }
                                only_icon = "far fa-file-pdf mr-2"
                                text= 'REPORTES GENERADOS'
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
                        <Tab.Container activeKey = { key }>
                            <Tab.Content>
                                <Tab.Pane eventKey = 'one'>
                                    {this.setButtons(null, 'two', null)}
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas" >
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                01 
                                            </strong>
                                            ENTRADA TOTAL DE LEADS ({mes} {form.año}) 
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                03
                                            </strong>
                                            ORIGEN DE LEADS ({mes} {form.año})
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                05
                                            </strong>
                                            SERVICIOS SOLICITADOS ({mes} {form.año})
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                07
                                            </strong>
                                            TIPO DE LEAD ({mes} {form.año})
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                09
                                            </strong>
                                            TOTAL DE PROSPECTOS ({mes} {form.año})
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                10
                                            </strong>
                                            COMPARATIVA TOTAL DE PROSPECTOS (MESES ANTERIORES)
                                        </h3>
                                    </div>
                                    <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-9" >
                                            <Line ref = { this.chartComparativaProspectosReference } data = { data.prospectosComparativa } options = { optionsLine } />
                                        </div>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey = 'eleven'>
                                    {this.setButtons('ten', 'twelve', null)}
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                11
                                            </strong>
                                            ESTATUS DE PROSPECTOS ({mes} {form.año})
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                12
                                            </strong>
                                            COMPARATIVA ESTATUS DE PROSPECTOS (MESES ANTERIORES)
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
                                    <div className = " mt-4 mb-5 ">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                13
                                            </strong>
                                            PROSPECTOS CONTRATADOS ({mes} {form.año})
                                        </h3>
                                    </div>
                                    {/* <div className = "row mx-0 mb-2 justify-content-center">
                                        <div className = "col-md-6" >
                                            <Pie ref = { this.chartCerradosReference } data = { data.cerrados } options = { optionsPie } />
                                        </div>
                                    </div> */}
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
                                                <th className="clave border-0 center_content"style={{ minWidth: "100px" }}>
                                                    <div className="font-size-lg font-weight-bolder text-center">
                                                        FECHA DE CONTRATACION
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.cerrados.map((element, index)=>{
                                                    return(
                                                        <tr key = { index } >
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
                                                                { setDateTableLG(element.created_at) }
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
                                    <div className = "mt-4 mb-5">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                14
                                            </strong>
                                            OBSERVACIONES DE PROSPECTOS ({mes} {form.año})
                                        </h3>
                                    </div>
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
                                <Tab.Pane eventKey = 'fifteen'>
                                    {this.setButtons('fourteen', 'sixteen', null)}
                                    <div className = "mt-4 mb-5">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
                                                15
                                            </strong>
                                            LISTADO DE PROSPECTO (MESES ANTERIORES)
                                        </h3>
                                    </div>
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
                                                leadsAnteriores.map((lead, index)=>{
                                                    if(lead.prospecto)
                                                        return(
                                                            <tr key = { index } >
                                                                <td className="font-size-sm text-justify">
                                                                    {
                                                                        lead.nombre
                                                                    }
                                                                </td>
                                                                <td className="font-size-sm text-justify">
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
                                                                <td className = 'text-center font-size-sm'>
                                                                    {
                                                                        lead.prospecto.contactos ?
                                                                            lead.prospecto.contactos.length ?
                                                                                setDateTableLG(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                            : 'SIN CONTACTO'
                                                                        : 'SIN CONTACTO'
                                                                    }
                                                                </td>
                                                                <td className = 'text-center font-size-sm'>
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
                                <Tab.Pane eventKey = 'sixteen'>
                                    {this.setButtons('fifteen', null, true)}
                                    <div className = "mt-4 mb-5">
                                        <h3 className="card-label title-reporte-ventas">
                                            <strong className={empresa==='INEIN'?"colorInein":empresa==='INFRAESTRUCTURA MÉDICA'?"colorIMAzul":''}>
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
                            empresas.map((empresa)=>{
                                if(empresaActive.toString() === empresa.id.toString())
                                    return(
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
                                                            return(
                                                                <tr key = { key }>
                                                                    <td> { reporte.año } </td>
                                                                    <td> { mesesEspañol[reporte.mes] } </td>
                                                                    <td>
                                                                        <a href = { reporte.adjunto.url}className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-primary">
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
                                                                <td colSpan = "3">
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