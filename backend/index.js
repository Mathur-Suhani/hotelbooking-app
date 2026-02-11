import express from "express";
import cors from "cors";
import amadeus from "./amadeus.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/flights-test", async (req, res) => {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: "DEL",
      destinationLocationCode: "BOM",
      departureDate: "2026-03-15",
      adults: 1,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.response?.data || error.message);
  }
});

app.get("/api/hotel-list", async (req, res) => {
  try {
    const { cityCode } = req.query;

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode.toUpperCase(),
      radius: 5,
      radiusUnit: 'KM'
    });

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch hotel list",
      error: error.description || error.message,
    });
  }
});

app.get("/api/hotel-list-with-prices", async (req, res) => {
  try {
    const { cityCode, checkIn, checkOut, adults = 2 } = req.query;

    const hotelListResponse = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode.toUpperCase(),
      radius: 5,
      radiusUnit: 'KM'
    });

    const hotels = hotelListResponse.data || [];

    if (hotels.length === 0) {
      return res.json([]);
    }

    const batchSize = 20;
    const hotelIds = hotels.slice(0, batchSize).map(h => h.hotelId).join(',');

    try {
      const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds: hotelIds,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: adults,
        roomQuantity: 1,
        currency: 'USD'
      });

      const offersData = offersResponse.data || [];

      const hotelsWithOffers = offersData.map(offer => {
        const hotelInfo = hotels.find(h => h.hotelId === offer.hotel.hotelId);
        return {
          ...hotelInfo,
          hotelId: offer.hotel.hotelId,
          name: offer.hotel.name || hotelInfo?.name,
          price: parseFloat(offer.offers[0]?.price?.total || 0),
          currency: offer.offers[0]?.price?.currency || 'USD',
          offers: offer.offers,
          rating: offer.hotel.rating || (Math.random() * 2 + 3).toFixed(1),
          reviewCount: Math.floor(Math.random() * 500) + 50,
          amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant'].slice(0, Math.floor(Math.random() * 3) + 2),
          hasRealPrice: true
        };
      });

      const hotelsWithoutOffers = hotels.slice(batchSize).map((hotel) => ({
        ...hotel,
        price: Math.floor(Math.random() * 200) + 50,
        currency: 'USD',
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant'].slice(0, Math.floor(Math.random() * 3) + 2),
        hasRealPrice: false
      }));

      const allHotels = [...hotelsWithOffers, ...hotelsWithoutOffers];

      res.json(allHotels);

    } catch (offerError) {
      
      const hotelsWithPlaceholders = hotels.map(hotel => ({
        ...hotel,
        price: Math.floor(Math.random() * 200) + 50,
        currency: 'USD',
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviewCount: Math.floor(Math.random() * 500) + 50,
        amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant'].slice(0, Math.floor(Math.random() * 3) + 2),
        hasRealPrice: false
      }));

      res.json(hotelsWithPlaceholders);
    }

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hotels",
      error: error.description || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
});