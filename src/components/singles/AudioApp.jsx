import React, { useEffect } from 'react';
import { toAbsoluteUrl } from '../../functions/routers'

function AudioApp(){
  const audioTune = new Audio(toAbsoluteUrl('/sounds/alert.mp3'));
  // variable to play audio in loop
  
  // load audio file on component load
  useEffect(
    () => {
      audioTune.load();
      audioTune.loop = true;
      audioTune.play();
      return () => {
        audioTune.pause();
      }
    }, []
  )

  // set the loop of audio tune
  return (
    <div className="audio">
      {/* {playSound()} */}
      {/* <div type="button" className="btn btn-primary mr-2" value="Play" onClick={playSound}>HOLA</div> */}
    </div>
  );
  
}

export default AudioApp