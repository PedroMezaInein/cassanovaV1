import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import './../../../../styles/_adjuntosVehiculos.scss'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 480,
        flexGrow: 1,
        height: 380,
    },
    adjuntos: {
        width: 477,
        height: 320,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
                        <div className="container_btns">
                            <a href={item.url} target="_blank" ><button className="btn_ver">Ver</button></a>
                        </div>

                    </div>
                ))}
            </AutoPlaySwipeableViews>
        </div>
    );
}