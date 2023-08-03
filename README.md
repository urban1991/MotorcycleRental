# Motorcycle Rental API

This is a RESTful API for a Motorcycle Rental service. The API is built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

- CRUD operations for Motorcycles
- Query for top 5 motorcycles based on rental fee
- Custom middleware to modify request query
- Joi validation for motorcycle data
- Winston logger for error handling and logging to a file
- Route for partial updates using HTTP PATCH method

## Installation

1. Clone the repository
2. Run `npm install` to install all dependencies
3. Make sure MongoDB is running locally or set your MongoDB URI in `.env` file
4. Run `npm start` to start the application

## Usage

- **Get Top 5 Motorcycles**

  `GET /api/motorcycles/top-5`

- **Get All Motorcycles**

  `GET /api/motorcycles`

- **Get a Motorcycle by ID**

  `GET /api/motorcycles/:id`

- **Create a new Motorcycle**

  `POST /api/motorcycles`

- **Update a Motorcycle by ID**

  `PUT /api/motorcycles/:id`

- **Partially Update a Motorcycle by ID**

  `PATCH /api/motorcycles/:id`

- **Delete a Motorcycle by ID**

  `DELETE /api/motorcycles/:id`

## Note

When using the PATCH route for partial updates, only the fields you want to update need to be provided in the request body. Joi validation is used to ensure data integrity.

## Error Handling

Errors are logged using the winston module, with error messages stored both in the console and in a dedicated `logfile.log` file.

## Author

urban1991

## License

MIT License
