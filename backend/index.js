import express from "express";
import cors from "cors";
import Router from "./routes/routes.js";
import staffRouter from "./routes/user/routes.js";
import clientRouter from "./routes/client/routes.js";
import session from "express-session";
import path from "path";

const app = express();

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use(express.json());

app.use(Router);
app.use(staffRouter);
app.use(clientRouter);
app.use("/static", express.static(path.resolve("./uploads")));
app.use(
  session({
    secret: "email",
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
