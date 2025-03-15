// client/src/components/QRScanner.js
import { QrScanner } from '@yudiel/react-qr-scanner'; // Nombre correcto del import
import { useState } from 'react';
import axios from 'axios';

const QRScanner = () => {
  const [result, setResult] = useState('');

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pets/${data}/found`, {
            location: `${latitude},${longitude}`
          });
          alert('¡Dueño notificado!');
        });
      } catch (error) {
        console.error('Error al escanear QR:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <QrScanner
        onDecode={(result) => handleScan(result)}
        onError={(error) => console.log(error?.message)}
      />
      <p className="mt-4 text-center">{result}</p>
    </div>
  );
};

export default QRScanner;