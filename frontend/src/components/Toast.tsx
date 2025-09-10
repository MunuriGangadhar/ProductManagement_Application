import React from 'react';

interface ToastProps{
  message:string;
  type:'success'|'error';
}

const Toast:React.FC<ToastProps>=({message,type})=>{
  return(
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default Toast;