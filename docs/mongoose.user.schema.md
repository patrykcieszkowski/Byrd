**Mongoose Schema: User**
----
User is based on mongoDB database, and each of it's documents is constructed by strict schema, that has to be followed:

**Schema:**
  * `email=[string]`
    * required
    * min-length: `5`
    * validation: `email format`
    * unique
  * `password=[string]`
    * required
    * min-length: `8`

* **Sample Tree:**

  ```javascript
    {
      "users":
      [
        {
          "_id": ObjectId("58cf0714114bff5adc35de06"),
          "email": "sample2@gmail.com",
          "password": "$2a$10$aj68Sa.m/nhLy1JBPv5iIOJJH5t7isDFYMpCOuM4.qcxIT8naB2KK"
        },
        {
          "_id": ObjectId("58cc67ab9b11ec4cfd9ebb6e"),
          "email": "sample@gmail.com",
          "password": "$2a$10$aj68Sa.m/nhLy1JBPv5iIOJJH5t7isDFYMpCOuM4.qcxIT8naB2KK"
        }
      ]
    }
  ```

**Methods & Functionality:**

  * ***Passwords:***

    * ***save/update***

      When saving new document, password doesn't have to be hashed, as it's taken care by Schema model, before inputing the new data. That means, the password doesn't have to be hashed when is getting updated either. It will be saved in database in hashed format.

      ```javascript
        let { email, password } = req.body

        const user = db.User({
          email, // "success@test.pl"
          password // "password"
        })

        user.save()
          .then((res) =>
        {
          /*
            Password is hashed without our knowledge.

            res:
            {
              "_id": ObjectId("58cc67ab9b11ec4cfd9ebb6e"),
              "email": "success@test.pl",
              "password": "$2a$10$aj68Sa.m/nhLy1JBPv5iIOJJH5t7isDFYMpCOuM4.qcxIT8naB2KK"
            }
          */
        })
      ```

    * ***compare:***

      In order to keep it clean, simple, and consistent around the whole app, model has a method, for comparing passwords; hashed, from mongoDB `document` and `provided by user` (not hashed). Because it is model method, you don't have to worry about keeping track of document's result. Just run the method on your `.findOne()` result. Returns a promise.

      @password - password to be matched with copy found at MongoDB storage.

      ```javascript
        let { email, password } = req.body

        db.User.findByEmail(email)
          .then((user) => user.comparePassword(password))
          .then((user) =>
        {
          console.log('SUCCESS!')
        })
          .catch((err) =>
        {
          // given password doesn't match
        })
      ```


  * `.publicParse()`:
    Formats result to JSON, removes it's password and replaces `_id` with `id` key/value. Returns result ready to be published.

  **Static:**
  * `.findByEmail(email)`
    Looks for first user, with matching email address. Returns a promise.

    @email - desired email address
