

import * as React from 'react';
import { getObject } from '@syncfusion/ej2-grids';
import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';
import { ExcelExport, Inject, Toolbar } from '@syncfusion/ej2-react-treegrid';
function colorHeader (args, bgColor, color, hoverBgColor) {
  // Color de header
  args.row.bgColor = bgColor;
  args.row.style.fontWeight = 600;
  args.row.children[0].style.color = color;
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
  args.row.childNodes[1].style.color = color;
  args.row.childNodes[1].style.fontSize = fontSize;
  args.row.children[0].children[0].children[2].style.fontSize = fontSize;
}
export default class App extends React.Component {
  
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
        rowTotal(args, '#F3F6F9', '#80808F', '14px')
        break;
      case 'TOTAL DE INGRESOS':
        rowTotal(args, '#F3F6F9', '#f9b180', '13.5px')
        break;
      case 'TOTAL DE GASTOS':
        rowTotal(args, '#F3F6F9', '#7ED0C5', '13.5px')
        break;
      case 'TOTAL VENTAS':
      case 'TOTAL COSTOS DE VENTAS':
        rowTotal(args, '#F3F6F9', '#F091B1', '13.5px')
        break;
      case 'TOTAL INGRESOS':
      case 'TOTAL DEVOLUCIONES':
        rowTotal(args, '#F3F6F9', '#948FD8', '13.5px')
        break;
      case 'TOTAL DEVOLUCIONES':
        rowTotal(args, '#F3F6F9', '#948FD8', '13.5px')
        break;
      case 'SIN FACTURA':
      case 'CON FACTURA':
        rowTotal(args, '#F3F6F9', '#80808F', '13.5px')
        break;
      case 'VENTAS':
      case 'DEVOLUCIONES':
      case 'VENTAS NETAS':
      case 'PROYECTOS':
      case 'COSTOS NETOS':
      case 'DEPARTAMENTOS':
        args.row.childNodes[0].childNodes[0].style.color='#80808F'
        args.row.childNodes[0].childNodes[0].style.fontWeight=600
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
      default:
        // Normal
        args.row.onmouseout = function () {
          this.style.backgroundColor = 'white';
        };
        //Hover 
        args.row.onmouseover = function () {
          this.style.backgroundColor = '#ecf0f3';
        };
        break;
    }
  }
  toolbarClick(args) {
    console.log(args)
    if (this.treegrid && args.item.text === 'Excel Export') {
      const excelExportProperties = {
        header: {
            headerRows: 5,
            rows: [
                { cells: [{ colSpan: 4, value: "" }] },
                { cells: [{ colSpan: 4, value: "ESTADOS DE RESULTADOS", style: { fontColor: '#80808F', fontSize: 18, hAlign: 'Center', bold: true, } }] },
                { cells: [{ colSpan: 4, value: "INFRAESTRUCTURA E INTERIORES", style: { fontColor: '#D8005A', fontSize: 12, hAlign: 'Center', bold: true, } }] },
                { cells: [{ colSpan: 4, value: "10/05/2021 - 21/05/2021", style: { fontColor: '#80808F', fontSize: 12, hAlign: 'Center', bold: true, } }] },
                { cells: [{ colSpan: 4, value: "" }] },
            ]
        },
        fileName: "Estados de resultados.xlsx",
        isCollapsedStatePersist: true,
        columns:[
          
        ]
    };
    console.log(this.treegrid)
    this.treegrid.excelExport(excelExportProperties);
    }
  }
  excelQueryCellInfo(args) {
    // console.log(args)
    // if (args.column.field === 'duration') {
    //     if (getValue('data.duration', args) === 0) {
    //         args.style = { backColor: '#336c12' };
    //     }
    //     else if (getValue('data.duration', args) < 3) {
    //         args.style = { backColor: '#7b2b1d' };
    //     }
    // }
}
queryCellInfo(args) {
    if (args.column.field === 'header') {
      console.log(args)
      // console.log(args.column.field)
    //     if (getValue('data.duration', args) === 0) {
    //         args.cell.style.background = '#336c12';
    //     }
    //     else if (getValue('data.duration', args) < 3) {
    //         args.cell.style.background = '#7b2b1d';
    //     }
    }
}
  render() {
    this.toolbarClick = this.toolbarClick.bind(this);
    const sampleData = [
      {
        header: 'INGRESOS',
        subtasks: [
          {
            header: 'VENTAS',
            subtasks: [
              {
                header: 'FASE 1',
                total: '$3',
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 1"',
                    porcentaje: '11%',
                    total: '$3',
                    subtasks: [
                      { header: 'SUBÁREA 1', porcentaje: '3%', total: '$3'},
                      { header: 'SUBÁREA 2', porcentaje: '3%', total: '$3'},
                    ]
                  }
                ]
              },
              {
                header: 'FASE 2',
                total: '$3',
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 2"',
                    porcentaje: '11%',
                    total: '$3',
                    subtasks: [
                      { header: 'SUBÁREA 1', porcentaje: '3%', total: '$3'},
                      { header: 'SUBÁREA 2', porcentaje: '3%', total: '$3'},
                    ]
                  }
                ]
              },
              {
                header: 'FASE 3',
                total: '$3',
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 3"',
                    porcentaje: '11%',
                    total: '$3',
                    subtasks: [
                      { header: 'SUBÁREA 1', porcentaje: '3%', total: '$3'},
                      { header: 'SUBÁREA 2', porcentaje: '3%', total: '$3'},
                    ]
                  }
                ]
              },
              { header: 'TOTAL INGRESOS', total: '$3'},
            ]
          },
          {
            header: 'DEVOLUCIONES',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'PROYECTOS ',
                total: '$3',
                // porcentaje: '11%',
                subtasks: [
                  { header: 'PROYECTO "1"', total: '$3'},
                  { header: 'PROYECTO "2"', total: '$3'},
                  { header: 'PROYECTO "3"', total: '$3'}
                ]
              },
              { header: 'TOTAL DEVOLUCIONES', total: '$3'},
            ]
          },
          {
            header: 'VENTAS NETAS',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              { header: 'SIN FACTURA', porcentaje: '3%', total: '$3'},
              { header: 'CON FACTURA', porcentaje: '3%', total: '$3'},
            ]
          }
        ]
      },

      {
        header: 'COSTOS DE VENTAS',
        // porcentaje: 11,
        // total: 66,
        subtasks: [
          {
            header: 'PROYECTOS',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'PROYECTO "1"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'ÁREA 1', total: '$3'},
                  { header: 'ÁREA 2', total: '$3'},
                ]
              },
              {
                header: 'PROYECTO "2"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'ÁREA 1', total: '$3'},
                  { header: 'ÁREA 2', total: '$3'},
                ]
              },
              {
                header: 'PROYECTO "3"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'ÁREA 1', total: '$3'},
                  { header: 'ÁREA 2', total: '$3'},
                ]
              },
            ]
          },
          {
            header: 'COSTOS NETOS',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              { header: 'SIN FACTURA', porcentaje: '3%', total: '$3'},
              { header: 'CON FACTURA', porcentaje: '3%', total: '$3'},
            ]
          }
        ]
      },

      {
        header: 'GANANCIA / PERDIDA BRUTA',
        porcentaje: '11%',
        // total: 66,
        subtasks: [
          { header: 'TOTAL VENTAS', total: '$3'},
          { header: 'TOTAL COSTOS DE VENTAS', total: '$3'}
        ]
      },

      {
        header: 'GASTOS',
        // porcentaje: '11%',
        // total: 66,
        subtasks: [
          {
            header: 'DEPARTAMENTOS',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'DEPARTAMENTO "1"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },
              {
                header: 'DEPARTAMENTO "2"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },
              {
                header: 'DEPARTAMENTO "3"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },

            ]
          },
          { header: 'TOTAL DE GASTOS', total: '$3'}
        ]
      },

      {
        header: 'OTROS INGRESOS',
        // porcentaje: '11%',
        // total: 66,
        subtasks: [
          {
            header: 'DEPARTAMENTOS',
            total: '$3',
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'DEPARTAMENTO "1"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },
              {
                header: 'DEPARTAMENTO "2"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },
              {
                header: 'DEPARTAMENTO "3"',
                porcentaje: '11%',
                total: '$3',
                subtasks: [
                  { header: 'SUB-AREA 1', total: '$3'},
                  { header: 'SUB-AREA 2', total: '$3'},
                ]
              },
            ]
          },
          { header: 'TOTAL DE INGRESOS', total: '$3'}
        ]
      },

      { header: 'FLUJO DE EFECTIVO', total: '$3'}
    ];
    return(
      <div className='control-pane'>
          <div className='control-section'>
              <TreeGridComponent id="costos_ventas" dataSource={sampleData} treeColumnIndex={0} childMapping='subtasks' enableHover='false' gridLines='Horizontal' rowDataBound={this.rowDataBound} enableCollapseAll={true} 
                allowExcelExport='true'toolbarClick={this.toolbarClick} ref={treegrid => this.treegrid = treegrid} toolbar={this.toolbarOptions} queryCellInfo={this.queryCellInfo} excelQueryCellInfo={this.excelQueryCellInfo}
              >
                  <ColumnsDirective>
                      <ColumnDirective field='header' width='200' headerText='' />
                      <ColumnDirective field='total' width='40' textAlign='Center' headerText='TOTAL' />
                      <ColumnDirective field='porcentaje' width='40' textAlign='Center' headerText='PORCENTAJE' />
                  </ColumnsDirective>
                  <Inject services={[Toolbar, ExcelExport]}/>
              </TreeGridComponent>
              
          </div>
      </div>
    )
  }
}