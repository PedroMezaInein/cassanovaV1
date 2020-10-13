import React, { Component } from 'react';
import '../../styles/custom_datatable.css'
import '../../styles/metronic/_datables.scss';
import { errorAlert } from '../../functions/alert'
import { Card, Spinner } from 'react-bootstrap'
import { renderToString } from 'react-dom/server';

const $ = require('jquery');
$.DataTable = require('datatables.net');
require("datatables.net-responsive-bs4");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-fixedheader");
const global_variable = {}

function runAjax(settings, accessToken, request, setter, url) {
    var deferred = new $.Deferred();
    /* waitAlert() */
    $.ajax({
        data: request,
        url: url,
        dataType: "json",
        type: "GET",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        success: function (response) {
            /* swal.close() */
            deferred.resolve({ data: setter(response.data), draw: response.draw, recordsTotal: response.recordsTotal, recordsFiltered: response.recordsFiltered, elements: response.data });
        },
        error: function (error) {
            console.log(error, 'error')
            errorAlert(error.responseJSON.message !== undefined ? error.responseJSON.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            deferred.fail(error);
        }
    });
    return deferred.promise();
}
class NewTableServerRender extends Component {

    state = {
        newElements: []
    }

    componentDidUpdate(){
        const {cardTable, cardTableHeader, cardBody, isTab} = this.props
        $("body").addClass("card-sticky-on")
                .css("overflow-y","scroll")  
        
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
        const { actions, mostrar_acciones, elementClass, accessToken, setter, urlRender, tipo_validacion, cardTable, 
            cardTableHeader, cardBody, isTab, checkbox } = this.props
        global_variable["mostrar_acciones"] = mostrar_acciones;

        $("body").addClass("card-sticky-on")
                .css("overflow-y","scroll")  
        
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
        var header = this.props.columns;
        var columns = [];
        var i = 0;

        let aux = [];

        let _that = this
        for (i = 0; i < header.length; i++) {
            var titulo = {}
            titulo["title"] = header[i].Header;
            titulo["data"] = header[i].accessor;
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
                    let cellIndex = $(this)[0].cellIndex
                    cellIndex = header[cellIndex].accessor
                    if (global_variable.mostrar_acciones === false || (global_variable.mostrar_acciones && contador !== 0))
                        $(this).append('<div class="mt-2 separator separator-dashed separator-border-2"></div><div class="mt-2"><input type="text" id=' + cellIndex + ' class="form-control form-control-sm"/></div>');
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
                });
            },

            colReorder: true,
            responsive: true,
            processing: true,
            serverSide: true,
            ajax: function (request, drawCallback, settings) {
                runAjax(settings, accessToken, request, setter, urlRender).done(function (response) {
                    _that.setState({
                        ..._that.state,
                        newElements: response.elements
                    })
                    drawCallback(response);
                });
            },
            columns,
            createdRow: function (row, data) {
                if (tipo_validacion) {
                    const { objeto } = data
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
                        default:
                            break
                    }
                }
                if (elementClass) {
                    let auxiliar = data[elementClass].split('<!-- -->')
                    if (auxiliar.length > 1) {
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
            dom:
                `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i>
                <'col-sm-12 col-md-7 flex-column-reverse flex-md-row dataTables_pager'lp>
            >`,
            language: {
                "sProcessing": renderToString(
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="position-fixed p-5">
                            <div className="">
                                <Spinner animation="border" variant="primary" size = "lg" as ="span"/>
                            </div>
                        </div>
                    </div>),
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
                    if (global_variable.mostrar_acciones === true) {
                        let aux = ''
                        data.map((element) => {
                            aux = aux + `<button name=${element.action}  id = ${row.id} class="ml-2 btn btn-actions-table btn-xs btn-icon btn-text-${element.btnclass} btn-hover-${element.btnclass}" title=${element.text}><i class=${element.iconclass}></i></button>`
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
            pageLength: 20,
            select: checkbox ? {style: 'multi'} : false

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
            _that.state.newElements.find(function (element, index) {
                if (element.id.toString() === id) {
                    aux = element
                }
                return false
            });
            actions[name].function(aux)
        });

    }

    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
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

        const { title, subtitle, url, mostrar_boton, abrir_modal, exportar_boton, cardTable,cardTableHeader,cardBody } = this.props
        return (
            <>
                <Card  id={cardTable} className="card-custom card-sticky">
                    <Card.Header id={cardTableHeader}>
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
                            {(exportar_boton === true) ?
                                <button onClick={() => this.clickHandlerExport()} className="btn btn-primary font-weight-bold mr-2">
                                    <i className="far fa-file-excel"></i> Exportar
                                    </button>
                                :
                                ""
                            }
                            {
                                (mostrar_boton === true) ?
                                    (abrir_modal === true) ?
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
                    </Card.Header>

                    <Card.Body id={cardBody} className="pt-0">
                        <table ref={'main'} className="table table-responsive-md table-separate table-head-custom table-checkable display table-hover text-justify" id={this.props.idTable ? this.props.idTable : "kt_datatable2"} />
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default NewTableServerRender