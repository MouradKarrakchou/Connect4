# PS8

The code of this repo is split in 2 folders:
* api/ manages the server. It contains a server which differentiate REST requests from HTTP file requests, and so
return either files or REST responses accordingly.
* front/ contains static files that should be returned by the HTTP server mentioned earlier.

Both folders contain a README with more details.

---

## Requirements to run the project

* [Node.js](https://nodejs.org/) should be installed.
* The repo should have been cloned.

---

## First launch

Not much in there, just launch `npm install` to install the dependencies for the server.

Note that this command should be run again every time you install / delete a package.

---

## All runs

Run the file start.sh to run the containers. It will launch the server and the front.The front at http://localhost:8000/.