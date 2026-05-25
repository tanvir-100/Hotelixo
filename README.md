# Hotelixo

Hotelixo is a full-stack vacation rental platform inspired by Airbnb. It is built with Node.js, Express, MongoDB, EJS templating, and Cloudinary for image uploads.

## Features

- User authentication and registration with Passport.js
- Create, edit, and delete property listings
- Upload listing images to Cloudinary
- Add and remove reviews on listings
- Authorization for listing owners and review authors
- Flash notifications for success/error feedback
- Form validation with Joi
- Session storage persisted in MongoDB

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- EJS + ejs-mate
- Passport.js for authentication
- Cloudinary for image hosting
- Joi for request validation
- connect-mongo for session persistence

## Prerequisites

- Node.js 22.x (project engine set to `22.22.0`)
- npm
- MongoDB Atlas database URL
- Cloudinary account

## Setup

1. Clone or copy the project into your workspace.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
ATLASDB_URL=your-mongodb-atlas-url
SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:

```bash
node app.js
```

5. Open your browser and visit:

```text
http://localhost:8080
```

## Available Routes

- `GET /listings` - View all listings
- `GET /listings/new` - Create a new listing (authenticated users only)
- `POST /listings` - Submit a new listing
- `GET /listings/:id` - View listing details
- `GET /listings/:id/edit` - Edit a listing (owner only)
- `PUT /listings/:id` - Update a listing
- `DELETE /listings/:id` - Delete a listing
- `POST /listings/:id/reviews` - Add a review (authenticated users only)
- `DELETE /listings/:id/reviews/:reviewId` - Delete review (author only)
- `GET /signup` - Register a new user
- `GET /login` - Login page
- `GET /logout` - Logout

## Project Structure

- `app.js` - Main application entrypoint
- `cloudConfig.js` - Cloudinary upload configuration
- `models/` - Mongoose models for listings, reviews, and users
- `controllers/` - Request handlers for listings, reviews, and users
- `routes/` - Route definitions for listings, reviews, and users
- `middleware.js` - Authentication, authorization, and validation middleware
- `schema.js` - Joi validation schemas
- `views/` - EJS templates for pages
- `public/` - Static assets (CSS, client-side JS)

## Notes

- The app uses port `8080` by default.
- Sessions are stored in MongoDB using `connect-mongo`.
- Listing images are uploaded to Cloudinary and stored using `multer-storage-cloudinary`.
- Validation errors and flash messages are displayed through the UI.

