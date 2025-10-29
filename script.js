const form = document.getElementById('inventoryForm');
const tableBody = document.getElementById('inventoryTableBody');
const submitBtn = document.getElementById('submitBtn');

let inventory = [];
let editIndex = -1; // to track which item is being edited

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const sku = document.getElementById('sku').value.trim();
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const supplier = document.getElementById('supplier').value.trim();
    const price = document.getElementById('price').value.trim();
    const location = document.getElementById('location').value.trim();

    if (!sku || !name || !category || !quantity || !price) {
        alert("Please fill all required fields!");
        return;
    }

    const item = { sku, name, category, quantity, supplier, price, location };

    // If editing
    if (editIndex !== -1) {
        inventory[editIndex] = item;
        editIndex = -1;
        submitBtn.textContent = "Add Item";
    } else {
        // If adding
        inventory.push(item);
    }

    displayInventory();
    form.reset();
});

function displayInventory() {
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.supplier}</td>
      <td>${item.price}</td>
      <td>${item.location}</td>
      <td>
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    `;
        tableBody.appendChild(row);
    });
}

function editItem(index) {
    const item = inventory[index];

    document.getElementById('sku').value = item.sku;
    document.getElementById('name').value = item.name;
    document.getElementById('category').value = item.category;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('supplier').value = item.supplier;
    document.getElementById('price').value = item.price;
    document.getElementById('location').value = item.location;

    editIndex = index;
    submitBtn.textContent = "Update Item";
}

function deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        inventory.splice(index, 1);
        displayInventory();
    }
}