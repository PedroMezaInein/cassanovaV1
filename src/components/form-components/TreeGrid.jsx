

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
        // <div className="text-muted font-size-lg font-weight-bolder"> 
        //   Total
        // </div>
        <div> </div>
    )
  }
  porcentaje = () => {
    return (
        // <div className="text-muted font-size-lg font-weight-bolder"> 
        //   Porcentaje
        // </div>
        <div> </div>
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
  render() {
    const sampleData = [
      // {
      //     header: 'VENTAS',
      //     // porcentaje: 11,
      //     // total: 66,
      //     subtasks: [
      //         {
      //             header: 'FASE 1',
      //             total: 1,
      //             porcentaje: '11%',
      //             subtasks: [
      //                 {
      //                     header: 'PROYECTO "X"',
      //                     porcentaje:'11%',
      //                     total: 1,
      //                     subtasks: [
      //                         {
      //                             header: 'ÁREA',
      //                             porcentaje:'11%',
      //                             total: 1,
      //                             subtasks: [
      //                                 { header: 'SUBÁREA 1',  porcentaje: '3%', total: 1 },
      //                                 { header: 'SUBÁREA 2',  porcentaje: '3%', total: 1 },
      //                             ]
      //                         }
      //                     ]
      //                 }
      //             ]
      //         }
      //     ]
      // },
      {
        header: 'COSTOS DE VENTAS',
        // porcentaje: 11,
        // total: 66,
        subtasks: [
            {
                header: 'PROYECTOS',
                total: 1,
                porcentaje: '11%',
                subtasks: [
                    {
                        header: 'PROYECTO "X"',
                        porcentaje:'11%',
                        total: 1,
                        subtasks: [
                            {
                                header: 'ÁREA',
                                porcentaje:'11%',
                                total: 1,
                                subtasks: [
                                    { header: 'SUBÁREA 1',  porcentaje: '3%', total: 1 },
                                    { header: 'SUBÁREA 2',  porcentaje: '3%', total: 1 },
                                ]
                            }
                        ]
                    },
                    { header: 'SIN FACTURA',  porcentaje: '3%', total: 1 },
                    { header: 'CON FACTURA',  porcentaje: '3%', total: 1 },
                    { header: 'COSTOS NETOS',  porcentaje: '3%', total: 1  },
                    { header: 'GANANCIA / PERDIDA BRUTA',  porcentaje: '3%',  total: 1  },
                    { header: 'VENTAS',  porcentaje: '3%', total: 1 },
                    { header: 'COSTOS DE VENTAS',  porcentaje: '3%', total: 1 },
                ]
                
            }
        ]
    }
      
  ];
    return(
      <div className='control-pane'>
          <div className='control-section'>
              <TreeGridComponent id="costos_ventas" dataSource={sampleData} treeColumnIndex={0} childMapping='subtasks' enableHover='false' gridLines='Horizontal' enableCollapseAll={true} >
                  <ColumnsDirective>
                      <ColumnDirective field='header' width='200' headerTemplate={this.header}/>
                      <ColumnDirective field='total' width='40' textAlign='Center' headerTemplate={this.total} />
                      <ColumnDirective field='porcentaje' width='30' textAlign='Center' headerTemplate={this.porcentaje} />
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