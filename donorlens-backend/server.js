import createApp from "./src/app.js";

const app =  createApp();
const PORT =  process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})