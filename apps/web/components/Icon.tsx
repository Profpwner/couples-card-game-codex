import React from 'react';

type IconName = 'help';

export default function Icon({ name, label }: { name: IconName; label?: string }) {
  const aria = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true } as any;
  switch (name) {
    case 'help':
      return <span {...aria}>❓</span>;
    default:
      return null;
  }
}

