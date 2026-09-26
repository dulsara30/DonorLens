import createApp from "./src/app.js";
import loggerService from "./src/services/logger.service.js";

const app =  createApp();
const PORT =  process.env.PORT || 5000;

app.listen(PORT, () => {
    loggerService.info(`Server is running on port ${PORT}`);
});
