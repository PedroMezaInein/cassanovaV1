import * as React from 'react';
import $ from "jquery";
import moment from 'moment'
import { getValue } from '@syncfusion/ej2-base';
import { getObject } from '@syncfusion/ej2-grids';
import { INEIN_RED, IM_AZUL } from '../../constants'
import { ExcelExport, Inject, Toolbar } from '@syncfusion/ej2-react-treegrid';
import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';

function colorHeader (args, bgColor, color, hoverBgColor) {
  	// Color de header
	args.row.bgColor = bgColor;
	args.row.style.fontWeight = 600;
	args.row.children[0].style.color = color;
	args.row.children[1].style.color = color;
	args.row.children[2].style.color = color;
	args.row.children[0].children[0].children[2].style.fontSize = '14px';
	// Normal
	args.row.onmouseout = function(){ 
		this.style.backgroundColor = bgColor;
		this.style.fontWeight = 600;
	};
	//Hover 
	args.row.onmouseover = function(){
		this.style.backgroundColor = hoverBgColor;
		this.style.fontWeight = 700;
	};
	// Color de flecha
	args.row.firstElementChild.children[0].childNodes[0].style.color = color;
	args.row.firstElementChild.children[0].childNodes[0].style.fontSize = '16px';
	args.row.firstElementChild.children[0].childNodes[0].style.fontFamily = 'auto';
	// Borders td
	args.row.childNodes[0].style.borderTop = `1px solid ${color}`
	args.row.childNodes[1].style.borderTop = `1px solid ${color}`
	args.row.childNodes[2].style.borderTop = `1px solid ${color}`
}

function rowTotal ( args, bgColor, color, fontSize ) {
	// Color de row total
	args.row.bgColor = bgColor;
	args.row.style.fontWeight = 600;
	args.row.style.textAlign ='right';
	args.row.children[0].style.color = color;
	args.row.children[0].style.paddingRight = '0px';
	args.row.childNodes[1].style.color = color;
	args.row.childNodes[1].style.fontSize = fontSize;
	args.row.children[0].children[0].children[2].style.fontSize = fontSize;
}

function colorHeaderExcel (args, bgColor, color){
	args.style = {
		backColor: bgColor,
		fontColor: color,
		bold: true,
		border:true,
		vAlign:'Center',
		fontSize:12,
		borders:{ color: bgColor }
	};
}

function rowTotalExcel ( args, value, bgColor, color ) {
	if(args.value === value){
		args.style = {
			backColor: bgColor,
			fontColor: color,
			bold: true,
			border:true,
			hAlign:'Right',
			vAlign:'Center',
			fontSize: 10.5,
			borders:{ color: bgColor },
		}
	}else{
		args.style = {
			backColor: bgColor,
			fontColor: color,
			bold: true,
			border:true,
			hAlign:'Center',
			vAlign:'Center',
			fontSize: 10.5,
			borders:{ color: bgColor },
		}
	}
}
export default class App extends React.Component {
	
	componentDidMount(){
		$(".e-tbar-btn-text").html("EXPORTAR")
		$(".e-toolbar-item").removeAttr("title");
		$("#_gridcontrol_excelexport").removeAttr("aria-label");
	}
	constructor() {
		super(...arguments);
		this.toolbarOptions = ['ExcelExport'];
	}
	rowDataBound(args) {
		let header = getObject('header', args.data)

		switch (header) {
			case 'INGRESOS':
				colorHeader(args, '#E8E6FC', '#948FD8', '#D4D2F6')
				break;
			case 'COSTOS DE VENTAS':
				colorHeader(args, '#E4EFFB', '#86AAD3', '#CEE1F5')
				break;
			case 'GANANCIA / PERDIDA BRUTA':
				colorHeader(args, '#FEE4ED', '#F091B1', '#fbd2e0')
				args.row.childNodes[2].style.color='#F091B1'
				break;
			case 'GASTOS':
				colorHeader(args, '#E2FBF7', '#7ED0C5', '#CAF4EE')
				break;
			case 'OTROS INGRESOS':
				colorHeader(args, '#fbeadf', '#f9b180', '#fde1ce')
				break;
			case 'FLUJO DE EFECTIVO':
				args.row.bgColor = '#e6e8ef';
				args.row.style.fontWeight = 600;
				args.row.children[0].style.color = '#6e6e7b';
				args.row.children[0].style.paddingRight = '0px';
				args.row.childNodes[1].style.color = '#6e6e7b';
				args.row.childNodes[1].style.fontSize = '14px';
				args.row.children[0].children[0].children[2].style.fontSize = '14px';
				break;
			case 'TOTAL DE INGRESOS':
				rowTotal(args, '#F3F6F9', '#f9b180', '13.5px')
				args.row.children[0].children[0].children[1].style.color = '#f9b180';
				break;
			case 'TOTAL DE GASTOS':
				rowTotal(args, '#F3F6F9', '#7ED0C5', '13.5px')
				args.row.children[0].children[0].children[1].style.color = '#7ED0C5'
				break;
			case 'TOTAL VENTAS':
			case 'TOTAL COSTOS DE VENTAS':
				rowTotal(args, '#F3F6F9', '#F091B1', '13.5px')
				args.row.children[0].children[0].children[1].style.color = '#F091B1'
				break;
			case 'TOTAL INGRESOS':
			case 'TOTAL DEVOLUCIONES':
				rowTotal(args, '#F3F6F9', '#948FD8', '13.5px')
				args.row.children[0].children[0].children[2].style.color = '#948FD8';
				break;
			case 'SIN FACTURA':
			case 'CON FACTURA':
				rowTotal(args, '#F3F6F9', '#80808F', '12px')
				args.row.children[0].style.fontSize='12px'
				args.row.children[2].style.fontSize='12px'
				break;
			case 'VENTAS':
			case 'DEVOLUCIONES':
			case 'VENTAS NETAS':
			case 'PROYECTOS':
			case 'COSTOS NETOS':
			case 'DEPARTAMENTOS':
				args.row.childNodes[0].childNodes[0].style.color='#80808F'
				args.row.childNodes[0].childNodes[0].style.fontWeight=600
				args.row.children[1].style.fontWeight=600
				args.row.children[2].style.fontWeight=600
				// args.row.childNodes[0].childNodes[0].childNodes[1].style.color='#80808F'
				// Normal
				args.row.onmouseout = function () {
					this.style.backgroundColor = 'white';
					this.style.fontWeight = 600;
				};
				//Hover 
				args.row.onmouseover = function () {
					this.style.backgroundColor = '#ecf0f3';
					this.style.fontWeight = 700;
				};
				break;
			case 'FASE 1':
			case 'FASE 2':
			case 'FASE 3':
			case 'PROYECTOS ':
				args.row.childNodes[0].childNodes[0].style.color = '#85AED2'
				args.row.childNodes[0].childNodes[0].style.fontWeight = 600
				args.row.children[0].children[0].children[2].style.color = '#85AED2'
				args.row.children[1].style.fontWeight = 600
				args.row.children[2].style.fontWeight = 600
				args.row.children[1].style.color='#85AED2'
				args.row.children[2].style.color='#85AED2'
				// Normal
				args.row.onmouseout = function () {
					this.style.backgroundColor = 'white';
					this.style.fontWeight = 600;
				};
				//Hover 
				args.row.onmouseover = function () {
					this.style.backgroundColor = '#ecf0f3';
					this.style.fontWeight = 700;
				};
			break;
			default:
				if (!args.data.hasChildRecords) {
					args.row.style.fontStyle = 'italic'
					args.row.onmouseout = function () {
						this.style.fontStyle = 'italic';
						this.style.backgroundColor = 'white'; 
						this.style.fontWeight = 'normal';
					};
					args.row.onmouseover = function () {
						this.style.fontStyle = 'italic';
						this.style.backgroundColor = '#ecf0f3';
						this.style.fontWeight = 700;
					};
				}else{
					args.row.children[0].children[0].children[3].style.color = '#80808fad'
					args.row.childNodes[0].childNodes[0].style.color = '#80808fad'
					args.row.childNodes[0].childNodes[0].style.fontWeight = 500
					args.row.children[0].children[0].children[2].style.color = '#80808fad'
					args.row.children[1].style.fontWeight = 500
					args.row.children[2].style.fontWeight = 500
					args.row.children[1].style.color='#80808fad'
					args.row.children[2].style.color='#80808fad'
					// Normal
					args.row.onmouseout = function () {
						this.style.backgroundColor = 'white';
						this.style.fontWeight = 500;
					};
					//Hover 
					args.row.onmouseover = function () {
						this.style.backgroundColor = '#ecf0f3';
						this.style.fontWeight = 600;
					};
				}
				// Normal
				args.row.onmouseout = function () { this.style.backgroundColor = 'white'; };
				//Hover 
				args.row.onmouseover = function () { this.style.backgroundColor = '#ecf0f3'; };
				break;
		}
	}
	setColor = (empresa) => {
        switch (empresa) {
            case 'INFRAESTRUCTURA E INTERIORES':
                return INEIN_RED;
            case 'INFRAESTRUCTURA MÉDICA':
                return IM_AZUL;
            default:
				return '#80808F';
        }
    }
	printDates = form => {
        let fechaInicio = moment(form.fechaInicio)
        let fechaFin = moment(form.fechaFin)
        let diffFechas = fechaFin.diff(fechaInicio, 'days')
        if(diffFechas === 0){
			return `${fechaInicio.format('DD')}/${fechaInicio.format('MM')}/${fechaInicio.format('YYYY')}`
        }else{
			return `${fechaInicio.format('DD')}/${fechaInicio.format('MM')}/${fechaInicio.format('YYYY')} - ${fechaFin.format('DD')}/${fechaFin.format('MM')}/${fechaFin.format('YYYY')}`
		}
    }
	toolbarClick(args) {
		const { form, options } = this.props
		let auxName = ''
		options.empresas.forEach((empresa) => {
			if(empresa.value.toString() === form.empresa){
				if(empresa.name === 'INEIN'){
					auxName ='INFRAESTRUCTURA E INTERIORES'
				}else{
					auxName = empresa.name
				}
			}
		})
		if (this.treegrid && args.item.text === 'Excel Export') {
			const excelExportProperties = {
				header: {
					headerRows: 5,
					rows: [
						{ cells: [{ colSpan: 3, value: "" }] },
						{ cells: [{ colSpan: 3, value: "ESTADOS DE RESULTADOS", style: { fontColor: '#80808F', fontSize: 14, hAlign: 'Center', bold: true, fontName: 'Nirmala UI' } }] },
						{ cells: [{ colSpan: 3, value: auxName , style: { fontColor: this.setColor(auxName), fontSize: 10, hAlign: 'Center', bold: true, fontName: 'Nirmala UI' } }] },
						{ cells: [{ colSpan: 3, value: this.printDates(form), style: { fontColor: '#80808F', fontSize: 10, hAlign: 'Center', bold: true, fontName: 'Nirmala UI' } }] },
						{ cells: [{ colSpan: 3, value: "" }] },
					]
				},
				fileName: "Estados de resultados.xlsx",
				isCollapsedStatePersist: true,
				theme: {
					header: { fontName: 'Nirmala UI', fontColor: '#80808F', fontSize:11, fontWeight:600 },
					record: { fontName: 'Nirmala UI', fontColor: '#80808F', fontSize:10 }
				}
			};
			this.treegrid.excelExport(excelExportProperties);
		}
	}
	excelQueryCellInfo(args) {
		let value = getValue('data.header', args)
		switch (value) {
			case 'INGRESOS':
				colorHeaderExcel(args, '#E8E6FC', '#948FD8')
				break;
			case 'COSTOS DE VENTAS':
				colorHeaderExcel(args, '#E4EFFB', '#86AAD3')
				break;
			case 'GANANCIA / PERDIDA BRUTA':
				colorHeaderExcel(args, '#FEE4ED', '#F091B1')
				break;
			case 'GASTOS':
				colorHeaderExcel(args, '#E2FBF7', '#7ED0C5')
				break;
			case 'OTROS INGRESOS':
				colorHeaderExcel(args, '#fbeadf', '#f9b180')
				break;
			case 'FLUJO DE EFECTIVO':
				colorHeaderExcel(args, '#E6E8EF', '#6E6E7B')
				break;
			case 'SIN FACTURA':
			case 'CON FACTURA':
				if (args.column.field === 'total' || args.column.field === 'porcentaje') {
					args.style = {
						backColor:  '#F3F6F9',
						fontColor: '#80808F',
						bold: true,
						border:true,
						hAlign:'Center',
						vAlign:'Center',
						fontSize: 9,
						borders:{ color: '#F3F6F9' }
					}
				}else{
					args.style = {
						backColor: '#F3F6F9',
						fontColor: '#80808F',
						bold: true,
						border:true,
						hAlign:'Right',
						vAlign:'Center',
						fontSize: 9,
						borders:{ color: '#F3F6F9' }
					}
				}
				break;
			case 'TOTAL INGRESOS':
			case 'TOTAL DEVOLUCIONES':
				rowTotalExcel(args, value, '#F3F6F9', '#948FD8')
				break;
			case 'TOTAL VENTAS':
			case 'TOTAL COSTOS DE VENTAS':
				rowTotalExcel(args, value, '#F3F6F9', '#F091B1')
				break;
			case 'TOTAL DE GASTOS':
				rowTotalExcel(args, value, '#F3F6F9', '#7ED0C5')
				break;
			case 'TOTAL DE INGRESOS':
				rowTotalExcel(args, value, '#F3F6F9', '#f9b180')
				break;
			case 'VENTAS':
			case 'DEVOLUCIONES':
			case 'VENTAS NETAS':
			case 'PROYECTOS':
			case 'COSTOS NETOS':
			case 'DEPARTAMENTOS':
				if (args.column.field === 'total' || args.column.field === 'porcentaje') {
					args.style = { hAlign:'Center', vAlign:'Center', fontColor: '#80808F', bold: true, fontSize: 11.5 };
				}else{
					args.style = { fontColor: '#80808F', bold: true, indent: 1, fontSize: 11.5 }
				}
				break;
			case 'FASE 1':
			case 'FASE 2':
			case 'FASE 3':
				if(args.column.field === 'total' || args.column.field === 'porcentaje'){
					args.style = { hAlign:'Center', vAlign:'Center', fontColor: '#85AED2', bold: true, fontSize: 11 };
				}else{
					args.style = { fontColor: '#85AED2', bold: true, indent: 2, fontSize: 11 };
				}
				break;
			default:
				if (!args.data.hasChildRecords) {
					if (args.column.field === 'total' || args.column.field === 'porcentaje') {
						args.style = { hAlign:'Center', vAlign:'Center', fontColor: '#B2B2B2', fontSize: 10 };
					}else{
						args.style = { italic: true, indent: 5, fontSize: 10 };
					}
				}else{
					if (args.column.field === 'total' || args.column.field === 'porcentaje') {
						args.style = { hAlign:'Center', vAlign:'Center', fontColor: '#5F5F5F',  fontSize: 10.5 };
					}else{
						args.style = { fontColor: '#5F5F5F', indent: 3,  fontSize: 10.5 };
					}
				}
				break;
		}
		
	}
	render() {
		this.toolbarClick = this.toolbarClick.bind(this);
		const { datos } = this.props
		return (
			<div className='control-pane'>
				<div className='control-section'>
					<TreeGridComponent id="costos_ventas" dataSource={datos} treeColumnIndex={0} childMapping='subtasks' enableHover='false'
						gridLines='Horizontal' rowDataBound={this.rowDataBound} enableCollapseAll={true} allowExcelExport='true' toolbar={this.toolbarOptions}
						toolbarClick={this.toolbarClick} ref={treegrid => this.treegrid = treegrid} excelQueryCellInfo={this.excelQueryCellInfo}>
						<ColumnsDirective>
							<ColumnDirective field='header' width='335' headerText='' />
							<ColumnDirective field='total' width='151' textAlign='Center' headerText='TOTAL' type='number' format='C2' />
							<ColumnDirective field='porcentaje' width='130' textAlign='Center' headerText='PORCENTAJE' type='number' format='P2' />
						</ColumnsDirective>
						<Inject services={[Toolbar, ExcelExport]} />
					</TreeGridComponent>
				</div>
			</div>
		)
	}
}