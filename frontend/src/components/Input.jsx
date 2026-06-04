import React from 'react';
import '../styles/components.css';

export default function Input({ label, error, ...props }){
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${error? 'input-error':''}`} {...props} />
      {error && <div className="input-error-msg">{error}</div>}
    </div>
  );
}
