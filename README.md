
# Project Setup and User Guide

Welcome to the project setup guide! Follow the steps below to set up and run the application smoothly. The guide also outlines how to use the platform effectively.

---

## **Setup Instructions**

### 1. Environment Configuration
- Navigate to the **kam-backend** folder and create a `.env` file.
- Navigate to the **client-portal** folder and create another `.env` file.
  - Add the following line to the `.env` file in **client-portal**:
    ```
    PORT=3001
    ```
- Add the following variables to the `.env` file in **kam-backend**:
  ```
  MONGO_URI=<Your MongoDB Connection String>
  JWT_SECRET=<Your Secret Key>
  ```

### 2. Install Dependencies
- Open a terminal in the **kam-backend** folder and run:
  ```
  npm i
  ```
- Open a terminal in the **kam-frontend** folder and run:
  ```
  npm i
  ```
- Open a terminal in the **client-portal** folder and run:
  ```
  npm i
  ```

### 3. Start the Development Servers
- Open a terminal in the **kam-backend** folder and run:
  ```
  npm run dev
  ```
- Open a terminal in the **kam-frontend** folder and run:
  ```
  npm start
  ```
- Open a terminal in the **client-portal** folder and run:
  ```
  npm start
  ```

### 4. Create an Admin User
- Send a POST request to the following endpoint using a tool like Postman or cURL:
  ```
  http://localhost:5000/api/users/register
  ```
- Use the following JSON body for the request:
  ```json
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpassword",
    "number": "4512458695",
    "role": "admin"
  }
  ```

### 5. Log in as Admin
- Use the admin credentials created above to log in via the **Admin Login** page.

### 6. Add a New Lead
- Navigate to the "Leads" section and add a new lead.

### 7. Retrieve Restaurant Credentials
- Check the backend terminal for the restaurant credentials.

### 8. Log in as Client
- Use the restaurant credentials to log in via the **Client Login** page.

### 9. Manage Restaurant Information
- Access the restaurant's information, including address, status, and lead user details.
- Perform the following actions:
  - Add new contacts.
  - Add new interactions (Regular-Update, Call, Email).
  - Get stats and update the lead via the Selected Lead Page.
  - Track interactions via the interaction log.

### 10. View Dashboard
- See stats for active, inactive, new, and recent leads.
- View today's due interactions.

### 11. Analyze Performance
- Navigate to the **Performance Page** to see performance metrics for all restaurants.
- Identify top-performing and underperforming restaurants.

### 12. Use the Searchbar
- Search by name.
- Sort by:
  - Average order
  - Average interactions
  - Last interaction time
- Filter by status.

---

Happy working with the platform!
