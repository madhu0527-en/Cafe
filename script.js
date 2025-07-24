class CafeAssistant {
    constructor() {
        this.currentOrder = [];
        this.orderTotal = 0;
        this.loyaltyPoints = 150; // Sample points
        this.chatHistory = [];
        this.isTyping = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadMenuData();
        this.loadCafeInfo();
        this.initializeLocalStorage();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        this.orderItems = document.getElementById('orderItems');
        this.orderTotal = document.getElementById('orderTotal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        this.notificationContainer = document.getElementById('notificationContainer');
    }

    attachEventListeners() {
        // Message sending
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Auto-suggestions for input
        this.messageInput.addEventListener('input', () => this.showInputSuggestions());

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const suggestion = e.target.dataset.suggestion;
                this.messageInput.value = suggestion;
                this.sendMessage();
            }
        });

        // Modal controls
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Checkout
        this.checkoutBtn.addEventListener('click', () => this.processCheckout());

        // Input suggestions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('input-suggestion')) {
                this.messageInput.value = e.target.textContent;
                this.sendMessage();
            }
        });
    }

    loadMenuData() {
        this.menuData = {
            coffee: [
                {
                    id: 1,
                    name: "Espresso",
                    description: "Rich and bold shot of pure coffee excellence",
                    price: 3.50,
                    icon: "☕"
                },
                {
                    id: 2,
                    name: "Cappuccino",
                    description: "Perfect balance of espresso, steamed milk, and foam",
                    price: 4.25,
                    icon: "☕"
                },
                {
                    id: 3,
                    name: "Latte",
                    description: "Smooth espresso with steamed milk and light foam",
                    price: 4.50,
                    icon: "☕"
                },
                {
                    id: 4,
                    name: "Mocha",
                    description: "Decadent blend of coffee, chocolate, and steamed milk",
                    price: 5.00,
                    icon: "☕"
                },
                {
                    id: 5,
                    name: "Americano",
                    description: "Espresso shots with hot water for a clean taste",
                    price: 3.75,
                    icon: "☕"
                },
                {
                    id: 6,
                    name: "Caramel Macchiato",
                    description: "Vanilla syrup, steamed milk, espresso, and caramel drizzle",
                    price: 5.25,
                    icon: "☕"
                }
            ],
            pastries: [
                {
                    id: 7,
                    name: "Croissant",
                    description: "Buttery, flaky pastry perfect with your morning coffee",
                    price: 3.00,
                    icon: "🥐"
                },
                {
                    id: 8,
                    name: "Blueberry Muffin",
                    description: "Fresh blueberries in a tender, sweet muffin",
                    price: 3.25,
                    icon: "🧁"
                },
                {
                    id: 9,
                    name: "Chocolate Danish",
                    description: "Rich chocolate filling in flaky pastry dough",
                    price: 3.75,
                    icon: "🥐"
                },
                {
                    id: 10,
                    name: "Banana Bread",
                    description: "Moist, homemade banana bread with walnuts",
                    price: 3.50,
                    icon: "🍞"
                }
            ],
            sandwiches: [
                {
                    id: 11,
                    name: "Turkey Club",
                    description: "Turkey, bacon, lettuce, tomato on toasted bread",
                    price: 8.50,
                    icon: "🥪"
                },
                {
                    id: 12,
                    name: "Veggie Wrap",
                    description: "Fresh vegetables, hummus, and greens in a soft wrap",
                    price: 7.25,
                    icon: "🌯"
                },
                {
                    id: 13,
                    name: "Grilled Cheese",
                    description: "Classic grilled cheese with tomato soup",
                    price: 6.75,
                    icon: "🥪"
                }
            ],
            specials: [
                {
                    id: 14,
                    name: "Today's Soup",
                    description: "Ask about our daily soup special",
                    price: 4.50,
                    icon: "🍲"
                },
                {
                    id: 15,
                    name: "Iced Coffee Special",
                    description: "Cold brew with your choice of flavored syrup",
                    price: 4.00,
                    icon: "🧊"
                }
            ]
        };
    }

    loadCafeInfo() {
        this.cafeInfo = {
            name: "Cozy Corner Café",
            address: "123 Main Street, Coffee City, CC 12345",
            phone: "(555) 123-CAFE",
            email: "hello@cozycorner.cafe",
            hours: {
                "Monday - Friday": "6:00 AM - 8:00 PM",
                "Saturday": "7:00 AM - 9:00 PM",
                "Sunday": "8:00 AM - 6:00 PM"
            },
            specialOffers: [
                "🌟 Buy 5 coffees, get the 6th free!",
                "☀️ Morning special: 20% off all pastries before 10 AM",
                "🎂 Birthday special: Free dessert with valid ID",
                "📱 Student discount: 15% off with student ID"
            ],
            wifi: "Free WiFi: CozyCafe_Guest (Password: coffee123)",
            features: [
                "Free WiFi",
                "Outdoor Seating", 
                "Pet Friendly",
                "Study Area",
                "Live Music Fridays"
            ]
        };
    }

    initializeLocalStorage() {
        // Load previous order if exists
        const savedOrder = localStorage.getItem('cafeOrder');
        if (savedOrder) {
            this.currentOrder = JSON.parse(savedOrder);
            this.updateOrderDisplay();
        }

        // Load loyalty points
        const savedPoints = localStorage.getItem('loyaltyPoints');
        if (savedPoints) {
            this.loyaltyPoints = parseInt(savedPoints);
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.hideInputSuggestions();

        // Process the message
        this.processUserMessage(message);
    }

    addMessage(text, sender, options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add to chat history
        this.chatHistory.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
    }

    async processUserMessage(message) {
        this.showTyping();
        
        // Simulate thinking time
        await this.delay(1000 + Math.random() * 2000);
        
        const response = this.generateResponse(message.toLowerCase());
        
        this.hideTyping();
        this.addMessage(response.text, 'bot');
        
        // Handle special actions
        if (response.action) {
            setTimeout(() => {
                this.handleBotAction(response.action, response.data);
            }, 500);
        }
    }

    generateResponse(message) {
        // Menu related queries
        if (message.includes('menu') || message.includes('food') || message.includes('drink')) {
            return {
                text: "I'd love to show you our delicious menu! We have amazing coffee, fresh pastries, hearty sandwiches, and daily specials. Would you like me to open our full menu for you? 📱",
                action: 'showMenuPrompt'
            };
        }

        // Order related
        if (message.includes('order') || message.includes('buy') || message.includes('get')) {
            if (message.includes('coffee')) {
                return {
                    text: "Great choice! ☕ Our coffee selection includes Espresso ($3.50), Cappuccino ($4.25), Latte ($4.50), Mocha ($5.00), Americano ($3.75), and Caramel Macchiato ($5.25). Which one would you like to add to your order?",
                    action: 'showCoffeeOptions'
                };
            }
            return {
                text: "I'd be happy to help you place an order! You can browse our menu using the 'View Menu' button, or tell me what you're in the mood for. We have coffee ☕, pastries 🥐, sandwiches 🥪, and daily specials! 🌟"
            };
        }

        // Hours related
        if (message.includes('hour') || message.includes('open') || message.includes('close') || message.includes('time')) {
            return {
                text: `Our hours are:<br>
                📅 Monday - Friday: 6:00 AM - 8:00 PM<br>
                📅 Saturday: 7:00 AM - 9:00 PM<br>
                📅 Sunday: 8:00 AM - 6:00 PM<br><br>
                We're currently ${this.isOpen() ? 'OPEN' : 'CLOSED'} 🕒`
            };
        }

        // Location related
        if (message.includes('location') || message.includes('address') || message.includes('where')) {
            return {
                text: `📍 You can find us at:<br>
                <strong>${this.cafeInfo.address}</strong><br><br>
                📞 Phone: ${this.cafeInfo.phone}<br>
                📧 Email: ${this.cafeInfo.email}<br><br>
                We have free parking and are easily accessible by public transport! 🚗🚌`
            };
        }

        // Reservation related
        if (message.includes('reservation') || message.includes('book') || message.includes('table')) {
            return {
                text: "I'd be happy to help you make a reservation! 📅 We accept reservations for parties of 4 or more. Would you like me to open our reservation form?",
                action: 'showReservationPrompt'
            };
        }

        // Special offers
        if (message.includes('special') || message.includes('offer') || message.includes('discount') || message.includes('deal')) {
            return {
                text: `🎉 Here are our current special offers:<br><br>
                ${this.cafeInfo.specialOffers.map(offer => `• ${offer}`).join('<br>')}<br><br>
                Plus, you currently have <strong>${this.loyaltyPoints} loyalty points</strong>! 🌟`
            };
        }

        // Loyalty points
        if (message.includes('loyalty') || message.includes('points') || message.includes('reward')) {
            return {
                text: `⭐ Your loyalty status:<br>
                <strong>Current Points: ${this.loyaltyPoints}</strong><br><br>
                🎁 Available Rewards:<br>
                • 100 points = Free pastry<br>
                • 200 points = Free coffee<br>
                • 500 points = Free lunch combo<br><br>
                You earn 10 points for every $1 spent! Keep collecting! 💫`
            };
        }

        // WiFi info
        if (message.includes('wifi') || message.includes('internet') || message.includes('password')) {
            return {
                text: `📶 Free WiFi Information:<br>
                <strong>Network:</strong> CozyCafe_Guest<br>
                <strong>Password:</strong> coffee123<br><br>
                Perfect for remote work or studying! We also have plenty of outlets and a quiet study area. 💻📚`
            };
        }

        // General café features
        if (message.includes('feature') || message.includes('amenity') || message.includes('service')) {
            return {
                text: `✨ What makes us special:<br><br>
                ${this.cafeInfo.features.map(feature => `• ${feature}`).join('<br>')}<br><br>
                We're designed to be your perfect coffee destination whether you're grabbing a quick drink or settling in for hours! 🏠☕`
            };
        }

        // Payment methods
        if (message.includes('payment') || message.includes('pay') || message.includes('card') || message.includes('cash')) {
            return {
                text: `💳 We accept all payment methods:<br>
                • Cash 💵<br>
                • Credit/Debit Cards 💳<br>
                • Apple Pay 📱<br>
                • Google Pay 📱<br>
                • Contactless payments<br><br>
                We also have a mobile app for easy ordering and payments! 📲`
            };
        }

        // Dietary restrictions
        if (message.includes('vegan') || message.includes('vegetarian') || message.includes('gluten') || message.includes('allergy')) {
            return {
                text: `🌱 We cater to all dietary needs:<br><br>
                • Vegan milk alternatives (oat, soy, almond)<br>
                • Gluten-free pastries and bread<br>
                • Vegetarian and vegan sandwich options<br>
                • Sugar-free syrups available<br><br>
                Please let our staff know about any allergies when ordering! We take food safety seriously. 🛡️`
            };
        }

        // Weather-related suggestions
        if (message.includes('cold') || message.includes('hot') || message.includes('weather')) {
            const suggestions = this.getWeatherBasedSuggestions();
            return {
                text: suggestions
            };
        }

        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
            const greetings = [
                "Hello! ☕ Welcome to Cozy Corner Café! How can I make your day better?",
                "Hi there! 🌟 Ready for some amazing coffee and delicious treats?",
                "Hey! 👋 Great to see you! What can I help you with today?",
                "Good day! ☀️ Looking for the perfect coffee experience? You've come to the right place!"
            ];
            return {
                text: greetings[Math.floor(Math.random() * greetings.length)]
            };
        }

        // Thank you
        if (message.includes('thank') || message.includes('thanks')) {
            return {
                text: "You're absolutely welcome! 😊 It's my pleasure to help. Is there anything else you'd like to know about our café? I'm here whenever you need me! ☕💫"
            };
        }

        // Default response with helpful suggestions
        const defaultResponses = [
            "I'd love to help! 😊 I can assist you with our menu, taking orders, making reservations, or answering questions about our café. What interests you most?",
            "Great question! 🤔 I'm here to help with anything café-related. Try asking me about our menu, special offers, hours, or how to place an order!",
            "I want to make sure I give you the best help possible! ✨ You can ask me about our delicious food and drinks, make a reservation, or learn about our loyalty program!",
            "Let me help you discover what makes our café special! 🌟 I can show you our menu, tell you about our features, or help you place an order. What sounds good?"
        ];

        return {
            text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
        };
    }

    getWeatherBasedSuggestions() {
        const hour = new Date().getHours();
        const isWinter = [11, 0, 1, 2].includes(new Date().getMonth());
        
        if (isWinter || hour < 10 || hour > 18) {
            return `❄️ Perfect weather for something warm! I recommend:<br>
            • Hot Chocolate with marshmallows ☕<br>
            • Fresh-baked pastries 🥐<br>
            • Our signature Mocha for extra comfort<br>
            • Soup of the day with grilled cheese 🍲<br><br>
            Nothing beats our cozy atmosphere on a cold day! 🔥`;
        } else {
            return `☀️ Beautiful day! How about something refreshing:<br>
            • Iced Coffee Special 🧊<br>
            • Cold brew with flavored syrups<br>
            • Fresh fruit smoothies 🥤<br>
            • Light sandwiches and wraps 🥪<br><br>
            Our outdoor seating is perfect for this weather! 🌳`;
        }
    }

    isOpen() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (day >= 1 && day <= 5) { // Monday - Friday
            return hour >= 6 && hour < 20;
        } else if (day === 6) { // Saturday
            return hour >= 7 && hour < 21;
        } else { // Sunday
            return hour >= 8 && hour < 18;
        }
    }

    handleBotAction(action, data) {
        switch (action) {
            case 'showMenuPrompt':
                this.showQuickSuggestions(['View Full Menu', 'Coffee Selection', 'Pastries', 'Today\'s Specials']);
                break;
            case 'showCoffeeOptions':
                this.showCoffeeQuickOrder();
                break;
            case 'showReservationPrompt':
                this.showQuickSuggestions(['Make Reservation', 'View Available Times', 'Group Booking Info']);
                break;
        }
    }

    showQuickSuggestions(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'quick-suggestions';
        suggestionsDiv.innerHTML = suggestions.map(suggestion => 
            `<button class="suggestion-btn" data-suggestion="${suggestion}">${suggestion}</button>`
        ).join('');
        
        const lastMessage = this.chatMessages.lastElementChild;
        lastMessage.querySelector('.message-content').appendChild(suggestionsDiv);
    }

    showCoffeeQuickOrder() {
        const coffeeOptions = this.menuData.coffee.slice(0, 4); // Show first 4 options
        const optionsHtml = coffeeOptions.map(coffee => 
            `<button class="suggestion-btn" data-suggestion="Add ${coffee.name} to order">${coffee.icon} ${coffee.name} - $${coffee.price}</button>`
        ).join('');
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'quick-suggestions';
        suggestionsDiv.innerHTML = optionsHtml;
        
        const lastMessage = this.chatMessages.lastElementChild;
        lastMessage.querySelector('.message-content').appendChild(suggestionsDiv);
    }

    showInputSuggestions() {
        const input = this.messageInput.value.toLowerCase();
        const suggestionsContainer = document.getElementById('inputSuggestions');
        
        if (input.length < 2) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        const suggestions = [
            'Show me the menu',
            'What are your hours?',
            'I want to order coffee',
            'Make a reservation',
            'What are today\'s specials?',
            'Do you have WiFi?',
            'What payment methods do you accept?',
            'Tell me about loyalty points',
            'Where are you located?',
            'Do you have vegan options?'
        ].filter(suggestion => 
            suggestion.toLowerCase().includes(input)
        ).slice(0, 3);

        suggestionsContainer.innerHTML = suggestions.map(suggestion =>
            `<button class="input-suggestion">${suggestion}</button>`
        ).join('');
    }

    hideInputSuggestions() {
        document.getElementById('inputSuggestions').innerHTML = '';
    }

    handleQuickAction(action) {
        switch (action) {
            case 'menu':
                this.showMenu();
                break;
            case 'order':
                this.addMessage("I'd love to help you place an order! What can I get for you today? ☕🥐🥪", 'bot');
                break;
            case 'reservation':
                this.showReservationForm();
                break;
            case 'location':
                this.addMessage(`📍 ${this.cafeInfo.address}<br>📞 ${this.cafeInfo.phone}<br><br>We're easily accessible and have free parking! 🚗`, 'bot');
                break;
            case 'offers':
                this.addMessage(`🎉 Current Special Offers:<br><br>${this.cafeInfo.specialOffers.map(offer => `• ${offer}`).join('<br>')}<br><br>Don't forget to use your loyalty points! ⭐`, 'bot');
                break;
            case 'loyalty':
                this.showLoyaltyInfo();
                break;
        }
    }

    showMenu() {
        this.modalTitle.textContent = '☕ Our Delicious Menu';
        
        let menuHtml = `
            <div class="menu-categories">
                <button class="category-btn active" data-category="all">All Items</button>
                <button class="category-btn" data-category="coffee">Coffee ☕</button>
                <button class="category-btn" data-category="pastries">Pastries 🥐</button>
                <button class="category-btn" data-category="sandwiches">Sandwiches 🥪</button>
                <button class="category-btn" data-category="specials">Specials ⭐</button>
            </div>
            <div class="menu-items" id="menuItemsContainer">
        `;

        // Show all items by default
        Object.values(this.menuData).flat().forEach(item => {
            menuHtml += this.createMenuItemHTML(item);
        });

        menuHtml += '</div>';
        this.modalBody.innerHTML = menuHtml;

        // Add category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterMenuItems(e.target.dataset.category);
            });
        });

        this.openModal();
    }

    createMenuItemHTML(item) {
        return `
            <div class="menu-item">
                <div class="menu-item-image">${item.icon}</div>
                <div class="menu-item-content">
                    <div class="menu-item-name">${item.name}</div>
                    <div class="menu-item-description">${item.description}</div>
                    <div class="menu-item-footer">
                        <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                        <button class="add-to-order-btn" onclick="cafeAssistant.addToOrder(${item.id})">
                            Add to Order
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    filterMenuItems(category) {
        const container = document.getElementById('menuItemsContainer');
        let items = [];
        
        if (category === 'all') {
            items = Object.values(this.menuData).flat();
        } else {
            items = this.menuData[category] || [];
        }
        
        container.innerHTML = items.map(item => this.createMenuItemHTML(item)).join('');
    }

    addToOrder(itemId) {
        const item = Object.values(this.menuData).flat().find(i => i.id === itemId);
        if (!item) return;

        this.currentOrder.push({...item, orderId: Date.now() + Math.random()});
        this.updateOrderDisplay();
        this.saveOrder();
        
        this.showNotification(`✅ ${item.name} added to your order!`);
        
        // Add bot message
        setTimeout(() => {
            this.addMessage(`Great choice! I've added ${item.name} ($${item.price.toFixed(2)}) to your order. Your current total is $${this.calculateOrderTotal().toFixed(2)}. Anything else? 😊`, 'bot');
        }, 500);
    }

    removeFromOrder(orderId) {
        const index = this.currentOrder.findIndex(item => item.orderId === orderId);
        if (index > -1) {
            const removedItem = this.currentOrder.splice(index, 1)[0];
            this.updateOrderDisplay();
            this.saveOrder();
            this.showNotification(`❌ ${removedItem.name} removed from order`);
        }
    }

    updateOrderDisplay() {
        const total = this.calculateOrderTotal();
        
        if (this.currentOrder.length === 0) {
            this.orderItems.innerHTML = '<p class="empty-order">No items in order</p>';
            this.checkoutBtn.disabled = true;
        } else {
            this.orderItems.innerHTML = this.currentOrder.map(item => `
                <div class="order-item">
                    <div>
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="order-item-remove" onclick="cafeAssistant.removeFromOrder('${item.orderId}')">×</button>
                </div>
            `).join('');
            this.checkoutBtn.disabled = false;
        }
        
        this.orderTotal.textContent = total.toFixed(2);
    }

    calculateOrderTotal() {
        return this.currentOrder.reduce((total, item) => total + item.price, 0);
    }

    saveOrder() {
        localStorage.setItem('cafeOrder', JSON.stringify(this.currentOrder));
    }

    processCheckout() {
        if (this.currentOrder.length === 0) return;
        
        const total = this.calculateOrderTotal();
        const pointsEarned = Math.floor(total * 10); // 10 points per dollar
        
        // Simulate payment processing
        this.showNotification('Processing payment...', 'info');
        
        setTimeout(() => {
            this.loyaltyPoints += pointsEarned;
            localStorage.setItem('loyaltyPoints', this.loyaltyPoints.toString());
            
            this.addMessage(`🎉 Order confirmed! 
            <br><br><strong>Order Summary:</strong><br>
            ${this.currentOrder.map(item => `• ${item.name} - $${item.price.toFixed(2)}`).join('<br>')}
            <br><br><strong>Total: $${total.toFixed(2)}</strong>
            <br><strong>Points Earned: ${pointsEarned}</strong>
            <br><br>Your order will be ready in 10-15 minutes. You'll receive a notification when it's ready! 📱⏰`, 'bot');
            
            this.currentOrder = [];
            this.updateOrderDisplay();
            this.saveOrder();
            
            this.showNotification('✅ Payment successful! Order confirmed.', 'success');
            
            // Simulate order ready notification
            setTimeout(() => {
                this.showNotification('🔔 Your order is ready for pickup!', 'success');
            }, 15000); // 15 seconds for demo
            
        }, 2000);
    }

    showReservationForm() {
        this.modalTitle.textContent = '📅 Make a Reservation';
        
        this.modalBody.innerHTML = `
            <form class="reservation-form" id="reservationForm">
                <div class="form-group">
                    <label for="reservationName">Name</label>
                    <input type="text" id="reservationName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="reservationEmail">Email</label>
                    <input type="email" id="reservationEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="reservationPhone">Phone</label>
                    <input type="tel" id="reservationPhone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="reservationDate">Date</label>
                    <input type="date" id="reservationDate" name="date" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label for="reservationTime">Time</label>
                    <select id="reservationTime" name="time" required>
                        <option value="">Select time</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="18:00">6:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reservationParty">Party Size</label>
                    <select id="reservationParty" name="party" required>
                        <option value="">Select party size</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6">6 people</option>
                        <option value="7">7 people</option>
                        <option value="8">8 people</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reservationNotes">Special Requests (optional)</label>
                    <textarea id="reservationNotes" name="notes" rows="3" placeholder="Any special requirements or requests?"></textarea>
                </div>
                <button type="submit" class="submit-btn">
                    <i class="fas fa-calendar-check"></i>
                    Confirm Reservation
                </button>
            </form>
        `;

        document.getElementById('reservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReservation(new FormData(e.target));
        });

        this.openModal();
    }

    submitReservation(formData) {
        const reservation = Object.fromEntries(formData);
        
        // Simulate API call
        this.showNotification('Processing reservation...', 'info');
        
        setTimeout(() => {
            this.closeModal();
            this.addMessage(`🎉 Reservation confirmed!
            <br><br><strong>Details:</strong>
            <br>📝 Name: ${reservation.name}
            <br>📅 Date: ${new Date(reservation.date).toLocaleDateString()}
            <br>🕐 Time: ${reservation.time}
            <br>👥 Party Size: ${reservation.party}
            <br><br>We'll send a confirmation email to ${reservation.email}. Looking forward to seeing you! 🌟`, 'bot');
            
            this.showNotification('✅ Reservation confirmed!', 'success');
        }, 1500);
    }

    showLoyaltyInfo() {
        this.modalTitle.textContent = '⭐ Loyalty Rewards Program';
        
        const availableRewards = [
            { points: 100, reward: 'Free Pastry', available: this.loyaltyPoints >= 100 },
            { points: 200, reward: 'Free Coffee', available: this.loyaltyPoints >= 200 },
            { points: 350, reward: 'Free Lunch Combo', available: this.loyaltyPoints >= 350 },
            { points: 500, reward: 'Free Birthday Cake', available: this.loyaltyPoints >= 500 }
        ];

        this.modalBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <h3 style="color: #8B4513;">Your Points: ${this.loyaltyPoints} ⭐</h3>
                <p>You earn 10 points for every $1 spent!</p>
            </div>
            
            <div class="rewards-grid" style="display: grid; gap: 1rem;">
                ${availableRewards.map(reward => `
                    <div class="reward-card" style="
                        padding: 1.5rem; 
                        border: 2px solid ${reward.available ? '#28a745' : '#e9ecef'}; 
                        border-radius: 12px;
                        background: ${reward.available ? '#f8fff8' : '#f8f9fa'};
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">${reward.reward}</h4>
                                <p style="color: #6c757d; margin: 0;">${reward.points} points</p>
                            </div>
                            <button class="redeem-btn" 
                                ${reward.available ? '' : 'disabled'} 
                                onclick="cafeAssistant.redeemReward(${reward.points}, '${reward.reward}')"
                                style="
                                    padding: 0.5rem 1rem; 
                                    border: none; 
                                    border-radius: 8px; 
                                    background: ${reward.available ? '#28a745' : '#6c757d'}; 
                                    color: white; 
                                    cursor: ${reward.available ? 'pointer' : 'not-allowed'};
                                ">
                                ${reward.available ? 'Redeem' : 'Not enough points'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background: #e3f2fd; border-radius: 8px;">
                <h4>💡 How to Earn More Points:</h4>
                <ul style="margin: 0.5rem 0;">
                    <li>Regular purchases (10 points per $1)</li>
                    <li>Refer a friend (+50 points)</li>
                    <li>Write a review (+25 points)</li>
                    <li>Birthday bonus (+100 points)</li>
                </ul>
            </div>
        `;

        this.openModal();
    }

    redeemReward(points, reward) {
        if (this.loyaltyPoints >= points) {
            this.loyaltyPoints -= points;
            localStorage.setItem('loyaltyPoints', this.loyaltyPoints.toString());
            
            this.closeModal();
            this.addMessage(`🎁 Congratulations! You've redeemed "${reward}" for ${points} points. Your remaining balance is ${this.loyaltyPoints} points. Show this message to our staff to claim your reward! ✨`, 'bot');
            this.showNotification(`🎁 ${reward} redeemed successfully!`, 'success');
        }
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }

    openModal() {
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        this.notificationContainer.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the chatbot when page loads
let cafeAssistant;
document.addEventListener('DOMContentLoaded', () => {
    cafeAssistant = new CafeAssistant();
    
    // Add some sample interactions for demo
    setTimeout(() => {
        if (cafeAssistant.chatHistory.length === 0) {
            // Show some example interactions
            console.log('Cafe Assistant initialized and ready! 🚀');
        }
    }, 1000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + M to open menu
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        cafeAssistant.showMenu();
    }
    
    // Escape to close modal
    if (e.key === 'Escape' && cafeAssistant.modal.style.display === 'block') {
        cafeAssistant.closeModal();
    }
});

// Service Worker for offline functionality (basic)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}