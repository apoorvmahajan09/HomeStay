const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            set: (v) =>
                v === ""
                    ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
                    : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            required: true
        }
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
