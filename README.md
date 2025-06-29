<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Whisk & Wonder Café</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #1e1e1e;
      color: #f5f5f5;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #2b2b2b;
      padding: 20px 40px;
    }

    header img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }

    header h1 {
      font-size: 2.2em;
      color: #ffccbc;
      margin-left: 15px;
    }

    nav {
      background-color: #3a3a3a;
      text-align: center;
      padding: 10px 0;
    }

    nav a {
      margin: 0 20px;
      text-decoration: none;
      color: #f5f5f5;
      font-weight: bold;
      transition: color 0.3s;
    }

    nav a:hover {
      color: #ffccbc;
    }

    .hero {
      background: url('https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38') center/cover no-repeat;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .hero h2 {
      font-size: 3em;
      color: #fff8f0;
      background-color: rgba(0,0,0,0.5);
      padding: 15px 30px;
      border-radius: 15px;
    }

    .section {
      padding: 50px 20px;
      text-align: center;
    }

    .section h3 {
      font-size: 2em;
      margin-bottom: 30px;
      color: #ffccbc;
    }

    .menu {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 30px;
    }

    .menu-item {
      background-color: #2b2b2b;
      border-radius: 15px;
      padding: 20px;
      width: 280px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }

    .menu-item img {
      width: 100%;
      border-radius: 10px;
    }

    .menu-item h4 {
      margin: 10px 0 5px;
      color: #ffe0b2;
    }

    .menu-item p {
      font-size: 0.9em;
      color: #ccc;
    }

    .about, .contact {
      max-width: 700px;
      margin: auto;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 20px;
    }

    input, textarea {
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: #3a3a3a;
      color: #fff;
      font-size: 1em;
    }

    button {
      background-color: #ffccbc;
      color: #1e1e1e;
      border: none;
      padding: 12px 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #ffb399;
    }

    .reservation {
      margin-top: 30px;
    }

    footer {
      background-color: #2b2b2b;
      padding: 20px;
      text-align: center;
      color: #aaa;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        align-items: center;
      }

      .hero h2 {
        font-size: 2em;
        padding: 10px 20px;
      }

      .menu {
        flex-direction: column;
        align-items: center;
      }

      header h1 {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  <header>
    <div style="display: flex; align-items: center;">
      <img src="https://drive.google.com/uc?export=view&id=18jmxW6-JlZAP3-qCIEsbdDpyOxaYWMsm" alt="Cafe Logo" />
      <h1>Whisk & Wonder Café</h1>
    </div>
  </header>

  <nav>
    <a href="#menu">Menu</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
    <a href="#reservation">Reserve</a>
  </nav>

  <div class="hero">
    <h2>Where Pastry Meets Magic ✨</h2>
  </div>

  <section class="section" id="menu">
    <h3>Our Unique Pastries</h3>
    <div class="menu">
      <div class="menu-item">
        <img src="https://images.unsplash.com/photo-1505253210343-d4e1b12f3d48" alt="Galaxy Macaron">
        <h4>Galaxy Macaron</h4>
        <p>Swirls of cosmic colors and raspberry cream inside.</p>
      </div>
      <div class="menu-item">
        <img src="https://images.unsplash.com/photo-1607082349250-e72d51d7a2b0" alt="Lavender Tart">
        <h4>Lavender Honey Tart</h4>
        <p>Floral and sweet with a buttery crust.</p>
      </div>
      <div class="menu-item">
        <img src="https://images.unsplash.com/photo-1585238342028-4be3d52dcf65" alt="Matcha Mousse">
        <h4>Matcha Mousse Bomb</h4>
        <p>Soft mousse in matcha shells with a surprise filling.</p>
      </div>
    </div>
  </section>

  <section class="section about" id="about">
    <h3>About Us</h3>
    <p>At Whisk & Wonder, every pastry tells a story. Blending artistry and flavor, we bring whimsical creations to life. Whether you're craving something floral, fruity, or fantastically unique — we’ve got a pastry for your mood.</p>
  </section>

  <section class="section contact" id="contact">
    <h3>Contact Us</h3>
    <p>📍 123 Cocoa Lane, Pastryville<br>
       📞 +91 98765 43210<br>
       📧 hello@whiskwondercafe.com</p>

    <form action="#" method="post">
      <input type="text" placeholder="Your Name" required>
      <input type="email" placeholder="Your Email" required>
      <textarea rows="4" placeholder="Your Message"></textarea>
      <button type="submit">Send Message</button>
    </form>
  </section>

  <section class="section reservation" id="reservation">
    <h3>Make a Reservation</h3>
    <form action="#" method="post">
      <input type="text" placeholder="Name" required>
      <input type="email" placeholder="Email" required>
      <input type="date" required>
      <input type="time" required>
      <input type="number" placeholder="Guests" required>
      <button type="submit">Book Table</button>
    </form>
  </section>

  <footer>
    &copy; 2025 Whisk & Wonder Café. All rights reserved.
  </footer>
</body>
</html>
