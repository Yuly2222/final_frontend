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
 

  // Actualiza la lista del carrito con precios y cantidades
  function updateCartList() {
    cartList.innerHTML = ''; // Clear current list
 let subtotal = 0;

for (const item in cart) {
  const li = document.createElement('li');
  li.innerHTML = `
    ${item} - ${cart[item].quantity} x $${cart[item].price}
    <br><button class="increase" data-item="${item}">+</button>
    <button class="decrease" data-item="${item}">-</button>
    <button class="remove" data-item="${item}">Remove</button>
  `;
  cartList.appendChild(li);
  subtotal += cart[item].price * cart[item].quantity;
}

let summary = document.getElementById('cart-summary');
if (subtotal === 0) {
  if (summary) {
    summary.remove();
  }
  document.getElementById("empty-cart-message").style.display = "block";
  return;
}

// No necesitas volver a declarar subtotal aquí ✅
// subtotal = 0; ❌ ¡BORRAR ESTA LÍNEA!

for (let item in cart) {
  console.log(`Item: ${item}, Precio: ${cart[item].price}, Cantidad: ${cart[item].quantity}`);
}

const deliveryFee = 5;
const total = subtotal + deliveryFee;
document.getElementById('cart-total').innerText = `Total: $${subtotal.toFixed(2)}`;



    
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
  const apiUrl = "https://final-backend2-20lz.onrender.com/app1/menu/";
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
          const items = json.data || json.items || json; 
          console.log("Datos recibidos:", items);

          if (!items || items.length === 0) {
              console.error("No data returned from API.");
              loadingMessage.textContent = "Error loading data.";
              return;
          }

          // SEPARAR leaders (los que tienen name vacío o price 0) y dishes
          let leaders = [];
          let dishes = [];

          items.forEach(item => {
            // Si el item está vacío en nombre y precio es 0, es leader
            if (
              (!item.name || item.name.trim() === "") &&
              (item.price === "0.00" || item.price === 0 || item.price === "0")
            ) {
              leaders.push(item);
            } else {
              dishes.push(item);
            }
          });

          // AGRUPAR dishes por categoría
          const dishesByCategory = {};
          dishes.forEach(dish => {
              const key = categoryMap[dish.category?.toLowerCase()] || dish.category?.toLowerCase() || "otros";
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
                      dishDiv.dataset.name = dish.name;

                      const price = parseFloat(dish.price.replace('$', ''));
                      dishDiv.dataset.price = price;

                      const img = document.createElement("img");
                      img.src = dish.image_link;
                      img.alt = dish.name;

                      const h3 = document.createElement("h3");
                      h3.textContent = dish.name;

                      dishDiv.appendChild(img);
                      dishDiv.appendChild(h3);

                      if (dish.description && dish.description.trim() !== "") {
                          const descriptionP = document.createElement("p");
                          descriptionP.textContent = `Description: ${dish.description.trim()}`;
                          dishDiv.appendChild(descriptionP);
                      }

                      if (dish.ingredients && dish.ingredients.trim() !== "") {
                          const ingredientsP = document.createElement("p");
                          ingredientsP.textContent = `Ingredients: ${dish.ingredients.trim()}`;
                          dishDiv.appendChild(ingredientsP);
                      }

                      if (dish.awareness && dish.awareness.trim() !== "") {
                          const allergensP = document.createElement("p");
                          allergensP.textContent = `Precaution: Contains ${dish.awareness.trim()}`;
                          dishDiv.appendChild(allergensP);
                      }

                      const priceLabel = document.createElement("p");
                      priceLabel.textContent = `Price: $${price.toFixed(2)}`;
                      dishDiv.appendChild(priceLabel);

                      if (dish.calories) {
                          const caloriesP = document.createElement("p");
                          caloriesP.textContent = `Calories: ${dish.calories}`;
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

          // Mostrar siempre todas las categorías como botones, con imagen líder si existe
          const categories = Object.keys(dishesByCategory);

          categories.forEach(catKey => {
              // Buscar líder correspondiente a la categoría
              let leader = leaders.find(l =>
                  (l.category?.toLowerCase() === catKey) ||
                  (catKey === "burgers" && l.category?.toLowerCase() === "burger") ||
                  (catKey === "desserts" && l.category?.toLowerCase() === "dessert") ||
                  (catKey === "drinks" && l.category?.toLowerCase() === "drink") ||
                  (catKey === "fast" && l.category?.toLowerCase() === "fast")
              );

              const div = document.createElement("div");
              div.classList.add(catKey);

              if (leader && leader.image_link) {
                  const img = document.createElement("img");
                  img.src = leader.image_link;
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

          // Seleccionar categoría por defecto (la primera)
          const defaultCat = categories[0];
          renderDishes(defaultCat);
      })
      .catch(error => {
          console.error("Error fetching menu data:", error);
          loadingMessage.textContent = "Error loading data.";
      });

  const cartList = document.getElementById('cart-list');
  const cart = {};
// Esto SÍ debe estar (delegación con verificación de login)
burgerOptionsContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart')) {
    const token = localStorage.getItem('token');
    if (!token) {
      showModal();
      return; // No agrega al carrito si no está logueado
    }
    const burger = e.target.closest('.burger');
    const name = burger.getAttribute('data-name');
    const price = parseFloat(burger.getAttribute('data-price'));

   if (cart[name]) {
  cart[name].quantity += 1;
} else {
  cart[name] = {
    quantity: 1,
    price: price
  };
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showUserInfo(user) {
  document.getElementById('user-display').textContent = `Bienvenido, ${user.name}`;
  document.querySelector('.login-btn').style.display = 'none';
  document.getElementById('consulta-pedidos-link').style.display = 'inline-block';
  document.getElementById('logout-btn').style.display = 'inline-block';
}

function hideUserInfo() {
  document.getElementById('user-display').textContent = '';
  document.querySelector('.login-btn').style.display = 'inline-block';
  document.getElementById('consulta-pedidos-link').style.display = 'none';
  document.getElementById('logout-btn').style.display = 'none';
}


async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
    hideUserInfo();
    return;
  }

  try {
    const res = await fetch('https://final-backend2-20lz.onrender.com/app1/profile/', {
      headers: { 'Authorization': 'Token ' + token }
    });
    if (!res.ok) throw new Error('No autorizado');
    const data = await res.json();
    showUserInfo(data.user);
  } catch {
    localStorage.removeItem('token');
    hideUserInfo();
  }
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  hideUserInfo();
  // Opcional: redirige a login o recarga la página
  window.location.href = 'ulogin-register.html';
});

window.addEventListener('DOMContentLoaded', fetchUserProfile);


// Cambia entre las pestañas de login y registro
document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Mostrar formulario de login al hacer clic en la pestaña "Iniciar Sesión"
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    // Mostrar formulario de registro al hacer clic en la pestaña "Registrarse"
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Registro: POST al backend
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const pass1 = document.getElementById('register-password').value;
        const pass2 = document.getElementById('register-password2').value;
        const msg = document.getElementById('register-message');

        if (user === "" || email === "" || pass1 === "" || pass2 === "") {
            msg.textContent = "Por favor, completa todos los campos.";
            return;
        }
        if (pass1 !== pass2) {
            msg.textContent = "Las contraseñas no coinciden.";
            return;
        }

        // Construir el objeto para el backend
        const data = {
            name: user,
            address: "Sin dirección",
            contact: email,
            buyer_score: "0"
        };

        fetch('https://final-backend2-20lz.onrender.com/app1/usuarios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                msg.style.color = "green";
                msg.textContent = "¡Registro exitoso!";
                registerForm.reset();
            } else {
                msg.textContent = "Error en el registro. Intenta de nuevo.";
            }
        })
        .catch(() => {
            msg.textContent = "No se pudo conectar al servidor.";
        });
    });
});

// Login: POST al backend
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;
    loginMessage.textContent = '';

    fetch('https://final-backend2-20lz.onrender.com/app1/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: user, password: pass})
    })
    .then(res => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
    })
    .then(data => {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Login exitoso!';
        window.location.href = 'parcial.html';
    })
    .catch(err => {
        loginMessage.style.color = 'red';
        loginMessage.textContent = err.message || 'Error en login';
    });
});

// Referencias al modal y backdrop
const modal = document.getElementById('login_container');
const backdrop = document.getElementById('modal_backdrop');
function showModal() {
  modal.classList.add('active');
  backdrop.classList.add('active');
}
function hideModal() {
  modal.classList.remove('active');
  backdrop.classList.remove('active');
}
if (backdrop) backdrop.addEventListener('click', hideModal);
const closeBtn = document.getElementById('close-modal');
if (closeBtn) closeBtn.addEventListener('click', hideModal);

// Evento para agregar al carrito con verificación de login
// 🎯 Evento para agregar al carrito con verificación de login
burgerOptionsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart')) {
        const token = localStorage.getItem('token');
        if (!token) {
            showModal(); // Mostrar ventana de login si no hay token
            return;
        }

        const burger = e.target.closest('.burger');
        const name = burger.getAttribute('data-name');
        const priceRaw = burger.getAttribute('data-price');
        const price = parseFloat(priceRaw);

        // 🛑 Validar si el precio se leyó correctamente
        if (isNaN(price)) {
            alert("ERROR: El precio no se está leyendo correctamente.");
            console.log("Valor inválido encontrado en data-price:", priceRaw);
            return;
        }

        // ✅ Agregar al carrito
        if (cart[name]) {
            cart[name].quantity += 1;
        } else {
            cart[name] = { price: price, quantity: 1 };
        }

        updateCartList(); // Refrescar carrito visualmente
    }
});
