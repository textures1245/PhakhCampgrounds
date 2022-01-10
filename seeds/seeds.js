const mongoose = require('mongoose');
const Camp = require('../models/camps');
const cities = require('./cities')
const {places, descriptors } = require('./seedHelpers') 
mongoose.connect('mongodb://localhost:27017/CampGround', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//- function for random array
const samples = array => array[Math.floor(Math.random() * array.length)];

//- random 50 seed location
const seedDB = async() => {
    await Camp.deleteMany({});
    for(let i = 0; i < 100; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 10;
        const camp = new Camp ({
            author: '61d9c408888efc577dfa5bda',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            // location: 'Ovando, Montana',
            title: `${samples(descriptors)} ${samples(places)}`,
            // image: 'https://source.unsplash.com/collection/483251/1000x700',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price,
            geometry: {
              type: "Point",
              coordinates: [cities[rand1000].longitude, cities[rand1000].latitude]
            },
            image: [
                {
                  url: 'https://res.cloudinary.com/dg03o1tta/image/upload/v1639052787/PhakhCamper/avjemmynmdpk5w7vc8xe.jpg',
                  filename: 'PhakhCamper/avjemmynmdpk5w7vc8xe',
                },
                {
                  url: 'https://res.cloudinary.com/dg03o1tta/image/upload/v1639052788/PhakhCamper/lftfd1by3i0n9phzohor.jpg',
                  filename: 'PhakhCamper/lftfd1by3i0n9phzohor',
                },
                {
                  url: 'https://res.cloudinary.com/dg03o1tta/image/upload/v1639052789/PhakhCamper/xcgnub6dqbcpeyninvug.jpg',
                  filename: 'PhakhCamper/xcgnub6dqbcpeyninvug',
                },
                {
                  url: 'https://res.cloudinary.com/dg03o1tta/image/upload/v1639052790/PhakhCamper/lco3ob0314hpx22jvv4u.jpg',
                  filename: 'PhakhCamper/lco3ob0314hpx22jvv4u',
                },
                {
                  url: 'https://res.cloudinary.com/dg03o1tta/image/upload/v1639052793/PhakhCamper/llzqq6mgbdgr1bhtvbm5.jpg',
                  filename: 'PhakhCamper/llzqq6mgbdgr1bhtvbm5',
                }
              ]
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
