const Listing = require("../models/listing");
const axios = require('axios');


module.exports.index = async (req, res) => {
  const { q, category, country } = req.query;
  let filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ];
  }

  if (category) {
    filter.category = category;
  }

  let selectedCountries = [];
  if (country) {
    selectedCountries = Array.isArray(country) ? country : [country];
    filter.country = { $in: selectedCountries };
  }

  const listings = await Listing.find(filter);
  const countries = await Listing.distinct("country");

  res.render("listings/index.ejs", {
    listings,
    q,
    category,
    countries,
    selectedCountries
  });
};



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListings = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }


    const fullAddress = `${listing.location}, ${listing.country}`;

   
    let coordinates = [0, 0]; 
    try {
        const geoRes = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(fullAddress)}.json`, {
            params: {
                key: process.env.MAPTILER_API_KEY 
            }
        });
        coordinates = geoRes.data.features[0]?.geometry?.coordinates || [0, 0];
    } catch (err) {
        console.error("Geocoding failed:", err.message);
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing, coordinates, maptilerKey: process.env.MAPTILER_API_KEY }); // 👈 pass coords to EJS
}



module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename }
    await listing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    let dlisting = await Listing.findByIdAndDelete(id);
    console.log(dlisting);
    req.flash("success", "Deleted Successfully!");
    res.redirect("/listings");
}