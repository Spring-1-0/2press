const formData = new FormData();
const feddback_token = localStorage.getItem('token');
// Function to format date in YYYY-MM-DD HH:mm:ss format
function formatDate(dateString) {
   var date = new Date(dateString);
   var year = date.getFullYear();
   var month = String(date.getMonth() + 1).padStart(2, '0');
   var day = String(date.getDate()).padStart(2, '0');
   return year + '-' + month + '-' + day;
}


function fetchFeedbacks() {
   $.ajax({
      type: "GET",
      url: "/api/customers/feedback/fetch",
      headers: {
         'Authorization': `Bearer ${feddback_token}`,
         'Content-Type': 'application/json'
      },
      success: function (feebacks) {

         $("#myTable tbody").empty();

         feebacks.forEach(function (user, index) {
            var row = $("<tr>");
            row.append("<td>" + (index + 1) + "</td>");
            row.append($("<td>").text(user.name));
            row.append($("<td>").text(user.message));
            // Create a button with a data attribute to store the _id
            var buttondel = $("<button>").html('<i class="fa fa-trash"></i>').addClass("del-btn").attr("data-id", user.id).attr("title", "Delete");

            // Attach a click event handler to the button
            buttondel.click(function () {
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

                     fetch(`/api/customers/feedback/delete?_id=${user.id}`, {
                        method: 'DELETE',
                        headers: {
                           'Authorization': `Bearer ${feddback_token}`,
                           'Content-Type': 'application/json'
                        },
                     })
                        .then(response => {
                           // Check if the request was successful (status code 200-299)
                           if (response.ok) {
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
                                 icon: "success",
                                 title: "Feedback deleted successfully"
                              });

                              fetchFeedbacks();
                           } else {

                              swalWithBootstrapButtons.fire({
                                 title: "Error",
                                 text: "Error occurred while deleting feedback",
                                 icon: "error"
                              });

                           }
                        })
                        .catch(error => {
                           swalWithBootstrapButtons.fire({
                              title: "Cancelled",
                              text: "feedback is not deleted successfully, Please try again",
                              icon: "error"
                           });
                        });


                  } else if (
                     /* Read more about handling dismissals below */
                     result.dismiss === Swal.DismissReason.cancel
                  ) {
                     swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your user is safe :)",
                        icon: "error"
                     });
                  }
               });


            });

            // Append the button to the row
            row.append($("<td>").append(buttondel));

            // Append the row to the table
            $("#myTable tbody").append(row);
         });
      },
      error: function (xhr, textStatus, errorThrown) {
         // Handle error responses
         if (xhr.status === 400 || xhr.status === 500) {
            swal("Oops!", "Somthing happened , try again", "error");
         } else {
            swal("Oops!", "An unexpected error occurred.", "error");
         }
      }
   });
}

$(document).ready(function () {
   fetchFeedbacks();
});
