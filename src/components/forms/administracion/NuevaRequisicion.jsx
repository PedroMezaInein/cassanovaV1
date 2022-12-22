import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';

// function NuevaRequisicion () {
    // const auth = useSelector(state => state.authUser.access_token)

    // const useStyles = makeStyles((theme) => ({
    //     formControl: {
    //       margin: theme.spacing(1),
    //       minWidth: 120,
    //     },
    //     selectEmpty: {
    //       marginTop: theme.spacing(2),
    //     },
    // }));
      
    // export default function NativeSelects() {
    // const classes = useStyles();
    // const [state, setState] = React.useState({
    //     age: '',
    //     name: 'hai',
    // });
      
    // const handleChange = (event) => {
    //     const name = event.target.name;
    //     setState({
    //     ...state,
    //     [name]: event.target.value,
    //     });
    // };


    // return (
    //     <>

    //     <FormControl className={classes.formControl}>
    //         <InputLabel htmlFor="age-native-simple">Age</InputLabel>
    //             <Select
    //             native
    //             value={state.age}
    //             onChange={handleChange}
    //             inputProps={{
    //                 name: 'age',
    //                 id: 'age-native-simple',
    //             }}
    //             >
    //             <option aria-label="None" value="" />
    //             <option value={10}>Ten</option>
    //             <option value={20}>Twenty</option>
    //             <option value={30}>Thirty</option>
    //             </Select>
    //   </FormControl>

    //     <p>Llena todos los campos</p>
    //     <label>Fecha
    //         <input type='text'></input>
    //     </label>
    //     <br/>
    //     <label>Departamento
    //         <input type='text'></input>
    //     </label>
    //     <br/>
    //     <label>Tipo de gasto
    //         <input type='text'></input>
    //     </label>
    //     <br/>
    //     <label>Descripcion
    //         <input type='text'></input>
    //     </label>
    //     </>
    // )
// }

// export { NuevaRequisicion }


export default function NativeSelects() {
    const useStyles = makeStyles((theme) => ({
        formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        },
        selectEmpty: {
        marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();
    const [state, setState] = React.useState({
      fecha: '',
      departamento: '',
      tipoEgreso: '',
      descripcion: '',
    });    
    
    const handleChange = (event) => {
    const name = event.target.name;
    setState({
        ...state,
        [name]: event.target.value,
    });
    };

    const inputComentario = makeStyles((theme) => ({
        root: {
          '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
          },
        },
      }));

    const comentario = inputComentario();
    const [value, setValue] = React.useState('Controlled');

    const handleChangeComentario = (event) => {
        setValue(event.target.value);
    };
    
    return (
        <div>
            <FormControl className={classes.formControl}>
            <form className={classes.container} noValidate>
                <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    defaultValue="2017-05-24"
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
            </form>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Departamento</InputLabel>
                <Select
                    native
                    value={state.departamento}
                    onChange={handleChange}
                    inputProps={{
                    name: 'departamento',
                    id: 'age-native-simple',
                    }}
                >
                <option aria-label="None" value="" />
                <option value={10}>TI</option>
                <option value={20}>Compras</option>
                <option value={30}>Proyectos</option>
                <option value={40}>RH</option>
                <option value={50}>Mercadotecnia</option>
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Tipo de egreso</InputLabel>
                <Select
                    native
                    value={state.tipoEgreso}
                    onChange={handleChange}
                    inputProps={{
                    name: 'tipoEgreso',
                    id: 'age-native-simple',
                    }}
                >
                <option aria-label="None" value="" />
                <option value={10}>A</option>
                <option value={20}>B</option>
                <option value={30}>C</option>
                <option value={40}>D</option>
                <option value={50}>E</option>
                </Select>
            </FormControl>

            <FormControl className={comentario.formControl}>
            <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                rows={4}
                defaultValue="Default Value"
                variant="outlined"
            />
            </FormControl>
        </div>

    );  
}