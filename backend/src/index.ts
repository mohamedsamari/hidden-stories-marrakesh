import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import storiesRoutes from './routes/stories.routes';
import categoriesRoutes from './routes/categories.routes';
import historicalPeriodsRoutes from './routes/historical-periods.routes';
import dynastiesRoutes from './routes/dynasties.routes';
import locationsRoutes from './routes/locations.routes';
import adminStoriesRoutes from './routes/admin-stories.routes';
import adminCategoriesRoutes from './routes/admin-categories.routes';
import adminHistoricalPeriodsRoutes from './routes/admin-historical-periods.routes';
import adminDynastiesRoutes from './routes/admin-dynasties.routes';
import adminLocationsRoutes from './routes/admin-locations.routes';
import adminUploadsRoutes from './routes/admin-uploads.routes';
import adminStoryImagesRoutes from './routes/admin-story-images.routes';
import adminLocationImagesRoutes from './routes/admin-location-images.routes';
import adminRoutes from './routes/admin.routes';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
});

app.use('/stories', storiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/historical-periods', historicalPeriodsRoutes);
app.use('/dynasties', dynastiesRoutes);
app.use('/locations', locationsRoutes);
app.use('/admin/stories', adminStoriesRoutes);
app.use('/admin/categories', adminCategoriesRoutes);
app.use('/admin/historical-periods', adminHistoricalPeriodsRoutes);
app.use('/admin/dynasties', adminDynastiesRoutes);
app.use('/admin/locations', adminLocationsRoutes);
app.use('/admin/uploads', adminUploadsRoutes);
app.use('/admin/story-images', adminStoryImagesRoutes);
app.use('/admin/location-images', adminLocationImagesRoutes);
app.use('/admin', adminRoutes);


app.get("/health",(req, res)=>{
    res.json({status: "ok", message: "Server is running!"});
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
}
)