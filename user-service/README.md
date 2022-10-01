# User service

This folder contains the code for the user service. The user service is responsible for user authentication and administration, as well as logging history.

## Get set up

### Running mongoDB

1. Install GUI (optional)
   To use MongoDB, I recommend installing [MongoDB Compass](https://zellwk.com/blog/local-mongodb/#:~:text=To%20connect%20to%20your%20local,databases%20in%20your%20local%20MongoDB.), a GUI for interfacing with the underlying tables. For an overview of important fundemental concepts to MongoDB, I recommend this [FAQ in the docs](https://www.mongodb.com/docs/manual/faq/fundamentals/#:~:text=Instead%20of%20tables%2C%20a%20MongoDB,in%20a%20relational%20database%20table.).

2. Install `mongod` - this runs MongoDB locally

```
sudo apt-get install mongod
```

3. Create a data directory for MongoDB to use

```
mkdir mongo
mkdir mongo/data
```

`/mongo` is currently in our `.gitignore`, so use that.

4. Start the local MongoDB server

```
mongod --dbpath ./mongo/data/ --port 27017
```

This runs the MongoDB process, and specifies the path for it to use on disk, as well as the port (by default it's 27017, so we just use it, too). This is the same port number we will reference in our user service app.

5. (Optional) Open MongoDB compass
   Using MongoDB compass, connect to the URI specified in the `.env` file. You should see the tables with dummy data.

### Modifying the local DB

Observe that we populate the database from `dev-data.json`. To see how it's actually done, see `db/db.ts`. It's dummy data populated only for local development.

### Running the server

1. Install dependencies

```
npm install
```

2. Compile to `.js` and run

```
npm run dev
```

You should see the server start up, and also that we watch for changes (and recompiles and runs as needed).

Note that in our `tsconfig.json`, we specify the output directory of the compiled `.ts` files to go to `dist/`, and the program executes from there.
