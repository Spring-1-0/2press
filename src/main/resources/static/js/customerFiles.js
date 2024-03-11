

const blobUrl = '';
function getCustomerIdFromUrl() {
   // Get the current URL
   var url = window.location.href;

   // Parse the URL to get the query parameters
   var queryParams = new URLSearchParams(url.split('?')[1]);

   // Get the value of the 'customer' parameter
   var customerId = queryParams.get('customer');

   return customerId;
}
// Function to format date in YYYY-MM-DD HH:mm:ss format
function formatDate(dateString) {
   var date = new Date(dateString);
   var year = date.getFullYear();
   var month = String(date.getMonth() + 1).padStart(2, '0');
   var day = String(date.getDate()).padStart(2, '0');
   return year + '-' + month + '-' + day;
}
// Usage example
var _id = getCustomerIdFromUrl();
var fileInfo = '';
// Function to handle file preview
function previewFile(fileUrl) {
   var extension = fileUrl.split('.').pop().toLowerCase();
   var filePreviewContent = $('#filePreviewContent');
   fileInfo = fileUrl;

   // Clear any existing content
   filePreviewContent.empty();
   // Set the src attribute of your iframe to the blob URL
   // $('#Frame').attr('src', '/api/files/fetch?filename=' + fileUrl);

}



function fetchCustomers() {
   $.ajax({
      type: "GET",
      url: "/api/customers/findById?_id=" + _id,
      success: function (customer) {

         $("#customerName").text(customer.name);
         $("#customertel").text(customer.tel);

         $.ajax({
            type: "GET",
            url: "/api/customers/find/Files/ByRefId?refId=" + customer.refId,
            success: function (files) {
               $('#customer-list').empty();
               files.forEach(function (file, index) {
                  $('#customer-list').append(
                     '<li>' +
                     '<a href="#" class="customer-item" onclick="previewFile(\'' + file.name + '\')" data-file="' + file.name + '">' +
                     '<div class="preview-container">' +
                     getFilePreviewHTML(file.name) +
                     '</div>' +
                     '<span class="product">' + file.name + '</span>' +
                     '</a>' +
                     '<span class="price">At: ' + formatDate(file.createdAt) + '</span>' +
                     '</li>'
                  );


               });

            }
            ,
            error: function (xhr, status, error) {
               console.error('Error fetching customer files :', error);
            }
         });


         // Function to get preview HTML based on file type
         function getFilePreviewHTML(fileUrl) {
            var extension = fileUrl.split('.').pop().toLowerCase();

            if (extension === 'pdf' || extension === 'doc' || extension === 'docx') {
               return '<img width="30px" height="30px" src="/api/files/fetch?filename=1708202239534_download.jpeg" >';
            } else {
               return '<img src="/api/files/fetch?filename=' + encodeURIComponent(fileUrl) + '" alt="">';
            }
         }

      },
      error: function (xhr, status, error) {
         console.error('Error fetching customers:', error);
      }
   });


}


// Call the fetchCustomers function to retrieve and display customer data
fetchCustomers();

function fetchCustomersFiles() {
   $.ajax({
      type: "GET",
      url: "/api/customers/findById?_id=" + _id,
      success: function (customer) {
         $.ajax({
            type: "GET",
            url: "/api/customers/find/Files/ByRefId?refId=" + customer.refId,
            success: function (files) {
               $('#myTable tbody').empty(); // Clear existing table rows
               files.forEach(function (file, index) {
                  // Create a new row for each file
                  var row = $("<tr>").attr("title", file.message);
                  // Add index number

                  // Add file name
                  row.append("<td>" + file.name + "</td>");
                  row.append("<td>" + file.color + "</td>");
                  row.append("<td>" + file.copies + "</td>");
                  row.append("<td>" + file.status + "</td>");
                  row.append("<td>" + file.activity + "</td>");

                  // Add action buttons for download and print
                  var actions = $("<td>");
                  var downloadBtn = $("<button>").html('<i class="fa fa-download"></i>').addClass("btn").attr("title", "Download").click(function () {
                     downloadFile(file.name); // Call function to download the file
                  });
                  var printBtn = $("<button>").html('<i class="fa fa-print"></i>').addClass("btn").attr("title", "Print").click(function () {
                     openPrintModal(file.name); // Call function to open print modal
                  });
                  var previewBtn = $("<button>").html('<i class="fa fa-eye"></i>').addClass("btn").attr("title", "Preview").click(function () {
                     openPreview(file.name); // Call function to open preview modal
                  });


                  actions.append(downloadBtn).append(printBtn).append(previewBtn);
                  row.append(actions);
                  row.append("<td>" + (index + 1) + "</td>");
                  // Append the row to the table
                  $('#myTable tbody').append(row);
               });
            },
            error: function (xhr, status, error) {
               console.error('Error fetching customer files:', error);
            }
         });
      },
      error: function (xhr, status, error) {
         console.error('Error fetching customers:', error);
      }
   });
}

// Function to download the file
function downloadFile(fileName) {
   $.ajax({
      type: "GET",
      url: '/api/files/fetch?filename=' + fileName,
      xhrFields: {
         responseType: 'blob'
      },
      success: function (blob) {
         var url = URL.createObjectURL(blob);
         var link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
      },
      error: function (xhr, status, error) {
         console.error('Error downloading file:', error);
      }
   });
}



function openPreview(fileName) {
   const fileUrl = '/uploads/' + fileName;
   window.open(fileUrl, '_blank');
}

// Function to open print modal
// function openPrintModal(fileName) {

//    const fileUrl = '/uploads/' + fileName;

//    const iframe = document.createElement('iframe');
//    iframe.src = fileUrl;
//    iframe.style.width = '100%';
//    iframe.style.height = '100%';
//    iframe.style.border = 'none';

//    document.body.appendChild(iframe);

//    iframe.onload = () => {
//       iframe.contentWindow.print();
//       iframe.style.display = 'none';

//    };


// }


async function openPrintModal(fileName) {
   const fileExtension = fileName.split('.').pop().toLowerCase();
   const fileUrl = '/uploads/' + fileName;

   if (fileExtension === 'doc' || fileExtension === 'txt') {
      // Convert DOC or TXT to PDF on the server
      const response = await fetch(`/api/convert-to-pdf?fileName=${fileName}`);
      const blob = await response.blob();

      // Create object URL for the PDF blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open the PDF file for printing
      const iframe = document.createElement('iframe');
      iframe.src = pdfUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
         iframe.contentWindow.print();
         iframe.style.display = 'none';
      };
   } else {
      // Directly print the file if it's already in PDF format
      const iframe = document.createElement('iframe');
      iframe.src = fileUrl;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      iframe.onload = () => {
         iframe.contentWindow.print();
         iframe.style.display = 'none';
      };
   }
}




// Function to print the file content
function printFile() {

}

fetchCustomersFiles();
