import React, { Component } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font, Link } from '@react-pdf/renderer'
import INEIN from '../../assets/logos/inein.png'
import PoppinsBold from '../../assets/fonts/Poppins-Bold.ttf'
import Poppins from '../../assets/fonts/Poppins-Regular.ttf'
import moment from 'moment'
import { INEIN_RED } from '../../constants'

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
        flexDirection: 'column',
        paddingTop: 50
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
        backgroundColor: '#E6E6E6'
    },
    tableRowBodyPar:{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    footerTable1:{
        width: '12%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
        border: 'solid', borderRightWidth: 3, borderColor: INEIN_RED, flexDirection: 'row', display: 'flex', alignItems: 'center'
    },
    footerTable2:{
        width: '21%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
        flexDirection: 'row', display: 'flex', alignItems: 'center', marginLeft: 5
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
        width: '95%',
        fontSize: '10',
        marginBottom: 5,
        textAlign: "justify",
        lineHeight: 1.2
    },
    cell20: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '22%'
    },
    cell10: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '11%'
    },
    cell15: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '17%'
    },
    cell30: {
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
        fontSize: 10,
        padding:3,
        textAlign: 'left'
    },
    bodyText:{
        fontWeight: 100,
        fontSize: 8,
        padding:1,
        textAlign: "left"
    },
    imagenCentrada:{
        width: '95%',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 40
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
    lineaRoja:{
        backgroundColor: INEIN_RED,
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
    },
    logoFin:{
        position: 'absolute',
        width: '44%',
        left: '28%',
        right: '28%',
        height: 'auto',
        top: '35%',
    },
    textPortada:{
        position: 'absolute',
        top: '60%',
        width: '100%',
        fontFamily: 'Poppins',
        fontColor: '#525252'
    }
});

export default class ReporteVentasInein extends Component {

    getFecha = () => {
        const { form } = this.props
        let fecha = moment(form.fechaInicio)
        let fecha2 = moment(form.fechaFin)
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        let aux = meses[fecha.month()] + ' ' + fecha.date() + ' - ' + meses[fecha2.month()] + ' ' + fecha2.date()
        return aux
    }

    getMonth = () => {
        const { form } = this.props
        let fecha = moment(form.fechaInicio)
        let mes = fecha.month()
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return meses[mes]
    }

    getLastMonth = () => {
        const { form } = this.props
        let fecha = moment(form.fechaInicioRef)
        let mes = fecha.month()
        let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
        return meses[mes]
    }

    getYear = () => {
        const { form } = this.props
        let fecha = moment(form.fechaInicio)
        let año = fecha.year()
        return año
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

    setMoney = value => {
        // Create our number formatter.
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        
        return formatter.format(value); /* $2,500.00 */
    }

    render() {
        const { lista, images, form, anteriores, mes, data } = this.props
        return (
            <Document style = {{ fontFamily: 'Poppins', color: '#525252' }}>
                <Page style = {{ position: 'relative', height: '100%' }} size="A4" orientation = "landscape">
                    <View style = { styles.lineaNegra }>
                    </View>
                    <View style = { styles.lineaRoja }>
                    </View>
                    <Image src = { INEIN } style = { styles.logoPortada } />
                    <View style = { styles.textPortada } >
                        <Text style = {{  textAlign: 'center', fontWeight: 'bold', fontSize: '25', color: '#525252' }}>
                            REPORTE DE VENTAS
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '15', color: '#525252' }}>
                            {this.getFecha()}
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '15', color: '#525252' }}>
                            {this.getYear()}
                        </Text>
                    </View>
                </Page>
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View>
                                <Text style = { styles.paginacion}>01</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    ENTRADA TOTAL DE LEADS ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[0].url }/>
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
                                    COMPARATIVA DE LEADS TOTALES (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[1].url }/>
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
                                    ORIGEN DE LEADS ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[2].url }/>
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
                                    COMPARATIVA ORIGEN LEADS (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[3].url }/>
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
                                    SERVICIOS SOLICITADOS ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[4].url }/>
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
                                    COMPARATIVA SERVICIOS SOLICITADOS (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[5].url }/>
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
                                    TIPO DE LEAD ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[6].url }/>
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
                                    COMPARATIVA TIPO DE LEAD (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[7].url }/>
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
                                    TOTAL DE PROSPECTOS ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[8].url }/>
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
                                    COMPARATIVA TOTAL DE PROSPECTOS (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[9].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>11</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    STATUS DE PROSPECTOS ({mes})
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[10].url }/>
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
                                    COMPARATIVA STATUS DE PROSPECTOS (MESES ANTERIORES)
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[11].url }/>
                    </View>
                </Page>
                <Page style = { styles.pagina } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>13</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    PROSPECTOS CONTRATADOS ({mes})
                                </Text>
                            </View>
                        </View>
                        <View style = {{ marginTop: 10}}>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            NOMBRE
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            COSTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell30 }>
                                        <Text style = { styles.headerText } >
                                            VENDEDOR
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            FECHA DE CONTRATACION
                                        </Text>
                                    </View>
                                    <View style = { styles.cell30 }>
                                        <Text style = { styles.headerText } >
                                            ORIGEN
                                        </Text>
                                    </View>
                                </View>
                                {
                                    data.cerrados.map( (element, index) =>{
                                        if(element.prospecto)
                                            return(
                                                <View key = { index } style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.nombre
                                                                    : ''
                                                                : ''
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
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
                                                                                                {vendedor.name}
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
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                this.getFechaText(element.created_at)
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell30 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                element.prospecto ?
                                                                    element.prospecto.lead ?
                                                                        element.prospecto.lead.origen ?
                                                                            element.prospecto.lead.origen.origen
                                                                        : ''
                                                                    : ''
                                                                : ''
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
                    </View>
                </Page>
                
                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>14</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    OBSERVACIONES DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <View style = {{ marginTop: 10}}>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            NOMBRE DEL LEAD
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell30 }>
                                        <Text style = { styles.headerText } >
                                            OBSERVACIONES
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            STATUS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerText } >
                                            PRIMER CONTACTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerText } >
                                            ÚLTIMO CONTACTO
                                        </Text>
                                    </View>
                                </View>
                                {
                                    form.leads.map( (lead, index) =>{
                                        if(lead.prospecto)
                                            return(
                                                <View key = { index } style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.nombre
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.tipoProyecto ?
                                                                    lead.prospecto.tipoProyecto.tipo
                                                                : 
                                                                    lead.servicios.map((serv, index) => {
                                                                        return serv.servicio
                                                                    })
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell30 }>
                                                        <Text style = { styles.bodyText } >
                                                            { this.setComentario(lead) }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.estatus_prospecto ?
                                                                    lead.prospecto.estatus_prospecto.estatus
                                                                :''
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.contactos ?
                                                                    lead.prospecto.contactos.length ?
                                                                        this.getFechaText(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                    : 'Sin contacto'
                                                                : 'Sin contacto'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.contactos ?
                                                                    lead.prospecto.contactos.length ?
                                                                        this.getFechaText(lead.prospecto.contactos[0].created_at)
                                                                    : 'Sin contacto'
                                                                : 'Sin contacto'
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
                        
                    </View>
                </Page>

                <Page style = { styles.pagina2 } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>15</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    LISTADO DE PROSPECTO DE MESES ANTERIORES
                                </Text>
                            </View>
                        </View>
                        <View style = {{ marginTop: 10}}>
                            <View style = { styles.table}  >
                                <View style = { styles.tableRowHeader } >
                                    <View style = { styles.cell20 }>
                                        <Text style = { styles.headerText } >
                                            NOMBRE DEL LEAD
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            PROYECTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell30 }>
                                        <Text style = { styles.headerText } >
                                            MOTIVO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell10 }>
                                        <Text style = { styles.headerText } >
                                            STATUS
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerText } >
                                            PRIMER CONTACTO
                                        </Text>
                                    </View>
                                    <View style = { styles.cell15 }>
                                        <Text style = { styles.headerText } >
                                            ÚLTIMO CONTACTO
                                        </Text>
                                    </View>
                                </View>
                                {
                                    anteriores.map( (lead, index) =>{
                                        if(lead.prospecto)
                                            return(
                                                <View key = { index } style = { this.setStyleRowBody(index) } >
                                                    <View style = { styles.cell20 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.nombre
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.tipoProyecto ?
                                                                    lead.prospecto.tipoProyecto.tipo
                                                                : 
                                                                    lead.servicios.map((serv, index) => {
                                                                        return serv.servicio
                                                                    })
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell30 }>
                                                        <Text style = { styles.bodyText } >
                                                            { this.setComentario(lead) }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell10 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.estatus_prospecto ?
                                                                    lead.prospecto.estatus_prospecto.estatus
                                                                :''
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.contactos ?
                                                                    lead.prospecto.contactos.length ?
                                                                        this.getFechaText(lead.prospecto.contactos[lead.prospecto.contactos.length - 1].created_at)
                                                                    : 'Sin contacto'
                                                                : 'Sin contacto'
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View style = { styles.cell15 }>
                                                        <Text style = { styles.bodyText } >
                                                            {
                                                                lead.prospecto.contactos ?
                                                                    lead.prospecto.contactos.length ?
                                                                        this.getFechaText(lead.prospecto.contactos[0].created_at)
                                                                    : 'Sin contacto'
                                                                : 'Sin contacto'
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
                        
                    </View>
                </Page>

                <Page style = { styles.pagina } size="A4" orientation = "landscape">
                    <View style = { styles.page } >
                        <View style = {{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end'}}>
                            <View >
                                <Text style = { styles.paginacion}>16</Text>
                            </View>
                            <View>
                                <Text style = { styles.titulo }>    
                                    CONCLUSIONES
                                </Text>
                            </View>
                        </View>
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
