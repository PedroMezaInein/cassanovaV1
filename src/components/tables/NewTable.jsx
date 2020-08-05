import React, { Component } from 'react';
import '../../styles/custom_datatable.css'
import '../../styles/metronic/_datables.scss';

const $ = require('jquery');
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
            });
            if (aux !== '')
                actions[name].function(aux)
        });
    }

    componentDidMount() {
        const { data, mostrar_acciones, elementClass, totales, validateFactura} = this.props
        global_variable["mostrar_acciones"] = mostrar_acciones;
        var header = this.props.columns;
        var columns = [];
        var i = 0;

        let aux = [];

        for (i = 0; i < header.length; i++) {
            var titulo = new Object();
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
                var html_append;
                var html;
                var contador = 0;
                table.find("thead th").each(function () {
                    var title = $(this).text();
                    let cellIndex = $(this)[0].cellIndex
                    let total = header[cellIndex].total
                    let clase = header[cellIndex].class
                    cellIndex = header[cellIndex].accessor
                    
                    if (global_variable.mostrar_acciones == false || global_variable.mostrar_acciones && contador != 0) {
                        if(clase){
                            $(this).append(`<div class="mt-2 separator separator-dashed separator-border-2 ${clase}"></div><div class="mt-2"><input type="text" id=${cellIndex} class="form-control form-control-sm"/></div>`);
                        }else
                            $(this).append('<div class="mt-2 separator separator-dashed separator-border-2"></div><div class="mt-2"><input type="text" id=' + cellIndex + ' class="form-control form-control-sm"/></div>');
                        if(total)
                        {
                            $(this).append('<div class="mt-2 text-primary bg-primary-o-40 font-weight-boldest">'+totales[total]+'</div>');
                        }else{
                            // $(this).append('<div class="mt-2 text-white  font-weight-boldest">.</div');
                        }

                    }
                    contador++;


                    //  html+='<th style="'+$(this).attr("style").toString()+'"><input class="form-control form-control-sm form-filter datatable-input" type="text"/></th>';
                });

                //table.find("thead").append('<tr class="filter">'+html+'</tr>');
                // Apply the search
                this.api().columns().every(function () {
                    var that = this;
                    $('input', this.header()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw();
                        }
                    });
                })
            },

            colReorder: true,
            responsive: true,
            data: data,
            columns,
            createdRow: function(row, data) {
                if(validateFactura){
                    const { objeto } = data
                    if(objeto.factura && objeto.total === objeto.total_facturas){
                        $(row).addClass('verde');
                    }
                }
                if (elementClass) {
                    let auxiliar = data[elementClass].split('<!-- -->')
                    if(auxiliar.length > 1){
                        if (auxiliar[1] === '$0.00')
                            $(row).addClass('rojo');
                        else {
                            let auxiliar2 = auxiliar[1].charAt(0)
                            if (auxiliar2 === '-')
                                $(row).addClass('rojo');
                        }
                    }
                    else {
                        let auxiliar = data[elementClass].includes('Inactivo')
                        if (auxiliar)
                            $(row).addClass('gris');
                    }
                }
            },
            // DOM Layout settings
            dom:
                `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i>
                <'col-sm-12 col-md-7 flex-column-reverse flex-md-row dataTables_pager'lp>
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
                'orderable': false,
                render: function (data, type, row, meta) {
                    if (global_variable.mostrar_acciones == true) {
                        let aux = ''
                        {
                            data.map((element) => {
                                aux = aux +
                                    `<button name=${element.action}  id = ${row.id} class="ml-2 btn btn-actions-table btn-xs btn-icon btn-text-${element.btnclass} btn-hover-${element.btnclass}" title=${element.text}><i class=${element.iconclass}></i></button>`
                            })
                        }
                        return (
                            '<div>' + aux + '</div>'
                        )
                    }
                    else {
                        return (`<div>${data}</div>`)
                    }
                }
                /* 'defaultContent': '<button type="button" class="btn btn-primary btn-edit">Edit</button>' */
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
            /* var id = $(this).attr('id').toString()
            var name =$(this).attr('name').toString() 
            let aux = elements.find(function(element, index) { 
                if(element.id.toString() === id){
                    return element    
                }
            }); 
            actions[name].function(aux) */
        });

    }

    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
    }
    shouldComponentUpdate(nextProps) {
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

        const { columns, data, title, subtitle, url, mostrar_boton, abrir_modal, exportar_boton } = this.props

        return (
            <>
                <div className="card card-custom">
                    <div className="card-header flex-wrap border-0 pt-6 pb-0">
                        <div className="card-title">
                            <h2 className="card-label font-weight-bolder font-size-h2">
                                {
                                    title ? title : ''
                                }
                                <span className="d-block text-muted pt-2 font-size-sm">
                                    {
                                        subtitle ? subtitle : ''
                                    }
                                </span>
                            </h2>
                        </div>
                        <div className="card-toolbar">
                            {(exportar_boton == true) ?
                                <button onClick={() => this.clickHandlerExport()} className="btn btn-primary font-weight-bold mr-2">
                                    <i className="far fa-file-excel"></i> Exportar
                                </button>
                                :
                                ""
                            }
                            {
                                (mostrar_boton == true) ?
                                    (abrir_modal == true) ?
                                        <button onClick={() => this.clickHandler()} className="btn btn-success font-weight-bold mr-2">
                                            <i className="flaticon-add"></i> Agregar
                                        </button>
                                        :
                                        <a href={url} className="btn btn-success font-weight-bold mr-2">
                                            <i className="flaticon-add"></i> Agregar
                                        </a>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    <div className="separator separator-solid mt-3"></div>
                    <div className="card-body">
                        <table ref="main" className="table table-responsive-md table-separate table-head-custom table-checkable display table-hover text-justify" id={this.props.idTable ? this.props.idTable : "kt_datatable2"} />
                    </div>
                </div>
            </>
        )
    }
}
export default NewTable