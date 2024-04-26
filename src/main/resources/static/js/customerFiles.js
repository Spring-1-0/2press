const customer_token = localStorage.getItem('token');

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
      headers: {
         'Authorization': `Bearer ${customer_token}`,
         'Content-Type': 'application/json'
      },
      success: function (customer) {

         $("#customerName").text(customer.name);
         $("#customertel").text(customer.tel);

         $.ajax({
            type: "GET",
            url: "/api/customers/find/Files/ByRefId?refId=" + customer.refId,
            headers: {
               'Authorization': `Bearer ${customer_token}`,
               'Content-Type': 'application/json'
            },
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
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 4000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                     toast.onmouseenter = Swal.stopTimer;
                     toast.onmouseleave = Swal.resumeTimer;
                  }
               });
               Toast.fire({
                  icon: "warning",
                  title: "Error fecthing customer files",
               });
            }
         });


         // Function to get preview HTML based on file type
         function getFilePreviewHTML(fileUrl) {
            var extension = fileUrl.split('.').pop().toLowerCase();

            if (extension === 'pdf' || extension === 'doc' || extension === 'docx') {
               return '<img width="30px" height="30px" src="https://i.pinimg.com/474x/39/9d/f0/399df0c33700ac96624bfe9215da0437.jpg" >';
            } else {
               return '<img src="/api/files/fetch?filename=' + encodeURIComponent(fileUrl) + '" alt="">';
            }
         }

      },
      error: function (xhr, status, error) {
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "warning",
            title: "Error fecthing customer files",
         });
      }
   });


}


// Call the fetchCustomers function to retrieve and display customer data
fetchCustomers();

function fetchCustomersFiles() {
   $.ajax({
      type: "GET",
      url: "/api/customers/findById?_id=" + _id,
      headers: {
         'Authorization': `Bearer ${customer_token}`,
         'Content-Type': 'application/json'
      },
      success: function (customer) {
         $.ajax({
            type: "GET",
            url: "/api/customers/find/Files/ByRefId?refId=" + customer.refId,
            headers: {
               'Authorization': `Bearer ${customer_token}`,
               'Content-Type': 'application/json'
            },
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
                     downloadFile(file.name, file._id, file.cusRefId);
                  });
                  var printBtn = $("<button>").html('<i class="fa fa-print"></i>').addClass("btn").attr("title", "Print").click(function () {
                     openPrintModal(file.name, file._id, file.cusRefId); // Call function to open print modal
                  });
                  var previewBtn = $("<button>").html('<i class="fa fa-eye"></i>').addClass("btn").attr("title", "Preview").click(function () {
                     openPreview(file.name, file._id, file.cusRefId); // Call function to open preview modal
                  });

                  var rePrintBtn = $("<button>").html('<i class="fa fa-redo">&#xf0e2;</i>').addClass("btn").attr("title", "Redo").click(function () {
                     openPrintModal(file.name, file._id, file.cusRefId, "redo"); // Call function to open print modal
                  });

                  if (file.status !== "successful") {

                     actions.append(downloadBtn).append(printBtn).append(previewBtn);

                  } else {

                     actions.append(downloadBtn).append(rePrintBtn).append(previewBtn);
                  }
                  row.append(actions);
                  row.append("<td>" + (index + 1) + "</td>");
                  // Append the row to the table
                  $('#myTable tbody').append(row);
               });
            },
            error: function (xhr, status, error) {
               const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 4000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                     toast.onmouseenter = Swal.stopTimer;
                     toast.onmouseleave = Swal.resumeTimer;
                  }
               });
               Toast.fire({
                  icon: "warning",
                  title: "Error fecthing customer files",
               });
            }
         });
      },
      error: function (xhr, status, error) {
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "warning",
            title: "Error fecthing customer files",
         });
      }
   });
}

// Function to download the file
function downloadFile(fileName, fileId, cusRefId) {
   $.ajax({
      type: "GET",
      url: '/api/files/fetch?filename=' + fileName,
      headers: {
         'Authorization': `Bearer ${customer_token}`,
         'Content-Type': 'application/json'
      },
      xhrFields: {
         responseType: 'blob'
      },
      success: function (blob) {

         Swal.fire({
            title: "Are you sure?",
            text: "You want to add this as records , the owner will be notified",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, add it!"
         }).then((result) => {
            if (result.isConfirmed) {
               var cusRefId = _id;
               updateSalesStatus(fileId, 'successful', cusRefId);
               var url = URL.createObjectURL(blob);
               var link = document.createElement('a');
               link.href = url;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
            } else {
               var url = URL.createObjectURL(blob);
               var link = document.createElement('a');
               link.href = url;
               link.download = fileName;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);

            }
         });

      },
      error: function (xhr, status, error) {
         console.error('Error downloading file:', error);
      }
   });
}



function openPreview(fileName, fileId, cusRefId) {
   const fileUrl = '/uploads/' + fileName;
   window.open(fileUrl, '_blank');
}


async function openPrintModal(fileName, fileId, cusRefId) {
   const fileExtension = fileName.split('.').pop().toLowerCase();
   const fileUrl = '/uploads/' + fileName;
   const iframe = document.createElement('iframe');
   iframe.style.width = '100%';
   iframe.style.height = '100%';
   iframe.style.border = 'none';

   if (fileExtension === 'doc' || fileExtension === 'txt') {
      // Convert DOC or TXT to PDF on the server
      const response = await fetch(`/api/convert-to-pdf?fileName=${fileName}`);
      const blob = await response.blob();

      // Create object URL for the PDF blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open the PDF file for printing
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
         iframe.contentWindow.print();
         iframe.style.display = 'none';
         console.log("print is ready doc and txt");
      };
   } else {
      // Directly print the file if it's already in PDF format
      iframe.src = fileUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => {
         iframe.contentWindow.print();
         iframe.style.display = 'none';
      };
   }

   iframe.contentWindow.addEventListener('afterprint', cleanupAndNotify);

   function cleanupAndNotify(event) {
      // Cleanup and notify the user
      iframe.contentWindow.removeEventListener('afterprint', cleanupAndNotify);
      var cusRefId = _id;
      if (event.returnValue) {
         console.log('Printing was successful.' + event.returnValue);
         updateSalesStatus(fileId, 'successful', cusRefId);
      } else {
         console.log('Printing was canceled.' + event.returnValue);
         // Add your actions for canceled printing here
      }
   }

}


function updateSalesStatus(fileId, status, cusRefId) {
   var formData = new FormData();
   formData.append('_id', fileId);
   formData.append('status', status);
   formData.append('cusRefId', cusRefId);

   $.ajax({
      type: "POST",
      url: '/api/reports/sales/update-status',
      data: formData,
      processData: false,
      contentType: false,
      headers: {
         'Authorization': `Bearer ${customer_token}`,
      },
      success: function (data) {
         console.log(data)
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "success",
            title: data
         });

         formData.delete('_id');
         formData.delete('status');
         formData.delete('cusRefId');
         fetchCustomersFiles();
      },
      error: function (xhr, status, error) {

         console.log(xhr, status, error);
         const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
               toast.onmouseenter = Swal.stopTimer;
               toast.onmouseleave = Swal.resumeTimer;
            }
         });
         Toast.fire({
            icon: "error",
            title: xhr.responseText
         });

      }
   });
}






fetchCustomersFiles();
