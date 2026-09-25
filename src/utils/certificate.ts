import { jsPDF } from 'jspdf';
import { CertificateData } from '../types';
import { sanitizeName } from './quiz';

export const CERT_WIDTH = 2480;
export const CERT_HEIGHT = 1754;

// EXACT REFERENCE COLOR PALETTE
export const COLOR_DEEP_NAVY = '#062B57';
export const COLOR_TEXT_NAVY = '#072C5B';
export const COLOR_ROYAL_BLUE = '#115FA7';
export const COLOR_LIGHT_BLUE = '#9FD1F5';
export const COLOR_CYAN_ACCENT = '#0E88C7';
export const COLOR_TEAL = '#0E8BA3';
export const COLOR_GOLD = '#D9A328';
export const COLOR_GOLD_LIGHT = '#F6C954';
export const COLOR_GOLD_DARK = '#B88214';
export const COLOR_IVORY_BG = '#FFFFFF';

/**
 * Draws the high-resolution, premium ECE Digital Electronics Certificate
 * onto a 2480x1754 (A4 Landscape 300 DPI) canvas, matching the reference image strictly:
 *
 * 1. Warm-white/ivory background with delicate radiant paper depth
 * 2. Exact reference palette: Deep Navy (#062B57), Royal Blue (#115FA7), Light Blue (#9FD1F5), Gold (#D9A328)
 * 3. Double outer border close to edges with rich geometric corner chevrons and PCB circuit traces
 * 4. Subtle vertical binary 0/1 columns running near side borders
 * 5. Top center digital IC microchip with circuit traces & terminal nodes
 * 6. "CERTIFICATE OF ACHIEVEMENT" (Very large, bold, prominent serif)
 * 7. "ECE QUIZ SIMULATOR" with gold decorative flanking lines and diamond nodes
 * 8. "This certificate is proudly presented to" in elegant italic serif
 * 9. STUDENT NAME: VERY LARGE, bold, centered serif with gold flourish underline and floral/diamond ornament
 * 10. "For successfully completing" & QUIZ TITLE in bold readable navy
 * 11. FOUR COMPACT INFORMATION CARDS:
 *     - SCORE (Trophy icon, gold accent, 10 / 10)
 *     - PERCENTAGE (% icon, teal accent, 100.00%)
 *     - CORRECT ANSWERS (Checkmark icon, royal blue accent, 10 / 10)
 *     - DATE (Calendar icon, indigo/blue accent, Sep 19, 2026)
 * 12. LOWER SECTION IN ONE BALANCED ROW:
 *     - LEFT: CERTIFICATE ID box with document badge icon
 *     - CENTER: Achievement Seal with gold starburst cog, navy disc, golden laurels, chip center, blue/gold ribbon, and flanking gold lines
 *     - RIGHT: Quiz Simulator / Issuing Platform
 * 13. EXACT DISCLAIMER close to bottom border with tight, balanced vertical distribution occupying 90-95% of the page
 */
export function drawCertificateCanvas(
  canvas: HTMLCanvasElement,
  data: CertificateData
): void {
  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = CERT_WIDTH;
  const h = CERT_HEIGHT;

  // 1. BACKGROUND: Clean Warm White / Ivory (#FFFFFF to #FCFBFA)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);

  // Soft radiant center glow giving subtle depth
  const centerGlow = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 1200);
  centerGlow.addColorStop(0, '#FFFFFF');
  centerGlow.addColorStop(0.6, '#FFFFFF');
  centerGlow.addColorStop(1, '#F8F9FC');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, w, h);

  // 2. SUBTLE VERTICAL BINARY 0 AND 1 STRIPS (Runs down near the sides)
  drawVerticalBinaryStrips(ctx, w, h);

  // 3. DIGITAL CIRCUIT TRACES IN ALL FOUR CORNERS & SIDES
  drawDigitalCircuitEdges(ctx, w, h);

  // 4. OUTER DOUBLE BORDER & GEOMETRIC CHEVRON CORNERS
  drawReferenceBorders(ctx, w, h);

  // 5. TOP CENTER DIGITAL IC MOTIF WITH STEPPED CIRCUIT TRACES
  const topChipY = 120;
  drawTopCenterChipMotif(ctx, w / 2, topChipY);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // 6. MAIN HEADING: "CERTIFICATE OF ACHIEVEMENT" (VERY LARGE, PROMINENT)
  const headerY = 248;
  ctx.font = '900 106px "Cinzel", "Georgia", serif';
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', w / 2, headerY);

  // 7. SUBTITLE: "ECE QUIZ SIMULATOR" WITH THIN GOLD FLANKING LINES
  const subHeaderY = 345;
  drawSubtitleWithFlankingLines(ctx, w / 2, subHeaderY);

  // 8. PRESENTATION TEXT: "This certificate is proudly presented to"
  const presentY = 435;
  ctx.font = 'italic 500 32px "Cinzel", "Georgia", serif';
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.fillText('This certificate is proudly presented to', w / 2, presentY);

  // 9. STUDENT NAME (VERY LARGE & PROMINENT - FILLS THE CENTER AREA)
  const nameY = 590;
  drawStudentName(ctx, data.studentName, w / 2, nameY);

  // 10. COMPLETION TEXT & DYNAMIC QUIZ TITLE
  const completeY = 710;
  ctx.font = 'italic 500 30px "Cinzel", "Georgia", serif';
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.fillText('For successfully completing', w / 2, completeY);

  const titleY = 785;
  ctx.font = '800 56px "Outfit", "Cinzel", sans-serif';
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.fillText(data.quizTitle, w / 2, titleY);

  // 11. FOUR COMPACT INFORMATION CARDS IN ONE HORIZONTAL ROW
  // SCORE, PERCENTAGE, CORRECT ANSWERS, DATE
  const scoreCardsY = 865;
  drawScoreCards(ctx, w, scoreCardsY, data);

  // 12. LOWER BALANCED ROW:
  // LEFT: CERTIFICATE ID BOX
  // CENTER: PROFESSIONAL ACHIEVEMENT SEAL (WITH RIBBONS & FLANKING GOLD LINES)
  // RIGHT: QUIZ SIMULATOR / ISSUING PLATFORM
  const lowerY = 1250;
  drawLowerCertificateSection(ctx, w, lowerY, data);

  // 13. EXACT DISCLAIMER AT BOTTOM - CLOSE TO BOTTOM BORDER
  const disclaimerY = 1570;
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#3E5771';
  ctx.textAlign = 'center';
  ctx.fillText(
    'This certificate is issued by Quiz Simulator as a digital achievement record and is not issued or accredited by an educational institution.',
    w / 2,
    disclaimerY
  );
}

/**
 * Draws subtle vertical binary (0 and 1) patterns near the side borders, exactly like the reference.
 */
function drawVerticalBinaryStrips(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(7, 44, 91, 0.055)'; // Very subtle, clean
  ctx.textAlign = 'center';

  const patternLeft = ['0', '1', '1', '0', '1', '0', '0', '1', '1', '1', '0', '1', '0', '0', '1', '0', '1'];
  const patternRight = ['1', '0', '0', '1', '0', '1', '1', '0', '1', '1', '0', '0', '1', '0', '1', '1', '0'];

  // Left vertical tracks
  for (let x = 85; x <= 175; x += 30) {
    let pIdx = (x * 7) % patternLeft.length;
    for (let y = 140; y <= h - 140; y += 38) {
      ctx.fillText(patternLeft[pIdx], x, y);
      pIdx = (pIdx + 1) % patternLeft.length;
    }
  }

  // Right vertical tracks
  for (let x = w - 175; x <= w - 85; x += 30) {
    let pIdx = (x * 11) % patternRight.length;
    for (let y = 140; y <= h - 140; y += 38) {
      ctx.fillText(patternRight[pIdx], x, y);
      pIdx = (pIdx + 1) % patternRight.length;
    }
  }

  ctx.restore();
}

/**
 * Draws the outer double border and geometric corner chevrons matching the reference image.
 */
function drawReferenceBorders(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const outerInset = 42;
  const innerInset = 54;

  // 1. Solid Outer Navy Blue Frame
  ctx.strokeStyle = COLOR_DEEP_NAVY;
  ctx.lineWidth = 5;
  ctx.strokeRect(outerInset, outerInset, w - outerInset * 2, h - outerInset * 2);

  // 2. Fine Inner Gold Line
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(innerInset, innerInset, w - innerInset * 2, h - innerInset * 2);

  // 3. Four Geometric Corner Chevrons (Blue & Gold angled bands)
  drawCornerChevrons(ctx, outerInset, outerInset, w - outerInset * 2, h - outerInset * 2);
}

/**
 * Geometric corner chevrons in all four corners matching the reference image:
 * Diagonal 45-degree multi-color bands in navy, gold, and light blue.
 */
function drawCornerChevrons(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  const size = 95;
  const corners = [
    { x: x, y: y, dx: 1, dy: 1 },
    { x: x + w, y: y, dx: -1, dy: 1 },
    { x: x, y: y + h, dx: 1, dy: -1 },
    { x: x + w, y: y + h, dx: -1, dy: -1 },
  ];

  corners.forEach((c) => {
    ctx.save();

    // Solid Navy Corner Chamfer Fill
    ctx.fillStyle = COLOR_DEEP_NAVY;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x + c.dx * size, c.y);
    ctx.lineTo(c.x, c.y + c.dy * size);
    ctx.closePath();
    ctx.fill();

    // Gold Diagonal Accent Stripe
    ctx.strokeStyle = COLOR_GOLD;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(c.x + c.dx * (size - 18), c.y);
    ctx.lineTo(c.x, c.y + c.dy * (size - 18));
    ctx.stroke();

    // Royal/Light Blue Inner Accent Stripe
    ctx.strokeStyle = COLOR_ROYAL_BLUE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(c.x + c.dx * (size + 4), c.y);
    ctx.lineTo(c.x, c.y + c.dy * (size + 4));
    ctx.stroke();

    // Cyan Fine Accent Line
    ctx.strokeStyle = COLOR_LIGHT_BLUE;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(c.x + c.dx * (size + 14), c.y);
    ctx.lineTo(c.x, c.y + c.dy * (size + 14));
    ctx.stroke();

    // Gold Corner Terminal Node
    ctx.fillStyle = COLOR_GOLD;
    ctx.beginPath();
    ctx.arc(c.x + c.dx * 42, c.y + c.dy * 42, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // White concentric via ring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(c.x + c.dx * 42, c.y + c.dy * 42, 8.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  });
}

/**
 * Detailed circuit-board traces extending along the corners and side edges,
 * with terminal pads and circular circuit nodes exactly like the reference.
 */
function drawDigitalCircuitEdges(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.save();

  // TOP-LEFT TRACES
  drawTraceWithNodes(
    ctx,
    [
      { x: 130, y: 75 },
      { x: 130, y: 190 },
      { x: 210, y: 190 },
      { x: 270, y: 135 },
      { x: 420, y: 135 },
    ],
    COLOR_ROYAL_BLUE,
    2.2
  );

  drawTraceWithNodes(
    ctx,
    [
      { x: 75, y: 130 },
      { x: 190, y: 130 },
      { x: 250, y: 190 },
      { x: 250, y: 310 },
      { x: 320, y: 380 },
    ],
    COLOR_LIGHT_BLUE,
    2
  );

  // TOP-RIGHT TRACES
  drawTraceWithNodes(
    ctx,
    [
      { x: w - 130, y: 75 },
      { x: w - 130, y: 190 },
      { x: w - 210, y: 190 },
      { x: w - 270, y: 135 },
      { x: w - 420, y: 135 },
    ],
    COLOR_ROYAL_BLUE,
    2.2
  );

  drawTraceWithNodes(
    ctx,
    [
      { x: w - 75, y: 130 },
      { x: w - 190, y: 130 },
      { x: w - 250, y: 190 },
      { x: w - 250, y: 310 },
      { x: w - 320, y: 380 },
    ],
    COLOR_LIGHT_BLUE,
    2
  );

  // BOTTOM-LEFT TRACES
  drawTraceWithNodes(
    ctx,
    [
      { x: 130, y: h - 75 },
      { x: 130, y: h - 190 },
      { x: 210, y: h - 190 },
      { x: 270, y: h - 135 },
      { x: 420, y: h - 135 },
    ],
    COLOR_ROYAL_BLUE,
    2.2
  );

  drawTraceWithNodes(
    ctx,
    [
      { x: 75, y: h - 130 },
      { x: 190, y: h - 130 },
      { x: 250, y: h - 190 },
      { x: 250, y: h - 310 },
      { x: 320, y: h - 380 },
    ],
    COLOR_LIGHT_BLUE,
    2
  );

  // BOTTOM-RIGHT TRACES
  drawTraceWithNodes(
    ctx,
    [
      { x: w - 130, y: h - 75 },
      { x: w - 130, y: h - 190 },
      { x: w - 210, y: h - 190 },
      { x: w - 270, y: h - 135 },
      { x: w - 420, y: h - 135 },
    ],
    COLOR_ROYAL_BLUE,
    2.2
  );

  drawTraceWithNodes(
    ctx,
    [
      { x: w - 75, y: h - 130 },
      { x: w - 190, y: h - 130 },
      { x: w - 250, y: h - 190 },
      { x: w - 250, y: h - 310 },
      { x: w - 320, y: h - 380 },
    ],
    COLOR_LIGHT_BLUE,
    2
  );

  ctx.restore();
}

function drawTraceWithNodes(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
  color: string,
  width: number
): void {
  if (pts.length < 2) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();

  // Terminal circular pad
  const end = pts[pts.length - 1];
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(end.x, end.y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner solid node
  ctx.fillStyle = COLOR_GOLD;
  ctx.beginPath();
  ctx.arc(end.x, end.y, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Top Center Motif:
 * Digital IC microchip with 5 pins on top and bottom, stepped horizontal circuit traces,
 * and circular node terminals extending left and right.
 */
function drawTopCenterChipMotif(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();

  // 1. Horizontal circuit lines extending left and right
  // Left primary trace
  ctx.strokeStyle = COLOR_ROYAL_BLUE;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy - 8);
  ctx.lineTo(cx - 160, cy - 8);
  ctx.lineTo(cx - 200, cy - 32);
  ctx.lineTo(cx - 360, cy - 32);
  ctx.stroke();

  // Left secondary trace
  ctx.strokeStyle = COLOR_LIGHT_BLUE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 10);
  ctx.lineTo(cx - 130, cy + 10);
  ctx.lineTo(cx - 160, cy + 34);
  ctx.lineTo(cx - 290, cy + 34);
  ctx.stroke();

  // Left circular terminal nodes
  drawCircularNode(ctx, cx - 360, cy - 32, COLOR_ROYAL_BLUE);
  drawCircularNode(ctx, cx - 290, cy + 34, COLOR_LIGHT_BLUE);
  drawCircularNode(ctx, cx - 160, cy - 8, COLOR_GOLD);

  // Right primary trace
  ctx.strokeStyle = COLOR_ROYAL_BLUE;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy - 8);
  ctx.lineTo(cx + 160, cy - 8);
  ctx.lineTo(cx + 200, cy - 32);
  ctx.lineTo(cx + 360, cy - 32);
  ctx.stroke();

  // Right secondary trace
  ctx.strokeStyle = COLOR_LIGHT_BLUE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 30, cy + 10);
  ctx.lineTo(cx + 130, cy + 10);
  ctx.lineTo(cx + 160, cy + 34);
  ctx.lineTo(cx + 290, cy + 34);
  ctx.stroke();

  // Right circular terminal nodes
  drawCircularNode(ctx, cx + 360, cy - 32, COLOR_ROYAL_BLUE);
  drawCircularNode(ctx, cx + 290, cy + 34, COLOR_LIGHT_BLUE);
  drawCircularNode(ctx, cx + 160, cy - 8, COLOR_GOLD);

  // 2. Central IC Chip
  const chipW = 48;
  const chipH = 48;
  const halfW = chipW / 2;
  const halfH = chipH / 2;

  // Chip Pins (5 top, 5 bottom)
  ctx.fillStyle = COLOR_ROYAL_BLUE;
  const pinW = 3.5;
  const pinLen = 9;
  for (let i = -16; i <= 16; i += 8) {
    ctx.fillRect(cx + i - pinW / 2, cy - halfH - pinLen, pinW, pinLen);
    ctx.fillRect(cx + i - pinW / 2, cy + halfH, pinW, pinLen);
  }

  // Chip body: Deep Navy with gold border
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2;
  roundRect(ctx, cx - halfW, cy - halfH, chipW, chipH, 6, true, true);

  // Inner square border in light blue
  ctx.strokeStyle = COLOR_LIGHT_BLUE;
  ctx.lineWidth = 1.8;
  ctx.strokeRect(cx - 14, cy - 14, 28, 28);

  // Central Cyan Core
  ctx.fillStyle = COLOR_CYAN_ACCENT;
  ctx.fillRect(cx - 7, cy - 7, 14, 14);

  ctx.restore();
}

function drawCircularNode(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Subtitle: "ECE QUIZ SIMULATOR"
 * Uppercase navy typography with thin gold horizontal lines and diamond ornaments on both sides.
 */
function drawSubtitleWithFlankingLines(ctx: CanvasRenderingContext2D, cx: number, y: number): void {
  ctx.save();

  // Subtitle text
  ctx.font = '800 38px "Outfit", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.textAlign = 'center';
  ctx.fillText('ECE QUIZ SIMULATOR', cx, y);

  const textWidth = ctx.measureText('ECE QUIZ SIMULATOR').width;
  const linePadding = 36;
  const lineLength = 280;

  // Left gold line
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(cx - textWidth / 2 - linePadding, y - 11);
  ctx.lineTo(cx - textWidth / 2 - linePadding - lineLength, y - 11);
  ctx.stroke();

  // Left diamond
  drawOrnamentDiamond(ctx, cx - textWidth / 2 - linePadding - lineLength, y - 11, 7);

  // Right gold line
  ctx.beginPath();
  ctx.moveTo(cx + textWidth / 2 + linePadding, y - 11);
  ctx.lineTo(cx + textWidth / 2 + linePadding + lineLength, y - 11);
  ctx.stroke();

  // Right diamond
  drawOrnamentDiamond(ctx, cx + textWidth / 2 + linePadding + lineLength, y - 11, 7);

  ctx.restore();
}

function drawOrnamentDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
): void {
  ctx.fillStyle = COLOR_GOLD;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x + radius, y);
  ctx.lineTo(x, y + radius);
  ctx.lineTo(x - radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the student name: VERY LARGE, bold, centered serif font in deep navy,
 * with a gold flourish underline and floral/diamond center ornament.
 */
function drawStudentName(
  ctx: CanvasRenderingContext2D,
  studentName: string,
  centerX: number,
  y: number
): void {
  const upper = studentName.trim().toUpperCase();
  const maxAvailableWidth = 1900;
  let fontSize = 122; // Very large, prominent like reference
  const minFontSize = 60;

  ctx.font = `900 ${fontSize}px "Cinzel", "Georgia", serif`;
  while (ctx.measureText(upper).width > maxAvailableWidth && fontSize > minFontSize) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px "Cinzel", "Georgia", serif`;
  }

  // Name fill: Deep Navy Blue
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.textAlign = 'center';
  ctx.fillText(upper, centerX, y);

  // Gold Flourish Underline with Center Floral/Diamond Ornament
  const measuredWidth = ctx.measureText(upper).width;
  const underlineWidth = Math.min(measuredWidth + 200, 1600);
  const half = underlineWidth / 2;
  const underlineY = y + 30;

  ctx.save();
  // Thin Gold Line
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(centerX - half, underlineY);
  ctx.lineTo(centerX - 35, underlineY);
  ctx.moveTo(centerX + 35, underlineY);
  ctx.lineTo(centerX + half, underlineY);
  ctx.stroke();

  // Center Floral/Diamond Ornament
  drawCenterFloralOrnament(ctx, centerX, underlineY);

  // End Gold Diamonds
  drawOrnamentDiamond(ctx, centerX - half, underlineY, 6);
  drawOrnamentDiamond(ctx, centerX + half, underlineY, 6);

  ctx.restore();
}

/**
 * Center floral / scroll ornament on the gold divider line directly beneath the student name.
 */
function drawCenterFloralOrnament(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.strokeStyle = COLOR_GOLD;
  ctx.fillStyle = COLOR_GOLD;
  ctx.lineWidth = 2;

  // Center Diamond
  ctx.beginPath();
  ctx.moveTo(cx, cy - 9);
  ctx.lineTo(cx + 9, cy);
  ctx.lineTo(cx, cy + 9);
  ctx.lineTo(cx - 9, cy);
  ctx.closePath();
  ctx.fill();

  // Inner navy pip
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Flanking petal curves
  ctx.fillStyle = COLOR_GOLD;
  ctx.beginPath();
  ctx.arc(cx - 18, cy, 4, 0, Math.PI * 2);
  ctx.arc(cx + 18, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Exactly FOUR compact cards in ONE horizontal row:
 * 1. SCORE (Trophy icon, gold accent, 10 / 10)
 * 2. PERCENTAGE (% icon, teal accent, 100.00%)
 * 3. CORRECT ANSWERS (Checkmark icon, royal blue accent, 10 / 10)
 * 4. DATE (Calendar icon, indigo accent, Sep 19, 2026)
 *
 * Matching the exact visual style of the reference image:
 * - White cards
 * - Thin light-blue borders
 * - Subtle shadows
 * - Top accent line
 * - Beautiful vector icons
 * - Large bold values
 */
function drawScoreCards(
  ctx: CanvasRenderingContext2D,
  totalWidth: number,
  cardY: number,
  data: CertificateData
): void {
  const cardW = 445;
  const cardH = 205;
  const gap = 36;
  const startX = (totalWidth - (cardW * 4 + gap * 3)) / 2;

  // Format score
  let formattedScore = data.scoreDisplay.trim();
  if (formattedScore.includes('/') && !formattedScore.includes(' / ')) {
    formattedScore = formattedScore.replace('/', ' / ');
  }

  // Format percentage
  const formattedPercentage = `${data.percentage.toFixed(2)}%`;

  // Format correct answers
  let correctDisplay = '';
  if (data.correctAnswers !== undefined) {
    correctDisplay = `${data.correctAnswers} / ${data.totalQuestions || 10}`;
  } else if (formattedScore.includes('/')) {
    correctDisplay = formattedScore;
  } else {
    correctDisplay = `${Math.round(data.percentage / 10)} / 10`;
  }

  // 1. SCORE (Trophy icon, Gold accent)
  drawSingleCard(
    ctx,
    startX,
    cardY,
    cardW,
    cardH,
    'SCORE',
    formattedScore,
    '#E59A1A',
    'trophy'
  );

  // 2. PERCENTAGE (% icon, Teal accent)
  drawSingleCard(
    ctx,
    startX + (cardW + gap),
    cardY,
    cardW,
    cardH,
    'PERCENTAGE',
    formattedPercentage,
    '#0CA5B0',
    'percent'
  );

  // 3. CORRECT ANSWERS (Checkmark icon, Royal Blue accent)
  drawSingleCard(
    ctx,
    startX + (cardW + gap) * 2,
    cardY,
    cardW,
    cardH,
    'CORRECT ANSWERS',
    correctDisplay,
    '#166BB3',
    'check'
  );

  // 4. DATE (Calendar icon, Indigo/Purple accent)
  drawSingleCard(
    ctx,
    startX + (cardW + gap) * 3,
    cardY,
    cardW,
    cardH,
    'DATE',
    data.date,
    '#6366F1',
    'calendar'
  );
}

function drawSingleCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accentColor: string,
  iconType: 'trophy' | 'percent' | 'check' | 'calendar'
): void {
  ctx.save();

  // Card Background: Clean White with delicate soft shadow
  ctx.shadowColor = 'rgba(6, 43, 87, 0.08)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D1E6F9'; // Thin light-blue border like reference
  ctx.lineWidth = 1.8;
  roundRect(ctx, x, y, w, h, 14, true, true);
  ctx.restore();

  // Top Accent Colored Bar
  ctx.fillStyle = accentColor;
  roundRect(ctx, x + 24, y, w - 48, 4.5, 2, true, false);

  // Vector Icon Centered at top
  const iconY = y + 54;
  drawCardVectorIcon(ctx, x + w / 2, iconY, iconType, accentColor);

  // Label: Uppercase, bold, readable navy
  ctx.font = '800 19px "Outfit", "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#4B6685';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + 104);

  // Large Bold Value
  ctx.font = '800 50px "Outfit", "Cinzel", sans-serif';
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.fillText(value, x + w / 2, y + 165);
}

/**
 * Draws crisp vector icons matching the reference image:
 * 1. Trophy 🏆 (Score)
 * 2. Circle with Percent `%` (Percentage)
 * 3. Square with Checkmark `✓` (Correct Answers)
 * 4. Calendar 📅 (Date)
 */
function drawCardVectorIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  type: 'trophy' | 'percent' | 'check' | 'calendar',
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'trophy') {
    // Trophy Cup
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 12);
    ctx.lineTo(cx + 10, cy - 12);
    ctx.lineTo(cx + 8, cy - 2);
    ctx.quadraticCurveTo(cx + 7, cy + 6, cx, cy + 6);
    ctx.quadraticCurveTo(cx - 7, cy + 6, cx - 8, cy - 2);
    ctx.closePath();
    ctx.stroke();

    // Handles
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 6, 4.5, Math.PI * 0.5, Math.PI * 1.5, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 10, cy - 6, 4.5, Math.PI * 1.5, Math.PI * 0.5, false);
    ctx.stroke();

    // Stem and Base
    ctx.beginPath();
    ctx.moveTo(cx, cy + 6);
    ctx.lineTo(cx, cy + 11);
    ctx.moveTo(cx - 8, cy + 11);
    ctx.lineTo(cx + 8, cy + 11);
    ctx.stroke();
  } else if (type === 'percent') {
    // Teal circular badge
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Percent symbol
    ctx.beginPath();
    ctx.moveTo(cx + 5, cy - 6);
    ctx.lineTo(cx - 5, cy + 6);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx - 4, cy - 4, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + 4, cy + 4, 2.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'check') {
    // Square checkbox
    roundRect(ctx, cx - 13, cy - 13, 26, 26, 5, false, true);

    // Checkmark
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 1);
    ctx.lineTo(cx - 2, cy + 4.5);
    ctx.lineTo(cx + 6, cy - 4.5);
    ctx.stroke();
  } else if (type === 'calendar') {
    // Calendar body
    roundRect(ctx, cx - 12, cy - 10, 24, 22, 4, false, true);

    // Top header bar
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 3);
    ctx.lineTo(cx + 12, cy - 3);
    ctx.stroke();

    // Rings
    ctx.fillRect(cx - 7, cy - 14, 2.5, 5);
    ctx.fillRect(cx + 4.5, cy - 14, 2.5, 5);

    // Dots
    ctx.fillRect(cx - 6, cy + 2, 2.5, 2.5);
    ctx.fillRect(cx + 3.5, cy + 2, 2.5, 2.5);
    ctx.fillRect(cx - 1.2, cy + 6.5, 2.5, 2.5);
  }

  ctx.restore();
}

/**
 * Lower Section in One Balanced Row:
 * LEFT: Certificate ID box with document badge icon
 * CENTER: Professional Achievement Seal with ribbons & flanking gold lines
 * RIGHT: Quiz Simulator / Issuing Platform
 */
function drawLowerCertificateSection(
  ctx: CanvasRenderingContext2D,
  w: number,
  baseY: number,
  data: CertificateData
): void {
  // 1. LEFT: CERTIFICATE ID BOX
  const leftX = 470;
  drawCertificateIdBox(ctx, leftX, baseY, data.certificateId);

  // 2. CENTER: ACHIEVEMENT SEAL WITH FLANKING GOLD LINES
  const sealY = baseY;
  drawFlankingGoldLines(ctx, w / 2, sealY);
  drawAchievementEmblemSeal(ctx, w / 2, sealY);

  // 3. RIGHT: QUIZ SIMULATOR / ISSUING PLATFORM
  const rightX = w - 470;
  drawIssuingPlatformBlock(ctx, rightX, baseY);
}

/**
 * Left: CERTIFICATE ID Box with document badge icon
 */
function drawCertificateIdBox(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  certificateId: string
): void {
  const boxW = 440;
  const boxH = 150;
  const x = cx - boxW / 2;
  const y = cy - boxH / 2;

  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D1E6F9'; // Thin light-blue border
  ctx.lineWidth = 1.8;
  ctx.shadowColor = 'rgba(6, 43, 87, 0.06)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  roundRect(ctx, x, y, boxW, boxH, 14, true, true);
  ctx.restore();

  // Document Badge Icon on the left inside the box
  const iconX = x + 52;
  const iconY = cy;
  drawDocumentBadgeIcon(ctx, iconX, iconY);

  // Text Content on the right inside the box
  const textX = x + 105;
  ctx.textAlign = 'left';

  // Label: "CERTIFICATE ID"
  ctx.font = '800 17px "Outfit", sans-serif';
  ctx.fillStyle = '#4B6685';
  ctx.fillText('CERTIFICATE ID', textX, cy - 14);

  // Value: Bold Monospace Navy
  ctx.font = '800 30px "JetBrains Mono", monospace';
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.fillText(certificateId, textX, cy + 26);
}

function drawDocumentBadgeIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.strokeStyle = COLOR_ROYAL_BLUE;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Document outline with folded corner
  const w = 26;
  const h = 34;
  const x = cx - w / 2;
  const y = cy - h / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - 8, y);
  ctx.lineTo(x + w, y + 8);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.stroke();

  // Corner fold line
  ctx.beginPath();
  ctx.moveTo(x + w - 8, y);
  ctx.lineTo(x + w - 8, y + 8);
  ctx.lineTo(x + w, y + 8);
  ctx.stroke();

  // Document text lines inside
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 13);
  ctx.lineTo(x + w - 5, y + 13);
  ctx.moveTo(x + 5, y + 19);
  ctx.lineTo(x + w - 5, y + 19);
  ctx.moveTo(x + 5, y + 25);
  ctx.lineTo(x + w - 9, y + 25);
  ctx.stroke();

  ctx.restore();
}

/**
 * Thin gold horizontal decorative lines flanking the achievement seal on the left and right.
 */
function drawFlankingGoldLines(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2;

  // Left Line
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy);
  ctx.lineTo(cx - 210, cy);
  ctx.stroke();
  drawOrnamentDiamond(ctx, cx - 210, cy, 6);

  // Right Line
  ctx.beginPath();
  ctx.moveTo(cx + 110, cy);
  ctx.lineTo(cx + 210, cy);
  ctx.stroke();
  drawOrnamentDiamond(ctx, cx + 210, cy, 6);

  ctx.restore();
}

/**
 * Center: Professional ECE Achievement Seal:
 * - Scalloped gold starburst outer cog (36 points)
 * - Concentric navy blue center disc
 * - Golden laurels / wreath pattern inside
 * - Digital IC chip symbol at core
 * - Royal blue & gold hanging ribbons below
 */
function drawAchievementEmblemSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.translate(cx, cy);

  // 1. Dual Royal Blue Hanging Ribbons Underneath
  // Left Ribbon
  ctx.fillStyle = COLOR_ROYAL_BLUE;
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-20, 32);
  ctx.lineTo(-50, 118);
  ctx.lineTo(-26, 104);
  ctx.lineTo(-6, 118);
  ctx.lineTo(-6, 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Ribbon
  ctx.beginPath();
  ctx.moveTo(20, 32);
  ctx.lineTo(50, 118);
  ctx.lineTo(26, 104);
  ctx.lineTo(6, 118);
  ctx.lineTo(6, 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Gold Scalloped Starburst Cog (36 points)
  const numPoints = 36;
  const outerR = 92;
  const innerR = 82;
  ctx.fillStyle = COLOR_GOLD;
  ctx.beginPath();
  for (let i = 0; i < numPoints * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / numPoints;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  // Outer Gold Rim Line
  ctx.strokeStyle = COLOR_GOLD_LIGHT;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. Middle Concentric Navy Blue Center Disc
  ctx.fillStyle = COLOR_DEEP_NAVY;
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.fill();

  // Inner Gold Ring
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Golden Laurel Wreath / Circuit Ring inside the navy circle
  drawLaurelWreathRing(ctx, 0, 0, 56);

  // 5. Digital Silicon IC Chip at Center
  const chipSize = 44;
  const halfChip = chipSize / 2;

  // Gold Pins
  ctx.fillStyle = COLOR_GOLD;
  const pinLen = 6;
  for (let i = -12; i <= 12; i += 8) {
    ctx.fillRect(i - 1.5, -halfChip - pinLen, 3, pinLen);
    ctx.fillRect(i - 1.5, halfChip, 3, pinLen);
    ctx.fillRect(-halfChip - pinLen, i - 1.5, pinLen, 3);
    ctx.fillRect(halfChip, i - 1.5, pinLen, 3);
  }

  // Chip Silicon Body
  ctx.fillStyle = '#062349';
  ctx.strokeStyle = COLOR_GOLD;
  ctx.lineWidth = 1.8;
  roundRect(ctx, -halfChip, -halfChip, chipSize, chipSize, 6, true, true);

  // Central Silicon Core (Cyan/Light Blue)
  ctx.fillStyle = COLOR_LIGHT_BLUE;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLOR_GOLD;
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Golden Laurel Wreath leaves around the inside circumference of the seal.
 */
function drawLaurelWreathRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
  ctx.save();
  ctx.strokeStyle = COLOR_GOLD;
  ctx.fillStyle = COLOR_GOLD;
  ctx.lineWidth = 1.5;

  const numLeaves = 18;
  for (let i = 0; i < numLeaves; i++) {
    const angle = (i * Math.PI * 2) / numLeaves;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Right: Quiz Simulator / Issuing Platform Block
 */
function drawIssuingPlatformBlock(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.textAlign = 'center';

  // "Quiz Simulator" in bold, deep navy blue serif/sans heading
  ctx.font = '800 42px "Cinzel", "Outfit", "Georgia", serif';
  ctx.fillStyle = COLOR_TEXT_NAVY;
  ctx.fillText('Quiz Simulator', cx, cy - 4);

  // "Issuing Platform" in medium blue/slate subtitle
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#4B6685';
  ctx.fillText('Issuing Platform', cx, cy + 36);

  ctx.restore();
}

/**
 * Helper to draw rounded rectangle paths.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill = true,
  stroke = true
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

/**
 * Generates exactly ONE high-resolution A4 Landscape PDF page (297mm × 210mm)
 * with zero margins, containing ONLY the certificate artwork.
 * Filename: ECE_Quiz_Certificate_[StudentName].pdf
 */
export function downloadCertificatePDF(
  canvas: HTMLCanvasElement,
  studentName: string
): void {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Get high-res PNG from canvas at 1.0 full quality
  const imageData = canvas.toDataURL('image/png', 1.0);

  // Exact A4 landscape dimensions: 297mm x 210mm (full bleed, no margins, no extra page)
  pdf.addImage(imageData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

  const cleanName = sanitizeName(studentName);
  pdf.save(`ECE_Quiz_Certificate_${cleanName}.pdf`);
}
