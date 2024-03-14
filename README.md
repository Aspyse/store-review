# re*curate
A store review webapp

*Created in partial fulfillment of CCAPDEV requirements*

## Setup
1. Set up npm project

```
npm init
```

2. Install required modules

```
npm i express express-handlebars body-parser mongoose
```

3. Connect to mongoDB at `localhost:27017`

4. Import sample data.
   - Create collection `reviewdb`
   - Import .json files from `models/sample_data` into `reviewdb`

5. Run `app.js` from the install directory
```
node app
```

6. Go to http://localhost:3000/
