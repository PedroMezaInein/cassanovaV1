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
import style from './CarruselCompras.module.scss'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 550,
        flexGrow: 1,
        height: 350,
    },
    adjuntos: {
        width: 550,
        height: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export default function CarruselAdjuntos(props) {
    const { data, id, getAdjuntos, reloadKey } = props;
    let adjuntos = data
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const auth = useSelector(state => state.authUser.access_token)
    const maxSteps = adjuntos?.length || 0;

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
        // console.log('idadjunto', index)
        // console.log('idRequisicion', id)
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
                apiDelete(`v2/proyectos/compras/${id}/adjuntos/${index}`, auth)
                    .then(res => {
                        // console.log(res)
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
                sx={{ padding: 2, textAlign: 'center', }}

            >
                {adjuntos.map((item, index) => {
                    // ✅ usa la firmada tal cual
                    let href = item.url_temporal;

                    // ⚠️ Sólo si NO hay firmada, arma la pública
                    if (!href && item.url) {
                        const base = 'https://adminpruebas.s3.us-east-2.amazonaws.com/';
                        href = item.url.startsWith('http') ? item.url : base + item.url;
                    }

                    // ❌ NO agregar query extra a una URL firmada (rompe la firma y/o el cache)
                    // if (href) href += ...  ← elimínalo

                    return (
                        <div key={`${index}-${reloadKey}`}>
                            <iframe
                                key={`${(item.id || index)}-${reloadKey}`} // fuerza remount sin tocar href
                                src={href}
                                title={`adjunto-${item.id || index}`}
                                className={classes.adjuntos}
                                style={{ border: 0, width: 550, height: 250 }}
                            />
                            <br />
                            <div className="text-center">
                                <button id={style.button_delete} onClick={() => handleDelete(item.id)}>Eliminar</button>
                                <a style={{ marginLeft: '2rem' }} href={href} target="_blank" rel="noopener noreferrer">
                                    <button id={style.button_view}>Ver</button>
                                </a>
                            </div>
                        </div>
                    );
                })}

            </AutoPlaySwipeableViews>
        </div>
    );
}