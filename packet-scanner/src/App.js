import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import './App.css';

const QRScanner = ({ onScan, onError, isActive = true }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const startScanning = async () => {
      try {
        readerRef.current = new BrowserMultiFormatReader();

        const devices = await readerRef.current.listVideoInputDevices();
        if (devices.length === 0) {
          onError(new Error('No camera found'));
          return;
        }

        const selectedDeviceId = devices[0].deviceId;

        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              onScan(result.getText());
            }
            if (error && error.name !== 'NotFoundError') {
              onError(error);
            }
          }
        );
      } catch (error) {
        onError(error);
      }
    };

    startScanning();

    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [isActive, onScan, onError]);

  return (
    <div className="qr-scanner-container">
      <video ref={videoRef} className="scanner-video" />
    </div>
  );
};

function App() {
  const [packetId, setPacketId] = useState(null);
  const [startSequence, setStartSequence] = useState(null);
  const [endSequence, setEndSequence] = useState(null);
  const [selectedField, setSelectedField] = useState('packetId');
  const [message, setMessage] = useState('');

  const handleScan = (data, type) => {
  if (data && data !== null && data !== undefined) {
    let scannedValue = data;

    try {
      if (typeof data === 'string' && data.trim().startsWith('{')) {
        scannedValue = JSON.parse(data);
      }
    } catch (err) {
      console.log('Non-JSON QR data:', data);
    }
    console.log(`Scanned data for ${type}:`, scannedValue);
    

    if (typeof scannedValue === 'object') {
      if (type === 'packetId' && scannedValue.packet_id) {
        scannedValue = scannedValue.packet_id;
      } else if (type === 'startSequence' && scannedValue.start_sequence) {
        scannedValue = scannedValue.start_sequence;
      } else if (type === 'endSequence' && scannedValue.end_sequence) {
        scannedValue = scannedValue.end_sequence;
      }
    }

    if (type === 'packetId') {
      setPacketId(scannedValue);
      setMessage(`Packet ID scanned: ${scannedValue}`);
    } else if (type === 'startSequence') {
      setStartSequence(scannedValue);
      setMessage(`Start Sequence scanned: ${scannedValue}`);
    } else if (type === 'endSequence') {
      setEndSequence(scannedValue);
      setMessage(`End Sequence scanned: ${scannedValue}`);
    }
  }
};


  const handleError = (error) => {
    console.error('QR Scanner Error:', error);
    setMessage(`Scanner error: ${error.message}`);
  };

  const handleSubmit = async () => {
    if (packetId && startSequence && endSequence) {
      try {
        const packetData  = 
        {
          packet_id: packetId,
          start_sequence:startSequence,
          end_sequence:endSequence
        }
        console.log('Submitting packet data:', packetData);
        
        const response = await axios.post('http://localhost:3021/updatePacketInfo', packetData);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Error updating packet info');
      }
    } else {
      setMessage('All fields must be scanned.');
    }
  };

  const resetAll = () => {
    setPacketId(null);
    setStartSequence(null);
    setEndSequence(null);
    setMessage('All fields reset.');
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>QR Code Packet Scanner</h1>

      {/* Field Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="fieldSelect"><strong>Select Field to Scan:</strong></label>
        <select
          id="fieldSelect"
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="packetId">Packet ID</option>
          <option value="startSequence">Start Sequence</option>
          <option value="endSequence">End Sequence</option>
        </select>
      </div>

      {/* QR Scanner */}
      <h3>Currently Scanning: <span style={{ color: '#007bff' }}>{selectedField}</span></h3>
      <QRScanner
        onScan={(data) => handleScan(data, selectedField)}
        onError={handleError}
        isActive={true}
      />

      {/* Scanned Results */}
      <div className="scanned-values" style={{ marginTop: '30px' }}>
        <h3>Scanned Values:</h3>
        <p>
          <strong>Packet ID:</strong> {packetId || 'Not scanned'}{' '}
          {packetId && <button onClick={() => setPacketId(null)}>Reset</button>}
        </p>
        <p>
          <strong>Start Sequence:</strong> {startSequence || 'Not scanned'}{' '}
          {startSequence && <button onClick={() => setStartSequence(null)}>Reset</button>}
        </p>
        <p>
          <strong>End Sequence:</strong> {endSequence || 'Not scanned'}{' '}
          {endSequence && <button onClick={() => setEndSequence(null)}>Reset</button>}
        </p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleSubmit}
          disabled={!packetId || !startSequence || !endSequence}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            marginRight: '10px',
            cursor: 'pointer',
          }}
        >
          Submit Packet Info
        </button>
        <button
          onClick={resetAll}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reset All
        </button>
      </div>

      {/* Message Box */}
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: message.toLowerCase().includes('error') ? '#ffebee' : '#e8f5e9',
          color: message.toLowerCase().includes('error') ? '#c62828' : '#2e7d32',
          borderRadius: '5px',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
