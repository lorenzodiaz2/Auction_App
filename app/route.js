const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("./database.js");
const { ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
const JWT_SECRET='supersecretkey12345!@';


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    } 
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
};


router.get('/users/', authenticateToken, async (req, res) => {
    try {
        const matching = req.query.q;
    
        let query = {};
        
        if(matching && matching.trim().length > 0) {
            query = {
                $or: [
                    { username: { $regex: matching, $options: "i" } },
                    { name: { $regex: matching, $options: "i" } },
                    { surname: { $regex: matching, $options: "i" } }
                ]
            };
        }

        const database = await db.connectToDatabase();
        const users = await database.collection("users").find(query).toArray();

        if (users.length > 0) {
            const filteredUsers = users.map(user => ({
                Id: user._id.toString(),
                Username: user.username,
                Name: user.name,
                Surname: user.surname
            }));
            return res.status(200).json(filteredUsers);
        } else {
            return res.status(404).json({
                status: 'error', 
                message: (matching && matching.trim().length > 0) ? `No users found with matching = ${matching}` : 'No users found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
    
});


router.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid user ID format' });
        }

        const database = await db.connectToDatabase();

        const user = await database.collection("users").findOne({ _id: new ObjectId(userId) });

        if (user) {
            res.status(200).json({
                Username: user.username,
                Name: user.name,
                Surname: user.surname
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
    
});


router.get('/auctions', authenticateToken, async (req, res) => {
    try {
        const matching = req.query.q;
        
        let query = {};
        
        if(matching && matching.trim().length > 0) {
            query = {
                $or: [
                    { title: { $regex: matching, $options: "i" } },
                    { description: { $regex: matching, $options: "i" } },
                ]
            };
        }

        const database = await db.connectToDatabase();
        const auctions = await database.collection("auctions").find(query).toArray();

        if (auctions.length > 0) {
            const filteredAuctions = auctions.map(auction => ({
                Id: auction._id.toString(),
                Title: auction.title,
                Description: auction.description,
                StartingPrice: `$ ${auction.startingPrice}.00`,
                CurrentPrice: `$ ${auction.currentPrice}.00`,
                ExpirationDate: auction.expiryDate,
                WinningUser: auction.winningUser ? auction.winningUser : 'No bidders yet',
                Creator: auction.creator
            }));
            return res.status(200).json(filteredAuctions);
        } else {
            return res.status(404).json({
                status: 'error', 
                message: (matching && matching.trim().length > 0) ? `No auctions with "${matching}" match found` : "No auctions found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }


});


router.post('/auctions', authenticateToken, async (req, res) => {
    try {
        const { title, description, currentPrice, expiryDate } = req.body;         

        if (!title || !description || typeof(currentPrice) !== 'number' || !expiryDate) {
            return res.status(400).json({ status: 'error', message: 'All fields required!' }); 
        }
        
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);

        if (title.trim() === '' || description.trim() === '' || currentPrice < 0 || new Date(expiryDate) <= currentDate) {
            message = `Invalid fields! ${currentPrice < 0 ? 'Starting Price must be non negative. ' : ''} ${new Date(expiryDate) <= currentDate ? 'Expiry date must be greater than the current one.' : ''}`;
            return res.status(400).json({ status: 'error', message });
        }

        if (/^[!?.\s]*$/.test(title) || /^[!?.\s]*$/.test(description)) {
            return res.status(400).json({ status: 'error', message: 'Title and description must contain valid characters.' });
        }        

        const database = await db.connectToDatabase();
        
        let newAuction = {
            title,
            description,
            startingPrice: currentPrice,
            currentPrice,
            expiryDate: expiryDate.replace('T', ' at '),
            winningUser: null,
            creator: req.user.username
        };
    
        const result = await database.collection("auctions").insertOne(newAuction);

        if (result.acknowledged && result.insertedId) {
            res.status(201).json({
                status : 'success', 
                message: 'Auction created successfully', 
                auction: {
                    Id: result.insertedId,
                    Title: newAuction.title,
                    Description: newAuction.description,
                    StartingPrice: `$ ${newAuction.startingPrice}.00`,
                    CurrentPrice: `$ ${newAuction.currentPrice}.00`,
                    ExpirationDate: newAuction.expiryDate,
                    WinningUser: newAuction.winningUser,
                    Creator: newAuction.creator
                }
              });
        } else {
            res.status(500).json({ status: 'error', message: 'Failed to create auction' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Error' });
    }
  });
    



router.get('/auctions/:id', authenticateToken, async (req, res) => {
    try {
        const auctionId = req.params.id;

        if (!ObjectId.isValid(auctionId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid auction ID format' });
        }

        const database = await db.connectToDatabase();

        const auction = await database.collection("auctions").findOne({ _id: new ObjectId(auctionId) });

        if (auction) {
            res.status(200).json({
                Title: auction.title,
                Description: auction.description,
                StartingPrice: `$ ${auction.startingPrice}.00`,
                CurrentPrice: `$ ${auction.currentPrice}.00`,
                ExpirationDate: auction.expiryDate,
                WinningUser: auction.winningUser ? auction.winningUser : 'No bidders yet',
                Creator: auction.creator
            });
        } else {
            res.status(404).json({ status: 'error', message: 'Auction not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
    
});



router.put('/auctions/:id', authenticateToken, async (req, res) => {
    try {
        const auctionId = req.params.id; 
        const { newTitle, newDescription } = req.body;

        if (!ObjectId.isValid(auctionId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid auction ID format' });
        }

        const database = await db.connectToDatabase();
        const auction = await database.collection('auctions').findOne({ _id: new ObjectId(auctionId) });

        if (!auction) {
            return res.status(404).json({ status: 'error', message: 'Auction not found' });
        }

        if (auction.creator !== req.user.username) { 
            return res.status(403).json({ status: 'error', message: 'Not authorized to modify' });
        }

        let updateFields = {};

        if (newTitle && newTitle.trim() !== '' && newTitle !== auction.title) {
            updateFields.title = newTitle;
        }
        if (newDescription && newDescription.trim() !== '' && newDescription !== auction.description) {
            updateFields.description = newDescription;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ status: 'error', message: 'No changes to update' });
        }

        const result = await database.collection('auctions').updateOne(
            { _id: new ObjectId(auctionId) }, 
            { $set: updateFields }
        );

        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return res.status(200).json({
                status: 'success',
                message: 'Auction updated successfully',
                auction: {
                    Id: auctionId,
                    Title: (updateFields.title ? updateFields.title : auction.title),
                    Description: (updateFields.description ? updateFields.description : auction.description),
                    StartingPrice: `$ ${auction.startingPrice}.00`,
                    CurrentPrice: `$ ${auction.currentPrice}.00`,
                    ExpirationDate: auction.expiryDate,
                    WinningUser: auction.winningUser ? auction.winningUser : 'No bidders yet',
                    Creator: auction.creator
                }
            });
        } else {
            return res.status(500).json({ status: 'error', message: 'Failed to update auction' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


router.delete('/auctions/:id', authenticateToken, async (req, res) => {
    try {
        const auctionId = req.params.id;
        if (!ObjectId.isValid(auctionId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid auction ID format' });
        }

        const database = await db.connectToDatabase();

        const auction = await database.collection('auctions').findOne({ _id: new ObjectId(auctionId) });

        if (auction) {
            if (auction.creator === req.user.username) {
                const auctionResult = await database.collection('auctions').deleteOne({ _id: new ObjectId(auctionId) });
                if (auctionResult.deletedCount === 1) {
                    const numberOfBidsToDelete = await database.collection('bids').countDocuments({ auctionId });
                    if (numberOfBidsToDelete > 0) {
                        const bidResult = await database.collection('bids').deleteMany({ auctionId });
                        if (bidResult.deletedCount === numberOfBidsToDelete) {
                            return res.status(204).end();
                        } else {
                            return res.status(500).json({ status:'error', message: 'Auction deleted but failed to update bid collection' });
                        }
                    }
                    return res.status(204).end();
                } else {
                    return res.status(500).json({ status: 'error', message: 'Failed to delete auction'});
                }
            } else {
                return res.status(403).json({ status: 'error', message: 'Not authorized to delete!' })
            }
        } else {
            return res.status(404).json({ status: 'error', message: 'Auction not found!' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



router.get('/auctions/:id/bids', authenticateToken, async (req, res) => {
    try {
        const auctionId = req.params.id;

        if (!ObjectId.isValid(auctionId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid auction ID format' });
        }

        const database = await db.connectToDatabase();
        const bids = await database.collection('bids').find({ auctionId }).toArray();

        if (bids.length > 0) {
            const filteredBids = bids.map(bid => ({
                BidId: bid._id.toString(),
                BidderUser: bid.user,
                BidPrice: `$ ${bid.price}.00`,
                BidDate: bid.date
            }));
            return res.status(200).json(filteredBids);
        } else {
            return res.status(404).json({ status: 'error', message: 'No bids find' })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


router.post('/auctions/:id/bids', authenticateToken, async (req, res) => {
    try {
        const auctionId = req.params.id;
        const { newPrice } = req.body;

        if (!ObjectId.isValid(auctionId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid auction ID format' });
        }

        if (!newPrice || newPrice < 0) {
            return res.status(400).json({ status: 'error', message: 'Invalid bid!' })
        }

        const database = await db.connectToDatabase();

        const auction = await database.collection("auctions").findOne({ _id: new ObjectId(auctionId) });

        let currentDate = new Date();
        let expiry = new Date(auction.expiryDate.replace(' at ', 'T'));

        currentDate.setHours(currentDate.getHours() + 1);

        if (auction) {
            if (currentDate < expiry) {
                if (newPrice > auction.currentPrice) {
                    const auctionResult = await database.collection("auctions").updateOne(
                        { _id: new ObjectId(auctionId) },
                        { $set: {currentPrice: newPrice, winningUser: req.user.username}}
                    );
                    if (auctionResult.matchedCount === 1 && auctionResult.modifiedCount === 1) {
                        const bidResult = await database.collection("bids").insertOne({
                            auctionId,
                            user: req.user.username,
                            price: newPrice,
                            date: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()} at ${currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours()}:${currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes()}:${currentDate.getSeconds() < 10 ? `0${currentDate.getSeconds()}` : currentDate.getSeconds()}`
                        });
                        if (bidResult.acknowledged) {
                            return res.status(201).json({
                                status: 'success', 
                                message: 'Bid update successfully',
                                auction: {
                                    AuctionId: auctionId,
                                    Title: auction.title,
                                    Description: auction.description,
                                    StartingPrice: `$ ${auction.startingPrice}.00`,
                                    CurrentPrice: `$ ${newPrice}.00`,
                                    ExpirationDate: auction.expiryDate,
                                    WinningUser: auction.winningUser ? auction.winningUser : 'No bidders yet',
                                    Creator: auction.creator
                                },
                                bid: {
                                    BidId: bidResult.insertedId,
                                    AuctionId: auctionId,
                                    BidderUser: req.user.username,
                                    BidPrice: `$ ${newPrice}.00`,
                                    BidDate: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1}-${currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate()} at ${currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours()}:${currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes()}:${currentDate.getSeconds() < 10 ? `0${currentDate.getSeconds()}` : currentDate.getSeconds()}`
                                }
                            })
                        } else {
                            return res.status(500).json({status: 'error', message: 'Auction collection updated but failed to insert bid'});
                        }
                    } else {
                        return res.status(500).json({status: 'error', message: 'Failed to update auction price'});
                    }
                } else {
                    return res.status(400).json({ status: 'error', message: 'Bid too low!' });
                }
            } else {
                return res.status(400).json({ status: 'error', message: 'Auction has expired!' });
            }
        } else {
            return res.status(404).json({ status: 'error', message: 'Auction not found!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



router.get('/bids/:id', authenticateToken, async (req, res) => {
    try {
        const bidId = req.params.id;

        if (!ObjectId.isValid(bidId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid bid ID format' });
        }

        const database = await db.connectToDatabase();
        const bid = await database.collection('bids').findOne({ _id: new ObjectId(bidId) });
        if (bid) {
            return res.status(200).json({
                    AuctionId: bid.auctionId,
                    BidderUser: bid.user,
                    BidPrice: `$ ${bid.price}.00`,
                    BidDate: bid.date
                }
            );
        } else {
            return res.status(404).json({ status: 'error', message: 'Bid not found' })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



router.get('/whoami', authenticateToken, async (req, res) => {
    try {
        const database = await db.connectToDatabase();
        const user = await database.collection("users").findOne({ _id : ObjectId.createFromHexString(req.user.id) });

        if (user) {
            return res.status(200).json({
                Id: req.user.id,
                Username: user.username,
                Name: user.name,
                Surname: user.surname
            });
        } else {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


router.post("/logout", authenticateToken, (req, res) => {
    try {
      res.clearCookie("token", { httpOnly: true });
      res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  });


router.post("/changePassword", authenticateToken, async (req, res) => {
try {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'All fields required!' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@$%?])[A-Za-z\d!@$%?]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    });
    }

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized. Please log in again.' });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token. Please log in again.' });
    }

    const database = await db.connectToDatabase();
    const user = await database.collection("users").findOne({ username: decoded.username });

    if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ status: 'error', message: 'Current password is incorrect.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword.trim(), 12);

    const result = await database.collection("users").updateOne(
        { _id: user._id },
        { $set: { password: hashedNewPassword } }
    );

    if (result.modifiedCount === 1) {
        res.status(200).json({ status: 'success', message: 'Password updated successfully.' });
    } else {
        res.status(500).json({ status: 'error', message: 'Failed to update password.' });
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});
  


module.exports = router;