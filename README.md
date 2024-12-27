# Auction App

This is a Node.js application that uses MongoDB as a database, all managed via Docker.

## Prerequisites

Before running the app, ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup and Running the App

1. **Clone the Repository**
   ```bash
   git clone https://github.com/lorenzodiaz2/Auction_App.git
   cd Auction_App
2. **Open Docker**
3. **Build and Run the App**  
   Use Docker Compose to build and run the app:  
   ```bash
   docker-compose up --build
4. **Wait until you see in the terminal**
   ```plaintext
   | Database initialized
   | Web server started on http://localhost:3000
5. **Access the App**  
   Once the app is running, access it in your browser at:  
   ```plaintext
   http://localhost:3000