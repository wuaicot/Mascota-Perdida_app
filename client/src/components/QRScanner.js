// client/src/components/QRScanner.js
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import QrCodeIcon from "@mui/icons-material/QrCode";
import OwnerContactModal from "./OwnerContactModal"; // Modal para mostrar los datos de contacto del Dueño

const QRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [ownerContact, setOwnerContact] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleScan = useCallback(
    async (data) => {
      if (!data) return;
      setIsScanning(false);
      setScanResult(data);
      console.log("QR-id escaneado:", data);

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true,
          });
        });
        const { latitude, longitude } = position.coords;

        // Registrar y comprobar la URL final
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/pets/${data}/found`;
        console.log("Enviando petición a:", apiUrl);

        const response = await axios.post(apiUrl, {
          location: { latitude, longitude },
        });
        console.log("Respuesta de la API:", response.data);

        // Redirigir directamente al dashboard del héroe después de un escaneo exitoso
        router.push("/heroe/dashboardheroe");

        setScanResult("");
      } catch (error) {
        console.error("Error en handleScan:", error);
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Debes habilitar los permisos de ubicación para poder reportar la mascota encontrada."
          );
        } else if (error.code === error.TIMEOUT) {
          alert(
            "No se pudo obtener la ubicación a tiempo. Por favor, intenta nuevamente en un área con mejor señal GPS."
          );
        } else {
          alert(
            "Ocurrió un error al procesar el escaneo. Por favor, intenta nuevamente."
          );
        }
      }
    },
    [router]
  );

  const handleError = useCallback((error) => {
    console.error("Error del escáner QR:", error?.message);
    alert(
      "No se pudo iniciar la cámara para el escaneo QR. Asegúrate de que la cámara esté habilitada y no esté siendo utilizada por otra aplicación."
    );
    setIsScanning(false);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanResult(""); // Limpiar resultado previo al iniciar un nuevo escaneo
  };

  const stopScan = () => {
    setIsScanning(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setOwnerContact(null);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Reportar Mascota Encontrada
      </h2>
      <p className="mb-4 text-gray-700">
        Si has encontrado una mascota con un collar y un código QR, puedes
        escanearlo para notificar a su dueño de forma anónima y compartir tu
        ubicación aproximada.
      </p>

      {!isScanning && (
        <button
          onClick={startScan}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline animate-bounce"
        >
          <QrCodeIcon sx={{ fontSize: 24, mr: 1, verticalAlign: "middle" }} />
          Escanear<span className="text-xl"> QR</span>
        </button>
      )}

      {isScanning && (
        <div className="relative w-full overflow-hidden rounded-md mb-4">
          <Scanner
            onDecode={handleScan}
            onError={handleError}
            constraints={{ facingMode: "environment" }}
            className="w-full"
          />
          <button
            onClick={stopScan}
            className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline text-sm"
          >
            <svg
              className="w-4 h-4 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
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
            Código QR escaneado:{" "}
            <span className="font-semibold">{scanResult}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Intentando reportar la mascota encontrada... (Por favor, asegúrate
            de que tu ubicación esté habilitada).
          </p>
        </div>
      )}

      {!isScanning && !scanResult && (
        <p className="mt-4 text-center text-sm text-red-500">
          Haz clic en el botón &quot;Escanear Código QR&quot; para activar la
          cámara y escanear el código del collar de la mascota encontrada.
        </p>
      )}

      {modalOpen && ownerContact && (
        <OwnerContactModal
          isOpen={modalOpen}
          onClose={closeModal}
          ownerContact={ownerContact}
        />
      )}
    </div>
  );
};

export default QRScanner;
