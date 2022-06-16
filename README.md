# BookHub

BookHub is a free and open source website, for reading/downloading books. Just create an account and read all the books you would like, for free or download ePubs. We also allow users to post comments (with attachments), to share their opinions on the book.

## Setup and Installation

To host locally, one need to: 

Install [NodeJs](https://nodejs.org/en/download/)

Install [MongoDB](https://www.mongodb.com/)


Clone this repository by entering the following command on your terminal
```
git clone git@github.com:varun-s22/BookHub.git
```


Create a `.env` file in the root directory. It should look like this

```
  API_KEY = < your Google Books API key >
  secret = < your Session secret >
  CLOUD_NAME = < your Cloudinary cloud name >
  CLOUD_API_KEY = < your Cloudinary API key >
  CLOUD_API_SECRET= < your Cloudinary API secret >
 ```
 
Open the folder, and install the dependencies, by 
```
npm install
```

Now start the local server on your machine, by 
```
node app.js
```
Visit `localhost:3000` on your browser to open the website.

## Extra Requirements

You can get a Google Books API Key, from [here](https://developers.google.com/books), and Cloudinary API Key from [here](https://cloudinary.com/)
