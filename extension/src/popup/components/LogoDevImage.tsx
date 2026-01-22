import React, { useState } from 'react';
import { FaBuilding } from 'react-icons/fa';

interface LogoDevImageProps {
  companyName: string;
  size?: number;
  className?: string;
}

const LogoDevImage: React.FC<LogoDevImageProps> = ({ companyName, size = 24, className = '' }) => {
  const [error, setError] = useState(false);
  const publicKey = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

  if (error || !publicKey) {
    return <FaBuilding size={size} className={className} />;
  }

  return (
    <img
      src={`https://img.logo.dev/name/${encodeURIComponent(companyName)}?token=${publicKey}`}
      alt={`${companyName} logo`}
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }}
      className={`rounded-sm ${className}`}
      onError={() => setError(true)}
    />
  );
};

export default LogoDevImage;
