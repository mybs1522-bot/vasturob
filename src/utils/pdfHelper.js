import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;

/**
 * Convert a PDF file (e.g. floor plan PDF) to a high-resolution PNG Data URL.
 * Renders page 1 of the PDF onto a canvas.
 */
export async function convertPdfFileToDataUrl(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get page 1
    const page = await pdf.getPage(1);
    
    // Scale for high resolution
    const viewport = page.getViewport({ scale: 2.0 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (error) {
    console.error('Failed to convert PDF file:', error);
    throw new Error('Could not read PDF floor plan. Please upload a PNG or JPG file.');
  }
}
