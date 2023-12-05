import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiOptions, apiPutForm, apiPostForm, apiGet } from './../../functions/api';

import DateFnsUtils from '@date-io/date-fns';
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import S3 from 'react-aws-s3'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { setLabelTable, dayDMY } from '../../functions/setters'

import { Modal, ItemSlider, ItemDoubleSlider } from '../../components/singles'



import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import j2xParser from 'fast-xml-parser'

import Style from './Egresos/Modales/CrearEgreso.module.css'

export default function EditarEgreso(props) {
    const {opcionesData, reload, handleClose, data} = props
    const auth = useSelector((state) => state.authUser.access_token)
    const departamentos = useSelector(state => state.opciones.areas)
    const [opciones, setOpciones] = useState({
        cuentas: [],
        empresas: [],
        estatusCompras: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
    })
   
    const [form, setForm] = useState({
        // adjuntos: {
        //     pago: {files:[], value: ''},
        //     pdf: { files: [], value: '' },
        //     presupuesto: { files: [], value: '' },
        //     xml: { files: [], value: '' },
        // },
        // area : data.area ?  data.area.id : '',
        // banco: 0,
        // comision: data.comision,
        // correo: '',
        // cuenta: data.cuenta ? data.cuenta.id : '',
        // cuentas: [],
        // comision: 0,
        // descripcion: data.descripcion,
        // empresa: data.em
    })

 
    const  setAdjuntosFacturas = () => {
        let aux = [];
        if (data[0] || data[0].xml.length > 0) {
            let xml = data[0].xml
            aux.push({
                name: xml.folio + '-xml.xml',
                url: xml.url
            })
        }
        if (data[0] || data[0].pdf.length > 0) {
            let pdf = data[0].pdf
            aux.push({
                name: pdf.folio + '-pdf.pdf',
                url: pdf.url
            })
        }
        return aux
    }

    return (
        <>
            
            <div className=" col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon2-file"></i></span>
                                        <span className="navi-text font-size-lg">Datos de la factura</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second">
                                        <span className="navi-icon"><i className="fas fa-coins"></i></span>
                                        <span className="navi-text font-size-lg">Datos generales</span>
                                    </Nav.Link>
                                </Nav.Item>
                                {
                                    data[0].pdf || data[0].xml ?
                                        <Nav.Item className="navi-item">
                                            <Nav.Link className="navi-link px-3" eventKey="third" >
                                                <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                                <span className="navi-text font-size-lg">Facturas</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        : ''
                                }
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <div className="col d-flex justify-content-end">
                                                        {
                                                            data[0] ?
                                                                <span>{setLabelTable(data[0])}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FOLIO:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].folio ?
                                                                <span>{data[0].folio}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].fecha ?
                                                                <span>{dayDMY(data[0].fecha)}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">SERIE:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].serie ?
                                                                <span>{data[0].serie}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary text-left">NÚMERO DE CERTIFICADO:</label>
                                                    <div className="col-8 align-self-center">
                                                        {
                                                            data[0].numero_certificado ?
                                                                <span>{data[0].numero_certificado}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">USO CFDI:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].uso_cfdi ?
                                                                <span>{data[0].uso_cfdi}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-2">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">EMISOR:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].nombre_emisor ?
                                                                <div>
                                                                    <strong>RFC: </strong><span>{data[0].rfc_emisor}</span><br />
                                                                    <strong>NOMBRE: </strong><span>{data[0].nombre_emisor}</span>
                                                                </div>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">RECEPTOR:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].nombre_receptor ?
                                                                <div>
                                                                    <strong>RFC: </strong><span>{data[0].rfc_receptor}</span><br />
                                                                    <strong>NOMBRE: </strong><span>{data[0].nombre_receptor}</span>
                                                                </div>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">SUBTOTAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].subtotal ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].subtotal}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].total}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">MONTO ACUMULADO:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].ventas_compras_count + data[0].ingresos_egresos_count}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary">MONTO RESTANTE:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={data[0].total - data[0].ventas_compras_count - data[0].ingresos_egresos_count}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-4 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-8">
                                                        {
                                                            data[0].descripcion ?
                                                                <span>{data[0].descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    {
                                        data[0] !== '' ?
                                            <ItemSlider items={setAdjuntosFacturas()} item='' />
                                            : ''
                                    }
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        
        </>
    )
        
}
