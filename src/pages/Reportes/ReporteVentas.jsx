import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { RangeCalendar, Button } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS, COLORES_GRAFICAS } from '../../constants'
import axios from 'axios'
import { Page, Text, View, PDFDownloadLink, Document, StyleSheet, PDFViewer, BlobProvider, pdf, Image } from '@react-pdf/renderer'
import {ItemSlider} from '../../components/singles'
import {Pie} from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { generateColor } from '../../functions/functions';
import { setOptions } from '../../functions/setters';
import FlujoDepartamentosForm from '../../components/forms/reportes/FlujoDepartamentosForm';
import { saveAs } from 'file-saver';


const styles = StyleSheet.create({
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    tableRow:{
        display: 'flex',
        flexDirection: 'row'
    },
    cell: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '50%'
    },
    imagenCentrada:{
        width: '75%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    imagenDoble:{
        width: '90%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const options = {
    plugins: {
        datalabels: {
            display: ctx => {
                return true;
            },
            formatter: (ctx, data) => {
                return `${ctx}`;
            },
            backgroundColor: '#849095',
            borderRadius: '3',
            padding:{
                top: '6',
                left: '10',
                bottom: '6',
                right: '10',
            },
            color: '#000',
            font:{
                size: '15'
            }
        }
    },
    legend:{
        display: true,
        position: 'right',
        labels: {
            fontSize: 20,
        }
    }
}

class ReporteVentas extends Component {

    state = {
        url: [],
        form:{
            fechaInicio: '',
            fechaFin: '',
            empresa: '',
            adjuntos:{
                reportes:{
                    value: '',
                    placeholder: 'Reporte',
                    files: []
                }
            }
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
        this.chartEstatusReference = React.createRef();
    }

    componentDidMount() {
        this.getOptionsAxios()
    }

    onChangeRange = range => {
        waitAlert()
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteVentasAxios()
        }
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteVentasAxios()
        }
        this.setState({
            ... this.state,
            form
        })
    }

    getBG = tamaño => {
        let aux = []
        for(let i = 0; i < tamaño; i++){
            aux.push(generateColor())
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
        let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return meses[mes]
    }

    getLastMonth = () => {
        const { form } = this.state
        let fecha = moment(form.fechaInicio)
        let mes = fecha.month()
        if(mes === 0)
            mes = 12
        mes --
        let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return meses[mes]
    }

    getYear = () => {
        const { form } = this.state
        let fecha = moment(form.fechaInicio)
        let año = fecha.year()
        return año
    }

    async generarPDF(){
        let aux = []
        const { leads, form } = this.state
        aux.push({
            name: 'total',
            url: this.chartTotalReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'total-anteriores',
            url: this.chartTotalAnterioresReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'origenes',
            url: this.chartTotalOrigenesReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'origenes-anteriores',
            url: this.chartTotalOrigenesAnterioresReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'servicios',
            url: this.chartServiciosReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'servicios-anteriores',
            url: this.chartServiciosAnterioresReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'tipos',
            url: this.chartTiposReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'tipos-anteriores',
            url: this.chartTiposAnterioresReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'estatus',
            url: this.chartEstatusReference.current.chartInstance.toBase64Image()
        })
        this.setState({
            ... this.state,
            url: aux
        })
        console.log(aux, 'aux')
        const blob = await pdf((
            <Document >
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            01 ENTRADA DE LEADS { this.getMonth() } { this.getYear() }
                        </Text>
                        <Image style = { styles.imagenCentrada }  src = { aux[0].url }/>
                        <Text style = { styles.text }>
                            {leads.length} LEADS totales en Infraestructura e Interiores
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            02 COMPARATIVA LEADS VS { this.getLastMonth() }
                        </Text>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[0].url }/>
                                        <Text>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[1].url }/>
                                        <Text>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            03 ENTRADA DE LEADS { this.getMonth() } { this.getYear() }
                        </Text>
                        <Image style = { styles.imagenCentrada }  src = { aux[2].url }/>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            04 COMPARATIVA LEADS VS { this.getLastMonth() }
                        </Text>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[2].url }/>
                                        <Text>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[3].url }/>
                                        <Text>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            05 SERVICIOS SOLICITADOS { this.getMonth() } { this.getYear() }
                        </Text>
                        <Image style = { styles.imagenCentrada }  src = { aux[4].url }/>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            06 SERVICIOS SOLICITADOS VS { this.getLastMonth() }
                        </Text>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[4].url }/>
                                        <Text>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[5].url }/>
                                        <Text>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            07 TIPO DE LEADS { this.getMonth() } { this.getYear() }
                        </Text>
                        <Image style = { styles.imagenCentrada }  src = { aux[6].url }/>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            08 COMPARATIVA DE LEADS VS { this.getLastMonth() }
                        </Text>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[6].url }/>
                                        <Text>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View>
                                        <Image style = { styles.imagenDoble } src = { aux[7].url }/>
                                        <Text>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" wrap = { true } >
                    <View>
                        <Text style = { styles.titulo }>
                            09 STATUS LEADS POTENCIALES { this.getMonth() } { this.getYear() }
                        </Text>
                        <Image style = { styles.imagenCentrada }  src = { aux[8].url }/>
                    </View>
                </Page>
            </Document>
        )).toBlob();
        form.adjuntos.reportes.files = [
            {
                name: 'reporte.pdf',
                url: URL.createObjectURL(blob)
            }
        ]
        swal.close()
        this.setState({
            ... this.state,
            form
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
                const { data } = this.state
                data.total = {
                    labels: ['Total'],
                    datasets: [{
                        data: [leads.length],
                        backgroundColor: [
                            '#D8005A',
                        ],
                        hoverBackgroundColor: [
                            '#D8005AD9',
                        ]
                    }]
                }

                data.totalAnteriores = {
                    labels: ['Total'],
                    datasets: [{
                        data: [leadsAnteriores.length],
                        backgroundColor: [
                            '#D8005A',
                        ],
                        hoverBackgroundColor: [
                            '#D8005AD9',
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
                        arrayLabes.push(origen.origen)
                        arrayData.push(contador)
                    }
                    leadsAnteriores.map((lead)=> {
                        if(lead.origen)
                            if(lead.origen.origen === origen.origen)
                                contador2 ++
                    })
                    if(contador2)
                    {
                        arrayLabes2.push(origen.origen)
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
                        arrayLabes.push(servicio.servicio)
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
                        arrayLabes2.push(servicio.servicio)
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
                    labels: ['basura', 'potencial'],
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
                    labels: ['basura', 'potencial'],
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
                        if(lead.prospecto)
                            if(lead.prospecto.estatus)
                                if(lead.prospecto.estatus.estatus === element.estatus){
                                    contador ++
                                }
                    })
                    if(contador)
                    {
                        arrayLabes.push(element.estatus)
                    }
                })

                colors = this.getBG(arrayData.length);

                if(arrayData.length === 0){
                    arrayLabes = ['Sin definir']
                    arrayData = [leads.length]
                    colors = ['#D8005A']
                }

                data.estatus = {
                    labels: arrayLabes,
                    datasets: [{
                        data: arrayData,
                        backgroundColor: colors,
                        hoverBackgroundColor: this.setOpacity(colors),
                    }]
                }

                swal.close()
                this.setState({
                    ... this.state,
                    leads: leads
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
        const { form, leads, data, url } = this.state
        
        return (
            <Layout active = 'reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Reporte de ventas</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="row mx-0 justify-content-center">
                            <div className="col-md-6">
                                
                                <FlujoDepartamentosForm
                                    form={form}
                                    options={this.state.options}
                                    onChangeRange = { this.onChangeRange }
                                    onChange={this.onChange}
                                    className="mb-3"
                                    />
                            </div>
                            {
                                form.adjuntos.reportes.files.length > 0 ?
                                    <div className="col-md-6">
                                        {
                                            leads.length && url.length > 0 ?
                                                <>
                                                    <div>
                                                        <ItemSlider items={form.adjuntos.reportes.files} item='reportes' />
                                                    </div>
                                                </>
                                            : ''
                                        }
                                    </div>
                                : ''
                            }
                        </div>
                        {
                            leads.length > 0 ?
                                <div className="text-center">
                                    <Button text='Generar PDF' className="btn btn-primary mr-2" icon=''
                                        onClick = {
                                            (e) => {
                                                e.preventDefault();
                                                waitAlert();
                                                this.generarPDF()
                                            }
                                        }/>
                                </div>
                            : ''
                        }
                        <div className={leads.length ? "my-3" : 'd-none'}>
                            <h3 className="card-label">
                                01 Entrada de leads { this.getMonth() } { this.getYear() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2 justify-content-center" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalReference } data = { data.total } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3 pt-4" : 'd-none'}>
                            <h3 className="card-label">
                                02 Comparativa de leads VS { this.getLastMonth() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalReference } data = { data.total } options = { options } />
                            </div>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalAnterioresReference } data = { data.totalAnteriores } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3" : 'd-none'}>
                            <h3 className="card-label">
                                03 Entrada de leads { this.getMonth() } { this.getYear() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2 justify-content-center" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalOrigenesReference } data = { data.totalOrigenes } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3 pt-4" : 'd-none'}>
                            <h3 className="card-label">
                                04 Comparativa de leads VS { this.getLastMonth() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalOrigenesReference } data = { data.totalOrigenes } options = { options } />
                            </div>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTotalOrigenesAnterioresReference } data = { data.totalOrigenesAnteriores } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3" : 'd-none'}>
                            <h3 className="card-label">
                                05 Servicios solicitados { this.getMonth() } { this.getYear() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2 justify-content-center" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartServiciosReference } data = { data.servicios } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3 pt-4" : 'd-none'}>
                            <h3 className="card-label">
                                06 Servicios solicitados VS { this.getLastMonth() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartServiciosReference } data = { data.servicios } options = { options } />
                            </div>
                            <div className="col-md-6">
                                <Pie ref = { this.chartServiciosAnterioresReference } data = { data.serviciosAnteriores } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3" : 'd-none'}>
                            <h3 className="card-label">
                                07 Tipo de leads { this.getMonth() } { this.getYear() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2 justify-content-center" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTiposReference } data = { data.tipos } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3 pt-4" : 'd-none'}>
                            <h3 className="card-label">
                                08 Comparativa de leads vs { this.getLastMonth() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTiposReference } data = { data.tipos } options = { options } />
                            </div>
                            <div className="col-md-6">
                                <Pie ref = { this.chartTiposAnterioresReference } data = { data.tiposAnteriores } options = { options } />
                            </div>
                        </div>
                        <div className={leads.length ? "my-3 pt-4" : 'd-none'}>
                            <h3 className="card-label">
                                09 Status leads potenciales { this.getMonth() } { this.getYear() }
                            </h3>
                        </div>
                        <div className={leads.length ? "row mx-0 mb-2 justify-content-center" : 'd-none'}>
                            <div className="col-md-6">
                                <Pie ref = { this.chartEstatusReference } data = { data.estatus } options = { options } />
                            </div>
                        </div>
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