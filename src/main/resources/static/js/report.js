const report1_token = localStorage.getItem('token');
function ExportToExcel(type, fn, dl) {
   var elt = document.getElementById('myTable');
   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
   return dl ?
      XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
      XLSX.writeFile(wb, fn || ('Report.' + (type || 'xlsx')));
}


function exportCustomersToExcel(type, fn, dl) {
   var elt = document.getElementById('customers');
   var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
   return dl ?
      XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
      XLSX.writeFile(wb, fn || ('Customers.' + (type || 'xlsx')));
}

function exportPDF() {
   // Create a new jsPDF instance
   var pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a5',
      putOnlyUsedFonts: true
   });

   // Get the HTML table element
   const table = document.querySelector("#myTable");

   // Define starting position for the PDF content
   let y = 20;

   // Iterate over each row in the table
   table.querySelectorAll('tr').forEach(row => {
      // Reset x position for each row
      let x = 20;

      // Iterate over each cell in the row
      row.querySelectorAll('td').forEach(cell => {
         // Add content of the cell to the PDF with adjusted font size and style
         pdf.setFontSize(10); // Set font size
         pdf.setFont('helvetica', 'normal'); // Set font style
         pdf.text(cell.innerText, x + 2, y + 7); // Adjust position for text content

         // Draw border for the cell
         pdf.rect(x, y, 40, 10); // Define cell width and height
         pdf.line(x, y + 10, x + 40, y + 10); // Draw bottom border

         // Increment x position for the next cell
         x += 40; // Adjust this value to set horizontal spacing between cells
      });

      // Increment y position for the next row
      y += 10; // Adjust this value to set vertical spacing between rows
   });

   // Save the PDF with the given filename
   pdf.save('Report.pdf');
}


let salesData = []; // Variable to store sales data

function formatDate(dateString) {
   var date = new Date(dateString);
   var year = date.getFullYear();
   var month = String(date.getMonth() + 1).padStart(2, '0');
   var day = String(date.getDate()).padStart(2, '0');
   return year + '-' + month + '-' + day;
}

async function fetchSalesData() {
   try {
      const response = await fetch('/api/reports/sales', {
         headers: {
            'Authorization': `Bearer ${report1_token}
`,
            'Content-Type': 'application/json'
         }
      });
      const data = await response.json();
      salesData = data; 
      fetchSalesTable();
   } catch (error) {
      console.error('Error fetching sales data:', error);
   }
}

async function fetchSalesTable() {
   $("#myTable tbody").empty();

   salesData.forEach(function (Sales, index) {
      var row = $("<tr>");
      row.append($("<td>").text(Sales.activity));
      row.append($("<td>").text(Sales.amount.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })));

      var status = Sales.status;
      var color;

      if (status === 'pending') {
         color = 'gold';
      } else if (status === 'successful') {
         color = 'green';
      } else if (status === 'failed') {
         color = 'red';
      } else {
         color = 'transparent'; // Default background color
      }

      var tdElement = $("<td>").text(status).css('color', color);
      row.append(tdElement);
      row.append($("<td>").text(formatDate(Sales.createdAt)));
      row.append($("<td>").text(formatDate(Sales.operatedAt)));
      row.append("<td>" + (index + 1) + "</td>");

      $("#myTable tbody").append(row);
   });
}




window.onload = function () {
   // Chart options
   const options = {
      title: {
         text: "Sales Overview"
      },
      axisY: {
         includeZero: true
      },
      data: [{
         type: "column",
         yValueFormatString: "#,###",
         indexLabel: "{y}",
         color: "#546BC1",
         dataPoints: []
      }]
   };

   function updateChart() {
      // Initialize empty objects to store total amounts for each activity
      const pendingTotals = {};
      const successfulTotals = {};
      const failedTotals = {};

      // Calculate total amounts for each activity based on status
      salesData.forEach(sale => {
         const activity = sale.activity.toLowerCase();
         const amount = parseFloat(sale.amount);
         const status = sale.status.toLowerCase();

         if (status === 'pending') {
            if (pendingTotals.hasOwnProperty(activity)) {
               pendingTotals[activity] += amount;
            } else {
               pendingTotals[activity] = amount;
            }
         } else if (status === 'successful') {
            if (successfulTotals.hasOwnProperty(activity)) {
               successfulTotals[activity] += amount;
            } else {
               successfulTotals[activity] = amount;
            }
         } else if (status === 'failed') {
            if (failedTotals.hasOwnProperty(activity)) {
               failedTotals[activity] += amount;
            } else {
               failedTotals[activity] = amount;
            }
         }
      });

      // Convert the pendingTotals object into an array of data points for pending sales
      const pendingDataPoints = Object.entries(pendingTotals).map(([label, y]) => ({ label, y, indexLabel: "{y}", color: "#FFD700" }));

      // Convert the successfulTotals object into an array of data points for successful sales
      const successfulDataPoints = Object.entries(successfulTotals).map(([label, y]) => ({ label, y, indexLabel: "{y}", color: "#32CD32" }));

      // Convert the failedTotals object into an array of data points for failed sales
      const failedDataPoints = Object.entries(failedTotals).map(([label, y]) => ({ label, y, indexLabel: "{y}", color: "#FF0000" }));

      // Merge pending, successful, and failed data points
      const dataPoints = [...pendingDataPoints, ...successfulDataPoints, ...failedDataPoints];

      // Update the chart options with the new data points
      options.data[0].dataPoints = dataPoints;

      // Render the updated chart
      var chart = new CanvasJS.Chart("chartContainer", options);
      chart.render();
   }

   // Call updateChart() to initially render the chart
   updateChart();
};


   async function filterTable() {
      const { value: formValues } = await Swal.fire({
         title: "Multiple inputs",
         html: `
        <input type="date" id="swal-input1" class="swal2-input">
        <input type="date" id="swal-input2" class="swal2-input">
      `,
         focusConfirm: false,
         preConfirm: () => {
            return [
               document.getElementById("swal-input1").value,
               document.getElementById("swal-input2").value
            ];
         }
      });

      if (formValues) {
         var startDate = new Date(formValues[0]);
         var endDate = new Date(formValues[1]);

         if (formValues[0] !== '' && formValues[1] !== '') {
       
         // Filter salesData based on the date range
         var filteredData = salesData.filter(Sales => {
            var saleDate = new Date(Sales.createdAt);
            return saleDate >= startDate && saleDate <= endDate;
         });

         // Update table with filtered data
         $("#myTable tbody").empty();
         filteredData.forEach(function (Sales, index) {
            var row = $("<tr>");
            row.append($("<td>").text(Sales.activity));
            row.append($("<td>").text(Sales.amount.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })));

            var status = Sales.status;
            var color;

            if (status === 'pending') {
               color = 'gold';
            } else if (status === 'successful') {
               color = 'green';
            } else if (status === 'failed') {
               color = 'red';
            } else {
               color = 'transparent';
            }

            var tdElement = $("<td>").text(status).css('color', color).addClass('status');
            row.append(tdElement);
            row.append($("<td>").text(formatDate(Sales.createdAt)));
            row.append($("<td>").text(formatDate(Sales.operatedAt)));
            row.append("<td>" + (index + 1) + "</td>");

            $("#myTable tbody").append(row);
         });

      }
      }
   }


   function fetchCustomers() {
      $.ajax({
         type: "GET",
         url: "/api/customers/fetch",
         headers: {
            'Authorization': `Bearer ${report1_token}
`,
            'Content-Type': 'application/json'
         },
         success: function (customers) {

            // Clear the existing list before adding new customers
            $('#customers tbody').empty();

            // Loop through each customer and append their data to the table
            customers.forEach(function (customer, index) {
               var row = $("<tr>");
               row.append($("<td>").text(customer.name));
               row.append($("<td>").text(customer.tel));
               row.append($("<td>").text(formatDate(customer.createdAt)));
               row.append("<td>" + (index + 1) + "</td>");
               $("#customers tbody").append(row);
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
               title: "Error fetching customers",
            });
         }
      });
   }


   async function getAllTodaysSales() {
      try {
         const response = await fetch('/api/reports/sales/today', {
            headers: {
               'Authorization': `Bearer ${report1_token}`,
               'Content-Type': 'application/json'
            }
         });
         const data = await response.json();
         $("#todaySales").text(data.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' }));
      } catch (error) {
         console.error('Error fetching sales data:', error);
      }
   }

   
   async function getAllWeeksSales() {
      try {
         const response = await fetch('/api/reports/sales/week', {
            headers: {
               'Authorization': `Bearer ${report1_token}`,
               'Content-Type': 'application/json'
            }
         });
         const data = await response.json();
         $("#weekSales").text(data.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' }));
      } catch (error) {
         console.error('Error fetching sales data:', error);
      }
   }

   async function getAllTotalSales() {
      try {
         const response = await fetch('/api/reports/sales/total', {
            headers: {
               'Authorization': `Bearer ${report1_token}`,
               'Content-Type': 'application/json'
            }
         });
         const data = await response.json();
         $("#totalSales").text(data.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' }));
      } catch (error) {
         console.error('Error fetching sales data:', error);
      }
   }

   //pendingAndFailed

   async function getAllFailedAndPendingSales() {
      try {
         const response = await fetch('/api/reports/sales/pending-and-failed', {
            headers: {
               'Authorization': `Bearer ${report1_token}`,
               'Content-Type': 'application/json'
            }
         });
         const data = await response.json();
         $("#pendingAndFailed").text(data.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' }));
      } catch (error) {
         console.error('Error fetching sales data:', error);
      }
   }


   getAllTodaysSales();
   getAllWeeksSales();
   getAllTotalSales();
   getAllFailedAndPendingSales();
   
   fetchSalesData();
   fetchCustomers();


