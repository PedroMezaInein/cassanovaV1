import React, { Component } from 'react';
import '../../styles/plugins.bundle.css';
import '../../styles/style.bundle.css';
import '../../styles/datables.css';
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server' 

import {PlusCircle} from '../../assets/svg'

const $ = require('jquery');
$.DataTable = require('datatables.net');
require("datatables.net-responsive");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-select");

function reloadTableData(data) {
    const table = $('.data-table-wrapper')
        .find('table')
        .DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
}

class NewTable extends Component {
    componentDidMount() {
        const { actions, elements, data } = this.props
        var header = this.props.columns;
        var columns = [];
        var i=0;

        let aux = []

        for (i = 0; i < header.length; i++) {
            var titulo = new Object();
                titulo["title"] = header[i].Header; 
                titulo["data"] = header[i].accessor; 
                columns[i] = titulo;
                if(aux > 0)
                    aux.push(i)
        }

        var table = $(this.refs.main);
        table.DataTable({  
            
            initComplete: function () {
                table.find("thead th").each( function () {
                    var title = $(this).text();
                    $(this).append(`<br/><input class="form-control form-control-sm form-filter datatable-input" type="text" placeholder="${title}"/>`);
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
            columnDefs:[{
                "targets": aux,
                render: function ( data, type, row, meta ) {
                    return(`<div>${data}</div>`)
                }
            },
                {
                    'targets': [0],
                    'data': null,
                    'searchable': false,
                    'orderable': false,
                    render: function ( data, type, row, meta ) {
                        let aux = ''
                        console.log(data)
                        {
                            data.map( (element) => {
                                console.log(element, 'element')
                                aux = aux + /* `<input type="button" onClick = { console.log('hola')} value="Edit" class="btnEdit sfBtn sfPrimaryBtn sfLocale" />` */
                                `<button name=${element.action}  id = ${row.id} class="btn btn-primary btn-actions-table">${element.text}</button>`
                            })
                        }
                        return(
                            '<div>'+aux+'</div>'
                        )
                    } 
                    /* 'defaultContent': '<button type="button" class="btn btn-primary btn-edit">Edit</button>' */
                }
            ],
            
            dom: `<'row'<'col-sm-12'tr>>
			<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'lp>>`, 
            /* dom: 'Bfrtip', */
            buttons: [
                'selected',
                'selectedSingle',
                'selectAll',
                'selectNone',
                'selectRows',
                'selectColumns',
                'selectCells'
            ],
            select: true,
            lengthMenu: [20, 40, 50],

            pageLength: 20
        });
        $(this.refs.main).on('click', '.btn-actions-table', function(e){
            e.preventDefault();
            
            const { id, name } = e.target
            let aux = elements.find(function(element, index) {
                if(element.id.toString() === id.toString()){
                    return element    
                }
            });
            console.log(actions, name)
            actions[name].function(aux)
            // Reset form
            
        });
    }

    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
    }
    shouldComponentUpdate(nextProps) {
        if(nextProps.data !== this.props.data)
        {
            reloadTableData(nextProps.data)
        }
    }
    render() {

        const { columns, data, title, subtitle, url } = this.props

        return (
            <>
                <div className="d-flex flex-column-fluid">        
                    <div className="container">
                        <div className="card card-custom">
                            <div className="card-header flex-wrap border-0 pt-6 pb-0">
                                <div className="card-title">
                                    <h3 className="card-label font-weight-bolder">
                                        {
                                            title ? title : ''
                                        }
                                        <span className="d-block text-muted pt-2 font-size-sm">
                                            {
                                                subtitle ? subtitle : ''
                                            }
                                        </span>
                                    </h3>
                                </div>
                                <div className="card-toolbar">
                                    
                                    <a href={url} className="btn btn-primary font-weight-bolder">
                                        <span className="svg-icon svg-icon-md">
                                            <PlusCircle />
                                        </span>
                                        Agregar
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref="main" className="table table-separate table-head-custom table-checkable display responsive nowrap dt-responsive" id="kt_datatable2" />
                            </div>
                        </div>   
                    </div>
                </div> 
            </>
        )
    }
}

export default NewTable