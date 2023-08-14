# Server application

The application is a GrahpQL server that works with the local MongoDB database through the mongoose library.

## Before start

You must have an `.env` file, an example file is shown below. It should be saved in the root directory.

```
# Required
MONGODB_HOST=mongodb://localhost:27017/notes
JWT_SECRET_KEY=AnyStringYouWant__:3

# Optional
PORT=5000
```

### Start development server

```bash
yarn install
yarn dev
```
