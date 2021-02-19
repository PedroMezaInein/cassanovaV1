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
    pagina: {
        backgroundColor: INEIN_RED
    },
    pagina2: {
        backgroundColor: '#525252'
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
    cell20: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '20%',
        padding:'4px'
    },
    cell8: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '8%',
        padding:'4px'
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
    cell15: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '15%',
        padding:'4px'
    },
    cell30: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '30%',
        padding:'4px'
    },  
    cell43: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '43%',
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
    },
    imagenCentrada:{
        width: '95%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        objectFit: 'cover'
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
        paddingRight: '35px',
        paddingLeft: '35px',
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

export default class ReporteVentasInein extends Component {

    getFecha = () => {
        const { form } = this.props
        let fecha = moment(form.mes+'/01/'+form.año)
        let fecha2 = moment(form.mes+'/01/'+form.año).endOf('month')
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let aux = meses[fecha.month()] + ' ' + fecha.date() + ' - ' + meses[fecha2.month()] + ' ' + fecha2.date()
        return aux
    }

    getYear = () => {
        const { form } = this.props
        return moment(form.mes+'/01/'+form.año).year()
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

    render() {
        const { lista, images, form, anteriores, mes, data } = this.props
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
                        <Text style = {{  textAlign: 'center', marginTop: 4, fontSize: '14', color: '#525252' }}>
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
                                    ENTRADA <Text style = { styles.textPink }>TOTAL</Text> DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[0].url }/>
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
                                    ENTRADA DE LEADS <Text style = { styles.textPink }>MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[1].url }/>
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
                                    <Text style = { styles.textPink }>ORIGEN</Text> DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[2].url }/>
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
                                    <Text style = { styles.textPink }>ORIGEN </Text> DE LEADS ORGÁNICOS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[3].url }/>
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
                                    <Text style = { styles.textPink }>ORIGEN </Text> DE LEADS ADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[4].url }/>
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
                                ORIGEN DE LEADS <Text style = { styles.textPink }>MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[5].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
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
                                <Text style = { styles.paginacion}>11</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    TIPO DE LEADS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[8].url }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>12</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS  <Text style = { styles.textPink }>NO POTENCIALES </Text>(#Total)
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[9].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>13</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS <Text style = { styles.textPink }>POTENCIALES </Text>(#Total)
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[10].url }/>
                        </View>
                        <View style={ styles.lineGray }></View>
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
                                    <Text style = { styles.textPink }>ORIGEN </Text>DE LEADS <Text style = { styles.textPink }>DUPLICADOS </Text>(#Total)
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[11].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
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
                                    TIPO DE LEADS <Text style = { styles.textPink }>MESUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[11].url }/>
                        </View>
                        <View style={ styles.lineGray }></View>
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
                                <Text style = { styles.paginacion}>17</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    <Text style = { styles.textPink }>SERVICIOS </Text>SOLICITADOS
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[6].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>18</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    SERVICIOS SOLICITADOS <Text style = { styles.textPink }>MENSUAL</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
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
                                <Text style = { styles.paginacion}>20</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    LEADS <Text style = { styles.textPink }>CONTACTADOS</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>21</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ESTATUS DE LEADS <Text style = { styles.textPink }>CONTACTADOS</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>22</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textPink }>CANCELACIÓN</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
                        </View>
                        <View style={ styles.lineGray }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape" >
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>23</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PRINCIPALES MOTIVOS DE <Text style = { styles.textPink }>RECHAZO</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
                        </View>
                        <View style={ styles.linePink }></View>
                    </View>
                </Page>
                <Page size="A4" orientation = "landscape">
                    <View style = { styles.pagePadding } >
                        <View style = { styles.numberTitle } >
                            <View >
                                <Text style = { styles.paginacion}>24</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    OBSERVACIONES <Text style = { styles.textPink }>CONTRATADOS</Text>
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.imgCenter }>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerTextJustify } >
                                            NOMBRE
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerTextJustify } >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerTextJustify } >
                                            SERVICIOS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            ORIGEN
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            MONTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            M²
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            INGRESO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            CONTRATACIÓN
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            VENDEDOR
                                        </Text>
                                    </View>
                                </View>
                                {
                                    data.cerrados.length === 0 ?
                                        <View>
                                            <Text style = { styles.bodyTextCenterBig } >
                                                NO SE CERRARON PROSPECTOS DURANTE ESTE AÑO
                                            </Text>
                                        </View>
                                    : ''
                                }
                                {
                                    data.cerrados.map( (element, index) => {
                                        if(element.prospecto){
                                            return(
                                                <View key = { index } style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell20 }>
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
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText}>
                                                            Proyecto
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText}>
                                                            SERVICIOS
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell30 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.origen ?
                                                                            element.prospecto.lead.origen.origen.toUpperCase()
                                                                        : ''
                                                                    : ''
                                                                : ''
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
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            M2       
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                this.getFechaText(element.created_at)
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyTextCenter } >
                                                            {
                                                                this.getFechaText(element.created_at)
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell30 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.vendedores ?
                                                                        element.prospecto.vendedores.length > 0 ?
                                                                            <View>
                                                                                {
                                                                                    element.prospecto.vendedores.map((vendedor, index)=>{
                                                                                        return(
                                                                                            <Text key = { index }>
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
                                        return ''
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
                                <Text style = { styles.paginacion}>26</Text>
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
                                <Text style = { styles.paginacion}>27</Text>
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
