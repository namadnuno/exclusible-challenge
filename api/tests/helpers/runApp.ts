import app from "../../app";

const runApp = () => app().listen(8001, () => {
       console.log(`Example app listening on port 8001`);
    });


export default runApp;