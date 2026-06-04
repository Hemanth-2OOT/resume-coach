import React from 'react';
import '../styles/components.css';

export default function EmptyState({ title='No data', message='' }){
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
