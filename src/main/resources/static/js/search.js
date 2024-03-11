function myFunction() {
   var input, filter, table, tr, td, i, txtValue;
   input = document.getElementById("myInput");
   filter = input.value.toUpperCase();
   table = document.getElementById("myTable");
   tr = table.getElementsByTagName("tr");
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
         txtValue = td.textContent || td.innerText;
         if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

function editRow(button) {
   // Add logic for editing the row
   alert("Edit button clicked");
}

function deleteRow(button) {
   // Add logic for deleting the row
   alert("Delete button clicked");
}

function openSearch() {
   document.getElementById("myOverlay").style.display = "block";
}

function closeSearch() {
   document.getElementById("myOverlay").style.display = "none";
}


// Function to filter customers by name
function filterCustomersByName() {
   var input, filter, ul, li, a, i, txtValue;
   input = document.getElementById('search-input');
   filter = input.value.toUpperCase();
   ul = document.getElementById("customer-list");
   li = ul.getElementsByTagName('li');
   for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByClassName("product")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
         li[i].style.display = "";
      } else {
         li[i].style.display = "none";
      }
   }
}

// Attach event listener to search input
document.getElementById("search-input").addEventListener("input", filterCustomersByName);


