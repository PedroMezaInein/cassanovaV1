import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { Modal } from '../../../components/singles';
import Layout from '../../../components/layout/layout';
import { ComprasCard } from '../../../components/cards';
import ComprasTable from './ComprasTable';
import { apiOptions, apiGet, apiDelete, apiPostFormResponseBlob, catchErrors, apiPutForm } from '../../../functions/api';
import {
    waitAlert,
    printResponseErrorAlert,
    doneAlert,
    deleteAlert,
} from '../../../functions/alert';
import {
    setOptionsWithLabel,
    setSelectOptions,
} from '../../../functions/setters';

function Compras(props) {
    const [modal, setModal] = useState({
        facturas: false,
        see: false,
        facturaExtranjera: false,
        adjuntos: false,
        filters: false,
    });

    const [form, setForm] = useState({
        factura: 'Sin factura',
        tipoAdjunto: 'presupuesto',
        tipoImpuesto: 0,
        tipoPago: 0,
        estatusCompra: 0,
        fecha: new Date(),
        adjuntos: {
            factura: { value: '', placeholder: 'Factura', files: [] },
            pago: { value: '', placeholder: 'Pago', files: [] },
            presupuesto: { value: '', placeholder: 'Presupuesto', files: [] },
            facturas_pdf: { value: '', placeholder: 'Facturas extranjeras', files: [] },
        },
    });

    const [options, setOptions] = useState({
        empresas: [],
        cuentas: [],
        areas: [],
        subareas: [],
        clientes: [],
        proyectos: [],
        proveedores: [],
        tiposImpuestos: [],
        tiposPagos: [],
        estatusCompras: [],
        formasPago: [],
        metodosPago: [],
        estatusFacturas: [],
        allCuentas: [],
    });

    const [compra, setCompra] = useState(null);

    const [filters, setFilters] = useState({});

    const [key, setKey] = useState('compras');

    useEffect(function () {
        validarPermisos();
        // obtenerOpciones();

        const queryString = props.history.location.search;
        if (queryString) {
            const params = new URLSearchParams(queryString);
            const id = parseInt(params.get('id'), 10);
            if (id) {
                abrirModalVer(id);
            }
        }
    }, []);

    function validarPermisos() {
        const { user: { permisos } } = props.authUser;
        const { pathname } = props.history.location;
        const tienePermiso = permisos.some(({ modulo }) => modulo.url === pathname);

        if (!tienePermiso) {
            props.history.push('/');
        }
    }

    // async function obtenerOpciones() {
    //     const { access_token } = props.authUser;
    //     waitAlert();
    //     try {
    //         const response = await apiOptions('v2/proyectos/compras', access_token);
    //         const {
    //             empresas,
    //             areas,
    //             tiposPagos,
    //             tiposImpuestos,
    //             estatusCompras,
    //             proyectos,
    //             proveedores,
    //             formasPago,
    //             metodosPago,
    //             estatusFacturas,
    //             cuentas,
    //         } = response.data;

    //         setOptions({
    //             empresas: setOptionsWithLabel(empresas, 'name', 'id'),
    //             proveedores: setOptionsWithLabel(proveedores, 'razon_social', 'id'),
    //             areas: setOptionsWithLabel(areas, 'nombre', 'id'),
    //             proyectos: setOptionsWithLabel(proyectos, 'nombre', 'id'),
    //             tiposPagos: setSelectOptions(tiposPagos, 'tipo'),
    //             tiposImpuestos: setSelectOptions(tiposImpuestos, 'tipo'),
    //             estatusCompras: setSelectOptions(estatusCompras, 'estatus'),
    //             formasPago: setOptionsWithLabel(formasPago, 'nombre', 'id'),
    //             metodosPago: setOptionsWithLabel(metodosPago, 'nombre', 'id'),
    //             estatusFacturas: setOptionsWithLabel(estatusFacturas, 'estatus', 'id'),
    //             allCuentas: setOptionsWithLabel(cuentas, 'nombre', 'id'),
    //         });

    //         Swal.close();
    //     } catch (error) {
    //         printResponseErrorAlert(error);
    //     }
    // }

    async function abrirModalVer(id) {
        waitAlert();
        try {
            const response = await apiGet(`v2/proyectos/compras/${id}`, props.authUser.access_token);
            setCompra(response.data.compra);
            setModal((prev) => ({ ...prev, see: true }));
            Swal.close();
        } catch (error) {
            printResponseErrorAlert(error);
        }
    }

    function cerrarModal() {
        setModal({
            facturas: false,
            see: false,
            facturaExtranjera: false,
            adjuntos: false,
            filters: false,
        });
        setCompra(null);
    }

    function recargarTabla(filters) {
        const aux = Object.keys(filters).reduce((acc, key) => {
            if (['area', 'proveedor', 'cuenta', 'empresa', 'estatusCompra', 'proyecto', 'subarea', 'factura'].includes(key)) {
                acc[key] = {
                    value: filters[key]?.value,
                    name: filters[key]?.name,
                };
            } else {
                acc[key] = filters[key];
            }
            return acc;
        }, {});

        $('#compras').DataTable().search(JSON.stringify(aux)).draw();
    }

    return (
        <Layout active="Compras" {...props}>
            <ComprasTable />
            <Modal size="lg" title="Compra" show={modal.see} handleClose={cerrarModal}>
                <ComprasCard compra={compra} comprasProyectos={props.comprasProyectos} />
            </Modal>
        </Layout>
    );
}

function mapStateToProps(state) {
    return {
        authUser: state.authUser,
        comprasProyectos: state.opciones.compras,
    };
}

export default connect(mapStateToProps)(Compras);
