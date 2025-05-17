document.addEventListener('DOMContentLoaded', () => {
  // Filtrado de hamburguesas por grupo
  const groupButtons = document.querySelectorAll('.groups button');
  const burgerItems = document.querySelectorAll('.burger-options .burger');
  
  groupButtons.forEach(button => {
    button.addEventListener('click', () => {
      const group = button.textContent.toLowerCase();
      burgerItems.forEach(item => {
        if (item.classList.contains(group)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

// Ocultar items de hamburguesas al cargar la página
burgerItems.forEach(item => {
  item.style.display = 'none';
});

  // Agregar elementos al carrito
  const cartList = document.getElementById('cart-list');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const burger = button.closest('.burger');
      const name = burger.getAttribute('data-name');
      const price = parseFloat(burger.getAttribute('data-price'));
      
      if (cart[name]) {
        cart[name].quantity += 1;
      } else {
        cart[name] = { price: price, quantity: 1 };
      }
      updateCartList();
    });
  });

  // Actualiza la lista del carrito con precios y cantidades
  function updateCartList() {
    cartList.innerHTML = ''; // Clear current list
    let subtotal = 0;
    for (const item in cart) {
    const li = document.createElement('li'); // Create list item
    li.innerHTML = `
      ${item} - ${cart[item].quantity} x $${cart[item].price}
      <br><button class="increase" data-item="${item}">+</button>
      <button class="decrease" data-item="${item}">-</button>
      <button class="remove" data-item="${item}">Remove</button>
    `; // Agregar botones para aumentar, disminuir y eliminar en el InnerHTML
    cartList.appendChild(li);
    subtotal += cart[item].price * cart[item].quantity;
    }
    
    let summary = document.getElementById('cart-summary');
    // Si el carrito está vacío, mostrar mensaje de carrito vacío y ocultar resumen
    if (subtotal === 0) {
    if (summary) {
      summary.remove();
    }
    document.getElementById("empty-cart-message").style.display = "block";
    return;
    }
    
    const deliveryFee = 5;  // Envío fijo de $5
    const total = subtotal + deliveryFee; // Calcular total
    
    // Si no existe el resumen, crearlo y agregarlo después de la lista del carrito
    if (!summary) {
    summary = document.createElement('div');
    summary.id = 'cart-summary';
    cartList.insertAdjacentElement('afterend', summary);
    }
    
    summary.innerHTML = `
    <p>Subtotal: $${subtotal.toFixed(2)}</p>
    <p>Delivery: $${deliveryFee.toFixed(2)}</p>
    <p>Total: $${total.toFixed(2)}</p>
    `; // Actualiza el resumen con los precios en el InnerHTML

    document.getElementById("empty-cart-message").style.display = "none"; // Oculta el mensaje de Carrito Vacío
  }

  // Propiedades de los botones del carrito (aumentar, disminuir y eliminar)
  cartList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
      const itemName = target.getAttribute('data-item');
      if (target.classList.contains('increase')) {
        cart[itemName].quantity += 1;
      } else if (target.classList.contains('decrease')) {
        if (cart[itemName].quantity > 1) {
          cart[itemName].quantity -= 1;
        } else {
          delete cart[itemName];
        }
      } else if (target.classList.contains('remove')) {
        delete cart[itemName];
      }
      updateCartList();
    }
  });

  // Boton para mostrar/ocultar el carrito flotante
  const showCartButton = document.getElementById('show-cart');
  const cartContainer = document.getElementById('cart-container');
  cartContainer.style.display = 'none';// Ocultar el carrito al cargar la página

  // Cambiar el texto del botón y mostrar/ocultar el carrito al hacer clic
  showCartButton.addEventListener('click', () => {
    if (cartContainer.style.display === 'none' || cartContainer.style.display === '') {
    cartContainer.style.display = 'block';
    showCartButton.textContent = '❌';
    } else {
    cartContainer.style.display = 'none';
    showCartButton.textContent = '🛒';
    }
  });

// Toggle chat window visibility
const showChatButton = document.getElementById('show-chat');
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');

const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');
chatContainer.style.display = 'none';

showChatButton.addEventListener('click', () => {
    if (chatContainer.style.display === 'none') {
        chatContainer.style.display = 'block';
        showChatButton.textContent = '❌';
    } else {
        chatContainer.style.display = 'none';
        showChatButton.textContent = '💬';
    }
});

  // Handle sending messages to the server
  sendChatButton.addEventListener('click', () => {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        appendMessage('You: ' + userMessage, 'user');
        chatInput.value = '';
        sendMessageToServer(userMessage);
    }
  });

  // Append message to chat window
  function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
  }

  // Send message to the Django backend API
  function sendMessageToServer(message) {
    fetch('http://127.0.0.1:8000/api/chatbot/?query=' + encodeURIComponent(message), {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      if (data.answer) {
        appendMessage('Assistant: ' + data.answer, 'assistant');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      appendMessage('Assistant: Sorry, something went wrong.', 'assistant');
    });
  }
});


// Send chat message
const sendChatButton = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');

sendChatButton.addEventListener('click', () => {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        appendMessage('You: ' + userMessage, 'user');
        chatInput.value = '';
        sendMessageToServer(userMessage);
    }
});

// Append message to chat window
function appendMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to server
function sendMessageToServer(message) {
    fetch('/chat_api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: 'message=' + encodeURIComponent(message)
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            appendMessage('Assistant: ' + data.response, 'assistant');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('Assistant: Sorry, something went wrong.', 'assistant');
    });
}

// Get CSRF token from cookies
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}


  // Eliminar todos los elementos del carrito con clear-cart
  const clearCartButton = document.getElementById('clear-cart');
  clearCartButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    for (const item in cart) {
      delete cart[item];
    }
    updateCartList();
  });

function updateCartMessage() {
  let cartList = document.getElementById("cart-list");
  let emptyMessage = document.getElementById("empty-cart-message");

  if (cartList.children.length === 0) {
      emptyMessage.style.display = "block"; // Show message
  } else {
      emptyMessage.style.display = "none"; // Hide message
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateCartMessage);

// Also update when an item is added or removed
document.getElementById("clear-cart").addEventListener("click", function() {
  document.getElementById("cart-list").innerHTML = ""; // Clear all items
  updateCartMessage();
});



const cart = {}; // Objeto para almacenar los ítems del carrito


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('hid').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting immediately

    // Check if cart is empty or undefined
    if (Object.keys(cart).length === 0) {
      console.log("Cart is empty!");
      return;
    }

    const totalPrice = calculateTotalPrice(); // Calculate the total price of the cart
    document.getElementById('prices').value = totalPrice.toFixed(2); // Set the price field in the form

    // Prepare the cart data (products and quantities) to send
    let products = [];
    for (const item in cart) {
      const name = encodeURIComponent(item);  // Ensure product name is encoded properly
      const quantity = cart[item].quantity;
      products.push(`${name}=${quantity}`);
    }
    const productsString = products.join('|');  // Join product data with '|' separator

    document.getElementById('products').value = productsString;  // Set the products field in the form

    // Log form data for debugging
    console.log("Submitting form with products:", productsString);
    
    // Now, submit the form after setting the hidden values
    document.getElementById('hid').submit();
  });
});
  

// Función para calcular el precio total del carrito
function calculateTotalPrice() {
  let total = 0;
  for (const item in cart) {
      total += cart[item].price * cart[item].quantity;
  }
  total += 5.00;
  return total;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhBzw-nzs3vZpSPJno-b1qPpNAKlomOrvlSnHMjeA_eJ6_X9XsVvh3FiUZxMMd3huJB9kbqmA98hSywXrZNUDyhQdpyRVMgyP0AAw1ijYXiEzv6AT5__gBV6TWaTRB97L5cMUYQ5yCa2wmXvKT6IAiAMAoX-hfiVFXM15dGB1YIf8hyXTkc6vj9NF8EoaTxdNLQlC053Zeqtem71xgTT4iIWXpKcsVw-KApC4B5OhRYq6USI8s49TxXTr3OK_5uGwX7nluNiRtq_Xd7AUrdYO613oyarw&lib=MODKcEcOcTwDb5jwiLy02M1CpcznXvU-Y";

  const categoryMap = {
      burger: "burgers",
      dessert: "desserts",
      drink: "drinks",
      fast: "fast"
  };

  const groupsContainer = document.getElementById("groups");
  const burgerOptionsContainer = document.getElementById("burger-options");
  const loadingMessage = document.getElementById("loading-message");

  fetch(apiUrl)
      .then(response => response.json())
      .then(json => {
          const items = json.data;
          console.log("Datos recibidos:", items); // <-- Para depuración

          if (!items || items.length === 0) {
              console.error("No data returned from API.");
              loadingMessage.textContent = "Error loading data.";
              return;
          }

          // Si hay menos de 5 elementos, usa todos como dishes y no muestres leaders
          let leaders = [];
          let dishes = items;
          if (items.length > 4) {
              leaders = items.slice(-4);
              dishes = items.slice(0, items.length - 4);
          }

          const dishesByCategory = {};
          dishes.forEach(dish => {
              const key = categoryMap[dish.categoria?.toLowerCase()] || dish.categoria?.toLowerCase() || "otros";
              if (!dishesByCategory[key]) {
                  dishesByCategory[key] = [];
              }
              dishesByCategory[key].push(dish);
          });


          loadingMessage.style.display = "none";

          function renderDishes(category) {
              burgerOptionsContainer.innerHTML = "";
              const filteredDishes = dishesByCategory[category];
              if (filteredDishes && filteredDishes.length > 0) {
                  filteredDishes.forEach(dish => {
                      const dishDiv = document.createElement("div");
                      dishDiv.classList.add("burger", category);
                      dishDiv.dataset.name = dish.nombre;

                      // Convert price to number (removes $ and converts to float)
                      const price = parseFloat(dish.precio.replace('$', ''));
                      dishDiv.dataset.price = price;

                      const img = document.createElement("img");
                      img.src = dish.imagen;
                      img.alt = dish.nombre;

                      const h3 = document.createElement("h3");
                      h3.textContent = dish.nombre;

                      dishDiv.appendChild(img);
                      dishDiv.appendChild(h3);

                      // Description
                      if (dish.descripcion && dish.descripcion.trim() !== "") {
                          const descriptionP = document.createElement("p");
                          descriptionP.textContent = `Description: ${dish.descripcion.trim()}`;
                          dishDiv.appendChild(descriptionP);
                      }

                      // Ingredients
                      if (dish.ingredientes && dish.ingredientes.trim() !== "") {
                          const ingredientsP = document.createElement("p");
                          ingredientsP.textContent = `Ingredients: ${dish.ingredientes.trim()}`;
                          dishDiv.appendChild(ingredientsP);
                      }

                      // Allergens (precaution with ingredients)
                      if (dish.alergeno && dish.alergeno.trim() !== "") {
                          const allergensP = document.createElement("p");
                          allergensP.textContent = `Precaution: Contains ${dish.alergeno.trim()}`;
                          dishDiv.appendChild(allergensP);
                      }

                      // Price
                      const priceLabel = document.createElement("p");
                      priceLabel.textContent = `Price: $${price.toFixed(2)}`;
                      dishDiv.appendChild(priceLabel);

                      // Calories
                      if (dish.calorias) {
                          const caloriesP = document.createElement("p");
                          caloriesP.textContent = `Calories: ${dish.calorias}`;
                          dishDiv.appendChild(caloriesP);
                      }

                      const button = document.createElement("button");
                      button.classList.add("add-to-cart");
                      button.textContent = "Add to Cart";
                      dishDiv.appendChild(button);

                      burgerOptionsContainer.appendChild(dishDiv);
                  });
              } else {
                  burgerOptionsContainer.textContent = "No dishes available for this category.";
              }
          }

          // Mostrar SIEMPRE todas las categorías como botones, usando la imagen del leader si existe
          const categories = Object.keys(dishesByCategory);

          categories.forEach(catKey => {
              // Busca si hay un leader para esta categoría
              let leader = leaders.find(l =>
                  (l.categoria?.toLowerCase() === catKey) ||
                  (catKey === "burgers" && l.categoria?.toLowerCase() === "burger") ||
                  (catKey === "desserts" && l.categoria?.toLowerCase() === "dessert") ||
                  (catKey === "drinks" && l.categoria?.toLowerCase() === "drink")
              );

              const div = document.createElement("div");
              div.classList.add(catKey);

              // Si hay leader, muestra imagen, si no, solo el botón
              if (leader && leader.imagen) {
                  const img = document.createElement("img");
                  img.src = leader.imagen;
                  img.alt = "Category Image";
                  div.appendChild(img);
              }

              const button = document.createElement("button");
              const displayName = catKey.charAt(0).toUpperCase() + catKey.slice(1);
              button.textContent = displayName;
              button.addEventListener("click", () => {
                  renderDishes(catKey);
              });

              div.appendChild(button);
              groupsContainer.appendChild(div);
          });

          // Selecciona la categoría por defecto (la primera)
          const defaultCat = categories[0];
          renderDishes(defaultCat);
      })
      .catch(error => {
          console.error("Error fetching menu data:", error);
          loadingMessage.textContent = "Error loading data.";
      });

  const cartList = document.getElementById('cart-list');
  const cart = {};

  burgerOptionsContainer.addEventListener('click', event => {
      if (event.target && event.target.classList.contains('add-to-cart')) {
          const burger = event.target.closest('.burger');
          const name = burger.getAttribute('data-name');
          const price = parseFloat(burger.getAttribute('data-price'));

          if (cart[name]) {
              cart[name].quantity += 1;
          } else {
              cart[name] = { price: price, quantity: 1 };
          }
          updateCartList();
      }
  });

  function updateCartList() {
      cartList.innerHTML = "";
      for (const [name, item] of Object.entries(cart)) {
          const listItem = document.createElement("li");
          listItem.textContent = `${name} - ${item.quantity} x $${item.price.toFixed(2)}`;
          cartList.appendChild(listItem);
      }
  }

  // Clear Cart - Remove items and flush localStorage
  const clearCartButton = document.getElementById("clear-cart");
  clearCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      // Remove items from the cart object
      for (const item in cart) {
          delete cart[item];
      }
      updateCartList();
      // Remove items from localStorage
      localStorage.removeItem("cartItems");
  });

  document.getElementById('hid').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Calculate the total price
    const totalPrice = calculateTotalPrice();
    
    // Update the hidden price field
    document.getElementById('prices').value = totalPrice.toFixed(2);

    // Create a string of product details (name=quantity)
    let products = [];
    for (const item in cart) {
        const name = encodeURIComponent(item); // Make sure the product name is URL-safe
        const quantity = cart[item].quantity;
        products.push(`${name}=${quantity}`);
    }
    const productsString = products.join('|'); // Use '|' as a separator

    // Update the hidden products field
    document.getElementById('products').value = productsString;

    // Construct the full URL with query parameters (without ".html")
    const fullUrl = `${deliveryUrl}?prices=${totalPrice.toFixed(2)}&products=${productsString}`;

    // Now redirect to the dynamically generated URL
    window.location.href = fullUrl;
});


  // Function to calculate the total price
  function calculateTotalPrice() {
      let total = 0;
      for (const item in cart) {
          total += cart[item].price * cart[item].quantity;
      }
      total += 5.00; // Add fixed delivery fee
      return total;
  }
});

// Function to fetch menu data
async function fetchMenuData() {
  try {
      const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjpvPbjOX2q16HBV3u_pBYB_3yFwc6Ke4FubmuuUiQLHAfI2mauW0hnKXyQdWWvqcTnXgBE9LnixfIhYv_c-b8BH2yRz-DUiapEuyvuHdrPxyALEIYoga59pA6ikg3p3QB_hH3BJpVGxEoGvNus5inP3yOnuxthu_T9rQZcrKA04fEX1S0qGkVZnobm2Ltvl3n-TgJWybG69iZPNItVEgSnR-kicQJYs8Tbkbakn1njRFsRIOFDiru_iWQOGVVODGQI86H1UGezYJzpboWNApN4dkkICQ&lib=MODKcEcOcTwDb5jwiLy02M1CpcznXvU-Y');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const menuData = await response.json();
      return menuData;
  } catch (error) {
      console.error('Fetch error:', error);
      return [];
  }
}

// Example usage:
fetchMenuData().then(menuData => {
  // Process the menuData as needed
  console.log(menuData);
});

// Function to fetch menu data
async function fetchMenuData() {
  try {
      const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjpvPbjOX2q16HBV3u_pBYB_3yFwc6Ke4FubmuuUiQLHAfI2mauW0hnKXyQdWWvqcTnXgBE9LnixfIhYv_c-b8BH2yRz-DUiapEuyvuHdrPxyALEIYoga59pA6ikg3p3QB_hH3BJpVGxEoGvNus5inP3yOnuxthu_T9rQZcrKA04fEX1S0qGkVZnobm2Ltvl3n-TgJWybG69iZPNItVEgSnR-kicQJYs8Tbkbakn1njRFsRIOFDiru_iWQOGVVODGQI86H1UGezYJzpboWNApN4dkkICQ&lib=MODKcEcOcTwDb5jwiLy02M1CpcznXvU-Y');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const menuData = await response.json();
      return menuData;
  } catch (error) {
      console.error('Fetch error:', error);
      return [];
  }
}

// Function to initialize the chatbot
function initializeChatbot(menuData) {
  // Your existing chatbot initialization code

  // Example: Use menuData to provide context to the chatbot
  const menuItems = menuData.map(item => item.name).join(', ');
  const initialMessage = `Hello! Here's our menu: ${menuItems}. How can I assist you today?`;
  appendMessage(initialMessage, 'assistant');
}

// Initialize the chatbot with menu data
fetchMenuData().then(menuData => {
  initializeChatbot(menuData);
});

