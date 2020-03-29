import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io();
socket.emit('ready');

export default () => {
  const [message, updateMessage] = useState('Welcome to Next.js!');

  useEffect(() => {

    socket.on('message', updateMessage);
  }, [message]);


  return (
    <main>
      <video autoPlay muted loop className="videoBackground">
        <source src="/VfE_html5.mp4" type="video/mp4" />
        Video not supported.
      </video>
      <div className="message">{ message }</div>
    </main>
  );
};
