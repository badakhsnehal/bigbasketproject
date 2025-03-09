document.addEventListener("DOMContentLoaded", () => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
    const cartList = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout");
    const continueShoppingButton = document.getElementById("continue-shopping");
    const paymentButton = document.getElementById("payment");
    const scannerImage = document.getElementById("scanner-image");
  
    // Fix for payment button
    if (paymentButton && scannerImage) {
        scannerImage.style.display = "none"; // Hide scanner initially
  
        paymentButton.addEventListener("click", () => {
            console.log("Payment button clicked");
            scannerImage.style.display = "block"; // Show scanner image
        });
  
        scannerImage.addEventListener("dblclick", () => {
            alert("Payment successful! Thank you...");
            window.location.href = "#checkout";
        });
    } else {
        console.error("Payment button or scanner image not found!");
    }
  
    function updateCartUI() {
        cartList.innerHTML = "";
        let total = 0;
  
        if (cartItems.length === 0) {
            cartList.innerHTML = "<li class='list-group-item text-center'>Your cart is empty</li>";
            totalPriceElement.textContent = "Total: ₹0.00";
            checkoutButton.style.display = "none";
            return;
        }
  
        cartItems.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            total += item.quantity * itemPrice;
  
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover;">
                <span>${item.title} - ₹${item.price} </span>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-secondary decrease-item" data-index="${index}">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-primary increase-item" data-index="${index}">+</button>
                    <button class="btn btn-sm btn-danger remove-item mx-2" data-index="${index}">🗑</button>
                </div>
            `;
            cartList.appendChild(listItem);
        });
  
        totalPriceElement.textContent = `Total: ₹${total.toFixed(2)}`;
        checkoutButton.style.display = "block";
  
        document.querySelectorAll(".decrease-item").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                } else {
                    cartItems.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });
  
        document.querySelectorAll(".increase-item").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                cartItems[index].quantity += 1;
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });
  
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                cartItems.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });
    }
  
    document.querySelectorAll(".add-to-cart")?.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productCard = event.target.closest(".card");
            const productTitle = productCard.querySelector(".card-title").textContent;
            const productPrice = productCard.querySelector(".card-text").textContent;
            const productImage = productCard.querySelector(".card-img-top").src;
  
            const existingItem = cartItems.find((item) => item.title === productTitle);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cartItems.push({ title: productTitle, price: productPrice, image: productImage, quantity: 1 });
            }
  
            localStorage.setItem("cart", JSON.stringify(cartItems));
            alert("Item added to cart!");
            updateCartUI();
        });
    });
  
    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            localStorage.removeItem("cart");
            cartItems = [];
            updateCartUI();
        });
    }
  
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            if (cartItems.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            generateReceipt();
        });
    }
  
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener("click", () => {
            window.location.href = "http://127.0.0.1:5500/index%20.html#";
        });
    }
  
    updateCartUI();
  });
  
  function generateReceipt() {
    const receiptItems = document.getElementById("receipt-items");
    const receiptTotal = document.getElementById("receipt-total");
    let total = 0;
  
    receiptItems.innerHTML = "";
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
    cartItems.forEach((item) => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        const itemTotal = item.quantity * itemPrice;
        total += itemTotal;
  
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `<span>${item.title} (Qty: ${item.quantity})</span><span>₹${itemTotal.toFixed(2)}</span>`;
        receiptItems.appendChild(li);
    });
  
    receiptTotal.textContent = `Total: ₹${total.toFixed(2)}`;
    const billReceiptModal = new bootstrap.Modal(document.getElementById('billReceiptModal'));
    billReceiptModal.show();
  }
  
  function showPopup() {
    document.getElementById("popupMessage").style.display = "block";
  }
  
  function closePopup() {
    document.getElementById("popupMessage").style.display = "none";
  }
  
  window.onclick = function (event) {
    let popup = document.getElementById("popupMessage");
    if (event.target !== popup && event.target !== document.querySelector(".location button")) {
        popup.style.display = "none";
    }
  };

  
  
  const myCarousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
    interval: 1000,
    wrap: true
  });
  
    //print
    function downloadReceipt() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Big Basket Receipt", 70, 20);
        doc.setFontSize(12);
        doc.text("-------------------------------------------------", 10, 30);
    
        let yPos = 40;
        let total = 0;
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
        cartItems.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
            const itemTotal = item.quantity * itemPrice;
            total += itemTotal;
    
            doc.text(`${index + 1}. ${item.title} (Qty: ${item.quantity}) - ₹${itemTotal.toFixed(2)}`, 10, yPos);
            yPos += 10;
        });
    
        doc.text("-------------------------------------------------", 10, yPos);
        yPos += 10;
        doc.setFont("helvetica", "bold");
        doc.text(`Total Amount: ₹${total.toFixed(2)}`, 10, yPos);
        yPos += 20;
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for shopping with us!", 60, yPos);
    
        // Save the PDF
        doc.save("receipt.pdf");
    }
    
    // Attach download function to the button
    document.addEventListener("DOMContentLoaded", () => {
        const downloadButton = document.createElement("button");
        downloadButton.classList.add("btn", "btn-info");
        downloadButton.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF';
        downloadButton.onclick = downloadReceipt;
    
        // Add the button inside the modal footer
        document.querySelector(".modal-footer").appendChild(downloadButton);
    });
    


    //login
    document.addEventListener("DOMContentLoaded", function () {
        const loginForm = document.getElementById("loginForm");
        const loginMessage = document.getElementById("loginMessage");
    
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form submission
    
            // Dummy login validation (Replace with actual authentication logic)
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
    
            if (email === "user@example.com" && password === "123456") {
                alert("Login successful!");
                let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
                loginModal.hide(); // Hide the modal
            } else {
                loginMessage.style.display = "block"; // Show error message
            }
        });
    });
    