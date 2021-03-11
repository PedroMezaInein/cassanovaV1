import React, { Component } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font, Link } from '@react-pdf/renderer'
import INEIN from '../../../assets/logos/inein.png'
import PoppinsBold from '../../../assets/fonts/Poppins-Bold.ttf'
import Poppins from '../../../assets/fonts/Poppins-ExtraLight.ttf'
import moment from 'moment'
import { INEIN_RED } from '../../../constants'

Font.register({
    family: 'Poppins',
    fonts:[
        { src: Poppins },
        { src: PoppinsBold, fontWeight: 700 }
    ]
})
const styles = StyleSheet.create({
    dot:{
        width: 3,
        height: 3,
        borderRadius: 0.5,
        backgroundColor: INEIN_RED
    },
    paginacion:{
        color: INEIN_RED,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        fontSize: 35
    },
    titulo:{
        color: '#525252',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        paddingBottom: 9,
        paddingLeft: 8
    },
    table: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    table2: {
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
        backgroundColor: INEIN_RED
    },
    tableRowBodyNon:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#F3F6F9'
    },
    tableRowBodyPar:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    footerTable1:{
        width: '12%',
        height: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        border: 'solid',
        borderRightWidth: 3,
        borderColor: INEIN_RED,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'
    },
    footerTable2:{
        width: '21%',
        height: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 5
    },
    // cell: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     textAlign: 'center',
    //     flexWrap: 'wrap',
    //     width: '50%'
    // }, 
    cellListaDot: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '1%',
        paddingBottom:20
    }, 
    cellLista:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '98%',
        fontSize: 10,
        marginBottom: 15,
        textAlign: "justify",
        lineHeight: 1.5,
        fontFamily: 'Poppins',
        fontWeight:'extralight'
    },
    cell15: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '14.9%',
        padding:'4px'
    },
    cell7: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '7%',
        padding:'4px'
    },
    cell5: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '5%',
        padding:'4px'
    },
    cell8: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '7.5%',
        padding:'2px'
    },
    cell10: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '10%',
        padding:'4px'
    },
    cell11: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '11%',
        padding:'4px'
    },
    // cell15: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     textAlign: 'center',
    //     flexWrap: 'wrap',
    //     width: '15%',
    //     padding:'4px'
    // },
    // cell30: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     textAlign: 'center',
    //     flexWrap: 'wrap',
    //     width: '30%',
    //     padding:'4px'
    // },  
    cell13: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '13%',
        padding:'4px'
    },
    cell19: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '19%',
        padding:'4px'
    },
    cell20: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '20%',
        padding:'4px'
    },
    cell42: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '42%',
        padding:'4px'
    },
    cell_8: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '8%',
        padding:'4px'
    },
    cell_15: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '15%',
        padding:'4px'
    },
    headerText:{
        color: 'white',
        fontWeight: 'bold',        
        fontFamily: 'Poppins',
        fontSize: 8,
        padding:3,
        textAlign: 'center'
    },
    headerTextJustify:{
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        fontSize: 8,
        padding:3,
        textAlign: 'justify'
    },
    bodyTextCenter:{
        fontWeight: 'extralight',
        fontSize: 8,
        textAlign: "center",
        lineHeight:1.3,
        fontFamily: 'Poppins',
    },
    bodyTextCenterBig: {
        fontWeight: 'extralight',
        fontSize: 12,
        textAlign: "center",
        lineHeight:1.3,
        fontFamily: 'Poppins',
    },
    bodyText:{
        fontWeight: 'extralight',
        fontSize: 8,
        textAlign: "justify",
        lineHeight:1.3,
        fontFamily: 'Poppins',
        textTransform:'uppercase'
    },
    imagenCentrada:{
        width: '100%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        objectFit: 'cover'
    },
    // imagenDoble:{
    //     width: '90%',
    //     textAlign: 'center',
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    //     marginBottom: 40,
    //     marginTop: 100
    // },
    lineaNegra:{
        backgroundColor: '#525252',
        position: 'absolute',
        height: '70%',
        width: '10px',
        top: 0,
        left: 20
    },
    lineaRosa:{
        backgroundColor: INEIN_RED,
        position: 'absolute',
        height: '70%',
        width: '10px',
        bottom: 0,
        right: 20
    },
    logoPortada:{
        position: 'absolute',
        width: '50%',
        left: '25%',
        right: '20%',
        height: 'auto',
        top: '25%',
        marginTop:'100px',
        objectFit: 'cover'
    },
    logoFin:{
        position: 'absolute',
        width: '44%',
        left: '28%',
        right: '28%',
        height: 'auto',
        top: '35%',
        marginTop:'80px',
        objectFit: 'cover'
    },
    textPortada:{
        position: 'absolute',
        top: '60%',
        width: '100%',
        fontFamily: 'Poppins',
        fontColor: '#525252'
    },
    pagePadding:{
        backgroundColor: 'white',
        paddingTop: '25px',
        paddingBottom: '35px',
        paddingRight: '25px',
        paddingLeft: '25px',
        height: '100%'
    },
    numberTitle:{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start'
    },
    imgCenter:{
        backgroundColor: 'white',
        display:'flex',
        height: '90%',
        justifyContent:'center',
        textAlign: "center"
    },
    lineGray:{
        backgroundColor: '#525252',
        height:"18px",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    linePink:{
        backgroundColor: INEIN_RED,
        height:"18px",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    textPink:{
        color: INEIN_RED
    },
    textSeparator:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '60',
        color: '#525252',
        fontFamily: 'Poppins'
    },
    justifyContentCenter:{
        display:'flex', 
        justifyContent:'center'
    }
});

export default class RVAnualInein extends Component {

    getFecha = () => {
        const { form } = this.props
        let fecha = moment(form.mes+'/01/'+form.año)
        let fecha2 = moment(form.mes+'/01/'+form.año).endOf('month')
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let aux = meses[fecha.month()] + ' ' + fecha.date() + ' - ' + meses[fecha2.month()] + ' ' + fecha2.date()
        return aux
    }

    getMes = () => {
        const { form } = this.props
        let fecha2 = moment(form.mes+'/01/'+form.año).endOf('month')
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let aux = meses[fecha2.month()] 
        return aux
    }

    getYear = () => {
        const { form } = this.props
        return moment(form.mes+'/01/'+form.año).year()
    }
    
    getFechaText = (date) => {
        let fecha = moment(date)
        let mes = fecha.month() + 1;
        if (mes.toString().length === 1) {
            mes = '0' + mes
        }
        let aux = fecha.date() + '/' + mes + '/' + fecha.year()
        return aux
    }

    setStyleRowBody = index => {
        if(index === 0)
            return styles.tableRowBodyNon
        if(index % 2)
            return styles.tableRowBodyPar
        else
            return styles.tableRowBodyNon
    }

    clearElement = element => {
        return element.replace(/&nbsp;/gi,'')
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

    setMoney = value => {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(value);
    }

    render() {
        const { conclusiones, sugerencias, images, data } = this.props
        return (
            <Document style = {{ fontFamily: 'Poppins', color: '#525252' }}>
                <Page size="A4" orientation = "landscape" style = {{ position: 'relative', height: '100%'}}>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <Image src = { INEIN } style = { styles.logoPortada } />
                    <View style = { styles.textPortada } >
                        <Text style = {{  textAlign: 'center', fontWeight: 'bold', fontSize: '22', color: '#525252', marginTop:'70px'}}>
                            REPORTE DE VENTAS
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '14', color: '#525252' }}>
                            {this.getFecha()}
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '14', color: '#525252' }}>
                            {this.getYear()}
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            LEADS TOTALES
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View>
                                <Text style = { styles.paginacion}>03</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA <Text style = { styles.textPink }>TOTAL </Text>DE LEADS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.total }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>04</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA DE LEADS <Text style = { styles.textPink }>MESES ANTERIORES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.totalMeses }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            ORIGEN
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>06</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenes }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>07</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS ORGÁNICOS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesOrganicos }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>08</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS ADS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesAds }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>09</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                ORIGEN DE LEADS <Text style = { styles.textPink }>MESES ANTERIORES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesMeses }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            SERVICIOS
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>11</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>SERVICIOS </Text>SOLICITADOS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.servicios }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>12</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    SERVICIOS SOLICITADOS <Text style = { styles.textPink }>MESES ANTERIORES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.serviciosMeses }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            TIPO
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>14</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEADS ({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tipos }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>15</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS <Text style = { styles.textPink }>NO POTENCIALES </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesNoPotenciales }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>16</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS <Text style = { styles.textPink }>POTENCIALES </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesPotenciales }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                {
                    images.origenesDuplicados !== null &&
                        <Page size="A4" orientation = "landscape">
                            <View style = { styles.pagePadding } >
                                <View style = { styles.numberTitle } >
                                    <View >
                                        <Text style = { styles.paginacion}>17</Text>
                                    </View>
                                    <View>
                                        <Text style = { styles.titulo }>    
                                            <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS <Text style = { styles.textPink }>DUPLICADOS </Text>({this.getMes()})
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.imgCenter }>
                                    <Image style = { styles.imagenCentrada }  src = { images.origenesDuplicados }/>
                                </View>
                                <View style={ styles.linePink }></View>
                            </View>
                        </Page>
                }
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 18 : 17}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEADS <Text style = { styles.textPink }>MESES ANTERIORES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposMeses }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            TIPO DE PROYECTO
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 20 : 19}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TOTAL DE <Text style = { styles.textPink }>TIPOS DE PROYECTO </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposProyectos }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 21 : 20}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE PROYECTO <Text style = { styles.textPink }>MESES ANTERIORES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposProyectosMeses }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            LEADS POTENCIALES
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 23 : 22}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    LEADS <Text style = { styles.textPink }>CONTACTADOS </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.contactados }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 24 : 23}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ESTATUS DE LEADS <Text style = { styles.textPink }>CONTACTADOS </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.estatus }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 25 : 24}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    OBSERVACIONES DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table2}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell19 }>
                                        <Text style = { styles.headerTextJustify} >
                                            NOMBRE
                                        </Text>
                                    </View>
                                    <View style = { styles.cell13 }>
                                        <Text style = { styles.headerTextJustify} >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell42 }>
                                        <Text style = { styles.headerText } >
                                            OBSERVACIONES
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            ESTATUS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell_8 }>
                                        <Text style = { styles.headerText } >
                                            PRIMER CONTACTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell_8 }>
                                        <Text style = { styles.headerText } >
                                            ÚLTIMO CONTACTO
                                        </Text>
                                    </View>
                                </View>
                                {
                                    data.listado_prospectos.length === 0 &&
                                        <View>
                                            <Text style = { styles.bodyTextCenterBig } >
                                                NO SE ENCONTRARON OBSERVACIONESN DE PROSPECTOS DURANTE ESTE MES
                                            </Text>
                                        </View>
                                }
                                {
                                    data.listado_prospectos.map((element, index) => {
                                        return(
                                            <View key = { index } style = { this.setStyleRowBody(index) }>
                                                <View style = { styles.cell19 }>
                                                    <Text style = { styles.bodyText}>
                                                        {element.lead.nombre.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell13 }>
                                                    <Text style = { styles.bodyText}>
                                                        {
                                                            element.tipo_proyecto!==null?
                                                            element.tipo_proyecto.tipo:'-'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell42 }>
                                                    <Text style = { styles.bodyText}>
                                                        { this.setComentario(element) }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell10 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.estatus_prospecto ?
                                                                <Text style={
                                                                    {
                                                                        color: element.estatus_prospecto.color_texto, fontWeight:600
                                                                    }}>
                                                                    { element.estatus_prospecto.estatus.toUpperCase()}
                                                                </Text>
                                                            :''
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell_8 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.contactos ?
                                                                element.contactos.length ?
                                                                    this.getFechaText(element.contactos[element.contactos.length - 1].created_at)
                                                                : '-'
                                                            : '-'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell_8 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.contactos ?
                                                                element.contactos.length ?
                                                                    this.getFechaText(element.contactos[0].created_at)
                                                                : '-'
                                                            : '-'
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 26 : 25}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textPink }>CANCELACIÓN </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.motivosCancelacion }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 27 : 26}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textPink }>RECHAZO </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.motivosRechazo }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 28 : 27}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    LISTADO DE PROSPECTO DE MESES ANTERIORES
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table2}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell19 }>
                                        <Text style = { styles.headerTextJustify} >
                                            NOMBRE
                                        </Text>
                                    </View>
                                    <View style = { styles.cell13 }>
                                        <Text style = { styles.headerTextJustify} >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell42 }>
                                        <Text style = { styles.headerText } >
                                            OBSERVACIONES
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            ESTATUS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell_8 }>
                                        <Text style = { styles.headerText } >
                                            PRIMER CONTACTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell_8 }>
                                        <Text style = { styles.headerText } >
                                            ÚLTIMO CONTACTO
                                        </Text>
                                    </View>
                                </View>
                                {
                                    data.listado_prospectos_anteriores.length === 0 &&
                                        <View>
                                            <Text style = { styles.bodyTextCenterBig } >
                                                NO SE ENCONTRARON PROSPECTOS LOS MESES ANTERIORES
                                            </Text>
                                        </View>
                                }
                                {
                                    data.listado_prospectos_anteriores.map((element, index) => {
                                        return(
                                            <View key = { index } style = { this.setStyleRowBody(index) }>
                                                <View style = { styles.cell19 }>
                                                    <Text style = { styles.bodyText}>
                                                        {element.lead.nombre.toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell13 }>
                                                    <Text style = { styles.bodyText}>
                                                        {
                                                            element.tipo_proyecto!==null?
                                                            element.tipo_proyecto.tipo:'-'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell42 }>
                                                    <Text style = { styles.bodyText}>
                                                        { this.setComentario(element) }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell10 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.estatus_prospecto ?
                                                                <Text style={
                                                                    {
                                                                        color: element.estatus_prospecto.color_texto, fontWeight:600
                                                                    }}>
                                                                    { element.estatus_prospecto.estatus.toUpperCase()}
                                                                </Text>
                                                            :''
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell_8 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.contactos ?
                                                                element.contactos.length ?
                                                                    this.getFechaText(element.contactos[element.contactos.length - 1].created_at)
                                                                : '-'
                                                            : '-'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style = { styles.cell_8 }>
                                                    <Text style = { styles.bodyTextCenter } >
                                                        {
                                                            element.contactos ?
                                                                element.contactos.length ?
                                                                    this.getFechaText(element.contactos[0].created_at)
                                                                : '-'
                                                            : '-'
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 29 : 28}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    OBSERVACIONES <Text style = { styles.textPink }>CONTRATADOS </Text>({this.getMes()})
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerTextJustify } >
                                            NOMBRE
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerTextJustify } >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerTextJustify } >
                                            SERVICIOS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerTextJustify } >
                                            ORIGEN
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            MONTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell5 }>
                                        <Text style = { styles.headerText } >
                                            M²
                                        </Text>
                                    </View>
                                    <View style = { styles.cell7 }>
                                        <Text style = { styles.headerText } >
                                            INGRESO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell8 }>
                                        <Text style = { styles.headerText } >
                                            CONTRATO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell11 }>
                                        <Text style = { styles.headerText } >
                                            VENDEDOR
                                        </Text>
                                    </View>
                                </View>
                                {
                                    data.proyectos.length === 0 &&
                                        <View>
                                            <Text style = { styles.bodyTextCenterBig } >
                                                NO SE CERRARON PROSPECTOS DURANTE ESTE AÑO
                                            </Text>
                                        </View>
                                }
                                {
                                    data.proyectos.map((element, index) => {
                                        if(element.prospecto){
                                            return(
                                                <View key = { index } style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText}>
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.nombre.toUpperCase()
                                                                    : ''
                                                                : ''
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText}>
                                                            { element.nombre.toUpperCase() }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        {
                                                            element.prospecto.lead.servicios ?
                                                                element.prospecto.lead.servicios.length ?
                                                                    element.prospecto.lead.servicios.map((servicio)=>{
                                                                        return(
                                                                            <Text style = { styles.bodyText}>
                                                                                {servicio.servicio}
                                                                            </Text>
                                                                        )
                                                                    })
                                                                : <Text style = { styles.bodyText}>-</Text>
                                                            : <Text style = { styles.bodyText}>-</Text>
                                                        }
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.origen ?
                                                                            element.prospecto.lead.origen.origen.toUpperCase()
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.presupuesto_diseño ?
                                                                            this.setMoney(element.prospecto.lead.presupuesto_diseño.total)
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell5 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.presupuesto_diseño ?
                                                                            element.prospecto.lead.presupuesto_diseño.m2
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell7 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.presupuesto_diseño ?
                                                                            this.getFechaText(element.prospecto.lead.created_at)
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell8 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            { this.getFechaText(element.created_at) }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell11 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.vendedores ?
                                                                        element.prospecto.vendedores.length > 0 ?
                                                                            <View>
                                                                                {
                                                                                    element.prospecto.vendedores.map((vendedor, index)=>{
                                                                                        return(
                                                                                            <Text style = { styles.bodyTextCenter } key = { index }>
                                                                                                {vendedor.name.toUpperCase()}
                                                                                            </Text>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </View>
                                                                        : '-'
                                                                    : '-'
                                                                : '-'
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    })
                                }
                            </View>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <View>
                        <Text style = { styles.textSeparator }>
                            CONCLUSIONES
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 31 : 30}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    CONCLUSIONES
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table2 }  >
                            {
                                conclusiones.map((element)=>{
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
                                    return false
                                })
                            }
                        </View>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>
                                    {images.origenesDuplicados !== null ? 32 : 31}
                                </Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    SUGERENCIAS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table2 }  >
                            {
                                sugerencias.map((element)=>{
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
                                    return false
                                })
                            }
                        </View>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page> 
                <Page style = {{ position: 'relative', height: '100%' }} size="A4" orientation = "landscape">
                    <Image src = { INEIN } style = { styles.logoFin } />
                    <View style = {{ width: '85%', marginRight: 'auto', marginLeft: 'auto', top: '85%'}}>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.footerTable1 }>
                                    <View>
                                        <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                            Sitio Web
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.footerTable2 }>
                                    <Link src = "https://www.inein.mx" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none'  }}>
                                        www.inein.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                    <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                        Email
                                    </Text>
                                </View>
                                <View style = { styles.footerTable2 }>
                                    <Link src = "mailto:contacto@inein.mx" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none'  }}>
                                        contacto@inein.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                        Contacto
                                    </Text>
                                </View>
                                <View style = { styles.footerTable2 }>
                                    <View>
                                        <Link src = "tel:+5578240115" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none' }}>
                                            Cdmx (55) 78 24 0115
                                        </Link>
                                        <Link src = "tel+8122305180" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none'  }}>
                                            Mty (81) 22 30 5130
                                        </Link>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        )
    }
}
