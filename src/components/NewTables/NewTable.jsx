import React, { Component } from 'react';
import '../../styles/custom_datatable.css'
import '../../styles/metronic/_datables.scss';
import $ from "jquery";
import { Card } from 'react-bootstrap';
import ReactDOM from 'react-dom'
import { errorAlert } from '../../functions/alert';
import { CommonLottie } from '../Lottie'
import { NoData } from '../../assets/animate'
$.DataTable = require('datatables.net');
require("datatables.net-responsive-bs4");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-fixedheader");

class NewTable extends Component{

    state = {
        stateData: []
    }

    componentDidMount = () => {
        const { data } = this.props
        this.setState({...this.state, stateData: data})
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
        this.reloadHeader();
        this.initTableData()
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.reloadTableData(this.props)
        }
    }

    runAjax = (request) => {
        const { accessToken, urlRender, setter } = this.props
        var deferred = new $.Deferred();
        $.ajax({
            data: request,
            url: urlRender,
            dataType: "json",
            type: "GET",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            success: function (response) {
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

    initTableData = () => {
        const { tableName, columns, checkbox } = this.props
        let componente = this
        let tableHeader = `#${tableName}-card-header-id`
        let cardTable = `#${tableName}-card-id`
        let noOrdereableHeaders = []
        let columnas = []
        let renderedHeader = [] 
        columns.forEach((element, index) => {
            if(element.orderable === false) noOrdereableHeaders.push(index)
            columnas[index] = {
                'title': columns[index].Header,
                'data': columns[index].accessor
            }
            if(columns[index].customRender === true)
                renderedHeader.push(index)
        })
        let table = $(this.refs.main)
        table.DataTable({
            initComplete: function () {
                let tableWidth = $(cardTable).width()
                $(tableHeader).css("width", tableWidth)
                table.find("thead th").each(function (index) {
                    let cellIndex = columns[index].accessor
                    if(cellIndex !== 'actions'){
                        if(columns[index].searchable === false){
                            $(this).append(`<div class="mt-2 separator separator-dashed separator-border-2 d-none"></div>`+
                                `<div class="mt-2 d-none"><input type="text" id='${cellIndex}-${tableName}' class="form-control form-control-sm d-none" disabled/></div>`);
                        }else{
                            $(this).append(`<div class="mt-2 separator separator-dashed separator-border-2 d-none"></div>`+
                                `<div class="mt-2 d-none"><input type="text" id='${cellIndex}-${tableName}' class="form-control form-control-sm d-none" /></div>`);
                        }
                    }
                });
                this.api().columns().every(function () {
                    var that = this;
                    $('input', this.header()).on('blur', function () {
                        if (that.search() !== this.value) { 
                            that.search().draw()
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
                        let responsiveData = $.map( columns, function ( col, i ) {
                            if(col.hidden){
                                if(renderedHeader.includes(i)){
                                    arregloRendered.push(col)
                                    return `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">`+
                                        `<td class='responsive-td'>${col.title}:</td>`+
                                        `<td>${col.data.value}</td>`+
                                    `</tr>`
                                }else{
                                    return `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">`+
                                        `<td class='responsive-td'>${col.title}:</td>`+
                                        `<td>${col.data}</td>`+
                                    `</tr>`
                                }
                            }
                        }).join('');
                        let tablaModificada = $('<table/>').append( responsiveData ) 
                        let tablaInternaResponsiva =  tablaModificada[0]['children']
                        arregloRendered.forEach((col, index) => { 
                            tablaInternaResponsiva.forEach(element=>{
                                if(parseInt(element.dataset.dtColumn)===parseInt(col.columnIndex)){ 
                                    let td = element['children'][1] 
                                    ReactDOM.render( col.data, td)
                                }
                            })  
                        })
                        return responsiveData ? tablaModificada : false;
                    }
                }
            },
            processing: true,
            serverSide: true,
            ajax: function (request, drawCallback, settings) {
                componente.runAjax(request).done(function (response) {
                    drawCallback(response); 
                    let noData = $(`#not-data-${tableName}`)[0]
                    if(noData)
                        ReactDOM.render( 
                            <div className="row mx-0 justify-content-center">
                                <div className="col-md-2">
                                    <CommonLottie animationData = { NoData } />
                                </div>
                                <div className="col-12 text-center">
                                    <h3 className="card-label font-weight-bolder undefined">
                                        No hay datos disponibles
                                    </h3>
                                </div>
                            </div>, noData )
                });
            },
            columns: columnas,
            dom:
                `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-7'i>
                <'col-sm-12 col-md-5 flex-column-reverse flex-md-row dataTables_pager'lp>
            >`,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ &nbsp;registros",
                "sZeroRecords": `<div id = "not-data-${tableName}">No se encontraron resultados</div>`,
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": `(filtrado de un total de _MAX_ registros)`,
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
            },{
                'targets': noOrdereableHeaders,
                'orderable': false
            }],
            lengthMenu: [[20], [20]],
            pageLength: 20,
            select: checkbox ? { style: 'multi' } : false
        }).on('responsive-resize.dt', function (e, datatable, columns) {
            for (var i in columns) {
                var index = parseInt(i, 10) + 1;
                table.find('th:nth-child(' + index + ')').toggle(columns[i]);
            }
        });
    }

    reloadTableData = (props) => {
        const { data } = props
        this.setState({...this.state, stateData: data})
        $(this.refs.main).DataTable().destroy();
        this.initTableData()
        this.reloadHeader();
    }

    reloadHeader = () => {
        const { tableName, type } = this.props
        let tableHeader = `#${tableName}-card-header-id`
        let cardTable = `#${tableName}-card-id`
        let cardBody = `#${tableName}-card-body-id`
        $("body").addClass("card-sticky-on")
        let tableWidth = $(cardTable).width()
        $(tableHeader).css("width", tableWidth).css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)").css("z-index", 3)
        let headerHeidht = $(tableHeader).height()
        $(cardBody).css("margin-top", headerHeidht)
        $(cardTable).on('resize',function(){ })
        $( window ).resize(function() { 
            tableWidth = $(cardTable).width()
            $(tableHeader).css("width",tableWidth) 
        }) 
        $(window).on('scroll', function () {
            var pos = $(this).scrollTop();
            let limite
            if (pos === 0) 
                $(tableHeader).css("margin-top", "0px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
            else {
                let pantalla = $(this).width()
                switch(type){
                    case 'tab':
                        limite = pantalla > 992 ? 68 : 96
                        if (pos < limite)
                            $(tableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                        else
                            $(tableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                        break;
                    case 'nav':
                        limite = pantalla > 992 ? 68 : 96
                        if (pos < limite)
                            $(tableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                        else
                            $(tableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                        break;
                    default:
                        limite = pantalla > 992 ? 25 : 58
                        if (pos < limite)
                            $(tableHeader).css("margin-top", "-" + pos + "px").css("box-shadow", "0px 1px 15px 1px rgba(69, 65, 78, 0)")
                        else
                            $(tableHeader).css("margin-top", "-" + limite + "px").css("box-shadow", "0px 1px 5px 1px rgba(69, 65, 78, 0.1)")
                        break;
                }
            }
        });
    }

    clickHandler = () => {
        const { onClick } = this.props
        if (typeof onClick === 'function') {
            onClick();
        }
    }

    render = () => {
        const { tableName, customtitle, customlabel, customsubtitle, title, subtitle, customButton, abrirModal, url, filterClick, children } = this.props
        return(
            <Card id = { `${tableName}-card-id` } className = { `card-custom card-sticky ${tableName}-card-class` }>
                <Card.Header id  = { `${tableName}-card-header-id` } className = { `${tableName}-card-header-class` }>
                    <div className = { `card-title ${customtitle}` } >
                        <h3 className={`card-label font-weight-bolder ${customlabel}`}> { title ? title : '' }
                            <span className={`d-block text-muted pt-2 font-size-sm ${customsubtitle}`}>
                                { subtitle ? subtitle : '' }
                            </span>
                        </h3>
                    </div>
                    <div className="card-toolbar">
                        <button onClick = { filterClick } className="btn btn-info mr-2 font-weight-bold">
                            <i className="fas fa-filter"></i> FILTRAR
                        </button>
                        {
                            customButton ? 
                                customButton
                            : abrirModal === true ?
                                    <button onClick = { this.clickHandler } className="btn btn-success font-weight-bold">
                                        <i className="flaticon-add"></i> AGREGAR
                                    </button>
                                :
                                    <a href = { url } className="btn btn-success font-weight-bold">
                                        <i className="flaticon-add"></i> AGREGAR
                                    </a>
                        }
                    </div>
                </Card.Header>
                <Card.Body id = { `${tableName}-card-body-id` } className = "pt-0">
                    {children}
                    <table ref = 'main' className = "table table-responsive-md table-separate table-head-custom table-checkable display table-hover text-justify datatables-net" 
                        id = { tableName ? tableName : "kt_datatable2"} />
                </Card.Body>
            </Card>
        )
    }

}

export default NewTable