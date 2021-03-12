import React, { Component } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font, Link } from '@react-pdf/renderer'
import IM from '../../../assets/logos/im.png'
import PoppinsBold from '../../../assets/fonts/Poppins-Bold.ttf'
import Poppins from '../../../assets/fonts/Poppins-ExtraLight.ttf'
import moment from 'moment'
import { IM_AZUL, IM_DORADO } from '../../../constants'

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
        backgroundColor: IM_AZUL
    },
    paginacion:{
        color: IM_AZUL,
        fontWeight: 'bold',
        fontFamily: 'Poppins',
        fontSize: 35
    },
    titulo:{
        color: '#737373',
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
    tableRowCenter:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center'
    },
    tableRowHeader:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: IM_AZUL
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
        width: '10%',
        height: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        border: 'solid',
        borderRightWidth: 3,
        borderColor: IM_AZUL,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
    },
    footerTable2:{
        width: '13%',
        height: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 5
    },
    footerTable5:{
        width: '26%',
        height: '100%',
        marginTop: 'auto',
        marginBottom: 'auto',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 5
    },
    footerTable4:{
        width: '22%', 
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
    // cell43: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignContent: 'center',
    //     textAlign: 'center',
    //     flexWrap: 'wrap',
    //     width: '43%',
    //     padding:'4px'
    // },
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
        backgroundColor: IM_DORADO,
        position: 'absolute',
        height: '70%',
        width: '10px',
        top: 0,
        left: 20
    },
    lineaRosa:{
        backgroundColor: IM_AZUL,
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
    lineGolden:{
        backgroundColor: IM_DORADO,
        height:"18px",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    lineBlue:{
        backgroundColor: IM_AZUL,
        height:"18px",
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    textBlue:{
        color: IM_AZUL
    },
    textSeparator:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '60',
        color: '#737373',
        fontFamily: 'Poppins'
    },
    justifyContentCenter:{
        display:'flex', 
        justifyContent:'center'
    },
    page: { padding: 23 },
    box: { width: '100%', marginBottom: 30},
});

export default class RVAnualIm extends Component {

    getFecha = () => {
        const { form } = this.props
        let fecha = moment(form.mes+'/01/'+form.año)
        let fecha2 = moment(form.mes+'/01/'+form.año).endOf('month')
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let aux = meses[fecha.month()] + ' ' + fecha.date() + ' - ' + meses[fecha2.month()] + ' ' + fecha2.date()
        return aux
    }

    getFechaText = (date) => {
        let fecha = moment(date)
        let mes = fecha.month() + 1;
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

    setMoney = value => {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(value);
    }

    tablePage(listado){
        let totalElementos = listado.length 
        let total_paginas = Math.ceil(totalElementos / 10)
        let arregloNumPaginas =[ ]  
        let contador=0
        
        for(let i=0;i<total_paginas;i++){
            let arregloElementos =[]
            for(let j=0;j<10;j++){
                arregloElementos.push(contador)
                contador++;
                if(contador==totalElementos){
                    break
                }
            }
            let objetoPagina ={
                pagina:i,
                elementos:arregloElementos
            }
            arregloNumPaginas.push(objetoPagina)
        }
        return arregloNumPaginas
    }
    render() {
        const {  conclusiones, sugerencias, images, data, form} = this.props
        
        let objectlist_proyectos = data.proyectos
        return (
            <Document style = {{ fontFamily: 'Poppins' }}>
                <Page size="A4" orientation = "landscape" style = {{ position: 'relative', height: '100%'}}>
                    <View style = { styles.lineaNegra }></View>
                    <View style = { styles.lineaRosa }></View>
                    <Image src = { IM } style = { styles.logoPortada } />
                    <View style = { styles.textPortada } >
                        <Text style = {{  textAlign: 'center', fontWeight: 'bold', fontSize: '22', color: '#858585', marginTop:'70px'}}>
                            REPORTE DE VENTAS 
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 4, fontSize: '14', color: '#525252' }}>
                            {form.año}
                        </Text>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA<Text style = { styles.textBlue }> TOTAL</Text> DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.total }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA DE LEADS<Text style = { styles.textBlue }> MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.totalMeses }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>ORIGEN</Text> DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenes }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>ORIGEN</Text> DE LEADS ORGÁNICOS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesOrganicos }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>ORIGEN</Text> DE LEADS ADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesAds }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`0${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                ORIGEN DE LEADS<Text style = { styles.textBlue }> MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesMeses }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>SERVICIOS</Text> SOLICITADOS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.servicios }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    SERVICIOS SOLICITADOS<Text style = { styles.textBlue }> MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.serviciosMeses }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tipos }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>ORIGEN </Text>DE LEADS <Text style = { styles.textBlue }>NO POTENCIALES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesNoPotenciales }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textBlue }>ORIGEN </Text>DE LEADS <Text style = { styles.textBlue }>POTENCIALES</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.origenesPotenciales }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                {
                    images.origenesDuplicados !== null &&
                        <Page size="A4" orientation = "landscape">
                            <View style = { styles.pagePadding } >
                                <View style = { styles.numberTitle } >
                                    <View >
                                        <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                                    </View>
                                    <View>
                                        <Text style = { styles.titulo }>    
                                            <Text style = { styles.textBlue }>ORIGEN </Text>DE LEADS <Text style = { styles.textBlue }>DUPLICADOS</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.imgCenter }>
                                    <Image style = { styles.imagenCentrada }  src = { images.origenesDuplicados }/>
                                </View>
                                <View style={ styles.lineGolden }></View>
                            </View>
                        </Page>
                }
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEADS <Text style = { styles.textBlue }>MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposMeses }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TOTAL DE <Text style = { styles.textBlue }>TIPOS DE PROYECTO</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposProyectos }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE PROYECTO <Text style = { styles.textBlue }>MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.tiposProyectosMeses }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    LEADS <Text style = { styles.textBlue }>CONTACTADOS</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.contactados }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ESTATUS DE LEADS <Text style = { styles.textBlue }>CONTACTADOS</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.estatus }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textBlue }>CANCELACIÓN</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.motivosCancelacion }/>
                        </View>
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textBlue }>RECHAZO</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images.motivosRechazo }/>
                        </View>
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page style={styles.page} size="A4" orientation = "landscape" wrap>
                    <View style = { styles.numberTitle } fixed>
                        <View>
                            <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
                        </View>
                        <View>
                            <Text style = { styles.titulo }>    
                                OBSERVACIONES <Text style = { styles.textPink }>CONTRATADOS </Text>
                            </Text>
                        </View>
                    </View>
                    {
                        objectlist_proyectos.length === 0 &&
                            <View style={[styles.box, styles.justifyContentCenter, { height: 485 }]}>
                                <Text style = { styles.bodyTextCenterBig } >
                                    NO SE CERRARON PROSPECTOS ESTE MES
                                </Text>
                            </View>
                    }
                    {
                        this.tablePage(objectlist_proyectos).map((value,key)=>{
                            return (
                                <View key={key} style={[styles.box, styles.justifyContentCenter, { height: 485 }]}>
                                    <View>
                                        <View style = { styles.table2}  >
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
                                                value.elementos.map((indice,key2)=>{ 
                                                    return (
                                                        <View key={indice} style = { this.setStyleRowBody(indice) }>
                                                            <View style = { styles.cell15 }>
                                                                <Text style = { styles.bodyText}>
                                                                    {
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.lead ?
                                                                                objectlist_proyectos[indice].prospecto.lead.nombre.toUpperCase()
                                                                            : ''
                                                                        : ''
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell15 }>
                                                                <Text style = { styles.bodyText}>
                                                                    { objectlist_proyectos[indice].nombre.toUpperCase() }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell15 }>
                                                                {
                                                                    objectlist_proyectos[indice].prospecto.lead.servicios ?
                                                                        objectlist_proyectos[indice].prospecto.lead.servicios.length ?
                                                                            objectlist_proyectos[indice].prospecto.lead.servicios.map((servicio)=>{
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
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.lead ?
                                                                                objectlist_proyectos[indice].prospecto.lead.origen ?
                                                                                    objectlist_proyectos[indice].prospecto.lead.origen.origen.toUpperCase()
                                                                                : '-'
                                                                            : '-'
                                                                        : '-'
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell10 }>
                                                                <Text style = { styles.bodyTextCenter } >
                                                                    {
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.lead ?
                                                                                objectlist_proyectos[indice].prospecto.lead.presupuesto_diseño ?
                                                                                    this.setMoney(objectlist_proyectos[indice].prospecto.lead.presupuesto_diseño.total)
                                                                                : '-'
                                                                            : '-'
                                                                        : '-'
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell5 }>
                                                                <Text style = { styles.bodyTextCenter } >
                                                                    {
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.lead ?
                                                                                objectlist_proyectos[indice].prospecto.lead.presupuesto_diseño ?
                                                                                    objectlist_proyectos[indice].prospecto.lead.presupuesto_diseño.m2
                                                                                : '-'
                                                                            : '-'
                                                                        : '-'
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell7 }>
                                                                <Text style = { styles.bodyTextCenter } >
                                                                    {
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.lead ?
                                                                                objectlist_proyectos[indice].prospecto.lead.presupuesto_diseño ?
                                                                                    this.getFechaText(objectlist_proyectos[indice].prospecto.lead.created_at)
                                                                                : '-'
                                                                            : '-'
                                                                        : '-'
                                                                    }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell8 }>
                                                                <Text style = { styles.bodyTextCenter } >
                                                                    { this.getFechaText(objectlist_proyectos[indice].created_at) }
                                                                </Text>
                                                            </View>
                                                            <View style = { styles.cell11 }>
                                                                <Text style = { styles.bodyTextCenter } >
                                                                    {
                                                                        objectlist_proyectos[indice].prospecto ?
                                                                            objectlist_proyectos[indice].prospecto.vendedores ?
                                                                                objectlist_proyectos[indice].prospecto.vendedores.length > 0 ?
                                                                                    <View>
                                                                                        {
                                                                                            objectlist_proyectos[indice].prospecto.vendedores.map((vendedor, index)=>{
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
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={ styles.lineGolden } fixed></View>
                </Page>
                <Page size="A4" orientation = "landscape" style = { styles.justifyContentCenter }>
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
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
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
                        <View style={ styles.lineBlue }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion} render={({ pageNumber }) => (`${pageNumber}`)} fixed />
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
                        <View style={ styles.lineGolden }></View>
                    </View>
                </Page>
                <Page style = {{ position: 'relative', height: '100%' }} size="A4" orientation = "landscape">
                    <Image src = { IM } style = { styles.logoFin } />
                    <View style = {{ width: '95%', marginRight: 'auto', marginLeft: 'auto', top: '85%'}}>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRowCenter} >
                                <View style = { styles.footerTable1 }>
                                    <View>
                                        <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                            Sitio Web
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.footerTable4 }>
                                    <Link src = "https://www.infraestructuramedica.mx" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none'  }}>
                                        www.infraestructuramedica.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                    <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                        Email
                                    </Text>
                                </View>
                                <View style = { styles.footerTable5 }>
                                    <Link src = "mailto:contacto@infraestructuramedica.mx" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none'  }}>
                                        contacto@infraestructuramedica.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins', color: '#525252', textAlign: 'right', paddingRight: 5 }}>
                                        Contacto
                                    </Text>
                                </View>
                                <View style = { styles.footerTable2 }>
                                    <View>
                                        <Link src = "tel:+5586621100" style = {{ fontSize: 11, fontFamily: 'Poppins', color: '#525252', textDecoration: 'none' }}>
                                            Tel: (55) 86 62 1100
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
