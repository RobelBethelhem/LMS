const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const nameinput = document.getElementById('name');
const courseinput = document.getElementById('course');
const directorinput = document.getElementById('director');
const headinput = document.getElementById('head');
const download_btn = document.getElementById('download_btn');

const currentDate = new Date();
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-US', options);

const image = new Image();
image.src = 'Certeficate.png';
image.onload = function () {
  drawImage();
};

function drawImage() {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 35px monotype corsiva';
  ctx.fillStyle = 'white';
  ctx.fillText(courseinput.value, 300, 380);
  ctx.fillText(nameinput.value, 320, 500);
  ctx.fillText(directorinput.value, 150, 730);
  ctx.fillText(headinput.value, 580, 730);
  ctx.fillText(formattedDate, 430, 810);

  // Generate QR code
  const qrCodeData = 'http://localhost:3001/'+ nameinput.value;
  const qr = qrcode(0, 'L');
  qr.addData(qrCodeData);
  qr.make();

  // Draw QR code on the canvas
  const qrCodeX = 130;
  const qrCodeY = 800;
  const qrCodeSize = 150;
  const modules = qr.getModuleCount();
  const moduleSize = qrCodeSize / modules;

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      ctx.fillStyle = qr.isDark(row, col) ? 'black' : 'white';
      const x = qrCodeX + col * moduleSize;
      const y = qrCodeY + row * moduleSize;
      ctx.fillRect(x, y, moduleSize, moduleSize);
    }
  }
}

nameinput.addEventListener('input', function () {
  drawImage();
});
courseinput.addEventListener('input', function () {
  drawImage();
});
directorinput.addEventListener('input', function () {
  drawImage();
});
headinput.addEventListener('input', function () {
  drawImage();
});
download_btn.addEventListener('click', function () {
  download_btn.href = canvas.toDataURL('image/jpg');
  download_btn.download = 'Certeficate -' + courseinput.value;
});