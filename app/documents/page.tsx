"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle } from "lucide-react"
import { signDocument } from "@/app/actions/document-actions"
import * as PDFJS from 'pdfjs-dist';
import { useEffect, useRef } from 'react';

// Mock data for documents
const documents = [
  {
    id: "1",
    title: "High Hazard SWMS",
    description: "Safe Work Method Statement for high hazard activities",
    signed: false,
  },
  {
    id: "2",
    title: "Working at Heights SWMS",
    description: "Safe Work Method Statement for working at heights",
    signed: false,
  },
  {
    id: "3",
    title: "Electrical Work SWMS",
    description: "Safe Work Method Statement for electrical work",
    signed: false,
  },
]

// Set the worker source
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

  export default function DocumentsPage() {
  const [docs, setDocs] = useState(documents)
  const [selectedDoc, setSelectedDoc] = useState<(typeof documents)[0] | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignDocument = async () => {
    if (!selectedDoc || !name) return

    setLoading(true)
    try {
      // Define your signature data interface
      interface SignatureData {
        documentId: string;
        name: string;
        timestamp: string;
      };

      // Create a function to call your server
      const signDocument = async (signatureData: SignatureData) => {
        const response = await fetch('https://postgres-production-5236.up.railway.app/api/signatures', {
         method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
          body: JSON.stringify(signatureData)
        });
  
        if (!response.ok) {
         throw new Error(`Error signing document: ${response.statusText}`);
        }
  
        return await response.json();
      };

      setLoading(true);
        try {
          // Now this will call the actual server endpoint
          const result = await signDocument({
            documentId: selectedDoc.id,
            name,
            timestamp: new Date().toISOString(),
          });
    
          // Handle successful signature
          console.log("Document signed successfully:", result);
          // Maybe update UI or navigate to another page
    
        } 
          catch (error) {
          console.error("Failed to sign document:", error);
          // Handle errors - show message to user
        } 
          finally {
          setLoading(false);
        }
            // Update the local state to show the document as signed
            setDocs(docs.map((doc) => (doc.id === selectedDoc.id ? { ...doc, signed: true } : doc)))

            // Close the dialog by setting selectedDoc to null
            setSelectedDoc(null)
            setName("")
          } 
            catch (error) {
            console.error("Error signing document:", error)
          } 
            finally {
            setLoading(false)
          }
        };
        const PdfViewerComponent: React.FC<{ pdfUrl: string }> = ({ pdfUrl }) => {
          const canvasRef = useRef<HTMLCanvasElement>(null);
        
          useEffect(() => {
            const loadPdf = async () => {
              try {
                const loadingTask = PDFJS.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1); // Get the first page
                
                const viewport = page.getViewport({ scale: 1.5 });
                
                // Set canvas dimensions
                const canvas = canvasRef.current;
                if (!canvas) return;
                
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                // Render PDF page
                await page.render({
                  canvasContext: context as any,
                  viewport: viewport
                }).promise;
              } catch (error) {
                console.error('Error loading PDF:', error);
              }
            };
            
            loadPdf();
          }, [pdfUrl]);
        
          
          
          const PdfViewer: React.FC = () => {
            return (
              <embed 
                src="/path/to/your/document.pdf" 
                type="application/pdf"
                width="100%" 
                height="600px" 
              />
            );
          };

  return ( 
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/" className="mb-6 inline-block">
          <Button variant="outline" size="sm">
            ← Back to Home
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Safety Documents</h1>
          <p className="text-muted-foreground">View and sign required Safe Work Method Statements (SWMS)</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {doc.title}
                  {doc.signed && <CheckCircle className="ml-2 h-5 w-5 text-green-500" />}
                </CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {doc.signed ? "You have signed this document." : "This document requires your signature."}
                </p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={doc.signed ? "outline" : "default"}
                      className="w-full"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      {doc.signed ? "View Document" : "View & Sign"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedDoc?.title}</DialogTitle>
                      <DialogDescription>{selectedDoc?.description}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="border rounded p-4 h-64 overflow-auto">
                      <embed 
                          src="documents/test.pdf" 
                          type="application/pdf"
                          width="100%" 
                          height="600px" 
                          />
                      <canvas ref={canvasRef} />
                         
                      </div>
                      {!doc.signed && (
                        <div className="grid gap-2">
                          <Label htmlFor="signature">Sign with your full name to acknowledge</Label>
                          <Input
                            id="signature"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      {!doc.signed ? (
                        <Button onClick={handleSignDocument} disabled={!name || loading}>
                          {loading ? "Signing..." : "Sign Document"}
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setSelectedDoc(null)}>
                          Close
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )}}
