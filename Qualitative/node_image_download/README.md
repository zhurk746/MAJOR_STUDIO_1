## Major Studio 1: Downloading images with Node

### What this lab is about
This example uses Node.js, not client-side javascript. It contains two example scripts. One to create a query and create a `data.json` file from the Smithsonian API. The other to take that `data.json` file to download images.

### Setup
* Navigate to your folder in your terminal.
* Run `npm install` to install all the relevant dependencies. This will create a folder called `node_modules` containing all the relevant node.js libraries. 
* Create a file called `.env` file to store your API Key. You just write into it: `API_KEY=yourAPIKeyHere` and save it. 
* Create an empty directory called `downloads`.

### node_prepare_json.js
This code example is similar to the example we used earlier in lab 02. However, this is now written in node.js so it uses different libraries and commands. Most specifically you have to  Now you can download the relevant `data.json` file.

### node_download_images.js
This example now uses the `data.json` file to download images into a download directory. You first have to create 


#### Further Reading
* [Summer workshop: Command line tools](https://canvas.newschool.edu/courses/1528255/modules#module_2326390)
* [Node.js .env files](https://www.freecodecamp.org/news/nodejs-custom-env-files-in-your-apps-fa7b3e67abe1/)
* 

