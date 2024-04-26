
const settings_token = localStorage.getItem('token');
const formData = new FormData();

async function setStraightPrice(_id, type) {

    const { value: price } = await Swal.fire({
        title: "Enter price for " + type,
        input: "number",
        inputPlaceholder: "Enter your price for the activity",
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === "" || parseFloat(value) < 0 || isNaN(value)) {
                    resolve("Please enter a valid non-negative number.");
                } else {
                    resolve();
                }
            });
        }
    });

    if (price) {
        savePriceData(null, price, _id, type);

    }
}

async function setActivityType() {
    const { value: email } = await Swal.fire({
        title: "Input activity type",
        input: "text",
        inputLabel: "Activitiy type",
        inputPlaceholder: "Add more action types here"
    });
    if (email) {
        //Swal.fire(`Entered email: ${email}`);
        saveActivityType(email);
    }
}

function saveActivityType(name) {
    formData.append('name', name);
    $.ajax({
        url: "/api/customers/action-types/save",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': `Bearer ${settings_token}`,
        },
        success: function (response) {
            formData.delete('name');
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
                title: "Activity saved successfully"
            });
            getactivityTypes();

        },

        error: function (xhr, textStatus, errorThrown) {
            if (xhr.status === 401 || xhr.status === 400) {

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
                    title: xhr.responseText
                });

            } else {
                formData.delete('name');
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
        }
    });
}


function getactivityTypes() {
    $.ajax({
        type: "GET",
        url: "/api/customers/action-types",
        headers: {
            'Authorization': `Bearer ${settings_token}`,
            'Content-Type': 'application/json'
        },
        success: function (types) {
            const activityList = $('#activity-list');
            activityList.empty(); // Clear previous list items
            types.forEach((type, index) => {
                // Create list item and its components
                const listItem = $('<li>');
                const typeId = $('<span>').addClass('id').text(index + 1);
                const activityType = $('<span>').addClass('activity-type').text(type.name);
                const deleteIcon = $('<span>').attr("data-id", type.id).addClass('delete-icon').html('<i class="fa fa-trash"></i>');
                const setPriceIcon = $('<span>').attr("data-id", type.id).attr("data-type", type.name).addClass('set-price-icon').text('Add Price');


                deleteIcon.click(function name() {
                    var _id = $(this).data("id");
                    actionTypeDeleteById(_id);
                });

                setPriceIcon.click(function () {
                    var _id = $(this).data("id");
                    var type = $(this).data("type").trim().toLowerCase().charAt(0);

                    if (type === 'p' || type === 's') {
                        setDifPrice(_id, $(this).data("type"));
                    } else {
                        setStraightPrice(_id, $(this).data("type"));
                    }
                });
                // Append components to the list item
                listItem.append(typeId, activityType, setPriceIcon, deleteIcon);

                // Append the list item to the activity list
                activityList.append(listItem);
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
                title: "Error fetching activities",
            });
        }
    });
}

function actionTypeDeleteById(_id) {

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

            fetch(`/api/customers/action-types/delete?_id=${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${settings_token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {

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
                        title: "Type deleted successfully"
                    });
                    getactivityTypes();
                    getactivityPrices();

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
                        title: "type deletion was not successful, please try again",
                    });
                });


        } else if (
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

function actionTypePriceDeleteById(_id) {

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

            fetch(`/api/customers/action-types/prices/delete?_id=${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${settings_token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {

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
                        title: "Type deleted successfully"
                    });
                    getactivityTypes();
                    getactivityPrices();

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
                        title: "type deletion was not successful, please try again",
                    });
                });


        } else if (
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


function getactivityPrices() {
    $.ajax({
        type: "GET",
        url: "/api/customers/action-types",
        headers: {
            'Authorization': `Bearer ${settings_token}`,
            'Content-Type': 'application/json'
        },
        success: function (types) {

            console.log(types)
            const activityList = $('#activity-list');
            activityList.empty();
            types.forEach((type, index) => {
                // Create list item and its components
                const listItem = $('<li>');
                const typeId = $('<span>').addClass('id').text(index + 1);
                const activityType = $('<span>').addClass('activity-type').text(type.name);
                const deleteIcon = $('<span>').attr("data-id", type.id).addClass('delete-icon').html('<i class="fa fa-trash"></i>');
                const setPriceIcon = $('<span>').attr("data-id", type.id).attr("data-type", type.name).addClass('set-price-icon').text('Add Price');

                deleteIcon.click(function name() {
                    var _id = $(this).data("id");
                    actionTypeDeleteById(_id);
                });

                setPriceIcon.click(function () {
                    var _id = $(this).data("id");
                    var type = $(this).data("type").trim().toLowerCase().charAt(0);
                    console.log(_id, type)
                    if (type === 'p' || type === 's') {
                        setDifPrice(_id, $(this).data("type"));
                    } else {
                        setStraightPrice(_id, $(this).data("type"));
                    }
                });
                // Append components to the list item
                listItem.append(typeId, activityType, setPriceIcon, deleteIcon);

                // Append the list item to the activity list
                activityList.append(listItem);
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
                title: "Error fetching activities",
            });
        }
    });
}


async function setDifPrice(_id, type) {

    const { value: formValues } = await Swal.fire({
        title: "Set price for " + type,
        html:
            '<div>' +
            '<input type="radio" id="bw" name="color" value=""B&W">' +
            '<label for="bw">Black&White</label>' +
            '<input type="radio" id="color" name="color" value="Colored">' +
            '<label for="color">Colored</label>' +
            '</div>' +
            '<input id="price" type="number" min="0" step="01.0" class="swal2-input" placeholder="Enter price">',
        focusConfirm: true,
        showCancelButton: true,
        preConfirm: () => {
            return [
                document.getElementById("color").value,
                document.getElementById("price").value
            ];
        }
    });
    if (formValues && (formValues[0] !== '' || formValues[1] !== '')) {
        savePriceData(formValues[0], formValues[1], _id, type);
    }
}

function savePriceData(color, price, _id, type) {
    formData.append('color', color);
    formData.append('price', price);
    formData.append('typeId', _id);
    formData.append('type', type.toLowerCase());
    $.ajax({
        url: "/api/customers/save/prices",
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': `Bearer ${settings_token}`,
        },
        success: function (response) {
            formData.delete('color');
            formData.delete('quantity');
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
                title: "Price set successfully"
            });
            getactivityPrices();
            formData.delete('color');
            formData.delete('price');
            formData.delete('typeId');
            formData.delete('type');
        },
        error: function (xhr, textStatus, errorThrown) {

            formData.delete('color');
            formData.delete('price');
            formData.delete('typeId');
            formData.delete('type');
            if (xhr.status === 401 || xhr.status === 400) {

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
                    title: xhr.responseText
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
                    icon: "error",
                    title: "Failed to save price, please try again"
                });

            }

        }
    });
}

function getactivityPrices() {
    $.ajax({
        type: "GET",
        url: "/api/customers/action-types/prices",
        headers: {
            'Authorization': `Bearer ${settings_token}`,
            'Content-Type': 'application/json'
        },
        success: function (types) {
            const priceList = $('#price-list');
            priceList.empty(); // Clear previous list items
            types.forEach((type, index) => {
                // Create list item and its components
                const listItem = $('<li>');
                const typeId = $('<span>').addClass('id').text(index + 1);
                const activityType = $('<span>').addClass('activity-type').text(type.type);
                const color = $('<span>').addClass('color').text(type.color);
                const price = $('<span>').addClass('price').text(type.price.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' }));
                const deleteIcon = $('<span>').attr("data-id", type.id).addClass('delete-icon').html('<i class="fa fa-trash"></i>');

                deleteIcon.click(function name() {
                    var _id = $(this).data("id");
                    actionTypePriceDeleteById(_id);
                });
                // Append components to the list item
                listItem.append(typeId, activityType, color, price, deleteIcon);

                // Append the list item to the activity list
                priceList.append(listItem);
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
                title: "Error fetching activities",
            });
        }
    });
}

function fetchUsers() {
    $.ajax({
       type: "GET",
       url: "/api/users/fetch",
       headers: {
          'Authorization': `Bearer ${settings_token}`,
          'Content-Type': 'application/json'
       },
       success: function (users) {

        const activityList = $('#users-list');
        activityList.empty();
        users.forEach((user, index) => {
            // Create list item and its components
            const listItem = $('<li>');
            const id = $('<span>').addClass('id').text(index + 1);
            const name = $('<span>').addClass('activity-type').text(user.username);
            const role = $('<span>').addClass('activity-type').text(user.role);

            // Append components to the list item
            listItem.append(id, name, role);

            // Append the list item to the activity list
            activityList.append(listItem);
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

 function updateUserRole(_id, role) {
    formData.append('_id', _id);
    formData.append('role', role.toLowerCase());
    $.ajax({
        url: "/api/users/update/role",
        type: 'PUT',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': `Bearer ${settings_token}`,
        },
        success: function (response) {
            formData.delete('color');
            formData.delete('quantity');
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
                title: "Role Updated successfully"
            });
            getactivityPrices();
            formData.delete('role');
            formData.delete('_id');
        },
        error: function (xhr, textStatus, errorThrown) {

            formData.delete('role');
            formData.delete('_id');
            if (xhr.status === 401 || xhr.status === 400) {

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
                    title: xhr.responseText
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
                    icon: "error",
                    title: "Failed to save price, please try again"
                });

            }

        }
    });
}



getactivityPrices();
getactivityTypes();
// fetchUsers();