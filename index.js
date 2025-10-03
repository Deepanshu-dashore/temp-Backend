import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import {connectDb} from "./src/config/connection.js";
import { setupSwagger } from "./src/Utils/swaggerConfig.js";

const port = process.env.PORT || 5000;

// Setup Swagger documentation
setupSwagger(app);

connectDb().then(()=>{
    app.listen(port,()=>{
        console.log("Server is running on port : http://localhost:"+port);
        console.log("Swagger Docs available on http://localhost:"+port+"/api-docs");
    })
})
.catch((error)=>{
    console.log("Error to connect DB :",error);
})