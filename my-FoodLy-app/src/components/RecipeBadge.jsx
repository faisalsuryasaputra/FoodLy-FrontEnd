import React from 'react';

// Menambahkan prop textColor agar warna teks bisa diubah jika nanti dibutuhkan,
// namun default-nya tetap abu-abu (text-secondary)
export const RecipeBadge = ({ 
  icon: Icon, 
  text, 
  colorClass = "text-secondary", 
  textColor = "text-secondary" 
}) => {
  return (
    <div className="d-flex align-items-center gap-2">
      {/* Icon akan mengambil warna dari colorClass (misal: text-danger, text-warning) */}
      <Icon className={colorClass} size={16} />
      
      {/* Teks dikunci menggunakan textColor agar selalu konsisten */}
      <span className={`${textColor} m-0`}>{text}</span>
    </div>
  );
};