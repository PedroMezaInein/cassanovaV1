import React, { Component } from 'react';
import '../../styles/custom_datatable.css'
import '../../styles/metronic/_datables.scss';
import { errorAlert } from '../../functions/alert'
import { Card, Dropdown, DropdownButton, OverlayTrigger  } from 'react-bootstrap'
import { renderToString } from 'react-dom/server';
import Tooltip from 'react-bootstrap/Tooltip'
import ReactDOM from 'react-dom'
const $ = require('jquery');
const global_variable = {}
$.DataTable = require('datatables.net');
require("datatables.net-responsive-bs4");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-fixedheader");

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
            if(error.status === 401){
                errorAlert('Usuario sin autentificar')
                window.location.href = '/'
            }
            else
                errorAlert(error.responseJSON.message !== undefined ? error.responseJSON.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            deferred.fail(error);
        }
    });
    return deferred.promise();
}

class TableButton extends Component{
    render(){
        const { cellData, row, actions, elementos } = this.props
        let valor = elementos[row]
        if(cellData.length > 2)
            return(
                <div className="w-100 d-flex justify-content-center">
                    <DropdownButton menualign = "right" title = { <i className="fas fa-chevron-circle-down icon-md p-0 "></i> } id = 'dropdown-button-newtable' >
                        {
                            cellData.map((element, key) => {
                                if(actions[element.action]){
                                    let funcion = actions[element.action].function
                                    return(
                                        <Dropdown.Item key = { key } className = {`text-hover-${element.btnclass} dropdown-${element.btnclass}`}
                                            onClick = { (e) => { e.preventDefault(); funcion(valor)}} key = {key}>
                                            <span className="navi-icon">
                                                <i className = {`fas ${element.iconclass} mr-2`} />
                                                <span className="navi-text">
                                                    {
                                                        element.tooltip ? 
                                                            element.tooltip.text.replace(new RegExp('&nbsp;', 'g'), ' ') 
                                                        : element.text.replace(new RegExp('&nbsp;', 'g'), ' ')
                                                    }
                                                </span>
                                            </span>
                                        </Dropdown.Item>
                                    )
                                }
                                return ''
                            })
                        }
                    </DropdownButton>
                </div>
                
            )
        else
            return(
                <div className="w-100 d-flex justify-content-center">
                    {
                        cellData.map((element, key) => {
                            if(actions[element.action]){
                                let funcion = actions[element.action].function
                                return(
                                    <button key = { key } className = {`btn btn-icon btn-actions-table btn-xs ml-2 btn-text-${element.btnclass} btn-hover-${element.btnclass}`} 
                                        onClick = { (e) => {e.preventDefault(); funcion(valor)}} >
                                        <i className={`fas ${element.iconclass}`} />
                                    </button>
                                )
                            }
                            return ''
                        })
                    }
                    
                </div>
            )
    }
}

class NewTableServerRender extends Component {

    state = { newElements: [] }

    componentDidUpdate(prevProps) {
        if(prevProps.flag !== this.props.flag){
            var table = $(this.refs.main)
            table.DataTable().clear().draw();
        }
        const { cardTable, cardTableHeader, cardBody, isTab, isNav} = this.props
        $("body").addClass("card-sticky-on")

        let tableWidth = $("#" + cardTable).width()
        $("#" + cardTableHeader).css("width", tableWidth).css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)").css("z-index", 3)
        let headerHeidht = $("#" + cardTableHeader).height()
        $("#" + cardBody).css("margin-top", headerHeidht)
        $("#" + cardTable).on('resize', function () {
        })
        $(window).resize(function () {
            tableWidth = $("#" + cardTable).width()
            $("#" + cardTableHeader).css("width", tableWidth)
        })
        $(window).on('scroll', function () {
            var pos = $(this).scrollTop();
            if (pos === 0) {
                $("#" + cardTableHeader).css("margin-top", "0px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
            }
            else {
                if (isTab) {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 68 : 96
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                } else if (isNav) {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 95 : 208
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                } else {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 25 : 58
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                }
            }
        });
    }
    componentDidMount() {

        $.event.special.touchstart = {
            setup: function( _, ns, handle ){
                if ( ns.includes("noPreventDefault") ) {
                    this.addEventListener("touchstart", handle, { passive: false });
                    } else {
                        this.addEventListener("touchstart", handle, { passive: true });
                    }
                }
            };
        $.event.special.touchmove = {
            setup: function( _, ns, handle ){
                if ( ns.includes("noPreventDefault") ) {
                    this.addEventListener("touchmove", handle, { passive: false });
                } else {
                    this.addEventListener("touchmove", handle, { passive: true });
                }
            }
        };
        const { actions, mostrar_acciones, elementClass, accessToken, setter, urlRender, tipo_validacion, cardTable,
            cardTableHeader, cardBody, isTab, checkbox, isNav, idTable, columns: columnasHeader } = this.props
        global_variable["mostrar_acciones"] = mostrar_acciones;

        let noOrdereableHeaders = []
        
        let w = 0;
        columnasHeader.forEach(element => {
            if(element.orderable === false)
                noOrdereableHeaders.push(w)
            w++;
        })

        $("body").addClass("card-sticky-on")

        let tableWidth = $("#" + cardTable).width()
        $("#" + cardTableHeader).css("width", tableWidth).css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)").css("z-index", 3)
        let headerHeidht = $("#" + cardTableHeader).height()
        $("#" + cardBody).css("margin-top", headerHeidht)
        $("#" + cardTable).on('resize', function () {
        })
        $(window).resize(function () {
            tableWidth = $("#" + cardTable).width()
            $("#" + cardTableHeader).css("width", tableWidth)
        })
        $(window).on('scroll', function () {
            var pos = $(this).scrollTop();
            if (pos === 0) {
                $("#" + cardTableHeader).css("margin-top", "0px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
            }
            else {
                if (isTab) {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 68 : 96
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                }else if (isNav) {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 95 : 208
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                } else {
                    let pantalla = $(this).width()
                    let limite = pantalla > 992 ? 25 : 58
                    if (pos < limite) {
                        $("#" + cardTableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                    }
                    else {
                        $("#" + cardTableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                    }
                }
            }
        });
        var header = this.props.columns;
        var columns = [];
        var i = 0;

        let aux = [];

        let _that = this
        let renderedHeader = []
        for (i = 0; i < header.length; i++) {
            var titulo = {}
            titulo["title"] = header[i].Header;
            titulo["data"] = header[i].accessor;
            columns[i] = titulo;
            if (aux > 0)
                aux.push(i)
            if(header[i].customRender === true)
                renderedHeader.push(i)
        }
        var table = $(this.refs.main);
        table.DataTable({

            initComplete: function () {
                // var html_append;
                // var html;
                tableWidth = $("#" + cardTable).width()
                $("#" + cardTableHeader).css("width", tableWidth)
                var contador = 0;
                table.find("thead th").each(function () {
                    let cellIndex = $(this)[0].cellIndex
                    cellIndex = header[cellIndex].accessor
                    if (global_variable.mostrar_acciones === false || (global_variable.mostrar_acciones && contador !== 0)){
                        if(columnasHeader[contador]['searchable'] !== false)
                            $(this).append('<div class="mt-2 separator separator-dashed separator-border-2"></div><div class="mt-2"><input type="text" id=' + cellIndex + '-' + idTable + ' class="form-control form-control-sm"/></div>');
                    }
                    contador++;
                });
                this.api().columns().every(function () {
                    var that = this;
                    $('input', this.header()).on('blur', function () {
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
            responsive: {
                details: {
                    renderer: function(api, rowIdx, columns){ 
                        let arregloRendered = []
                        /* var hiddenCount = 0 */
                        var data = $.map( columns, function ( col, i ) {
                            if(col.hidden){
                                /* hiddenCount++; */
                                if(renderedHeader.includes(i)){
                                    // console.log(col,'col')
                                    let valorCelda = ''
                                    let data_children= col.data.props.children
                                    if(data_children){
                                        if(data_children.props){
                                            if(data_children.props.children){
                                                //Input
                                                valorCelda = data_children.props.children[1]
                                                // console.log(valorCelda,'Input')
                                            }else if(data_children.props.value){
                                                // Input costo
                                                valorCelda = data_children.props.value
                                                // console.log(valorCelda,'Costo')
                                            }
                                        }else /* if(data_children[1].props.children.props.children) */{
                                            // console.log(data_children)
                                            if(data_children !== 'Sin definir'){
                                                // if(data_children.length === 1){
                                                //     if(data_children[0].props.children.props.children)
                                                //         valorCelda = data_children[0].props.children.props.children
                                                // }else{
                                                //     if(data_children[1].props.children.props.children)
                                                //         valorCelda = data_children[1].props.children.props.children
                                                // }
                                            }
                                            //Fecha
                                            /* valorCelda = data_children[1].props.children.props.children */
                                            // console.log(valorCelda,'Fecha')
                                        }
                                    }
                                    arregloRendered.push(col)
                                    return `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">`+
                                        `<td>${col.title}:</td>`+
                                        `<td>${valorCelda}</td>`+
                                    `</tr>`
                                }else{
                                    return `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">`+
                                        `<td>${col.title}:</td>`+
                                        `<td>${col.data}</td>`+
                                    `</tr>`
                                }
                            }
                        } ).join('');

                        let tablaModificada = $('<table/>').append( data ) 
                        let tablaInternaResponsiva =  tablaModificada[0]['children']
                        // console.log(tablaInternaResponsiva)
                        arregloRendered.forEach((col, index) => { 
                            tablaInternaResponsiva.forEach(element=>{
                                if(parseInt(element.dataset.dtColumn)===parseInt(col.columnIndex))
                                { 
                                    // console.log("Si hice match ",element.dataset.dtColumn, " con ",col.columnIndex)
                                    let td = element['children'][1] 
                                    // console.log(td)
                                    ReactDOM.render( col.data, td)
                                }
                            })  
                           // console.log(valor[0],'data')
                            
                        })
     
                        return data ?
                        tablaModificada :
                            false;
                    }
                }
            },
            processing: true,
            serverSide: true,
            ajax: function (request, drawCallback, settings) {
                runAjax(settings, accessToken, request, setter, urlRender).done(function (response) {
                    _that.setState({
                        ..._that.state,
                        newElements: response.elements
                    })
                    drawCallback(response);
                    tableWidth = $("#" + cardTable).width()
                    $("#" + cardTableHeader).css("width", tableWidth)
                });
            },
            columns,
            createdRow: function (row, data) {
                if (tipo_validacion) {
                    const { objeto } = data
                    let pdfFlag = false
                    switch (tipo_validacion) {
                        case 'compras':
                            if(objeto.facturas_pdf){
                                if(objeto.facturas_pdf.length){
                                    pdfFlag = true
                                }
                            }
                            if(pdfFlag){
                                $(row).addClass('blanco');
                            }else{
                                if (objeto.factura) {
                                    if (objeto.total_facturas - objeto.monto > 1) {
                                        $(row).addClass('verde');
                                    } else if (objeto.total_facturas - objeto.monto >= -1 && objeto.total_facturas - objeto.monto <= -1) {
                                        $(row).addClass('blanco');
                                    } else if (objeto.total_facturas - objeto.monto < -1) {
                                        $(row).addClass('rojo');
                                    }
                                } else {
                                    $(row).addClass('blanco');
                                }
                            }
                            break;
                        case 'ventas':
                            if(objeto.facturas_pdf){
                                if(objeto.facturas_pdf.length){
                                    pdfFlag = true
                                }
                            }
                            if(pdfFlag){
                                $(row).addClass('blanco');
                            }else{
                                if (objeto.factura) {
                                    if (objeto.total_facturas - objeto.monto > 1) {
                                        $(row).addClass('rojo');
                                    } else if (objeto.total_facturas - objeto.monto >= -1 && objeto.total_facturas - objeto.monto <= -1) {
                                        $(row).addClass('blanco');
                                    } else if (objeto.total_facturas - objeto.monto < -1) {
                                        $(row).addClass('verde');
                                    }
                                } else {
                                    $(row).addClass('blanco');
                                }
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
                <'row'<'col-sm-12 col-md-7'i>
                <'col-sm-12 col-md-5 flex-column-reverse flex-md-row dataTables_pager'lp>
            >`,
            language: {
                "sProcessing": renderToString(
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="position-fixed p-5">
                            <div className="mt-175px">
                                <div className="spinner spinner-primary spinner-xl"></div>
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
                targets: renderedHeader,
                createdCell: (td, cellData, rowData, row, col) => {
                    ReactDOM.render( cellData, td)
                }
            },
            {
                'targets': [0],
                'data': null,
                'searchable': mostrar_acciones ? false : true,
                'orderable': false,
                createdCell: (td, cellData, rowData, row, col) => {
                    if (global_variable.mostrar_acciones === true) {
                        let elementos = _that.state.newElements
                        ReactDOM.render( <TableButton cellData = { cellData} row = { row }  actions = {actions} elementos = { elementos} />, td)    
                    }
                    else {
                        return (`<div>${td}</div>`)
                    }
                }

            },{
                'targets': noOrdereableHeaders,
                'orderable': false
            }
            ],
            lengthMenu: [[20], [20]],
            pageLength: 20,
            select: checkbox ? { style: 'multi' } : false

        });
        table.on('responsive-resize.dt', function (e, datatable, columns) {
            for (var i in columns) {
                var index = parseInt(i, 10) + 1;
                table.find('th:nth-child(' + index + ')').toggle(columns[i]);
            }
        });

        /* $(this.refs.main).on('click', '.btn-actions-table', function (e) {
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
        }); */

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
    clickHandlerRestante = (e) => {
        if (typeof this.props.onClickRestante === 'function') {
            this.props.onClickRestante();
        }
    }
    clickHandlerHabilitar = (e) => {
        if (typeof this.props.onClickHabilitar === 'function') {
            this.props.onClickHabilitar();
        }
    }
    render() {

        const { title, subtitle, url, mostrar_boton, abrir_modal, exportar_boton, cardTable, cardTableHeader, cardBody, restante_empresa, habilitar, text_habilitar, customcard, customheader, customtitle, customsubtitle, customlabel, icon_habilitar} = this.props
        return (
            <>
                <Card id={cardTable} className={`card-custom card-sticky ${customcard}`}>
                    <Card.Header id={cardTableHeader} className={`${customheader}`}>
                        <div className={`card-title ${customtitle}`}>
                            <h3 className={`card-label font-weight-bolder ${customlabel}`}>
                                {
                                    title ? title : ''
                                }
                                <span className={`d-block text-muted pt-2 font-size-sm ${customsubtitle}`}>
                                    {
                                        subtitle ? subtitle : ''
                                    }
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar">
                            {(restante_empresa === true) ?
                                <OverlayTrigger overlay={<Tooltip>RESTANTE POR EMPRESA</Tooltip>}>
                                    <button onClick={() => this.clickHandlerRestante()} className="btn btn-icon btn-light btn-text-primary btn-hover-text-dark font-weight-bold btn-sm mr-2">
                                        <i className="fas fa-dollar-sign text-dark-50"></i>
                                    </button>
                                </OverlayTrigger>
                                :
                                ""
                            }
                            {(habilitar === true) ?
                                <OverlayTrigger overlay={<Tooltip><span className="font-weight-bold text-dark-75">{text_habilitar}</span></Tooltip>}>
                                    <button onClick={() => this.clickHandlerHabilitar()} className="btn btn-icon btn-light btn-text-primary btn-hover-text-dark font-weight-bold btn-sm mx-3">
                                        <i className={`fas ${icon_habilitar} text-dark-50`}></i>
                                    </button>
                                </OverlayTrigger>
                                :
                                ""
                            }
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
                                        <button onClick={() => this.clickHandler()} className="btn btn-success font-weight-bold">
                                            <i className="flaticon-add"></i> AGREGAR
                                        </button>
                                        :
                                        <a href={url} className="btn btn-success font-weight-bold">
                                            <i className="flaticon-add"></i> AGREGAR
                                        </a>
                                    :
                                    ""
                            }
                        </div>
                    </Card.Header>

                    <Card.Body id={cardBody} className="pt-0">
                        <table ref={'main'} className="table table-responsive-md table-separate table-head-custom table-checkable display table-hover text-justify datatables-net" id={this.props.idTable ? this.props.idTable : "kt_datatable2"} />
                    </Card.Body>
                </Card>
            </>
        )
    }
}
export default NewTableServerRender