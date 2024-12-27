const db = require("./database.js");
const bcrypt = require('bcryptjs');
const { ObjectId } = require("mongodb");



module.exports = {

  fillDatabase: async () => {
    const database = await db.connectToDatabase();
    await database.collection('users').deleteMany({});
    await database.collection('auctions').deleteMany({});
    await database.collection('bids').deleteMany({});

    const users = [
      {
        username: "johnsmith",
        name: "John",
        surname: "Smith",
        password: await bcrypt.hash("Secure$123", 12)
      },
      {
        username: "emilydavis",
        name: "Emily",
        surname: "Davis",
        password: await bcrypt.hash("Pass!word8", 12)
      },
      {
        username: "michaelbrown",
        name: "Michael",
        surname: "Brown",
        password: await bcrypt.hash("Mike@4567", 12)
      },
      {
        username: "sarajones",
        name: "Sara",
        surname: "Jones",
        password: await bcrypt.hash("Sara$Pass99", 12)
      },
      {
        username: "davidclark",
        name: "David",
        surname: "Clark",
        password: await bcrypt.hash("Clark@2021", 12)
      },
      {
        username: "lucywhite",
        name: "Lucy",
        surname: "White",
        password: await bcrypt.hash("Lucy#777!", 12)
      },
      {
        username: "robertmiller",
        name: "Robert",
        surname: "Miller",
        password: await bcrypt.hash("Miller$1234", 12)
      },
      {
        username: "annathompson",
        name: "Anna",
        surname: "Thompson",
        password: await bcrypt.hash("Anna!Pass1", 12)
      },
      {
        username: "charleslee",
        name: "Charles",
        surname: "Lee",
        password: await bcrypt.hash("Lee@1234$", 12)
      },
      {
        username: "karenwalker",
        name: "Karen",
        surname: "Walker",
        password: await bcrypt.hash("Walk3r#!", 12)
      },
      {
        username: "danielyoung",
        name: "Daniel",
        surname: "Young",
        password: await bcrypt.hash("Young@#456", 12)
      },
      {
        username: "lauramartin",
        name: "Laura",
        surname: "Martin",
        password: await bcrypt.hash("Laura$123!", 12)
      },
      {
        username: "peterwilson",
        name: "Peter",
        surname: "Wilson",
        password: await bcrypt.hash("Pete@789!", 12)
      },
      {
        username: "jenniferhall",
        name: "Jennifer",
        surname: "Hall",
        password: await bcrypt.hash("Jen$2022!", 12)
      },
      {
        username: "chriswright",
        name: "Chris",
        surname: "Wright",
        password: await bcrypt.hash("Wr1ght!456", 12)
      }
    ]
    ;

    await database.collection("users").insertMany(users);

    const auctions = [
      {
        title: "Vintage Watch", 
        description: "Classic design", 
        currentPrice: 120, 
        expiryDate: "2025-01-15 at 12:00", 
        winningUser: null, 
        creator: "emilydavis"
      },
      {
        title: "Antique Vase", 
        description: "Rare item", 
        currentPrice: 250, 
        expiryDate: "2025-01-20 at 14:30", 
        winningUser: null, 
        creator: "michaelbrown"
      },
      {
        title: "Gaming Laptop", 
        description: "High performance", 
        currentPrice: 899, 
        expiryDate: "2024-02-10 at 18:00", 
        winningUser: null, 
        creator: "davidclark"
      },
      {
        title: "Mountain Bike", 
        description: "Lightweight frame", 
        currentPrice: 450, 
        expiryDate: "2024-03-05 at 10:15", 
        winningUser: null, 
        creator: "lucywhite"
      },
      {
        title: "Smartphone", 
        description: "Latest model", 
        currentPrice: 799, 
        expiryDate: "2025-01-28 at 16:45", 
        winningUser: null, 
        creator: "annathompson"
      },
      {
        title: "Designer Handbag", 
        description: "Luxury brand", 
        currentPrice: 1200, 
        expiryDate: "2025-02-15 at 20:00", 
        winningUser: null, 
        creator: "karenwalker"
      },
      {
        title: "Electric Guitar", 
        description: "Great sound", 
        currentPrice: 399, 
        expiryDate: "2024-01-31 at 19:30", 
        winningUser: null, 
        creator: "danielyoung"
      },
      {
        title: "Cookware Set", 
        description: "Durable materials", 
        currentPrice: 89, 
        expiryDate: "2024-02-18 at 12:00", 
        winningUser: null, 
        creator: "peterwilson"
      },
      {
        title: "Treadmill", 
        description: "Fitness equipment", 
        currentPrice: 750, 
        expiryDate: "2025-03-02 at 11:45", 
        winningUser: null, 
        creator: "chriswright"
      },
      {
        title: "Art Painting", 
        description: "Abstract design", 
        currentPrice: 340, 
        expiryDate: "2025-01-25 at 13:20", 
        winningUser: null, 
        creator: "johnsmith"
      },
      {
        title: "Book Collection", 
        description: "Best classics", 
        currentPrice: 49, 
        expiryDate: "2025-02-05 at 15:30", 
        winningUser: null, 
        creator: "emilydavis"
      },
      {
        title: "Wireless Headphones", 
        description: "Noise cancelling", 
        currentPrice: 129, 
        expiryDate: "2024-02-12 at 17:00", 
        winningUser: null, 
        creator: "sarajones"
      },
      {
        title: "Camera Drone", 
        description: "4K resolution", 
        currentPrice: 499, 
        expiryDate: "2025-02-25 at 19:15", 
        winningUser: null, 
        creator: "davidclark"
      },
      {
        title: "Espresso Machine", 
        description: "Professional grade", 
        currentPrice: 299, 
        expiryDate: "2025-03-12 at 08:30", 
        winningUser: null, 
        creator: "robertmiller"
      },
      {
        title: "Camping Tent", 
        description: "4-person capacity", 
        currentPrice: 149, 
        expiryDate: "2024-10-20 at 21:00", 
        winningUser: null, 
        creator: "charleslee"
      },
      {
        title: "Bluetooth Speaker", 
        description: "Waterproof", 
        currentPrice: 79, 
        expiryDate: "2025-01-29 at 20:45", 
        winningUser: null, 
        creator: "karenwalker"
      },
      {
        title: "Luxury Watch", 
        description: "Swiss made", 
        currentPrice: 2000, 
        expiryDate: "2025-03-08 at 14:00", 
        winningUser: null, 
        creator: "lauramartin"
      },
      {
        title: "Gaming Console", 
        description: "Latest gen", 
        currentPrice: 499, 
        expiryDate: "2025-02-10 at 10:00", 
        winningUser: null, 
        creator: "jenniferhall"
      },
      {
        title: "Electric Scooter", 
        description: "Long range", 
        currentPrice: 299, 
        expiryDate: "2025-03-01 at 18:30", 
        winningUser: null, 
        creator: "johnsmith"
      },
      {
        title: "Tablet", 
        description: "High resolution", 
        currentPrice: 349, 
        expiryDate: "2025-03-14 at 22:00", 
        winningUser: null, 
        creator: "emilydavis"
      },
      {
        title: "Digital Camera", 
        description: "Compact size", 
        currentPrice: 599, 
        expiryDate: "2025-02-17 at 16:30", 
        winningUser: null, 
        creator: "michaelbrown"
      },
      {
        title: "Office Chair", 
        description: "Ergonomic design", 
        currentPrice: 129, 
        expiryDate: "2025-01-27 at 09:15", 
        winningUser: null, 
        creator: "davidclark"
      },
      {
        title: "Smart TV", 
        description: "4K Ultra HD", 
        currentPrice: 799, 
        expiryDate: "2025-03-10 at 19:00", 
        winningUser: null, 
        creator: "lucywhite"
      },
      {
        title: "Sports Equipment", 
        description: "Complete set", 
        currentPrice: 259, 
        expiryDate: "2025-02-22 at 08:00", 
        winningUser: null, 
        creator: "annathompson"
      },
      {
        title: "Luxury Sofa", 
        description: "Italian leather", 
        currentPrice: 1800, 
        expiryDate: "2025-03-16 at 15:00", 
        winningUser: null, 
        creator: "karenwalker"
      },
      {
        title: "Smart Home System", 
        description: "Voice controlled", 
        currentPrice: 999, 
        expiryDate: "2025-03-04 at 13:45", 
        winningUser: null, 
        creator: "lauramartin"
      },
      {
        title: "Running Shoes", 
        description: "Breathable material", 
        currentPrice: 69, 
        expiryDate: "2025-02-08 at 10:30", 
        winningUser: null, 
        creator: "jenniferhall"
      },
      {
        title: "VR Headset", 
        description: "Immersive experience", 
        currentPrice: 449, 
        expiryDate: "2025-03-18 at 18:00", 
        winningUser: null, 
        creator: "chriswright"
      },
      {
        title: "Cookbook Set", 
        description: "Top recipes", 
        currentPrice: 39, 
        expiryDate: "2025-02-11 at 12:00", 
        winningUser: null, 
        creator: "johnsmith"
      },
      {
        title: "DJ Equipment", 
        description: "For professionals", 
        currentPrice: 1200, 
        expiryDate: "2025-02-28 at 23:15", 
        winningUser: null, 
        creator: "michaelbrown"
      },
      {
        title: "Car Dash Cam", 
        description: "HD recording", 
        currentPrice: 199, 
        expiryDate: "2025-01-26 at 21:45", 
        winningUser: null, 
        creator: "davidclark"
      },
      {
        title: "Winter Jacket", 
        description: "Waterproof", 
        currentPrice: 99, 
        expiryDate: "2025-03-09 at 17:30", 
        winningUser: null, 
        creator: "lucywhite"
      },
      {
        title: "Pet Supplies", 
        description: "Full set", 
        currentPrice: 49, 
        expiryDate: "2025-02-13 at 14:00", 
        winningUser: null, 
        creator: "annathompson"
      },
      {
        title: "Smart Thermostat", 
        description: "Energy efficient", 
        currentPrice: 199, 
        expiryDate: "2025-03-07 at 20:15", 
        winningUser: null, 
        creator: "karenwalker"
      },
      {
        title: "Cordless Vacuum", 
        description: "Lightweight", 
        currentPrice: 259, 
        expiryDate: "2025-02-21 at 15:30", 
        winningUser: null, 
        creator: "lauramartin"
      },
      {
        title: "Photography Course", 
        description: "Online lessons", 
        currentPrice: 99, 
        expiryDate: "2025-02-15 at 18:30", 
        winningUser: null, 
        creator: "peterwilson"
      },
      {
        title: "Gaming Mouse", 
        description: "RGB lighting", 
        currentPrice: 49, 
        expiryDate: "2025-02-07 at 11:45", 
        winningUser: null, 
        creator: "jenniferhall"
      },
      {
        title: "Electric Grill", 
        description: "Non-stick surface", 
        currentPrice: 79, 
        expiryDate: "2025-03-11 at 09:30", 
        winningUser: null, 
        creator: "johnsmith"
      }
    ]    
    ;


    for (const auction of auctions) {
      let result = await database.collection("auctions").insertOne(auction);
      if (!result.insertedId) {
        continue;
      }
      let bids = [];
      let auctionId = result.insertedId.toString();
      let date = new Date(auction.expiryDate.replace(' at ', 'T'));
      let currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);

      if (date > currentDate) {
        date = currentDate;
      }

      let price = auction.currentPrice + 401;
      for (let i = 0; i < 10; i++) {
        let randomUserBidderIndex = Math.floor(Math.random() * 15);

        if (i === 0 && auction.creator === users[randomUserBidderIndex].username) {
          i -= 1;
          continue;
        }

        if (i > 0 && bids[i-1].user === users[randomUserBidderIndex].username) {
          i -= 1;
          continue;
        }

        date.setSeconds(date.getSeconds() - 853);
        bids.push({
            auctionId,
            user: users[randomUserBidderIndex].username,
            price,
            date: `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()} at ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`
        });
        if (i === 0) {
          await database.collection('auctions').updateOne({ _id: new ObjectId(auctionId) }, { $set: {currentPrice: price, winningUser: users[randomUserBidderIndex].username} });
        }
        price -= Math.floor(Math.random() * 19) + 20;
      }
      bids.sort((bid1, bid2) => bid1.price - bid2.price);
      await database.collection('bids').insertMany(bids);  
    }
  }
}