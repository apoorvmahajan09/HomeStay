const Listing = require("../models/listing.js");
const axios = require("axios");

const nominatim = axios.create({
    baseURL: "https://nominatim.openstreetmap.org/",
    timeout: 1000,
    headers: { 'User-Agent': 'Wanderlust/1.0 (apoorvmahajan0910@gmail.com'}
});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    const { location, country } = req.body.listing;

    const q = `${location}, ${country}`;
    const geoRes = await nominatim.get("/search", {
        params: {
            q,
            format: "json",
            limit: 1
        }
    });

    let coordinates = [0, 0];
    if (Array.isArray(geoRes.data) && geoRes.data.length > 0) {
        coordinates = [parseFloat(geoRes.data[0].lon), parseFloat(geoRes.data[0].lat)];
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = { type: "Point", coordinates };
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image?.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing");
    res.redirect("/listings");
};