import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import axios from 'axios';

const QRScanner = () => {
  const [result, setResult] = useState('');

  const handleScan = async (data) => {
    if (!data) return;
    
    try {
      setResult(data);
      
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000
        });
      });

      const { latitude, longitude } = position.coords;
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pets/${data}/found`,
        { location: `${latitude},${longitude}` }
      );
      
      alert('¡Dueño notificado! Se ha enviado un correo electrónico con la ubicación.');
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        alert('Debes habilitar los permisos de ubicación para usar esta función');
      } else {
        console.error('Error:', error);
        alert('Error al procesar el escaneo. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="p-4">
      <QrScanner
        onDecode={handleScan}
        onError={(error) => console.log('Error QR:', error?.message)}
        constraints={{
          facingMode: 'environment'
        }}
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        Escanea el código QR del collar de la mascota
      </p>
    </div>
  );
};

export default QRScanner;