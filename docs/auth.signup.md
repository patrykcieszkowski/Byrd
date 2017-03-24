**Sign Up**
----
  Signs up new account, and returns a token, valid for 60mins.

* **URL**

  /auth/signup

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

    **Required:**

  * `email=[string]` 
    * required
    * minlength: 5
    * validation: email format
    * unique
  * `password=[string]`
    * required
    * minlength: 8

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "status": true, "token": "<JW Token>" }`

  * JWT Token: `{ data: {email: "<EMAIL>", id: "<ObjectId>" }}`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ message : "Missing auth data." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ message : "Invalid email format." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ message : "Email you've given is already used." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ message: "Password must have at least 6 chars." }`

* **Sample Call:**

  ```javascript
    axios.post('/auth/signup', { email, password })
      .then((response) =>
    {
      localStorage.setItem('jwt_token', response.data.token)
      dispatch(sign_up_success(response))
    })
      .catch((err) =>
    {
      dispatch(sign_up_error(err.response.message))
    })
  ```