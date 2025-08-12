import React from 'react';
import { toast } from 'react-hot-toast';

export default function ToastButton({ kind = 'success', label = 'Show toast', message = 'Hello!' }: { kind?: 'success' | 'error' | 'loading'; label?: string; message?: string }) {
  const onClick = () => {
    if (kind === 'success') toast.success(message);
    else if (kind === 'error') toast.error(message);
    else toast.loading(message, { duration: 1500 });
  };
  return (
    <button aria-label={label} onClick={onClick}>{label}</button>
  );
}
