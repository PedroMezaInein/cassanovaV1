import React, { Component, useState, useEffect } from 'react'
import $ from 'jquery'
import S3 from 'react-aws-s3'
import { Tabs, Tab } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Modal } from '../../../components/singles'
import { Update,Sending } from '../../../components/Lottie'
import Layout from '../../../components/layout/layout'
import { EgresosCard } from '../../../components/cards'
import { EngresosFilters } from '../../../components/filters'
import { printSwalHeader } from '../../../functions/printers'
import { FacturasFormTable } from '../../../components/tables'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { AdjuntosForm, FacturaExtranjera } from '../../../components/forms'
import { apiOptions, apiGet, apiDelete, apiPutForm, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { InputGray, CalendarDaySwal, SelectSearchGray, DoubleSelectSearchGray } from '../../../components/form-components'
import { waitAlert, deleteAlert, doneAlert, createAlertSA2WithActionOnClose, printResponseErrorAlert, customInputAlert, errorAlert } from '../../../functions/alert'
import { setOptions, setOptionsWithLabel, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setSelectOptions, setTextTableCenter, 
    setTextTableReactDom, setNaviIcon
} from '../../../functions/setters'
import RequisicionCompras from './../RequisicionCompras/RequisicionCompras'
import RequisicionContabilidad from './../RequisicionContabilidad/RequisicionContabilidad'
import { Requisiciones } from './../Requisiciones/Requisiciones'
import { Requisicionesautoriza } from '../Requisiciones/Requisicionesautoriza'

import EgresosTable from './EgresosTable'
import NewTable from './../../../components/NewTables/NewTable'
import TablaPaginado from './../../../components/NewTables/TablaGeneral/TablaGeneralPaginado'
import { URL_DEV, EGRESOS_COLUMNS } from '../../../constants'
import { connect } from 'react-redux'
import withReactContent from 'sweetalert2-react-content'


class Egresos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: {
                see: false,
                facturas: false,
                adjuntos: false,
                facturaExtranjera: false,
                filters: false,
                download: false
            },
            egresos: [],
            egresosAux: [],
            title: 'Nuevo egreso',
            egreso: '',
            data: {
                proveedores: [],
                empresas: [],
                adjuntos: []
            },
            form: this.initializeForm(),
            options: this.initializeOptions(),
            filters: {},
            key: 'gastos',
            // eliminar: '',
            accesos: '', // Inicializamos los permisos aquí
            eliminar: ''
        };
    }

    componentDidMount() {
        this.initializeComponent();
    }

    initializeComponent = async () => {
        const { authUser, history, location } = this.props;
        const { history: { location: { pathname } } } = this.props

        // Usar React Router para obtener la ubicación si está disponible
        const currentPath = location?.pathname || window?.location?.pathname;
    
        if (!currentPath) {
            console.error('No se pudo determinar el pathname');
            return;
        }
    
        const { permisos } = authUser.user;
    
        // const egresos = permisos.find((p) => p.modulo.url === currentPath);
        const egresos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });

        const accesos = egresos.read ? egresos.read : 0
        const eliminar = egresos.delete ?  egresos.delete : 0

        if (!egresos) {
            history.push('/'); // Redirigir al usuario si no tiene acceso
            return;
        }
        this.setState({ ...this.state, accesos, eliminar })

        const accessToken = authUser.access_token;
        // await this.getOptionsAxios(accessToken);
    };

    
    
    initializeForm = () => ({
        formaPago: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        metodoPago: '',
        estatusFactura: '',
        facturaObject: '',
        estatusCompra: 0,
        adjuntos: this.initializeAdjuntos()
    });

    initializeAdjuntos = () => ({
        factura: this.createAdjuntoField('Factura'),
        pago: this.createAdjuntoField('Pago'),
        presupuesto: this.createAdjuntoField('Presupuesto'),
        facturas_pdf: this.createAdjuntoField('Factura extranjera')
    });

    createAdjuntoField = (placeholder) => ({
        value: '',
        placeholder,
        files: []
    });

    initializeOptions = () => ({
        formasPagos: [],
        metodosPagos: [],
        estatusFacturas: [],
        estatusCompras: [],
        allCuentas: []
    });

    // getOptionsAxios = async (accessToken) => {
    //     waitAlert();
    //     try {
    //         const response = await apiOptions(`v2/administracion/egresos`, accessToken);
    //         const { proveedores, empresas, estatusCompras, cuentas } = response.data;
    //         const newData = {
    //             ...this.state.data,
    //             proveedores,
    //             empresas
    //         };
    //         const newOptions = {
    //             ...this.state.options,
    //             estatusCompras: setSelectOptions(estatusCompras, 'estatus'),
    //             empresas: setOptionsWithLabel(empresas, 'name', 'id'),
    //             allCuentas: setOptionsWithLabel(cuentas, 'nombre', 'id')
    //         };
    //         this.setState({ data: newData, options: newOptions });
    //         Swal.close();
    //     } catch (error) {
    //         printResponseErrorAlert(error);
    //     }
    // };

    reloadTable = (filters) => {
        const filterKeys = Object.keys(filters);
        const aux = {};

        filterKeys.forEach((key) => {
            switch (key) {
                case 'area':
                case 'proveedor':
                case 'cuenta':
                case 'empresa':
                case 'estatusCompra':
                case 'proyecto':
                case 'subarea':
                case 'factura':
                    aux[key] = {
                        value: filters[key]?.value,
                        name: filters[key]?.name
                    };
                    break;
                default:
                    aux[key] = filters[key];
                    break;
            }
        });

        $(`#egresos`).DataTable().search(JSON.stringify(aux)).draw();
    };

    handleModalClose = () => {
        this.setState({
            modal: {
                see: false,
                adjuntos: false,
                facturaExtranjera: false,
                filters: false,
                facturas: false
            },
            egreso: '',
            form: this.initializeForm()
        });
    };

    openModal = (key) => {
        this.setState((prevState) => ({
            modal: { ...prevState.modal, [key]: true }
        }));
    };

    render() {
        const { modal, key, eliminar,accesos } = this.state;
        const { authUser, areas } = this.props;

        return (
            <Layout active = 'administracion' { ... this.props }>
          
            { 
                accesos == 1 ?
               <Tabs  activeKey={key}  onSelect={(value) => this.setState({ key: value })}  >
                    <Tab eventKey="gastos" title="Gastos">
                        <EgresosTable reloadTable={this.reloadTable}  eliminar={eliminar} />
                    </Tab>
                    <Tab eventKey="requisiciones" title="Requisiciones">
                        <Requisiciones reloadTable={this.reloadTable}  />
                    </Tab>
                    <Tab eventKey="requisición compras" title="Requisición Compras">
                        <RequisicionCompras reloadTable={this.reloadTable} />
                    </Tab>
                    <Tab eventKey="requisición contabilidad" title="Requisición Contabilidad">
                        <RequisicionContabilidad reloadTable={this.reloadTable} />
                    </Tab>
                </Tabs>

                    :  
                    <Tabs id = "tabAdministracion" defaultActiveKey ="requisiciones"  activeKey ="requisiciones"  onSelect = {(value) => {this.controlledTab(value)}}>   
                    
                        <Tab eventKey="requisiciones" title="requisiciones">
                            <Requisiciones/>
                        </Tab>
                    
                    </Tabs>            
 
                 }

                {/* Modales */}
                <Modal
                    size="xl"
                    title="Facturas"
                    show={modal.facturas}
                    handleClose={this.handleModalClose}
                >
                    <FacturasFormTable at={authUser.access_token} tipo_factura="egresos" id={this.state.egreso.id} />
                </Modal>

                <Modal
                    size="lg"
                    title="Egreso"
                    show={modal.see}
                    handleClose={this.handleModalClose}
                >
                    <EgresosCard egreso={this.state.egreso} areas={areas} />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    authUser: state.authUser,
    // areas: state.opciones.areas
});

export default connect(mapStateToProps)(Egresos);
