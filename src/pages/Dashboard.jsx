import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../utils/auth';
import PDFViewer from '../components/PDFViewer';
import SignatureOverlay from '../components/SignatureOverlay';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSignature, setShowSignature] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState('');

  useEffect(() => {
    if (!user || !user.token) {
      alert("Please log in first");
      navigate('/');
    } else {
      fetchFiles();
    }
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('https://signature-app-server-1.onrender.com/api/docs/user', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      setUploadedFiles(data);
    } catch (err) {
      console.error('Failed to load files', err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Select a PDF first');

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await fetch('https://signature-app-server-1.onrender.com/api/docs/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedFiles((prev) => [...prev, data]);
        setSelectedFile(null);
        alert('Uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload error');
    }
  };

  const openSignatureOverlay = (filePath) => {
    setActivePdfUrl(`https://signature-app-server-1.onrender.com/${filePath}`);
    setShowSignature(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen px-4 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">📂 Dashboard</h1>
            <p className="text-gray-700 mt-1">Welcome, <strong>{user?.name}</strong> 👋</p>
          </div>
          <button
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload PDF:
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-3 w-full text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload PDF
          </button>
        </form>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex flex-col justify-between"
            >
              <div>
                <h2 className="font-medium text-sm text-gray-800 truncate mb-2">
                  {file.originalName || file.filename}
                </h2>
                <PDFViewer file={`https://signature-app-server-1.onrender.com/${file.path}`} />
              </div>
              <button
                onClick={() => openSignatureOverlay(file.path)}
                className="mt-3 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Add Signature
              </button>
            </div>
          ))}
        </div>
      </div>

      {showSignature && (
        <SignatureOverlay
          onClose={() => setShowSignature(false)}
          pdfUrl={activePdfUrl}
        />
      )}
    </div>
  );
}