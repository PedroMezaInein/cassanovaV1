import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Swal from 'sweetalert2'

import { apiDelete } from './../../../functions/api'
/* import styles from './CarruselAdjuntos.module.css' */

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '100vh',
        flexGrow: 1,
        height: '50vh',
    },
    adjuntos: {
        width: '100vh',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    description: {
        width: 477,
        maxHeight: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
        marginTop: 5
    },
}));


export default function CarruselAdjuntos(props) {
    const { data, id, getAdjuntos } = props;
    let adjuntos = data
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const auth = useSelector(state => state.authUser.access_token)
    const maxSteps = adjuntos.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };
    const handleDelete = (index) => {
        Swal.fire({
            title: '¿Estas seguro de eliminar este adjunto?',
            text: "No podras revertir esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Eliminando...',
                    text: 'Espere un momento por favor',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    }
                })
                apiDelete(`computo/${id}/adjuntos/${index}`, auth)
                    .then(res => {
                        getAdjuntos()
                        Swal.close()
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'El adjunto ha sido eliminado',
                            icon: 'success',
                            timer: 1500,
                            timerProgressBar: true,
                            showConfirmButton: false
                        })
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            title: 'Error!',
                            text: 'Ha ocurrido un error al eliminar el adjunto',
                            icon: 'error',
                            timer: 1500,
                            timerProgressBar: true,
                            showConfirmButton: false
                        })
                    })
            }
        })
    }

    return (
        <div className={classes.root}>
            <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                        Siguiente
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Anterior
                    </Button>
                }
            />
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                autoplay={false}

            >
                {adjuntos.map((item, index) => (
                    <div key={index} >
                        <object
                            data={item.url}
                            className={classes.adjuntos}
                        >
                        </object>
                        <br />
                        {/* <div className="text-center">
                            <a href={item.url} target="_blank" ><button className="btn btn-success">Ver</button></a>
                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </div> */}
                        <div className={classes.description}>

                            <span>{item.descripcion}</span>
                        </div>

                    </div>
                ))}
            </AutoPlaySwipeableViews>
        </div>
    );
}