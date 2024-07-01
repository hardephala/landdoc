import React, { useState, useEffect } from 'react';

const Modal = ({ text, status, position }) => {
  const [color, setColor] = useState('');
  const [hidden, setHidden] = useState(false);
  const [header, setHeader] = useState('');

  useEffect(() => {
    switch (status) {
      case 'success':
        setColor('rgb(221, 255, 221)');
        setHeader('SUCCESS');
        break;
      case 'warning':
        setColor('rgb(255, 255, 204)');
        setHeader('WARNING');
        break;
      case 'error':
        setColor('rgb(255, 221, 221)');
        setHeader('ERROR');
        break;
      default:
        setColor('');
        setHeader('');
    }
  }, [status]);

  return (
    <div style={{ background: color }} className={`${hidden ? 'modal-closed' : ""} ${position ? 'modal-bottom' : 'modal'}`}>
      <div className='modal-header'>
        <div>{header}</div>
        <div style={{ cursor: "pointer" }} onClick={() => setHidden(true)}>x</div>
      </div>
      <div className='modal-body'>{text}</div>
    </div>
  );
}

export default Modal;
