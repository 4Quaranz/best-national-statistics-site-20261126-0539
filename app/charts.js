// NorthStar Statistics — small canvas charts. No chart library: every chart is
// drawn with the canvas 2D API from the site's own data, so the site needs no
// network and no vendored framework.

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(280, Math.round(rect.width));
  const height = Math.max(180, Math.round(rect.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceTicks(min, max, count) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

function formatTick(v) {
  if (Math.abs(v) >= 1000000) return (v / 1000000).toFixed(1) + 'm';
  if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + 'k';
  return String(Math.round(v * 100) / 100);
}

// Line chart: labels along x, numeric values along y, with points and labels.
export function drawLineChart(canvas, labels, values, options) {
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { left: 56, right: 16, top: 16, bottom: 34 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const { lo, hi, ticks } = niceTicks(min, max, 4);
  const yOf = (v) => pad.top + plotH - ((v - lo) / (hi - lo)) * plotH;
  const xOf = (i) => pad.left + (labels.length === 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);

  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  ctx.fillStyle = '#5a6b7a';
  ctx.strokeStyle = '#d9e2ea';
  ctx.lineWidth = 1;
  for (const t of ticks) {
    const y = yOf(t);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(formatTick(t) + (options.unit || ''), pad.left - 8, y);
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  labels.forEach((label, i) => ctx.fillText(label, xOf(i), height - pad.bottom + 10));

  ctx.strokeStyle = '#c8102e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(xOf(i), yOf(v)) : ctx.lineTo(xOf(i), yOf(v))));
  ctx.stroke();
  values.forEach((v, i) => {
    ctx.fillStyle = '#c8102e';
    ctx.beginPath(); ctx.arc(xOf(i), yOf(v), 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0f2a43';
    ctx.font = 'bold 12px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(options.format ? options.format(v) : String(v), xOf(i), yOf(v) - 8);
    ctx.font = '12px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', options.label || 'Line chart');
}

// Horizontal bar chart: one bar per label, value shown at the bar end.
export function drawBarChart(canvas, labels, values, options) {
  const { ctx, width, height } = setupCanvas(canvas);
  const pad = { left: 150, right: 64, top: 12, bottom: 12 };
  const plotW = width - pad.left - pad.right;
  const max = Math.max(...values);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const rowH = (height - pad.top - pad.bottom) / labels.length;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '13px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  labels.forEach((label, i) => {
    const y = pad.top + i * rowH;
    const barH = Math.min(22, rowH * 0.55);
    const barY = y + (rowH - barH) / 2;
    const barW = ((values[i] - min) / span) * plotW;
    ctx.fillStyle = i % 2 === 0 ? '#0f2a43' : '#c8102e';
    ctx.fillRect(pad.left, barY, Math.max(2, barW), barH);
    ctx.fillStyle = '#1b2a38';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(label, pad.left - 10, y + rowH / 2);
    ctx.textAlign = 'left';
    ctx.font = 'bold 13px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
    ctx.fillText(options.format ? options.format(values[i]) : String(values[i]), pad.left + Math.max(2, barW) + 8, y + rowH / 2);
    ctx.font = '13px -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  });
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', options.label || 'Bar chart');
}
