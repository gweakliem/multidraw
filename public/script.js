const socket = io();
let canvas, ctx;
let isDrawing = false;
let color = '#000000';

function login() {
  const name = document.getElementById('nameInput').value;
  color = document.getElementById('colorInput').value;
  const userData = {
    name: name,
    color: color
  };

  socket.emit('login', userData);
}

socket.on('userLogin', (userData) => {
  console.log(`User ${userData.name} logged in with color ${userData.color}`);
});

socket.on('stroke', (strokeData) => {
  drawStroke(strokeData.x, strokeData.y, strokeData.color);
});

function drawStroke(x, y, strokeColor) {
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
}

function startDrawing(e) {
    console.info("startDrawing");
  isDrawing = true;
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const strokeData = {
    x: x,
    y: y,
    color: color
  };
  socket.emit('draw', strokeData);
  drawStroke(x, y, color);
}

function stopDrawing() {
    console.info("stop drawing");
  isDrawing = false;
  ctx.beginPath();
}

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
});
