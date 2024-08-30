const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cropBtn = document.getElementById("cropBtn");
let cropper = null;
let selectedFrame = null;
let croppedImageData = null; // Store the cropped image data here

imageUpload.addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = function (event) {
    imagePreview.src = event.target.result;
    imagePreview.style.display = "block";

    // Destroy previous cropper instance, if any
    if (cropper) {
      cropper.destroy();
    }

    // Initialize Cropper.js with scaling and zooming options
    cropper = new Cropper(imagePreview, {
      aspectRatio: 1, // 1:1 aspect ratio for 1000px by 1000px
      viewMode: 1, // Prevent the crop box from exceeding the container
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      scalable: true,
      minContainerWidth: 1000,
      minContainerHeight: 1000,
      cropBoxResizable: false,
      cropBoxMovable: true,
      background: false, // Optional: Hide the gray background grid
    });

    // Show crop button
    cropBtn.style.display = "block";
  };
  reader.readAsDataURL(this.files[0]);
});

cropBtn.addEventListener("click", function () {
  const croppedCanvas = cropper.getCroppedCanvas({
    width: 1000,
    height: 1000,
  });

  // Draw the cropped image on the canvas
  canvas.width = croppedCanvas.width;
  canvas.height = croppedCanvas.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(croppedCanvas, 0, 0);

  // Save the cropped image data
  croppedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // If a frame is selected, draw it over the image
  if (selectedFrame) {
    applyFrame(selectedFrame);
  }

  // Hide the image preview and show the canvas
  imagePreview.style.display = "none";
  canvas.style.display = "block";

  // Destroy the cropper instance after cropping
  cropper.destroy();
  cropBtn.style.display = "none";
});

document.getElementById("saveBtn").addEventListener("click", function () {
  if (canvas.style.display === "block") {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "framed-image.png";
    link.click();
  } else {
    alert("Please upload and crop an image first.");
  }
});

// Function to apply the selected frame
function applyFrame(frameSrc) {
  selectedFrame = frameSrc;

  // Redraw the cropped image first
  if (croppedImageData) {
    ctx.putImageData(croppedImageData, 0, 0);
  }

  // Draw the selected frame over the image
  const frameImage = new Image();
  frameImage.src = selectedFrame;
  frameImage.onload = function () {
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  };
}
