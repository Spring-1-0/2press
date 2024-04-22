
const formData = new FormData();
const report2_token = localStorage.getItem('token');
const existingFileNames = [];
let totalFiles = 0;
const fileCounter = document.getElementById('fileCounter');
const copiesText = document.getElementById('copies');
const colorText = document.getElementById('color');
const activityText = document.getElementById('activity');

function updateFileCounter() {
   fileCounter.textContent = `Total Files: ${totalFiles}`;
}

document.addEventListener('DOMContentLoaded', () => {
   const fileInput = document.getElementById('fileInput');
   const fileDrop = document.getElementById('fileDrop');
   const selectedFiles = document.getElementById('selectedFiles');
   const scanButton = document.getElementById('scanButton');
   // Overall base drag and drop
   document.body.addEventListener('dragover', (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
   });

   document.body.addEventListener('drop', (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
   });

   fileDrop.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDrop.classList.add('drag-over');
   });

   fileDrop.addEventListener('dragleave', () => {
      fileDrop.classList.remove('drag-over');
   });

   fileDrop.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDrop.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files);
      e.stopPropagation(); // Stop propagation to prevent duplication
   });

   fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
   });


   scanButton.addEventListener('click', () => {
      openCameraAndCapture();
   });

   async function openCameraAndCapture() {
      try {
         const stream = await navigator.mediaDevices.getUserMedia({ video: true });

         const video = document.createElement('video');
         document.body.appendChild(video);
         video.srcObject = stream;

         video.onloadedmetadata = (e) => {
            video.play();
         };

         // Capture image from video when the user clicks "Scan"
         video.addEventListener('click', () => {
            captureImageFromVideo(video);
         });
      } catch (error) {
         console.error('Error accessing camera:', error);
      }
   }

   function captureImageFromVideo(video) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataURL = canvas.toDataURL('image/png');

      const fileName = `scannedImage_${new Date().getTime()}.pdf`;
      const fileInfo = { name: fileName, dataURL: imageDataURL };

   }


   function handleFiles(files) {
      if (files.length > 0) {


         for (const file of files) {
            if (isValidFileType(file)) {

               formData.append('file', file);
               const fileName = file.name;

               // Check if the file with the same name already exists
               if (existingFileNames.includes(fileName)) {
                  // Handle duplicate file, you can choose to override or block
                  console.log(`File with name ${fileName} already exists!`);
                  continue; // Skip processing the duplicate file
               }

               existingFileNames.push(fileName); // Add the filename to the list
               totalFiles += 1; // Increment the total files counter

               if (file.type === 'application/zip') {
                  unzipFile(file);
               } else {
                  const fileInfo = {
                     name: fileName,
                     type: file.type,
                     file: file
                  };
                  appendFileRow(fileInfo);
               }
            }
         }

         updateFileCounter(); // Update the file counter after handling files
      }
   }

   function isValidFileType(file) {
      const acceptedTypes = ['image', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/zip', 'text/plain'];
      return acceptedTypes.some(type => file.type.startsWith(type)) && file.type !== 'image/svg+xml';
   }

   function appendFileRow(fileInfo) {
      const fileRow = document.createElement('div');
      fileRow.classList.add('file-row');

      const fileInfoDiv = document.createElement('div');
      fileInfoDiv.textContent = `${fileInfo.name}`;
      fileInfoDiv.classList.add('file-info'); // Add a class for styling
      fileInfoDiv.addEventListener('click', () => {
         // Call a function to open the file preview
         previewFile(fileInfo);
      });
      fileRow.appendChild(fileInfoDiv);

      const removeButton = document.createElement('div');
      removeButton.classList.add('remove-file');
      removeButton.textContent = 'X';
      removeButton.addEventListener('click', () => {
         fileRow.remove();
         removeFileFromStorage(fileInfo);
      });
      fileRow.appendChild(removeButton);

      selectedFiles.appendChild(fileRow);

      // Store the file info in local storage
      const storedFiles = JSON.parse(localStorage.getItem('selectedFiles')) || [];
      storedFiles.push(fileInfo);
      localStorage.setItem('selectedFiles', JSON.stringify(storedFiles));
   }

   function previewFile(fileInfo) {
      // Assuming 'fileUrl' contains the URL of the selected file
      const fileUrl = URL.createObjectURL(fileInfo.file); // Replace this with the actual file URL

      // Open the file with the default program associated with its file type
      window.open(fileUrl);

   }

   function removeFileFromStorage(fileInfo) {
      const storedFiles = JSON.parse(localStorage.getItem('selectedFiles')) || [];
      const updatedFiles = storedFiles.filter(file => file.name !== fileInfo.name);
      localStorage.setItem('selectedFiles', JSON.stringify(updatedFiles));

      // Remove the file from formData
      formData.forEach((value, key) => {
         if (value.name === fileInfo.name) {
            formData.delete(key);
         }
      });
      const index = existingFileNames.indexOf(fileInfo.name);
      if (index !== -1) {
         existingFileNames.splice(index, 1);
      }

      totalFiles -= 1;
      updateFileCounter()

   }


   function unzipFile(zipFile) {
      // Add your unzip logic here
      // For simplicity, let's assume it returns an array of file blobs
      const unzippedFiles = [];

      for (const file of unzippedFiles) {
         const fileName = file.name;
         const fileInfo = { name: fileName };
         appendFileRow(fileInfo);
      }
   }
});
async function addMessage() {
   const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
         "aria-label": "Type your message here"
      },
      showCancelButton: true
   });
   if (text) {
      // Swal.fire(text);
      formData.append('message', text);
   }
}


async function color() {
   //collor
   /* inputOptions can be an object or Promise */
   const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
         resolve({
            "B&W": "Black&White",
            "Colored": "Colored",
         });
      }, 1000);
   });
   const { value: color } = await Swal.fire({
      title: "Select output color",
      input: "radio",
      inputOptions,
      inputValidator: (value) => {
         if (!value) {
            return "You need to choose something!";
         }
      }
   });
   if (color) {
      formData.append('color', color);
      colorText.textContent = color;

      // Swal.fire({ html: `You selected: ${color}` });
   }
}


function getactivityTypes() {
   $.ajax({
      type: "GET",
      url: "/api/customers/action-types",
      headers: {
         'Authorization': `Bearer ${report2_token}`,
         'Content-Type': 'application/json'
      },
      success: function (types) {
         const inputOptions = {};
         types.forEach(type => {
            inputOptions[type.name.toLowerCase()] = type.name;
         });

         // Call the activity function with inputOptions
         activity(inputOptions);
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
            title: "Error fecthing activties",
         });
      }
   });

}

async function activity(inputOptions) {
   const { value: activity } = await Swal.fire({
      title: "Select what you want to do",
      input: "select",
      inputOptions: inputOptions,
      inputPlaceholder: "Select an action type",
      showCancelButton: true,
      inputValidator: (value) => {
         return new Promise((resolve) => {
            if (value != "") {
               resolve();
            } else {
               resolve("You need to select an action type.");
            }
         });
      }
   });
   if (activity) {
      //Swal.fire(`You selected: ${activity}`);
      formData.append('activity', activity);
      activityText.textContent = activity;
   }
}




function copies() {
   Swal.fire({
      title: "How many copies?",
      icon: "question",
      input: "range",
      inputLabel: "Your copies",
      inputAttributes: {
         min: "1",
         max: "500",
         step: "1"
      },
      inputValue: 1
   }).then((result) => {
      if (result.isConfirmed) {
         formData.append('copies', result.value);
         copiesText.textContent = result.value;
         // const selectedAge = result.value;
         // console.log("Selected age:", selectedAge);
      }
   });

}

submitButton.addEventListener('click', async () => {
   const files = formData.getAll('file');
   const fileCount = files.length;
   if (fileCount > 0) {
      const { value: formValues } = await Swal.fire({
         title: "Info",
         html: `
           <input id="swal-input1" placeholder="Enter name" class="swal2-input">
           <input id="swal-input2" placeholder="Enter telephone" class="swal2-input">
         `,
         focusConfirm: false,
         preConfirm: () => {
            return [
               document.getElementById("swal-input1").value,
               document.getElementById("swal-input2").value
            ];
         }
      });
      if (formValues && (formValues[0] !== '' || formValues[1] !== '')) {
         formData.append('name', formValues[0]);
         formData.append('tel', formValues[1]);
         $.ajax({
            url: '/api/customers/save',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
               'Authorization': `Bearer ${report2_token}`,
            },
            success: function (response) {
               console.log('Files submitted successfully:', response);
               localStorage.removeItem('selectedFiles');
               totalFiles = 0;
               updateFileCounter()
               selectedFiles.innerHTML = '';
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
                  title: "Files sent successfully"
               });
               setTimeout(() => {
                  window.location.reload();
               }, 4200);
            },
            error: function (xhr, textStatus, errorThrown) {
               if (xhr.status >= 400 && xhr.status <= 499) {
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
                     title: "Files not sent successfully, Please try again"
                  });

               } else if (xhr.status >= 500) {
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
                     title: "Something happened, please try again."
                  });

               }
            }
         });
         fileInput.value = '';
         formData.delete('file');
      }
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
         title: "Select at least one file"
      });
      setTimeout(() => {
         window.location.reload();
      }, 3000);
   }
});



async function feedback() {
   const { value: formValues } = await Swal.fire({
      title: 'Send Message',
      html:
         '<textarea id="swal-input1" class="swal2-textarea" placeholder="Type your message here..."></textarea>' +
         '<input id="swal-input2" class="swal2-input" placeholder="Your email" type="email">',
      focusConfirm: false,
      preConfirm: () => {
         return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
         ]
      }
   });


   if (formValues && (formValues[0] !== '' || formValues[1] !== '')) {

      formData.append('message', formValues[0]);
      formData.append('name', formValues[1]);

      $.ajax({
         url: '/api/customers/save/feedback',
         type: 'POST',
         data: formData,
         processData: false,
         contentType: false,
         headers: {
            'Authorization': `Bearer ${report2_token}`,
         },
         success: function (response) {
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
               title: "Feedback sent successfully"
            });

            formData.delete('name');
            formData.delete('message');
            formValues[0] = '';
            formValues[1] = '';
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
               title: "Failed to send feeback, please try again"
            });
         }
      });
   }
}