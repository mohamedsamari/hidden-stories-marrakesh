import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import storiesRoutes from './routes/stories.routes';
import categoriesRoutes from './routes/categories.routes';
import historicalPeriodsRoutes from './routes/historical-periods.routes';
import dynastiesRoutes from './routes/dynasties.routes';
import locationsRoutes from './routes/locations.routes';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/stories', storiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/historical-periods', historicalPeriodsRoutes);
app.use('/dynasties', dynastiesRoutes);
app.use('/locations', locationsRoutes);


app.get("/health",(req, res)=>{
    res.json({status: "ok", message: "Server is running!"});
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
}
)