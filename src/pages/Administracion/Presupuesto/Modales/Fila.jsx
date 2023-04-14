import React, { useState } from 'react'

import CurrencyTextField from '@unicef/material-ui-currency-textfield'

export default function Fila(props) { 
    return (
        <>
            
            <CurrencyTextField
                label="monto solicitado"
                variant="standard"
                /* value={form.monto} */
                currencySymbol="$"
                outputFormat="number"
                /* onChange={(event, value) => handleMoney(value)}
                error={errores.monto ? true : false} */
            />
            
        </>
    )
}