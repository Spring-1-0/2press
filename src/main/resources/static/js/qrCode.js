
// Script.js 
// create a new QRCode instance 
let qrcode = new QRCode(
   document.querySelector(".qrcode")
);

// Get the base URL (localhost or hosted route URL)
var baseUrl = window.location.origin;


// Generate the QR code with the concatenated URL
qrcode.makeCode(baseUrl + "/upload");

// function printQRCode() {
//    // Create an iframe
//    var iframe = document.createElement('iframe');
//    iframe.style.display = 'none';
//    document.body.appendChild(iframe);

//    // Write the QR code HTML content to the iframe
//    var qrCodeContent = document.querySelector('.qrcode').outerHTML;
//    var iframeDoc = iframe.contentWindow.document;
//    iframeDoc.write('<html><head><title>TWO-PRESS</title><style>@media print { .qrcode { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } }</style></head><body><h1>Scan QR Code to transfer Files</h1>' + qrCodeContent + '</body></html>');

//    // Print the iframe content
//    iframe.contentWindow.print();

//    // Remove the iframe after printing
//    document.body.removeChild(iframe);
// }


function printQRCode() {
  // Create an iframe
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  // Write the QR code HTML content to the iframe
  var qrCodeContent = document.querySelector(".qrcode").outerHTML;
  var htmlContent =
    "<html><head><title>TWO-PRESS</title><style>@media print { .qrcode { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } }</style></head><body><h1>Scan QR Code to transfer Files</h1>" +
    qrCodeContent +
    "</body></html>";
  iframe.srcdoc = htmlContent;

  // Wait for iframe to load before printing
  iframe.onload = function () {
    // Print the iframe content
    iframe.contentWindow.print();
    // Remove the iframe after printing
    document.body.removeChild(iframe);
  };
}





