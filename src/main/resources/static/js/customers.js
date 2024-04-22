const customers_token = localStorage.getItem('token');
// Function to format date in YYYY-MM-DD HH:mm:ss format
function formatDate(dateString) {
   var date = new Date(dateString);
   var year = date.getFullYear();
   var month = String(date.getMonth() + 1).padStart(2, '0');
   var day = String(date.getDate()).padStart(2, '0');
   return year + '-' + month + '-' + day;
}


function fetchCustomers() {
   $.ajax({
      type: "GET",
      url: "/api/customers/fetch",
      headers: {
         'Authorization': `Bearer ${customers_token}`,
         'Content-Type': 'application/json'
      },
      success: function (customers) {

         // Clear the existing list before adding new customers
         $('#customer-list').empty();

         // Loop through each customer and append their data to the list
         customers.forEach(function (customer, index) {

            $('#customer-list').append(
               '<li style="font-size:11px">' +
               '<a href="/dashboard/preview-customer-files?customer=' + customer._id + '"  class="customer-item" data-file="' + customer.fileUrl + '">' +
               '<div class="preview-container">' +
               getFilePreviewHTML(customer.fileUrl) + // Get preview based on file type
               '</div>' +
               '<span class="product">' + customer.name + '</span>' +
               '</a>' +
               '<span class="price">Date : ' + formatDate(customer.createdAt) + '</span>' +
               '<span class="price trash"><i class="fa fa-trash" onclick="deleteCustomers(\'' + customer._id + '\')"></i></span>' +
               '</li>'
            );


         });

         // Function to get preview HTML based on file type
         function getFilePreviewHTML(fileUrl) {
            return '<img src="' + fileUrl + '" alt="" class="img"  style="border-radius: 100px">';

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
            title: "Error fecthing customer",
         });
      }
   });
}


function deleteCustomers(_id) {
   const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
         confirmButton: "btn btn-success",
         cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
   });
   swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true
   }).then((result) => {
      if (result.isConfirmed) {

         fetch(`/api/customers/delete?_id=${_id}`, {
            method: 'DELETE',
            headers: {
               'Authorization': `Bearer ${customers_token}`,
               'Content-Type': 'application/json'
            },
         })
            .then(response => {
               // Check if the request was successful (status code 200-299)
               if (response.ok) {
                  swalWithBootstrapButtons.fire({
                     title: "Deleted!",
                     text: "Customer has been deleted.",
                     icon: "success"
                  });

                  fetchCustomers();
               } else {
                  // Handle error scenarios
                  if (response.status === 404) {
                     swalWithBootstrapButtons.fire({
                        title: "Error",
                        text: "Error occurred while deleting customer",
                        icon: "error"
                     });
                  } else {
                     swal("Oops!", "Error deleting user. Please try again.", "error");
                  }
               }
            })
            .catch(error => {

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
                  title: "customer deletion was not successful, please try again",
               });
            });


      } else if (
         /* Read more about handling dismissals below */
         result.dismiss === Swal.DismissReason.cancel
      ) {
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
            title: "No action occurred",
         });
      }
   });

}


// Call the fetchCustomers function to retrieve and display customer data
fetchCustomers();



