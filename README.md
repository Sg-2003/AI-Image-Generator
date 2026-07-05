# AI Image Generator - MERN Stack Application

A full-stack web application that uses OpenAI's DALL-E API to generate images from text prompts. Users can create AI-generated images and share them with the community.

## Features

- 🎨 **AI Image Generation**: Generate high-quality images using OpenAI's DALL-E API
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🔍 **Search Functionality**: Search through generated images by prompt or author name
- 💾 **Image Storage**: Images are stored in Cloudinary and posts are saved in MongoDB
- 🎯 **Community Feed**: Browse and explore images created by other users
- ⬇️ **Download Images**: Download any generated image to your device

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Styled Components
- Material-UI (MUI)
- Axios
- React Lazy Load Image Component

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- OpenAI API
- Cloudinary

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (or MongoDB Atlas)
- OpenAI API key
- Cloudinary account

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sg-2003/AI-Image-Generator.git
cd AI-Image-Generator
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Setup

#### Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file and add your credentials:

```env
MONGODB_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8080
```

#### Client Environment Variables

Create a `.env` file in the `client` directory:

```bash
cd client
cp .env.example .env
```

Edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:8080/api/
```

**Note**: If you're deploying, update `REACT_APP_API_URL` to your production API URL.

## Running the Application

### Start the Server

```bash
cd server
npm start
```

The server will start on `http://localhost:8080`

### Start the Client

Open a new terminal window:

```bash
cd client
npm start
```

The client will start on `http://localhost:3000`

## API Endpoints

### Posts
- `GET /api/post/` - Get all posts
- `POST /api/post/` - Create a new post

### Image Generation
- `POST /api/generateImage/` - Generate an image from a prompt

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over the ocean"
}
```

## Project Structure

```
AI-Image-Generator/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utilities and themes
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## Usage

1. **Generate an Image**:
   - Navigate to the "Create Post" page
   - Enter your name and a detailed prompt describing the image you want
   - Click "Generate Image" and wait for the AI to create your image
   - Once generated, you can post it to the community

2. **Explore Community**:
   - Browse through all generated images on the home page
   - Use the search bar to find images by prompt or author name
   - Click on any image to see details and download it

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add it to your `.env` file

### MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your password in the connection string

### Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

## Troubleshooting

### Server Issues
- Ensure MongoDB is running and accessible
- Check that all environment variables are set correctly
- Verify OpenAI API key is valid and has credits

### Client Issues
- Make sure the server is running on port 8080
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` in `.env` matches your server URL

### Common Errors
- **"Failed to connect to DB"**: Check your MongoDB connection string
- **"Invalid API key"**: Verify your OpenAI API key is correct
- **"CORS error"**: Ensure server CORS is configured correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Created as a MERN stack project for AI image generation.

---

**Note**: Make sure to keep your `.env` files secure and never commit them to version control!
