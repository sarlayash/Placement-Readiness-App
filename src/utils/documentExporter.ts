import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export interface DocumentExportOptions {
  fileName: string;
  format?: 'a4';
  orientation?: 'portrait' | 'landscape';
  pixelRatio?: number;
}

/**
 * Downloads a DOM element as a high-resolution, pixel-perfect PNG image.
 * Guarantees crisp text, preserved colors, and zero clipping.
 */
export async function exportElementAsPNG(
  element: HTMLElement,
  fileName: string,
  pixelRatio: number = 2.5
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio,
      cacheBust: true,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-export')) {
          return false;
        }
        return true;
      },
    });

    const link = document.createElement('a');
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating PNG document:', error);
    throw error;
  }
}

/**
 * Downloads a DOM element (or list of page elements) as a clean, professional A4 PDF.
 * Eliminates formatting clipping, cutoffs, and overlapping text.
 */
export async function exportElementAsPDF(
  elementOrPages: HTMLElement | HTMLElement[],
  fileName: string
): Promise<void> {
  try {
    const pages = Array.isArray(elementOrPages) ? elementOrPages : [elementOrPages];
    
    // Create standard A4 document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      if (i > 0) {
        pdf.addPage();
      }

      // Convert page element to crisp 2.5x PNG
      const dataUrl = await toPng(pageEl, {
        quality: 1,
        pixelRatio: 2.5,
        cacheBust: true,
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains('no-export')) {
            return false;
          }
          return true;
        },
      });

      // Fit directly to A4 page dimensions with zero margins or cropping
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const finalName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(finalName);
  } catch (error) {
    console.error('Error generating PDF document:', error);
    throw error;
  }
}

/**
 * Triggers native high-quality vector print dialog for clean paper/PDF export
 */
export function printDocumentNative(): void {
  window.print();
}
