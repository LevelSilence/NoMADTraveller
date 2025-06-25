const mongoose = require('mongoose');
const review = require('./review');
const { ref } = require('joi');
const { render } = require('ejs');
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ['Trending', 'Shelter', 'Hubs', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms', 'Arctic', 'Boating', 'City'],
        required: true
    },
});

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});
//creation of model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

