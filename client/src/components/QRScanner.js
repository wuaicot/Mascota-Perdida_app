import { Scanner } from '@yudiel/react-qr-scanner';
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import QrCodeIcon from '@mui/icons-material/QrCode';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  const handleScan = useCallback(async (data) => {
    if (!data) return;
    setIsScanning(false); // Stop scanning after a successful scan
    setScanResult(data);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000, // Increased timeout for better reliability
          enableHighAccuracy: true, // Request higher accuracy if available
        });
      });

      const { latitude, longitude } = position.coords;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pets/${data}/found`,
        { location: { latitude, longitude } } // Send location as an object
      );

      alert('¡Mascota reportada como encontrada! Se ha notificado al dueño y se le ha enviado un correo electrónico con la ubicación aproximada.');
      setScanResult(''); // Clear the result for the next scan
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        alert('Debes habilitar los permisos de ubicación para poder reportar la mascota encontrada.');
      } else if (error.code === error.TIMEOUT) {
        alert('No se pudo obtener la ubicación a tiempo. Por favor, intenta nuevamente en un área con mejor señal GPS.');
      } else {
        console.error('Error al procesar el escaneo:', error);
        alert('Ocurrió un error al procesar el escaneo. Por favor, intenta nuevamente.');
      }
    }
  }, [setScanResult]);

  const handleError = useCallback((error) => {
    console.error('Error del escáner QR:', error?.message);
    alert('No se pudo iniciar la cámara para el escaneo QR. Asegúrate de que la cámara esté habilitada y no esté siendo utilizada por otra aplicación.');
    setIsScanning(false);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanResult(''); // Clear previous result when starting a new scan
  };

  const stopScan = () => {
    setIsScanning(false);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Reportar Mascota Encontrada</h2>
      <p className="mb-4 text-gray-700">
        Si has encontrado una mascota con un collar y un código QR, puedes escanearlo para notificar a su dueño de forma anónima y compartir tu ubicación aproximada.
      </p>

      {!isScanning && (
        <button
        onClick={startScan}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate-bounce "
      >
        <QrCodeIcon sx={{ fontSize: 24, mr: 1, verticalAlign: 'middle' }} />
        Escanear Código QR
      </button>
      
      
      )}

      {isScanning && (
        <div className="relative w-full overflow-hidden rounded-md mb-4">
          <Scanner
            ref={scannerRef}
            onDecode={handleScan}
            onError={handleError}
            constraints={{
              facingMode: 'environment',
            }}
            className="w-full"
          />
          <button
            onClick={stopScan}
            className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline text-sm"
          >
            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <p className="absolute bottom-2 left-2 text-white text-sm bg-gray-800 bg-opacity-50 rounded-md py-1 px-2">
            Apuntando a un código QR...
          </p>
        </div>
      )}

      {scanResult && !isScanning && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">
            Código QR escaneado: <span className="font-semibold">{scanResult}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Intentando reportar la mascota encontrada... (Por favor, asegúrate de que tu ubicación esté habilitada).
          </p>
        </div>
      )}

      {!isScanning && !scanResult && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Haz clic en el botón &quot;Escanear Código QR&quot; para activar la cámara y escanear el código del collar de la mascota encontrada.
        </p>
      )}
    </div>
  );
};

export default QRScanner;