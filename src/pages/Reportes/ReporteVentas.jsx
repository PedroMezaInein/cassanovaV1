import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { RangeCalendar, Button } from '../../components/form-components';
import moment from 'moment'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import swal from 'sweetalert'
import { URL_DEV, URL_ASSETS } from '../../constants'
import axios from 'axios'
import { Page, Text, View, PDFDownloadLink, Document, StyleSheet, PDFViewer, BlobProvider, pdf, Image } from '@react-pdf/renderer'
import {ItemSlider} from '../../components/singles'
import {Pie} from 'react-chartjs-2';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

const options = {
    plugins: {
        datalabels: {
          color: '#ffffff',
          formatter: (value) => {
            return value + '%'
          }
        }
      }
}

class ReporteVentas extends Component {

    state = {
        url: '',
        form:{
            fechaInicio: moment().startOf('month').toDate(),
            fechaFin: moment().endOf('month').toDate(),
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
        leadsAnteriores: []
    }

    constructor(props) {
        super(props);
        this.chartTotalReference = React.createRef();
    }

    componentDidMount() {
        this.getReporteVentasAxios()
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
        this.getReporteVentasAxios()
    }

    setPdf = blob => {
        const { form } = this.state
        form.adjuntos.reportes.files = [
            {
                name: 'reporte.pdf',
                url: URL.createObjectURL(blob)
            }
        ]
        this.setState({
            ... this.state,
            form
        })
    }

    async getReporteVentasAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'reportes/ventas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { leads } = response.data
                const { data } = this.state
                data.total = {
                    labels: ['Total'],
                    datasets: [{
                        data: [leads.length],
                        backgroundColor: [
                            '#FF6384',
                        ],
                        hoverBackgroundColor: [
                            '#FF6384',
                        ]
                    }]
                }

                let url = ''
                this.chartTotalReference.current.chartInstance.render(options)

                this.setState({
                    ... this.state,
                    leads: leads,
                    url: url
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
        const { form, leads, data } = this.state
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
                            <div className="col-md-6">
                                <div className="d-flex justify-content-center">
                                    <RangeCalendar start = { form.fechaInicio } end = { form.fechaFin } 
                                        onChange = { this.onChangeRange } />
                                </div>
                            </div>
                            <div className="col-md-6">
                                {
                                    leads.length ?
                                        <>
                                            <div className="d-none">
                                                <PDFViewer>
                                                    <Document 
                                                        onRender = { 
                                                                ({ blob, url, loading, error }) => 
                                                                    {
                                                                        this.setPdf(blob)
                                                                    } 
                                                                }
                                                            >
                                                        <Page size="A4">
                                                            {/* <View style={styles.section}>
                                                                <Text>Section #1</Text>
                                                            </View> */}
                                                            {/* <Image src = {this.state.url} /> */}
                                                            {/* <View style={styles.section}>
                                                                <Text>Section #2</Text>
                                                            </View> */}
                                                        </Page>
                                                    </Document>
                                                </PDFViewer>
                                            </div>
                                            <div>
                                                <ItemSlider items={form.adjuntos.reportes.files} item='reportes' />
                                            </div>
                                        </>
                                    : ''
                                }
                            </div>
                        </div>
                        <div className="row mx-0">
                            <div className="col-md-6">
                                <Pie plugins =  {['ChartDataLabels']}ref = { this.chartTotalReference } data = { data.total } options = { options } />
                            </div>
                        </div>
                        <img src = { this.state.url } />
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