import React, { Component } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font, Link } from '@react-pdf/renderer'
import IM from '../../assets/logos/im.png'
import SpartanBold from '../../assets/fonts/Spartan-Bold.ttf'
import Spartan from '../../assets/fonts/Spartan-Regular.ttf'
import moment from 'moment'
import { IM_AZUL, IM_DORADO } from '../../constants'

Font.register({
    family: 'Spartan',
    fonts:[
        { src: Spartan },
        { src: SpartanBold, fontWeight: 700 }
    ]
})

const styles = StyleSheet.create({
    dot:{
        width: 3,
        height: 3,
        borderRadius: 0.5,
        backgroundColor: IM_AZUL
    },
    pagina: {
        backgroundColor: IM_AZUL
    },
    pagina2: {
        backgroundColor: IM_DORADO
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
        color: IM_AZUL,
        fontWeight: 'bold',
        fontFamily: 'Spartan',
        fontSize: 35
    },
    titulo:{
        color: '#535353',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Spartan',
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
        backgroundColor: IM_AZUL
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
        width: '10%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
        border: 'solid', borderRightWidth: 3, borderColor: IM_AZUL, flexDirection: 'row', display: 'flex', alignItems: 'center'
    },
    footerTable2:{
        width: '28%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
        flexDirection: 'row', display: 'flex', alignItems: 'center', marginLeft: 5
    },
    footerTable3:{
        width: '15%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
        flexDirection: 'row', display: 'flex', alignItems: 'center', marginLeft: 5
    },
    footerTable4:{
        width: '24%', height: '100%', marginTop: 'auto', marginBottom: 'auto',
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
        fontSize: '11',
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
        paddingBottom: 1,
        textAlign: "left"
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
        backgroundColor: IM_DORADO,
        position: 'absolute',
        height: '70%',
        width: '10px',
        top: 0,
        left: 20
    },
    lineaRoja:{
        backgroundColor: IM_AZUL,
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
        fontFamily: 'Spartan',
        fontColor: '#535353'
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

    render() {
        const { lista, images, form } = this.props
        return (
            <Document style = {{ fontFamily: 'Spartan', color: '#535353' }}>
                <Page style = {{ position: 'relative', height: '100%' }} size="A4" orientation = "landscape">
                    <View style = { styles.lineaNegra }>
                    </View>
                    <View style = { styles.lineaRoja }>
                    </View>
                    <Image src = { IM } style = { styles.logoPortada } />
                    <View style = { styles.textPortada } >
                        <Text style = {{  textAlign: 'center', fontWeight: 'bold', fontSize: '25', color: '#535353' }}>
                            REPORTE DE VENTAS
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '15', color: '#535353' }}>
                            {this.getFecha()}
                        </Text>
                        <Text style = {{  textAlign: 'center', marginTop: 5, fontSize: '15', color: '#535353' }}>
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
                                    ENTRADA TOTAL DE LEADS
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
                                    COMPARATIVA LEADS ACTUALES VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[0].url }/>
                                        <Text style = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[1].url }/>
                                        <Text style = { styles.texto }>
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
                                    COMPARATIVA ORIGEN LEADS ACTUALES VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[2].url }/>
                                        <Text style = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[3].url }/>
                                        <Text style = { styles.texto }>
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
                                    COMPARATIVA SERVICIOS SOLICITADOS VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[4].url }/>
                                        <Text style = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 60 }}>
                                        <Image style = { styles.imagenDoble } src = { images[5].url }/>
                                        <Text style = { styles.texto }>
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
                                    COMPARATIVA TIPO LEADS VS { this.getLastMonth() }
                                </Text>
                            </View>
                        </View>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[6].url }/>
                                        <Text style = { styles.texto }>
                                            { this.getMonth() }
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.cell }>
                                    <View style = {{ marginTop: 50 }}>
                                        <Image style = { styles.imagenDoble } src = { images[7].url }/>
                                        <Text style = { styles.texto }>
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
                                    STATUS DE PROSPECTOS
                                </Text>
                            </View>
                        </View>
                        <Image style = { styles.imagenCentrada }  src = { images[9].url }/>
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
                                <Text style = { styles.paginacion}>12</Text>
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
                    <Image src = { IM } style = { styles.logoFin } />
                    <View style = {{ width: '95%', marginRight: 'auto', marginLeft: 'auto', top: '85%'}}>
                        <View style = { styles.table}  >
                            <View style = { styles.tableRow } >
                                <View style = { styles.footerTable1 }>
                                    <View>
                                        <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Spartan', color: '#535353', textAlign: 'right', paddingRight: 5 }}>
                                            Sitio Web
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.footerTable4 }>
                                    <Link src = "https://www.infraestructuramedica.mx" style = {{ fontSize: 11, fontFamily: 'Spartan', color: '#535353', textDecoration: 'none'  }}>
                                        www.infraestructuramedica.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                    <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Spartan', color: '#535353', textAlign: 'right', paddingRight: 5 }}>
                                        Email
                                    </Text>
                                </View>
                                <View style = { styles.footerTable2 }>
                                    <Link src = "mailto:contacto@infraestructuramedica.mx" style = {{ fontSize: 11, fontFamily: 'Spartan', color: '#535353', textDecoration: 'none'  }}>
                                        contacto@infraestructuramedica.mx
                                    </Link>
                                </View>
                                <View style = { styles.footerTable1 }>
                                <Text style = {{ fontSize: 13, fontWeight: 'bold', fontFamily: 'Spartan', color: '#535353', textAlign: 'right', paddingRight: 5 }}>
                                        Contacto
                                    </Text>
                                </View>
                                <View style = { styles.footerTable3 }>
                                    <View>
                                        <Link src = "tel:+5586621100" style = {{ fontSize: 11, fontFamily: 'Spartan', color: '#535353', textDecoration: 'none' }}>
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
