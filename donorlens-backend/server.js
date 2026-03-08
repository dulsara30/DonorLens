import createApp from "./src/app.js";

const app =  createApp();
const PORT =  process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
