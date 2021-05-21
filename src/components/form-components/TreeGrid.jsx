

import * as React from 'react';
import { getObject } from '@syncfusion/ej2-grids';
import { ColumnDirective, ColumnsDirective, TreeGridComponent, Aggregate, AggregatesDirective } from '@syncfusion/ej2-react-treegrid';
import { AggregateColumnDirective, AggregateColumnsDirective, AggregateDirective, Inject } from '@syncfusion/ej2-react-treegrid';
export default class App extends React.Component {
  constructor() {
    super(...arguments);
  }
  header = () => {
    return (
        <div> </div>
    )
  }
  total = () => {
    return (
        <div className="header-table"> 
          Total
        </div>
        // <div> </div>
    )
  }
  porcentaje = () => {
    return (
        <div className="header-table"> 
          Porcentaje
        </div>
        // <div> </div>
    )
  }
  footerSum(props) {
    return (
      <span>
        <span className="font-weight-bolder">Total de ingresos: </span>
        <span className="font-weight-boldest font-size-lg">{getObject('Sum', props)}</span>
      </span>
    );
  }
  mouseOver() {
    // style.color = "red";
    console.log('entre')
  }
  rowDataBound(args) {
    if (getObject('header', args.data) === 'INGRESOS') {
      console.log(args)
        args.row.bgColor = '#E8E6FC';
        args.row.style.fontWeight = 600;
        args.row.children[0].style.color = '#948FD8';
        args.row.children[0].children[0].children[2].style.fontSize = '14px';
        args.row.firstElementChild.children[0].childNodes[0].style.color = '#948FD8';
        args.row.firstElementChild.children[0].childNodes[0].style.fontSize = '16px';
        args.row.firstElementChild.children[0].childNodes[0].style.fontFamily = 'auto';

        args.row.onmouseover = function(){
          this.style.backgroundColor = '#dddcfd';
          this.style.fontWeight = 700;
        };
        // Normal
        args.row.onmouseout = function(){ 
          this.style.backgroundColor = '#E8E6FC';
          this.style.fontWeight = 600;
        };
    }
    else if (getObject('header', args.data) === 'COSTOS DE VENTAS') {
        args.row.style.background = '#7b2b1d';
    }
}
// e-rowcell e-treerowcell e-gridrowindex0level0 .e-treecolumn-container
// span.e-icons.e-treegridcollapse
// e-icons e-treegridcollapse
// span.e-treecell
  render() {
    const sampleData = [
      {
        header: 'INGRESOS',
        subtasks: [
          {
            header: 'VENTAS',
            subtasks: [
              {
                header: 'FASE 1',
                total: 1,
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 1"',
                    porcentaje: '11%',
                    total: 1,
                    subtasks: [
                      { header: 'ÁREA 1', porcentaje: '3%', total: 1 },
                      { header: 'ÁREA 2', porcentaje: '3%', total: 1 },
                    ]
                  }
                ]
              },
              {
                header: 'FASE 2',
                total: 1,
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 2"',
                    porcentaje: '11%',
                    total: 1,
                    subtasks: [
                      { header: 'ÁREA 1', porcentaje: '3%', total: 1 },
                      { header: 'ÁREA 2', porcentaje: '3%', total: 1 },
                    ]
                  }
                ]
              },
              {
                header: 'FASE 3',
                total: 1,
                // porcentaje: '11%',
                subtasks: [
                  {
                    header: 'PROYECTO "FASE 3"',
                    porcentaje: '11%',
                    total: 1,
                    subtasks: [
                      { header: 'ÁREA 1', porcentaje: '3%', total: 1 },
                      { header: 'ÁREA 2', porcentaje: '3%', total: 1 },
                    ]
                  }
                ]
              },
              { header: 'TOTAL INGRESOS', total: 1 },
            ]
          },
          {
            header: 'DEVOLUCIONES',
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'PROYECTOS',
                total: 1,
                // porcentaje: '11%',
                subtasks: [
                  { header: 'PROYECTO "1"', total: 1 },
                  { header: 'PROYECTO "2"', total: 1 },
                  { header: 'PROYECTO "3"', total: 1 }
                ]
              },
              { header: 'TOTAL DEVOLUCIONES', total: 1 },
            ]
          },
          {
            header: 'VENTAS NETAS',
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              { header: 'SIN FACTURA', porcentaje: '3%', total: 1 },
              { header: 'CON FACTURA', porcentaje: '3%', total: 1 },
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
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'PROYECTO "1"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'ÁREA 1', total: 1 },
                  { header: 'ÁREA 2', total: 1 },
                ]
              },
              {
                header: 'PROYECTO "2"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'ÁREA 1', total: 1 },
                  { header: 'ÁREA 2', total: 1 },
                ]
              },
              {
                header: 'PROYECTO "3"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'ÁREA 1', total: 1 },
                  { header: 'ÁREA 2', total: 1 },
                ]
              },
            ]
          },
          {
            header: 'COSTOS NETOS',
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              { header: 'SIN FACTURA', porcentaje: '3%', total: 1 },
              { header: 'CON FACTURA', porcentaje: '3%', total: 1 },
            ]
          }
        ]
      },

      {
        header: 'GANANCIA / PERDIDA BRUTA',
        porcentaje: 11,
        // total: 66,
        subtasks: [
          { header: 'VENTAS', total: 1 },
          { header: 'COSTOS DE VENTAS', total: 1 }
        ]
      },

      {
        header: 'GASTOS',
        // porcentaje: 11,
        // total: 66,
        subtasks: [
          {
            header: 'DEPARTAMENTOS',
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'DEPARTAMENTO "1"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },
              {
                header: 'DEPARTAMENTO "2"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },
              {
                header: 'DEPARTAMENTO "3"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },

            ]
          },
          { header: 'TOTAL DE GASTOS', total: 1 }
        ]
      },

      {
        header: 'OTROS INGRESOS',
        // porcentaje: 11,
        // total: 66,
        subtasks: [
          {
            header: 'DEPARTAMENTOS',
            total: 1,
            // porcentaje: '11%',
            subtasks: [
              {
                header: 'DEPARTAMENTO "1"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },
              {
                header: 'DEPARTAMENTO "2"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },
              {
                header: 'DEPARTAMENTO "3"',
                porcentaje: '11%',
                total: 1,
                subtasks: [
                  { header: 'SUB-AREA 1', total: 1 },
                  { header: 'SUB-AREA 2', total: 1 },
                ]
              },
            ]
          },
          { header: 'TOTAL DE INGRESOS', total: 1 }
        ]
      },

      { header: 'FLUJO DE EFECTIVO', total: 1 }
    ];
    return(
      <div className='control-pane'>
          <div className='control-section'>






              <TreeGridComponent id="costos_ventas" dataSource={sampleData} treeColumnIndex={0} childMapping='subtasks' enableHover='false' gridLines='Horizontal' rowDataBound={this.rowDataBound} enableCollapseAll={true} >
                  <ColumnsDirective>
                      <ColumnDirective field='header' width='200' headerTemplate={this.header}/>
                      <ColumnDirective field='total' width='40' textAlign='Center' headerTemplate={this.total} />
                      <ColumnDirective field='porcentaje' width='40' textAlign='Center' headerTemplate={this.porcentaje} />
                  </ColumnsDirective>
                  {/* <AggregatesDirective>
                      <AggregateDirective showChildSummary={false}>
                        <AggregateColumnsDirective>
                          <AggregateColumnDirective field='total' columnName='total' type='Sum' footerTemplate={this.footerSum} format='C2'/>
                        </AggregateColumnsDirective>
                      </AggregateDirective>
                  </AggregatesDirective>
                  <Inject services={[Aggregate]}/> */}
              </TreeGridComponent>
              
          </div>
      </div>
    )
  }
}