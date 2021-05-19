

import * as React from 'react';
import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';

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
        <div className="text-muted font-size-lg font-weight-bolder"> 
          Total
        </div>
    )
  }
  porcentaje = () => {
    return (
        <div className="text-muted font-size-lg font-weight-bolder"> 
          Porcentaje
        </div>
    )
  }
  render() {
    const sampleData = [
      {
          header: 'VENTAS',
          // porcentaje: 11,
          // total: 66,
          subtasks: [
              {
                  header: 'FASE 1',
                  total: 50,
                  porcentaje: '11%',
                  subtasks: [
                      {
                          header: 'PROYECTO "X"',
                          porcentaje:'11%',
                          total: 10,
                          subtasks: [
                              {
                                  header: 'ÁREA',
                                  porcentaje:'11%',
                                  total: 10,
                                  subtasks: [
                                      { header: 'SUBÁREA 1',  porcentaje: '3%', total: '50' },
                                      { header: 'SUBÁREA 2',  porcentaje: '3%', total: '50' },
                                  ]
                              }
                          ]
                      }
                  ]
              }
          ]
      }
      
  ];
    return(
      <div className='control-pane'>
      <div className='control-section'>
          <TreeGridComponent dataSource={sampleData} childMapping='subtasks' treeColumnIndex={0}   enableHover='false' gridLines='Horizontal' enableCollapseAll={true} >
              <ColumnsDirective>
                  <ColumnDirective field='header' width='200' headerTemplate={this.header}/>
                  <ColumnDirective field='total' width='90' textAlign='Center' headerTemplate={this.total} />
                  <ColumnDirective field='porcentaje' width='90' textAlign='Center' headerTemplate={this.porcentaje} />
              </ColumnsDirective>
          </TreeGridComponent>
      </div>
  </div>
    )
  }
}