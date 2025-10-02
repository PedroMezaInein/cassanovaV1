import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { URL_DEV } from '../../../constants';
import { waitAlert, printResponseErrorAlert } from '../../../functions/alert';
import { setSingleHeader } from '../../../functions/routers';

const ModalImportarExcel = ({ handleClose, at, reloadData }) => {
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const camposDecimales = [
          'NOMINA IMSS',
          'EFECTIVO QNAL',
          'EXTRAS IMSS',
          'EXTRAS EFECTIVO',
          'ISR',
          'INFONAVIT /RSV',
          'IMSS',
          'ISN',
          'COMISION EFECTIVO',
          'Total'
        ];

        const json = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          raw: true,
        }).map(row => {
          camposDecimales.forEach(key => {
            if (row[key] !== undefined && row[key] !== '') {
              row[key] = limpiarYParsear(row[key]);
            }
          });
          return row;
        });

        setExcelData(json);
      } catch (error) {
        Swal.fire('Error', 'El archivo no es válido o está dañado.', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  
  const limpiarYParsear = (valor) => {
    if (typeof valor === 'string') {
      const limpio = valor.replace(/[^0-9.-]+/g, ''); // quita $, comas y cualquier otro carácter no numérico
      const numero = parseFloat(limpio);
      return isNaN(numero) ? valor : numero;
    } else if (typeof valor === 'number') {
      return valor;
    }
    return valor;
  };


  const confirmarImportacion = async () => {
    try {
      waitAlert();

      const camposDecimales = [
        'NOMINA IMSS',
        'EFECTIVO QNAL',
        'EXTRAS IMSS',
        'EXTRAS EFECTIVO',
        'ISR',
        'INFONAVIT /RSV',
        'IMSS',
        'ISN',
        'COMISION EFECTIVO',
        'Total'
      ];

      const datosFormateados = excelData.map(row => {
        const nuevo = { ...row };
        camposDecimales.forEach(key => {
          if (nuevo[key] !== undefined && nuevo[key] !== '') {
            const val = limpiarYParsear(nuevo[key]);
            nuevo[key] = typeof val === 'number' ? val.toFixed(2) : val;
          }
        });
        return nuevo;
      });

      const res = await axios.post(`${URL_DEV}v2/rh/empleados/importar-nomina`, datosFormateados, {
        headers: setSingleHeader(at),
      });

      Swal.close();

      const detalles = res.data.detalles || [];
      const noEncontrados = detalles.filter(d => d.status === 'no encontrado');

      if (noEncontrados.length > 0) {
        const lista = noEncontrados.map(e => `• ${e.nombre_excel}`).join('\n');

        Swal.fire({
          icon: 'warning',
          title: 'Importación parcial',
          html: `
            <p>Algunos empleados no fueron encontrados:</p>
            <pre style="text-align:left; white-space:pre-wrap;">${lista}</pre>
          `,
          confirmButtonText: 'Aceptar',
          width: 600,
        });
      } else {
        Swal.fire('Importado', 'Todos los empleados fueron actualizados correctamente.', 'success');
      }

      reloadData();
      handleClose();
    } catch (error) {
      printResponseErrorAlert(error);
    }
  };



  return (
    <Box>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {excelData.length > 0 && (
        <>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                {Object.keys(excelData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {excelData.map((row, i) => (
                <TableRow key={i}>
                  {Object.values(row).map((value, j) => (
                    <TableCell key={j}>
                      {typeof value === 'number'
                        ? value.toFixed(2)
                        : value}
                    </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="success"
            onClick={confirmarImportacion}
          >
            Confirmar Importación
          </Button>
        </>
      )}
    </Box>
  );
};

export default ModalImportarExcel;
