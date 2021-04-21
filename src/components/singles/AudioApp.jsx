import React, { useEffect } from 'react';
import { toAbsoluteUrl } from '../../functions/routers'

function AudioApp(){
    
    /* audioTune.load();
    audioTune.loop = true;
    audioTune.play(); */
    // variable to play audio in loop
    // load audio file on component load
    useEffect(
        () => {
            const audioTune = new Audio(toAbsoluteUrl('/sounds/alert2.mp3'));
            audioTune.load();
            audioTune.loop = true;
            audioTune.play();
            return () => {
                audioTune.pause();
            }
        }, []
    )

    // set the loop of audio tune
    return ( <div className="audio" /> );
}

export default AudioApp