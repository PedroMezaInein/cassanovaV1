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

import { apiDelete } from '../../../../../functions/api'
import './../../../../../styles/_adjuntosRequisicion.scss'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 480,
        flexGrow: 1,
        height: 350,
    },
    adjuntos: {
        width: 450,
        height: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export default function CarruselAdjuntos(props) { 
    const { data, id, getAdjuntos } = props;
    let adjuntos = data
    console.log(data)
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
                apiDelete(`proyectos/${id}/adjunto/${index}`, auth)
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
                        <div className="text-center">
                            <a href={item.url} target="_blank" ><button className="btn btn-success">Ver</button></a>
                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </div>

                    </div>
                ))}
            </AutoPlaySwipeableViews>
        </div>
    );
}
