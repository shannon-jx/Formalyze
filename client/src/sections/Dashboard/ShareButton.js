import React, { useState } from 'react';
import QRCode from 'qrcode';

const ShareButton = ({ url }) => {
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);

  const generateQrCode = async () => {
    try {
      const qr = await QRCode.toDataURL(url);
      setQrCode(qr);
      setShowQR(true); // Show the QR code and Copy Link button, hide the Share button
    } catch (error) {
      console.error("QR Code generation failed", error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
      <div style={{ textAlign: 'center', background: '#f9f9f9', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '250px' }}>
        {showQR && (
          <div style={{ marginBottom: '15px' }}>
            <img src={qrCode} alt="QR Code" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
          </div>
        )}
        {!showQR && (
          <button
            onClick={generateQrCode}
            style={{
              backgroundColor: '#7a94ff',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '10px',
            }}
          >
            Share
          </button>
        )}
        {showQR && (
          <button
            onClick={copyLink}
            style={{
              backgroundColor: '#7a94ff',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Copy Link
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareButton;
