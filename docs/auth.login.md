**Login**
----
  Authorizes, and returns access token valid for 60mins.

* **URL**

  /auth/login

* **Method:**

  `POST`
  
*  **URL Params**

    None

* **Data Params**

    **Required:**

  * `email=[string]` 
  * `password=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "status": true, "token": "<JW Token>" }`

  * JWT Token: `{ data: {email: "<EMAIL>", id: "<ObjectId>" }}`
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ message : "Missing auth data." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ message : "User not found." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ message: "Validation failed. Given email and password aren't matching." }`

* **Sample Call:**

  ```javascript
    axios.post('/auth/login', { email, password })
      .then((response) =>
    {
      localStorage.setItem('jwt_token', response.data.token)
      dispatch(login_success(response))
    })
      .catch((err) =>
    {
      dispatch(login_error(err.response.message))
    })
  ```