import React, { useState } from 'react';
import { Fingerprint, Loader, CheckCircle, XCircle } from 'lucide-react';
import { scanFingerprint } from '../../src/servicios/fingerprintService';
import { getAllPersonnel, createPersonnel } from '../../src/servicios/personnelService';

interface FingerprintScannerProps {
  onScanComplete: (token: string) => void;
  onScanError?: (error: string) => void;
  disabled?: boolean;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export const FingerprintScanner: React.FC<FingerprintScannerProps> = ({
  onScanComplete,
  onScanError,
  disabled = false
}) => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [token, setToken] = useState<string>('');

  const handleScan = async () => {
    try {
      setScanStatus('scanning');
      setScanError(null);
      setToken('');

      const response = await personnelService.scanFingerprint();
      setScanStatus('success');
      setToken(response.data.token);
      onScanComplete(response.data.token);
    } catch (err) {
      setScanStatus('error');
      const errorMessage = 'Error al escanear la huella dactilar';
      setScanError(errorMessage);
      onScanError?.(errorMessage);
      console.error('Error:', err);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleScan}
          disabled={disabled || scanStatus === 'scanning' || scanStatus === 'success'}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            disabled || scanStatus === 'scanning' ? 'bg-gray-400 cursor-not-allowed' :
            scanStatus === 'success' ? 'bg-green-500 text-white' :
            'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {scanStatus === 'scanning' ? (
            <Loader size={20} className="animate-spin" />
          ) : scanStatus === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <Fingerprint size={20} />
          )}
          <span>
            {scanStatus === 'scanning' ? 'Escaneando...' :
             scanStatus === 'success' ? 'Huella Capturada' :
             'Escanear Huella'
            }
          </span>
        </button>

        {scanStatus === 'success' && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            ¡Listo! ID: {token}
          </span>
        )}
        {scanStatus === 'error' && scanError && (
          <span className="text-sm text-red-600 flex items-center gap-1">
            <XCircle size={16} /> {scanError}
          </span>
        )}
        {scanStatus === 'idle' && !token && (
          <span className="text-sm text-gray-500">Presione el botón para escanear.</span>
        )}
      </div>
    </div>
  );
}; 