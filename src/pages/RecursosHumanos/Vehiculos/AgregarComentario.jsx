import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { apiPostForm, apiGet, apiPutForm } from '../../../functions/api';
import '../../../styles/_salaJuntas.scss'

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '30ch',
      },
    },
  }));

export default function AgregarComentario({ closeModal, rh, }) {
    const userAuth = useSelector((state) => state.authUser);

    // MATERIAL UI
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <TextField
                    id="standard-multiline-static"
                    label="Descripción"
                    multiline
                    rows={4}
                    // defaultValue="Default Value"
                />
            </div>
            <div>
                <button>Enviar</button>
            </div>
        </>
    )     
}