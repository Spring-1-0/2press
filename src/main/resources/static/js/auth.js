const guard_token = localStorage.getItem('token');
function handleResponse(response) {
  if (response.status === 200) {
   return;
  }
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
    return;
  }
}


function handleError(error) {
  
}

function checkResponse(url, options) {
  fetch(url, options)
    .then(handleResponse)
    .catch(handleError);
}

checkResponse('/api/users/token-exchange', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${guard_token}
`,
    'Content-Type': 'application/json'
  }
});

// Define a logout function
function logout() {
  // Make a POST request to the logout endpoint
  fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${guard_token}`,
    },
  })
    .then(response => {
      if (response.ok) {
        localStorage.removeItem('token');

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed Out successfully"
        });
        setTimeout(function () {
          window.location.href = '/';
        }, 2000);

      } 
    })
    .catch(error => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Failed to sign out, please try again"
      });
    });
}

