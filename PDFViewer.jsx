export default function PDFViewer({file}){
    return (
        <iframe src={file}
        title="PDF Viewer"
        width="100%"
        height="400px"
        className="border"
        ></iframe>
    );
}