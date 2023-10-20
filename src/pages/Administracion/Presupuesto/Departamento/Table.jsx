import React, { useState } from 'react';

function Table({ table, tables, setTables }) {
  const [rowData, setRowData] = useState([]);
  const [newRowData, setNewRowData] = useState({ id: '', monto: '' });

  const handleIdChange = (e) => {
    setNewRowData({ ...newRowData, id: e.target.value });
  };

  const handleMontoChange = (e) => {
    setNewRowData({ ...newRowData, monto: e.target.value });
  };

  const handleAddRow = () => {
    if (newRowData.id && newRowData.monto) {
      table.data.push({ ...newRowData });
      setTables([...tables]);
      setNewRowData({ id: '', monto: '' });
    }
  };

  const handleDeleteRow = (index) => {
    table.data.splice(index, 1);
    setTables([...tables]);
  };

  return (
    <div>
      <h2>Tabla de {table.month}</h2>
      <h3>Nombre de la tabla: {table.tableName}</h3>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Nombre</th>
            <th>ID</th>
            <th>Monto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, index) => (
            <tr key={index}>
              <td>{table.month}</td>
              <td>{table.tableName}</td>
              <td>{row.id}</td>
              <td>{row.monto}</td>
              <td>
                <button onClick={() => handleDeleteRow(index)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label>ID: </label>
        <input type="text" value={newRowData.id} onChange={handleIdChange} />
        <label>Monto: </label>
        <input type="text" value={newRowData.monto} onChange={handleMontoChange} />
        <button onClick={handleAddRow}>Agregar Fila</button>
      </div>
    </div>
  );
}

export default Table;
