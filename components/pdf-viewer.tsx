"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Fullscreen, FullscreenIcon as FullscreenExit } from "lucide-react"
import { Button } from "@/components/ui/button"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  return (
    <div className={`pdf-viewer ${isFullScreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button onClick={toggleFullScreen} variant="outline">
          {isFullScreen ? <FullscreenExit size={20} /> : <Fullscreen size={20} />}
        </Button>
      </div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className={`${isFullScreen ? "h-full" : ""}`}>
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className={`${isFullScreen ? "flex justify-center items-center h-full" : ""}`}
        />
      </Document>
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
          Previous
        </Button>
        <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= (numPages || 0)}>
          Next
        </Button>
      </div>
    </div>
  )
}

