import React, { Component } from 'react';
import '../../styles/custom_datatable.css'
import '../../styles/metronic/_datables.scss';
import { Card } from 'react-bootstrap'
import $ from "jquery";
$.DataTable = require('datatables.net');
require("datatables.net-responsive-bs4");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-select");
require("datatables.net-fixedheader");
const global_variable = {}
class NewTable extends Component {

    reloadTableData(props) {
        const { data, actions, elements } = props
        var table = $(this.refs.main)
            .DataTable();
        table.clear();
        table.rows.add(data).draw();

        table.draw();

        $(this.refs.main).on('click', '.btn-actions-table', function (e) {
            e.preventDefault();
            var id = $(this).attr('id').toString()
            var name = $(this).attr('name').toString()
            let aux = ''
            elements.find(function (element, index) {
                if (element.id.toString() === id) {
                    aux = element
                }
                return false
            });
            if (aux !== '')
                actions[name].function(aux)
        });
    }

    reloadHeader(){
        const {cardTable, cardTableHeader, cardBody, isTab} = this.props
        $("body").addClass("card-sticky-on").css("overflow-y","scroll")  
        
        let tableWidth = $("#"+cardTable).width() 
        $("#"+cardTableHeader).css("width",tableWidth).css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)").css("z-index",3)
        let headerHeidht = $("#"+cardTableHeader).height() 
        $("#"+cardBody).css("margin-top",headerHeidht)  
        $("#"+cardTable).on('resize',function(){ 
        })
        $( window ).resize(function() { 
            tableWidth = $("#"+cardTable).width()
            $("#"+cardTableHeader).css("width",tableWidth) 
        }) 
        $( window ).on('scroll',function(){ 
            var pos = $(this).scrollTop(); 
            if (pos === 0) {
                $("#"+cardTableHeader).css("margin-top","0px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
            }
            else
            {   
                if(isTab){ 
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 68 : 96
                    if(pos<limite)
                    {
                        $("#"+cardTableHeader).css("margin-top","-"+pos+"px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else{
                        $("#"+cardTableHeader).css("margin-top","-"+limite+"px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                }else{
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 25 : 58 
                    if(pos<limite)
                    {
                        $("#"+cardTableHeader).css("margin-top","-"+pos+"px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else{
                        $("#"+cardTableHeader).css("margin-top","-"+limite+"px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                }
            }
        });
    }

    componentDidMount() {
        const { data, mostrar_acciones, totales, tipo_validacion, elements, actions } = this.props
        global_variable["mostrar_acciones"] = mostrar_acciones;

        this.reloadHeader()
        var header = this.props.columns;
        var columns = [];
        var i = 0;

        let aux = [];

        for (i = 0; i < header.length; i++) {
            var titulo = {}
            titulo["title"] = header[i].Header;
            titulo["data"] = header[i].accessor;
            titulo["class"] = header[i].class;
            columns[i] = titulo;
            if (aux > 0)
                aux.push(i)
        }
        var table = $(this.refs.main);
        table.DataTable({

            initComplete: function () {
                // var html_append;
                // var html;
                var contador = 0;
                table.find("thead th").each(function () {
                    // var title = $(this).text();
                    let cellIndex = $(this)[0].cellIndex
                    let total = header[cellIndex].total
                    let clase = header[cellIndex].class
                    cellIndex = header[cellIndex].accessor
                    
                    if (global_variable.mostrar_acciones === false || (global_variable.mostrar_acciones && contador !== 0)) {
                        if(clase){
                            $(this).append(`<div class="mt-2 separator separator-dashed separator-border-2 ${clase}"></div><div class="mt-2"><input type="text" id=${cellIndex} class="form-control form-control-sm"/></div>`);
                        }else
                            $(this).append('<div class="mt-2 separator separator-dashed separator-border-2"></div><div class="mt-2"><input type="text" id=' + cellIndex + ' class="form-control form-control-sm"/></div>');
                        if(total)
                        {
                            $(this).append('<div class="mt-2 text-primary bg-primary-o-40 font-weight-boldest">'+totales[total]+'</div>');
                        }

                    }
                    contador++;
                });

                this.api().columns().every(function () {
                    var that = this;
                    $('input', this.header()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                    return false
                })
            },

            colReorder: true,
            responsive: true,
            data: data,
            columns,
            createdRow: function(row, data) {
                const { objeto } = data 
                if(tipo_validacion){                    
                    switch (tipo_validacion) {
                        case 'compras':
                            if (objeto.factura) {
                                if (objeto.total_facturas - objeto.monto >1) {
                                    $(row).addClass('verde');
                                } else if (objeto.total_facturas - objeto.monto >= -1 && objeto.total_facturas - objeto.monto <= -1) {
                                    $(row).addClass('blanco');
                                } else if (objeto.total_facturas - objeto.monto <-1 ) {
                                    $(row).addClass('rojo');
                                }
                            } else {
                                $(row).addClass('blanco');
                            }
                            break;
                        case 'ventas':
                            if (objeto.factura) {
                                if (objeto.total_facturas - objeto.monto >1) {
                                    $(row).addClass('rojo');
                                } else if (objeto.total_facturas - objeto.monto >= -1 && objeto.total_facturas - objeto.monto <= -1) {
                                    $(row).addClass('blanco');
                                } else if (objeto.total_facturas - objeto.monto <-1 ) {
                                    $(row).addClass('verde');
                                }
                            } else {
                                $(row).addClass('blanco');
                            }
                            break;
                        case 'facturas':
                            /* let restante = objeto.total - objeto.ventas_count - objeto.ingresos_count
                            if(restante <= 1){
                                $(row).addClass('blanco');
                            }else{
                                $(row).addClass('rojo');
                            } */
                            break;
                        default:
                            break
                    }
                }
            },
            dom:
                `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-7'i>
                <'col-sm-12 col-md-5 flex-column-reverse flex-md-row dataTables_pager'lp>
            >`,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ &nbsp;registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": 'Cargando... <div class="spinner spinner-primary mr-10"></div>',
                "oPaginate": {
                    "sFirst": '<i class=" ki ki-bold-arrow-back"></i>',
                    "sLast": '<i class="ki ki-bold-double-arrow-next"></i>',
                    "sNext": '<i class="ki ki-bold-arrow-next"></i>',
                    "sPrevious": '<i id=sPrevious class=" ki ki-bold-arrow-back"></i>'
                }
            },

            columnDefs: [{
                "targets": aux,
                render: function (data, type, row, meta) {
                    return (`<div>${data}</div>`)
                }
            },
            {
                'targets': [0],
                'data': null,
                'searchable': mostrar_acciones ? false : true,
                'orderable': global_variable.mostrar_acciones === true ? false : true,
                render: function (data, type, row, meta) {
                    if (global_variable.mostrar_acciones === true) {
                        let aux = ''
                            data.map((element) => {
                                aux = aux +
                                    `<button name=${element.action}  id = ${row.id} class="ml-2 btn btn-actions-table btn-xs btn-icon btn-text-${element.btnclass} btn-hover-${element.btnclass}" title=${element.text}><i class=${element.iconclass}></i></button>`
                                    return false
                            })
                        return (
                            '<div>' + aux + '</div>'
                        )
                    }
                    else {
                        return (`<div>${data}</div>`)
                    }   
                }
            }
            ],
            lengthMenu: [[20, 30, 40, 50, -1], [20, 30, 40, 50, "Todos"]],
            pageLength: 20
        });
        table.on('responsive-resize.dt', function (e, datatable, columns) {
            for (var i in columns) {
                var index = parseInt(i, 10) + 1;
                table.find('th:nth-child(' + index + ')').toggle(columns[i]);
            }
        });

        $(this.refs.main).on('click', '.btn-actions-table', function (e) {
            e.preventDefault();
            var id = $(this).attr('id').toString()
            var name = $(this).attr('name').toString()
            let aux = ''
            elements.find(function (element, index) {
                if (element.id.toString() === id) {
                    aux = element
                }
                return false
            });
            if (aux !== '')
                actions[name].function(aux)
        });

    }

    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
    }

    shouldComponentUpdate(nextProps) {
        if(this.props.aux)
            this.reloadHeader()
        if (nextProps.data !== this.props.data) {
            this.reloadTableData(nextProps)
        }
        return false;
    }

    clickHandler = (e) => {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    clickHandlerExport = (e) => {
        if (typeof this.props.onClickExport === 'function') {
            this.props.onClickExport();
        }
    }

    render() {

        const { title, subtitle, url, mostrar_boton, abrir_modal, exportar_boton, cardTable, cardTableHeader, cardBody} = this.props

        return (
            <>
                <Card id={cardTable} className="card-custom card-sticky">
                    <Card.Header id={cardTableHeader}>
                        <div className="card-title">
                            <h3 className="card-label font-weight-bolder font-size-h3">
                                {
                                    title ? title : ''
                                }
                                {
                                    subtitle ?
                                        <span className="d-block text-muted pt-2 font-size-sm">
                                            {subtitle}
                                        </span>
                                    : ''
                                }
                            </h3>
                        </div>
                        <div className="card-toolbar">
                            {(exportar_boton === true) ?
                                <button onClick={() => this.clickHandlerExport()} className="btn btn-primary font-weight-bold mr-2">
                                    <i className="far fa-file-excel"></i> EXPORTAR
                                </button>
                                :
                                ""
                            }
                            {
                                (mostrar_boton === true) ?
                                    (abrir_modal === true) ?
                                        <button onClick={() => this.clickHandler()} className="btn btn-success font-weight-bold mr-2">
                                            <i className="flaticon-add"></i> AGREGAR
                                        </button>
                                        :
                                        <a href={url} className="btn btn-success font-weight-bold mr-2">
                                            <i className="flaticon-add"></i> AGREGAR
                                        </a>
                                    :
                                    ""
                            }
                        </div>
                    </Card.Header>
                    <Card.Body id={cardBody} className="pt-0">
                        <table ref="main"  style={{width:"100%"}} className="table table-responsive-md table-separate table-head-custom table-checkable display table-hover text-justify collapsed dataTable dtr-inline" id={this.props.idTable ? this.props.idTable : "kt_datatable2"} />
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default NewTable
