import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { PDFDocument, rgb } from 'pdf-lib';

export default function SignatureOverlay({ onClose, pdfUrl }) {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [inputMode, setInputMode] = useState('upload');
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [signatureReady, setSignatureReady] = useState(false);

  useEffect(() => {
    localStorage.removeItem('customSignature');
    setSignatureReady(false);
  }, []);

  const handleDragEnd = (event) => {
    const { delta } = event;
    if (delta) {
      setPosition((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }
  };

  const startDraw = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const saveDrawnSignature = () => {
    const dataURL = canvasRef.current.toDataURL('image/png');
    localStorage.setItem('customSignature', dataURL);
    setSignatureReady(true);
    alert('🖋 Signature saved!');
  };

  const handleUploadSignature = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem('customSignature', reader.result);
      setSignatureReady(true);
      alert('📁 Signature image saved!');
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleDownloadSignedPDF = async () => {
    try {
      const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
      const signatureSrc = localStorage.getItem('customSignature') || '/signature.png';
      const signatureImageBytes = await fetch(signatureSrc).then(res => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const scale = 0.25;
      const scaledWidth = signatureImage.width * scale;
      const scaledHeight = signatureImage.height * scale;

      const x = position.x;
      const y = height - position.y - scaledHeight;

      firstPage.drawImage(signatureImage, {
        x,
        y,
        width: scaledWidth,
        height: scaledHeight,
      });

      const user = JSON.parse(localStorage.getItem('user'));
      const signerName = user?.user?.name || 'Unknown';
      const date = new Date().toLocaleString();

      firstPage.drawText(`Signed by ${signerName} on ${date}`, {
        x,
        y: y - 15,
        size: 10,
        color: rgb(0, 0, 0),
      });

      const signedPdfBytes = await pdfDoc.save();
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const fileName = `signed_${Date.now()}.pdf`;
      link.download = fileName;
      link.click();

      const key = `signedFiles_${user?.user?.email}`;
      const signedFiles = JSON.parse(localStorage.getItem(key)) || [];
      signedFiles.push({ name: fileName, url: link.href });
      localStorage.setItem(key, JSON.stringify(signedFiles));
    } catch (err) {
      console.error('❌ Error signing PDF:', err);
      alert('Failed to sign and download PDF');
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative w-[95%] h-[90%] bg-white shadow-lg p-4 rounded overflow-hidden flex flex-col">
        <button
          className="absolute top-2 right-2 text-red-500 font-bold text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">🖋 Add Your Signature</h2>

        {/* Signature method buttons */}
        <div className="mb-4 flex flex-wrap gap-4">
          <button
            onClick={() => setInputMode('upload')}
            className={`px-4 py-2 rounded ${inputMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setInputMode('draw')}
            className={`px-4 py-2 rounded ${inputMode === 'draw' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Draw Signature
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('customSignature');
              setSignatureReady(false);
              alert('🗑 Signature reset. You can now upload or draw again.');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset Signature
          </button>
        </div>

        {/* Upload or Draw */}
        {inputMode === 'upload' && (
          <div className="mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadSignature}
              className="w-full text-sm"
            />
          </div>
        )}

        {inputMode === 'draw' && (
          <div className="mb-6">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="border border-gray-300 rounded"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
            />
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                onClick={saveDrawnSignature}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Save Signature
              </button>
              <button
                onClick={() => {
                  const ctx = canvasRef.current.getContext('2d');
                  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* PDF and Signature Placement */}
        <div className="flex-grow relative mt-2">
          <DndContext onDragEnd={handleDragEnd}>
            <PDFDropZone pdfUrl={pdfUrl} />
            {signatureReady && localStorage.getItem('customSignature') && (
              <SignatureImage position={position} />
            )}
          </DndContext>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadSignedPDF}
          className="mt-4 self-end bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Download Signed PDF
        </button>
      </div>
    </div>
  );
}

// 🖼 Draggable Signature
function SignatureImage({ position }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: 'signature-image' });
  const signatureSrc = localStorage.getItem('customSignature') || '/signature.png';

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    position: 'absolute',
    top: position.y,
    left: position.x,
    width: '150px',
    cursor: 'move',
    zIndex: 10,
  };

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={signatureSrc}
      alt="Signature"
      style={style}
    />
  );
}

// 📄 PDF Preview Area
function PDFDropZone({ pdfUrl }) {
  const { setNodeRef } = useDroppable({ id: 'pdf-zone' });

  return (
    <div
      ref={setNodeRef}
      className="relative w-full h-full border rounded overflow-hidden"
    >
      <iframe
        src={pdfUrl}
        title="PDF"
        className="w-full h-full"
      />
    </div>
  );
}