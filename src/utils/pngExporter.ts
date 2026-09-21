import { toPng } from 'html-to-image';
import { Badge } from '../types';

/**
 * Downloads a DOM element as a high-resolution PNG image only.
 */
export async function downloadElementAsPNG(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2.5, // High resolution for crisp print/retina display
      backgroundColor: '#000000',
      filter: (node) => {
        // Exclude elements marked as print-hidden or no-export
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
    console.error('Error generating PNG from element:', error);
    throw error;
  }
}

/**
 * Generates an executive Black, White, and Gold Badge PNG image (1200 x 1200 px)
 * accredited by SarlaYash Mission and powered by Kapil.
 * Downloads the badge in PNG format ONLY.
 */
export async function downloadBadgeAsPNG(
  badge: Badge,
  studentName: string = 'Learner'
): Promise<void> {
  const size = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Solid Pure Black Background
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, size, size);

  // 2. Radial Dark Gradient for Depth
  const radialBg = ctx.createRadialGradient(size / 2, size / 2, 100, size / 2, size / 2, size / 2);
  radialBg.addColorStop(0, '#1a1810');
  radialBg.addColorStop(0.7, '#080808');
  radialBg.addColorStop(1, '#000000');
  ctx.fillStyle = radialBg;
  ctx.fillRect(0, 0, size, size);

  // 3. Outer Gold Metallic Border
  const outerBorderGrad = ctx.createLinearGradient(0, 0, size, size);
  outerBorderGrad.addColorStop(0, '#D4AF37');
  outerBorderGrad.addColorStop(0.25, '#FFF2B2');
  outerBorderGrad.addColorStop(0.5, '#AA771C');
  outerBorderGrad.addColorStop(0.75, '#FFDF73');
  outerBorderGrad.addColorStop(1, '#D4AF37');

  ctx.lineWidth = 14;
  ctx.strokeStyle = outerBorderGrad;
  ctx.strokeRect(40, 40, size - 80, size - 80);

  // 4. Inner Dashed Gold Border
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.strokeRect(65, 65, size - 130, size - 130);
  ctx.setLineDash([]); // reset dash

  // 5. Corner Ornaments (Gold Fluerons)
  ctx.fillStyle = '#FFDF73';
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❖', 55, 55);
  ctx.fillText('❖', size - 55, 55);
  ctx.fillText('❖', 55, size - 55);
  ctx.fillText('❖', size - 55, size - 55);

  // 6. Top Ribbon / Header
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('OFFICIAL PLACEMENT CREDENTIAL', size / 2, 130);

  // Gold Pill for Rarity
  const rarityY = 180;
  ctx.fillStyle = '#161309';
  ctx.beginPath();
  ctx.roundRect(size / 2 - 160, rarityY - 24, 320, 48, [24]);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#D4AF37';
  ctx.stroke();

  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`${badge.rarity.toUpperCase()} BADGE • ${badge.category.toUpperCase()}`, size / 2, rarityY + 2);

  // 7. Central Gold Crest / Seal
  const centerY = 450;
  const outerRadius = 170;

  // Outer glow circle
  const crestGrad = ctx.createRadialGradient(size / 2, centerY, 50, size / 2, centerY, outerRadius);
  crestGrad.addColorStop(0, '#FFE885');
  crestGrad.addColorStop(0.5, '#D4AF37');
  crestGrad.addColorStop(1, '#8C6200');

  ctx.fillStyle = crestGrad;
  ctx.beginPath();
  ctx.arc(size / 2, centerY, outerRadius, 0, Math.PI * 2);
  ctx.fill();

  // Dark Inner Disc
  ctx.fillStyle = '#080808';
  ctx.beginPath();
  ctx.arc(size / 2, centerY, outerRadius - 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#D4AF37';
  ctx.stroke();

  // Medallion Central Graphic / Star
  ctx.fillStyle = '#FFE885';
  ctx.font = '84px serif';
  ctx.fillText('★', size / 2, centerY + 5);

  // Laurel wreath arc text
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#D4AF37';
  ctx.letterSpacing = '4px';
  ctx.fillText('• VERIFIED ASSESSMENT COMPETENCY •', size / 2, centerY + 115);

  // 8. Badge Title (High-contrast White with Gold Glow)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(badge.title, size / 2, 690);

  // Gold divider
  const divGrad = ctx.createLinearGradient(size / 2 - 200, 0, size / 2 + 200, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, '#D4AF37');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(size / 2 - 250, 720);
  ctx.lineTo(size / 2 + 250, 720);
  ctx.stroke();

  // 9. Badge Description (Light Crisp White)
  ctx.fillStyle = '#D1D5DB';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';

  // Wrap text max 800px
  wrapText(ctx, badge.description, size / 2, 765, 800, 36);

  // 10. Awarded To Student Section
  ctx.fillStyle = '#9CA3AF';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('Awarded for benchmark mastery to', size / 2, 860);

  ctx.fillStyle = '#FFE885';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText(studentName, size / 2, 905);

  // 11. Mandatory Accreditation & Dual Signature
  // Box for accreditation
  ctx.fillStyle = '#0e0e0e';
  ctx.beginPath();
  ctx.roundRect(100, 960, size - 200, 150, [16]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left side: SarlaYash Mission
  const leftX = size / 2 - 240;
  ctx.fillStyle = '#FFE885';
  ctx.font = 'italic bold 28px Georgia, serif';
  ctx.fillText('SarlaYash Mission', leftX, 1010);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX - 120, 1025);
  ctx.lineTo(leftX + 120, 1025);
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('CERTIFIED BY SARLAYASH MISSION', leftX, 1050);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Director of Placement Excellence', leftX, 1072);

  // Center vertical divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, 975);
  ctx.lineTo(size / 2, 1095);
  ctx.stroke();

  // Right side: Powered By Kapil
  const rightX = size / 2 + 240;
  ctx.fillStyle = '#FFE885';
  ctx.font = 'italic bold 28px Georgia, serif';
  ctx.fillText('Kapil', rightX, 1010);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rightX - 120, 1025);
  ctx.lineTo(rightX + 120, 1025);
  ctx.stroke();

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('POWERED BY KAPIL', rightX, 1050);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Chief Architect & Placement Mentor', rightX, 1072);

  // 12. Bottom Serial and Date
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const certId = `SYM-BDG-${badge.id.toUpperCase()}-${Math.abs(
    studentName.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(4, '0')}`;

  ctx.fillStyle = '#6B7280';
  ctx.font = '14px monospace';
  ctx.fillText(`VERIFICATION ID: ${certId}  •  ISSUED: ${issueDate.toUpperCase()}  •  FORMAT: PNG ONLY`, size / 2, 1150);

  // 13. Download as PNG ONLY
  const pngDataUrl = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  const safeName = badge.title.replace(/[^a-zA-Z0-9]/g, '_');
  downloadLink.download = `Badge_${safeName}.png`;
  downloadLink.href = pngDataUrl;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
