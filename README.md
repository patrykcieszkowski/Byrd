
 <p align="center">
  <img src="http://i.imgur.com/x7F2UCf.png" height="350" alt="Byrd's Logo"/>
</p>

# Byrd

* **ENVIROMENTAL VARIABLES:**

  All `process.ENV` variables are stored in `~/app/.env` file, and are loaded once, on application start-up, with help of `dotenv` module. Module should be executed before any other action is being made, unless `process.ENV` variables aren't required for the task.

  * `PORT=[number]`
    * port on which process will be executed.
  * `JWT_SECRET=[string]`
    * secret used for signing and authorization of JWT Tokens.
  * `MONGO_URI=[string URI]`
    * mongoDB URI, with path to the database.

  * ***TEST:***

      All enviromental variables for tests, should be set in `~/app/test/.env`. Same structure applies for test.

* **NPM Commands:**

  * `npm run dev`
    * starts node process with a watchdog and babel.
  * `npm run build`
    * builds ES6 to ES5. Outouts to `~/app/dist`
  * `npm run start`
    * builds and starts compiled app.
  * `npm run test`
    * runs mocha test, on ES6 app version.
