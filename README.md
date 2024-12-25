# My Auction App

This is a Node.js application that uses MongoDB as a database, all managed via Docker.

## Prerequisites

Before running the app, ensure you have the following installed:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup and Running the App

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
2. **Create the `.env` File**  
   Based on the provided `.env.example`, create a `.env` file in the root of the project:  
   ```plaintext
   JWT_SECRET=your-secret-key
   MONGODB_URI=mongodb://mongo:27017
3. **Build and Run the App**  
   Use Docker Compose to build and run the app:  
   ```bash
   docker-compose up --build
4. **Access the App**  
   Once the app is running, access it in your browser at:  
   ```plaintext
   http://localhost:3000