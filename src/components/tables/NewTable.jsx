import React, { Component } from 'react';
import '../../styles/plugins.bundle.css';
import '../../styles/style.bundle.css';
import '../../styles/datables.css';
/*import {

    AdvanceTablesWidget2,
    AdvanceTablesWidget4

} from "../../_metronic/_partials/widgets";
*/

import  COMPRAS_COLUMNS  from '../../constants';
 

const $ = require('jquery');
$.DataTable = require('datatables.net');
require("datatables.net-responsive");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");

/*const columns = [
    { title: "Name" },
    { title: "Position" },
    { title: "Office" },
    { title: "Extn." },
    { title: "Start date" },
    { title: "Salary" }
];
*/

class NewTable extends Component {
    componentDidMount() {
        var header =this.props.headers;
        var data = this.props.data;
        var columns = [];
        var i=0;

        for (i = 0; i < header.length; i++) {
           var titulo = new Object();
            titulo["title"] = header[i]; 
            columns[i] = titulo;
            ;

        }

       console.log(columns);

        var table = $(this.refs.main);
        /*
        table.DataTable({ 
           data: dataSet,
           columns,
           ordering: true,
           responsive:true
        });
        */
      
       
        // begin first table
        table.DataTable({ 
            
            
            initComplete: function () {
                table.find("thead th").each( function () {
                    console.log("a");
                    var title = $(this).text();
                    $(this).append('<br/><input class="form-control form-control-sm form-filter datatable-input" type="text" placeholder=""/>' );
                } );
                // Apply the search
                this.api().columns().every( function () {
                    var that = this;
     
                    $( 'input', this.header() ).on( 'keyup change clear', function () {
                        if ( that.search() !== this.value ) {
                            that
                                .search( this.value )
                                .draw();
                        }
                    } );
                } );
            },
            
            colReorder: true,        
            responsive: true,
            data: data,
            columns,
            // DOM Layout settings
            dom: 
            `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i>
                <'col-sm-12 col-md-7 dataTables_pager'lp>
            >`,

            lengthMenu:	[[5, 10, 20, 25, 50, -1], [5, 10, 20, 25, 50, "Todos"]],
            pageLength: 5,

            language: {
                "sProcessing":    "Procesando...",
                "sLengthMenu":    "Mostrar _MENU_ registros",
                "sZeroRecords":   "No se encontraron resultados",
                "sEmptyTable":    "Ningún dato disponible en esta tabla",
                "sInfo":          "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":     "Registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":   "",
                "sSearch":        "Buscar:",
                "sUrl":           "",
                "sInfoThousands":  ",",
                "sLoadingRecords":"Cargando...",
                "oPaginate": {
                    "sFirst":"Primero",
                    "sLast":"Último",
                    "sNext":"Siguiente",
                    "sPrevious":"Anterior"
                }
            },
            
        });
    }
    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {

        const { headers, data } = this.props;
        
        return (
        <>
        
        <div className="d-flex flex-column-fluid">        
            <div className="container">
                <div className="card card-custom">
                    <div className="card-header flex-wrap border-0 pt-6 pb-0">
                        <div className="card-title">
                            <h3 className="card-label font-weight-bolder">
                                Facturas
                            <span className="d-block text-muted pt-2 font-size-sm">Listado de facturas</span>
                            </h3>
                        </div>
                        <div className="card-toolbar">
                            {/* begin::Dropdown */}
                            <div className="dropdown dropdown-inline mr-2">
                                 <button type="button" className="btn btn-light-primary font-weight-bolder dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="svg-icon svg-icon-md">
                                    {/* begin::Svg Icon | path:assets/media/svg/icons/Design/PenAndRuller.svg */}
									<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
										<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <rect x="0" y="0" width="24" height="24" />
                                            <path d="M3,16 L5,16 C5.55228475,16 6,15.5522847 6,15 C6,14.4477153 5.55228475,14 5,14 L3,14 L3,12 L5,12 C5.55228475,12 6,11.5522847 6,11 C6,10.4477153 5.55228475,10 5,10 L3,10 L3,8 L5,8 C5.55228475,8 6,7.55228475 6,7 C6,6.44771525 5.55228475,6 5,6 L3,6 L3,4 C3,3.44771525 3.44771525,3 4,3 L10,3 C10.5522847,3 11,3.44771525 11,4 L11,19 C11,19.5522847 10.5522847,20 10,20 L4,20 C3.44771525,20 3,19.5522847 3,19 L3,16 Z" fill="#000000" opacity="0.3" />
                                            <path d="M16,3 L19,3 C20.1045695,3 21,3.8954305 21,5 L21,15.2485298 C21,15.7329761 20.8241635,16.200956 20.5051534,16.565539 L17.8762883,19.5699562 C17.6944473,19.7777745 17.378566,19.7988332 17.1707477,19.6169922 C17.1540423,19.602375 17.1383289,19.5866616 17.1237117,19.5699562 L14.4948466,16.565539 C14.1758365,16.200956 14,15.7329761 14,15.2485298 L14,5 C14,3.8954305 14.8954305,3 16,3 Z" fill="#000000" />
                                        </g>
									</svg>
                                    {/*end::Svg Icon*/}
								</span>Exportar</button>
                                {/*begin::Dropdown Menu*/}
							    <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                    {/*begin::Navigation*/}
									<ul className="navi flex-column navi-hover py-2">
                                        <li className="navi-header font-weight-bolder text-uppercase font-size-sm text-primary pb-2">Choose an option:</li>
                                        <li className="navi-item">
                                            <a href="#" className="navi-link">
                                                <span className="navi-icon">
                                                    <i className="la la-print"></i>
                                                </span>
                                                <span className="navi-text">Imprimir</span>
                                            </a>
                                        </li>
                                        <li className="navi-item">
                                            <a href="#" className="navi-link">
                                                <span className="navi-icon">
                                                    <i className="la la-copy"></i>
                                                </span>
                                                <span className="navi-text">Copiar</span>
                                            </a>
                                        </li>
                                        <li className="navi-item">
                                            <a href="#" className="navi-link">
                                                <span className="navi-icon">
                                                    <i className="la la-file-excel-o"></i>
                                                </span>
                                                <span className="navi-text">Excel</span>
                                            </a>
                                        </li>
                                        <li className="navi-item">
                                            <a href="#" className="navi-link">
                                                <span className="navi-icon">
                                                    <i className="la la-file-text-o"></i>
                                                </span>
                                                <span className="navi-text">CSV</span>
                                            </a>
                                        </li>
                                        <li className="navi-item">
                                            <a href="#" className="navi-link">
                                                <span className="navi-icon">
                                                    <i className="la la-file-pdf-o"></i>
                                                </span>
                                                <span className="navi-text">PDF</span>
                                            </a>
                                        </li>
                                    </ul>
                                    {/*end::Navigation*/}
                                </div>
                                {/*end::Dropdown Menu*/}
                            </div>
                            {/*end::Dropdown*/}
                            {/*begin::Button*/}
                            <a href="#" className="btn btn-primary font-weight-bolder">
							<span className="svg-icon svg-icon-md">
								{/*begin::Svg Icon | path:assets/media/svg/icons/Design/Flatten.svg*/}
								<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
									<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
										<rect x="0" y="0" width="24" height="24" />
										<circle fill="#000000" cx="9" cy="15" r="6" />
										<path d="M8.8012943,7.00241953 C9.83837775,5.20768121 11.7781543,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,12.2218457 18.7923188,14.1616223 16.9975805,15.1987057 C16.9991904,15.1326658 17,15.0664274 17,15 C17,10.581722 13.418278,7 9,7 C8.93357256,7 8.86733422,7.00080962 8.8012943,7.00241953 Z" fill="#000000" opacity="0.3" />
									</g>
								</svg>
								{/*end::Svg Icon*/}
							</span>Enviar</a>
                        {/*end::Button*/}   
                    </div>
                </div>
                <div className="card-body">
                    {/*table table-separate table-head-custom table-checkable display responsive dt-responsive table table-striped"*/}
                    {/*begin: Datatable*/}
                    <table ref="main" className="table table-separate table-head-custom table-checkable table-striped display responsive dt-responsive" id="kt_datatable2" />
                    {/*<table    >
                        <tr>
                            {
                                headers.map((element, key) => {
                                    return (
                                        <th>
                                            {
                                                element
                                            }
                                        </th>
                                    )
                                })
                            }
                        </tr>
                        {
                            data.map((element, key) => {
                                return (
                                    <tr>
                                        {
                                            element.map((elemento) => {
                                                return (
                                                    <td>
                                                        {elemento}
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </table>*/}
                    {/*end: Datatable*/}
                </div>
            </div>   
        </div>
    </div> 
        </>
        )
    }
}

export default NewTable