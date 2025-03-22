const config = {
  port: process.env.PORT || 3333,
  archidektBaseUrl: "https://archidekt.com/api",
  mtgpiruloBaseUrl: "https://www.mtgpirulo.com",
  dealersBaseUrl: "https://www.magicdealersstore.com",
  tolariaBaseUrl: "https://www.tolariashop.com",
  corsOptions: {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  },
};

export default config;
