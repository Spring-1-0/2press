const formData = new FormData();
const user_token = localStorage.getItem('token');
// Function to format date in YYYY-MM-DD HH:mm:ss format
function formatDate(dateString) {
   var date = new Date(dateString);
   var year = date.getFullYear();
   var month = String(date.getMonth() + 1).padStart(2, '0');
   var day = String(date.getDate()).padStart(2, '0');
   return year + '-' + month + '-' + day;
}


function fetchUsers() {
   $.ajax({
      type: "GET",
      url: "/api/users/fetch",
      headers: {
         'Authorization': `Bearer ${user_token}`,
      },
      success: function (users) {

         $("#myTable tbody").empty();

         users.forEach(function (user) {
            var row = $("<tr>");
            row.append($("<td>").text(user.username));
            row.append($("<td>").text(user.location));
            row.append($("<td>").text(user.tel));
            // Display the user profile image 
            var profileImage =
               $("<img>")
                  .attr("src", `/api/files/fetch?filename=${user.profile}`)
                  .attr("alt", "Profile Image")
                  .css("max-width", "50px");

            row.append($("<td>").append(profileImage));
            //row.append($("<td>").text(user.password));
            row.append($("<td>").text(user.usermail));

            // Create a button with a data attribute to store the _id
            var buttondel = $("<button>").html('<i class="fa fa-trash"></i>').addClass("del-btn").attr("data-id", user._id).attr("title", "Delete");
            var buttonview = $("<button>").html('<i class="fa fa-eye"></i>').addClass("view-btn").attr("data-id", user._id).attr("title", "View");
            var buttonedit = $("<button>").html('<i class="fa fa-edit"></i>').addClass("edit-btn").attr("data-id", user._id).attr("title", "Edit");

            // Attach a click event handler to the button
            buttondel.click(function () {
               // Retrieve the _id from the data attribute
               var _id = $(this).data("id");

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

                     fetch(`/api/users/delete?_id=${_id}`, {
                        method: 'DELETE',
                        headers: {
                           'Authorization': `Bearer ${user_token}`,
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
                                 title: "User deleted successfully"
                              });

                              fetchUsers();
                           } else {

                              swalWithBootstrapButtons.fire({
                                 title: "Error",
                                 text: "Error occurred while deleting user",
                                 icon: "error"
                              });

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
                              title: "No action occurred",
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


            });



            buttonview.click(function () {
               var _id = $(this).data("id");

               // Make GET request to fetch user information
               $.ajax({
                  url: `/api/users/search?_id=${_id}`,
                  method: 'GET',
                  headers: {
                     'Authorization': `Bearer ${user_token}`,
                     'Content-Type': 'application/json'
                  },
                  success: function (response) {
                     // Extract user information from the response
                     var htmlContent = `
           <div>
               <p><strong>Username:</strong> ${response.username}</p>
               <p><strong>Location:</strong> ${response.location}</p>
               <p><strong>Profile:</strong><img width="20px" height="20px" src="/api/files/fetch?filename=${response.profile}"/></p>
               <p><strong>Telephone:</strong> ${response.tel}</p>
               <p><strong>Email:</strong> ${response.usermail}</p>
           </div>
       `;

                     // Display Swal modal with user information
                     Swal.fire({
                        title: "<strong>User Information</strong>",
                        icon: "info",
                        html: htmlContent,
                        showCloseButton: true,
                        showCancelButton: true,
                        focusConfirm: false,
                        confirmButtonText: `<i class="fa fa-thumbs-up"></i> Great!`,
                        confirmButtonAriaLabel: "Thumbs up, Okay",
                        cancelButtonText: `<i class="fa fa-thumbs-down"></i>`,
                     });
                  },
                  error: function (xhr, status, error) {
                     console.error('Error fetching user data:', error);
                  }
               });

            });


            buttonedit.click(function () {

               var _id = $(this).data("id");

               window.location.href = `/api/users/edit/${_id}`;


            });

            // Append the button to the row
            row.append($("<td>").append(buttondel, buttonview));

            // Append the row to the table
            $("#myTable tbody").append(row);
         });
      },
      error: function (xhr, textStatus, errorThrown) {
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
            title: "Error fecthing users",
         });
      }
   });
}

$(document).ready(function () {
   fetchUsers();
});

// Retrieve previous count from localStorage or initialize to 0
let previousCount = parseInt(localStorage.getItem('previousCount')) || 0;

function fetchCount() {
   $.ajax({
      type: "GET",
      url: "/api/users/fetch",
      headers: {
         'Authorization': `Bearer ${user_token}`,
         'Content-Type': 'application/json'
      },
      success: function (data) {
         // Get the current count from the received data
         const currentCount = data.length;
         if (currentCount !== previousCount) {
            fetchUsers();
            localStorage.setItem('previousCount', currentCount);
            //showToast("New user added ", "success", 10000);
         }
      },
      error: function (xhr, status, error) {
         console.error('Error fetching count:', error);
      }
   });
}


// Call fetchCount initially
//fetchCount();

// Periodically fetch count every second
//setInterval(fetchCount, 10000);
async function addUser() {
   const { value: formValues } = await Swal.fire({
      title: "Add User",
      html: ` 
        <input id="usermail" placeholder="Enter email" class="swal2-input">
        <input id="username" placeholder="Enter username" class="swal2-input">
        <input id="location" placeholder="Enter location" class="swal2-input">
        <input id="tel" placeholder="Enter telephone" class="swal2-input">
        <input id="password" type="password" placeholder="Enter password" class="swal2-input">
        <input id="file" style="width:270px" name="file" type="file" class="swal2-input">
      `,
      focusConfirm: false,
      preConfirm: () => {
         const fileInput = document.getElementById("file");
         const file = fileInput.files[0];
         formData.append('usermail', document.getElementById("usermail").value);
         formData.append('username', document.getElementById("username").value);
         formData.append('location', document.getElementById("location").value);
         formData.append('tel', document.getElementById("tel").value);
         formData.append('password', document.getElementById("password").value);
         formData.append('file', file);
         return formData;
      }
   });
   if (formValues && (formValues[0] !== '' || formValues[1] !== '' || formValues[2] !== '' || formValues[3] !== '' || formValues[4] !== '')) {
      $.ajax({
         url: '/api/users/save',
         type: 'POST',
         data: formData,
         processData: false,
         contentType: false,
         headers: {
            'Authorization': `Bearer ${user_token}`,
         },
         success: function (response) {
            formData.delete('usermail');
            formData.delete('username');
            formData.delete('location');
            formData.delete('tel');
            formData.delete('password');
            formData.delete('file');

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
               title: "User saved successfully"
            });
            fetchUsers();


         },
         error: function (xhr, textStatus, errorThrown) {
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
               icon: "error",
               title: "Failed to save user, please try again"
            });
         }
      });

   } else {
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
}
