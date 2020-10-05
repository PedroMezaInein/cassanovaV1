import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab, Tabs } from 'react-bootstrap'
import { Button } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import swal from 'sweetalert'
import { COLORES_GRAFICAS_2, URL_DEV } from '../../constants'
import axios from 'axios'
import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import {ItemSlider} from '../../components/singles'
import {Pie} from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import { generateColor } from '../../functions/functions';
import { setLabelTable, setOptions } from '../../functions/setters';
import FlujosReportesVentas from '../../components/forms/reportes/FlujosReportesVentas';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Input from '../../components/form-components/Input';
import InputSinText from '../../components/form-components/InputSinText';
import draftToMarkdown from 'draftjs-to-markdown';
import INEIN from '../../assets/logos/inein.png'

const styles = StyleSheet.create({
    dot:{
        width: 3,
        height: 3,
        borderRadius: 0.5,
        backgroundColor: '#D8005A'
    },
    pagina: {
        backgroundColor: '#D8005A'
    },
    pagina2: {
        backgroundColor: '#565656'
    },
    page: {
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingRight: '35px',
        paddingLeft: '35px',
        height: '97%',
        backgroundColor: 'white'
    },
    paginacion:{
        color: 'red',
        fontWeight: 'bold',
        fontSize: 30
    },
    titulo:{
        color: '#535353',
        fontSize: 20,
        paddingLeft: 20,
        fontWeight: 'bold',
    },
    texto:{
        marginTop: '0.5rem',
        color: '#535353',
        fontSize: 15
    },
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    tableRow:{
        display: 'flex',
        flexDirection: 'row'
    },
    tableRowHeader:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#D8005A'
    },
    tableRowBodyNon:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#E6E6E6'
    },
    tableRowBodyPar:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    cell: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '50%'
    }, 
    cellListaDot: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '5%'
    }, 
    cellLista:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '95%'
    },
    cell20: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '22%'
    }, 
    cell40: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '34%'
    }, 
    headerText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingTop:3,
        paddingBottom: 3
    },
    bodyText:{
        fontWeight: 100,
        fontSize: 12,
        paddingTop:1,
        paddingBottom: 1
    },
    imagenCentrada:{
        width: '70%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 120
    },
    imagenDoble:{
        width: '90%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 40,
        marginTop: 100
    },
    lineaNegra:{
        backgroundColor: '#323232',
        position: 'absolute',
        height: '70%',
        width: '10px',
        top: 0,
        left: 20
    },
    lineaRoja:{
        backgroundColor: '#D8005A',
        position: 'absolute',
        height: '70%',
        width: '10px',
        bottom: 0,
        right: 20
    },
    logoPortada:{
        position: 'absolute',
        width: '60%',
        left: '20%',
        right: '20%',
        height: 'auto',
        top: '25%',
    }
});

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
        const { form } = this.state
        form[name] = value
        if(form.empresa !== '' && form.fechaInicio !== null && form.fechaFin !== null && form.fechaInicioRef !== null && form.fechaFinRef !== null){
            this.getReporteVentasAxios()
        }
        this.setState({
            ... this.state,
            form
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
            /* aux.push(generateColor()) */
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
            name: 'prospectos',
            url: this.chartProspectosReference.current.chartInstance.toBase64Image()
        })
        aux.push({
            name: 'estatus-prospectos',
            url: this.chartEstatusProspectosReference.current.chartInstance.toBase64Image()
        })
        this.setState({
            ... this.state,
            url: aux
        })
        let lista = draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent()))
        lista = lista.replace(/\n|\r/g, "");
        lista = lista.split('-')
        console.log(lista, 'lisata')
        const blob = await pdf((
            <Document >
                <Page style = {{ position: 'relative', height: '100%' }} size="A4" orientation = "landscape">
                    <View style = { styles.lineaNegra }>
                    </View>
                    <View style = { styles.lineaRoja }>
                    </View>
                    <Image src = { INEIN } style = { styles.logoPortada } />
                    <View style = {{ marginTop: '80%' }} >
                        <Text>
                            REPORTE DE VENTAS
                        </Text>
                        <Text>
                            AGOSTO 01 - AGOSTO 31
                        </Text>
                        <Text>
                            2020
                        </Text>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>01</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA TOTAL DE LEADS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[0].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape" >
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>02</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    COMPARATIVA LEADS ACTUALES VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[0].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[1].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>03</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ORIGEN DE LEADS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[2].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape" >
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>04</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    COMPARATIVA ORIGEN LEADS ACTUALES VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[2].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[3].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>05</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    SERVICIOS SOLICITADOS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[4].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape" >
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>06</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    COMPARATIVA SERVICIOS SOLICITADOS VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[4].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[5].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>07</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEAD
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[6].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape" >
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>08</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    COMPARATIVA TIPO LEADS VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[6].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View styles = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { aux[7].url }/>
                                        <Text styles = { styles.texto }>
                                            { this.getLastMonth() }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>09</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TOTAL DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[8].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>10</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    STATUS DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { aux[9].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>11</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    OBSERVACIONES DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <View style = {{ marginTop: 40}}>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            NOMBRE DEL LEAD
                                        </Text>
                                    </View>
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell40 }>
                                        <Text style = { styles.headerText } >
                                            OBSERVACIONES
                                        </Text>
                                    </View>
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            STATUS
                                        </Text>
                                    </View>
                                </View>
                                {
                                    this.state.form.leads.map( (lead, index) =>{
                                        if(lead.prospecto)
                                            return(
                                                <View style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.nombre
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.servicios.map((serv)=> {
                                                                    return serv.servicio
                                                                })
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell40 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.observacion
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.estatus_prospecto ?
                                                                    lead.prospecto.estatus_prospecto.estatus
                                                                :''
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                    })
                                }
                            </View>
                        </View>
                        
                    </View>
                </Page>

                <Page style = { styles.pagina } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>12</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    CONCLUSIONES
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table, { paddingTop: 50 } }  >
                            {
                                lista.map((element)=>{
                                    if(element !== '')
                                    return(
                                        <View style = { styles.tableRow} >
                                            <View style = { styles.cellListaDot }>
                                                <View style = { styles.dot } >
                                                    
                                                </View>
                                            </View>
                                            <View style = { styles.cellLista }>
                                                <Text>
                                                    {
                                                        element
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
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

    setStyleRowBody = index => {
        if(index === 0)
            return styles.tableRowBodyNon
        if(index % 2)
            return styles.tableRowBodyPar
        else
            return styles.tableRowBodyNon
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
                const { data, form } = this.state
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
                        arrayLabes.push(element.estatus)
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
                    console.log(lead.contactado, 'contactado')
                    if(lead.contactado === 1)
                        contador++
                    else
                        contador2++
                })

                colors = ['#388E3C', '#F64E60']

                data.prospectos = {
                    labels: ['convertido', 'sin convertir'],
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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
                                    <div className = "my-3 pt-4">
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