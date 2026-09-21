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
      backgroundColor: undefined, // Preserve element's computed background
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
 * Tier color definitions inspired by Google Cloud and Microsoft Certified credentials
 */
function getTierColorPalette(rarity: Badge['rarity']) {
  switch (rarity) {
    case 'Legendary':
      return {
        label: 'MASTER CREDENTIAL',
        primary: '#F59E0B',
        light: '#FDE047',
        dark: '#B45309',
        border: '#FBBF24',
        glow: 'rgba(245, 158, 11, 0.35)',
        pillBg: 'rgba(245, 158, 11, 0.15)',
        badgeGradient: ['#B45309', '#F59E0B', '#FDE047'],
      };
    case 'Epic':
      return {
        label: 'EXPERT SPECIALIZATION',
        primary: '#8B5CF6',
        light: '#C4B5FD',
        dark: '#4C1D95',
        border: '#A78BFA',
        glow: 'rgba(139, 92, 246, 0.35)',
        pillBg: 'rgba(139, 92, 246, 0.15)',
        badgeGradient: ['#4C1D95', '#7C3AED', '#C4B5FD'],
      };
    case 'Rare':
      return {
        label: 'ASSOCIATE PRACTITIONER',
        primary: '#10B981',
        light: '#6EE7B7',
        dark: '#064E3B',
        border: '#34D399',
        glow: 'rgba(16, 185, 129, 0.35)',
        pillBg: 'rgba(16, 185, 129, 0.15)',
        badgeGradient: ['#064E3B', '#10B981', '#6EE7B7'],
      };
    default:
      return {
        label: 'FUNDAMENTAL CERTIFIED',
        primary: '#0284C7',
        light: '#7DD3FC',
        dark: '#0C4A6E',
        border: '#38BDF8',
        glow: 'rgba(2, 132, 199, 0.35)',
        pillBg: 'rgba(2, 132, 199, 0.15)',
        badgeGradient: ['#0C4A6E', '#0284C7', '#7DD3FC'],
      };
  }
}

/**
 * Generates an executive Google/Microsoft-styled Badge PNG (1200 x 1200 px)
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

  const tier = getTierColorPalette(badge.rarity);

  // 1. Deep Executive Canvas with Radial Aura
  ctx.fillStyle = '#060A17';
  ctx.fillRect(0, 0, size, size);

  const radialBg = ctx.createRadialGradient(size / 2, size / 2 - 80, 80, size / 2, size / 2, size * 0.7);
  radialBg.addColorStop(0, '#0F1A3A');
  radialBg.addColorStop(0.6, '#080E24');
  radialBg.addColorStop(1, '#040711');
  ctx.fillStyle = radialBg;
  ctx.fillRect(0, 0, size, size);

  // Subtle tech dot-grid pattern
  ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
  for (let x = 60; x < size - 60; x += 40) {
    for (let y = 60; y < size - 60; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Precision Dual Border with Corner Notches (Microsoft / Google Enterprise Certificate frame)
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.strokeRect(40, 40, size - 80, size - 80);

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeRect(52, 52, size - 104, size - 104);

  // 3. Four-Color Tech Spectrum Accent Bar at the Top (Google / Microsoft multi-pillar signature)
  const barY = 60;
  const barWidth = 480;
  const segWidth = barWidth / 4;
  const startX = size / 2 - barWidth / 2;

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444']; // Blue, Green, Amber, Coral
  colors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(startX + idx * segWidth, barY, segWidth, 4);
  });

  // 4. Header Ribbon: SarlaYash Mission Accreditation
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SARLAYASH MISSION • PLACEMENT ACCREDITATION', size / 2, 100);

  // 5. Tier Level Pill (Microsoft / Google Learn Badge Tier)
  const pillY = 145;
  ctx.fillStyle = tier.pillBg;
  ctx.beginPath();
  ctx.roundRect(size / 2 - 180, pillY - 20, 360, 40, [20]);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = tier.border;
  ctx.stroke();

  ctx.fillStyle = tier.light;
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`${tier.label} • ${badge.category.toUpperCase()}`, size / 2, pillY);

  // 6. Central Faceted Hexagonal / Shield Medallion (Faceted Google/Microsoft Badge)
  const centerY = 390;
  const radius = 160;

  // Outer ambient glow
  const glowGrad = ctx.createRadialGradient(size / 2, centerY, 40, size / 2, centerY, radius + 40);
  glowGrad.addColorStop(0, tier.glow);
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(size / 2, centerY, radius + 40, 0, Math.PI * 2);
  ctx.fill();

  // Draw Faceted Hexagon
  function drawHexagon(context: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    context.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
  }

  // Outer Hexagon with Tier Gradient
  const hexGrad = ctx.createLinearGradient(size / 2 - radius, centerY - radius, size / 2 + radius, centerY + radius);
  hexGrad.addColorStop(0, tier.badgeGradient[2]);
  hexGrad.addColorStop(0.5, tier.badgeGradient[1]);
  hexGrad.addColorStop(1, tier.badgeGradient[0]);

  ctx.fillStyle = hexGrad;
  drawHexagon(ctx, size / 2, centerY, radius);
  ctx.fill();

  // Inner Dark Facet Hexagon
  ctx.fillStyle = '#060B18';
  drawHexagon(ctx, size / 2, centerY, radius - 14);
  ctx.fill();

  // Fine metallic rim
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = tier.border;
  drawHexagon(ctx, size / 2, centerY, radius - 14);
  ctx.stroke();

  // Core Emblem Star & Shield Graphic
  ctx.fillStyle = tier.light;
  ctx.font = '78px serif';
  ctx.fillText('★', size / 2, centerY - 6);

  // Laurel wreath / verified insignia
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = tier.border;
  ctx.fillText('• VERIFIED COMPETENCY •', size / 2, centerY + 95);

  // 7. Badge Title (Crisp White with modern typography)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(badge.title, size / 2, 605);

  // Thin Accent Divider
  const divGrad = ctx.createLinearGradient(size / 2 - 180, 0, size / 2 + 180, 0);
  divGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  divGrad.addColorStop(0.5, tier.primary);
  divGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(size / 2 - 200, 635);
  ctx.lineTo(size / 2 + 200, 635);
  ctx.stroke();

  // 8. Badge Description (High Readability Slate)
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '400 22px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';
  wrapText(ctx, badge.description, size / 2, 675, 820, 32);

  // 9. Recipient Statement
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('Awarded for benchmark mastery to', size / 2, 785);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(studentName, size / 2, 830);

  // 10. Official Accreditation Box with Dual Endorsement
  const boxY = 885;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(110, boxY, size - 220, 155, [16]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left Signatory: Certified By SarlaYash Mission
  const leftX = size / 2 - 240;
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'italic bold 26px Georgia, serif';
  ctx.fillText('SarlaYash Mission', leftX, boxY + 46);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX - 110, boxY + 62);
  ctx.lineTo(leftX + 110, boxY + 62);
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('CERTIFIED BY SARLAYASH MISSION', leftX, boxY + 86);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Director of Academic & Placement Excellence', leftX, boxY + 110);

  // Center Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, boxY + 20);
  ctx.lineTo(size / 2, boxY + 135);
  ctx.stroke();

  // Right Signatory: Powered By Kapil
  const rightX = size / 2 + 240;
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'italic bold 26px Georgia, serif';
  ctx.fillText('Kapil', rightX, boxY + 46);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rightX - 110, boxY + 62);
  ctx.lineTo(rightX + 110, boxY + 62);
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('POWERED BY KAPIL', rightX, boxY + 86);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Chief Technology Architect & Placement Mentor', rightX, boxY + 110);

  // 11. Cryptographic Verification & Metadata Footer
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const certId = `SYM-BDG-${badge.id.toUpperCase()}-${Math.abs(
    studentName.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0)
  ).toString(16).toUpperCase().padStart(4, '0')}`;

  ctx.fillStyle = '#64748B';
  ctx.font = '13px monospace';
  ctx.fillText(`VERIFICATION ID: ${certId}  •  ISSUED: ${issueDate.toUpperCase()}  •  FORMAT: PNG ONLY`, size / 2, 1145);

  // 12. Save Canvas as PNG ONLY
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

