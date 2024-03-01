import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes/routes";

const router: Express = express();
/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

router.use("/api", routes);

router.use((req, res, next) => {
  const error = new Error("Not found");
  return res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);
const PORT = process.env.PORT_MS2 || 3020;
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
