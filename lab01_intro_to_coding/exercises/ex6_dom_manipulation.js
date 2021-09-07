/*
  Exercise 6
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?

//Document Object Model

// Task
// Open the file index.html in AWS Cloud9. Click "Preview" > "Preview File index.html". (Note that you can open it in a new window). What do you see?
//long red rectangle in the top left corner

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.
//blank page because nothing style tag is not in reference to anything
// Task
// What does the following code do?
const viz = document.body.querySelector(".viz");

console.log(viz, viz.children);

const addChildToViz = () => {
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  newChild.style.height = Math.random() * 100 + "px";
  viz.appendChild(newChild);
};

viz.addEventListener("click", addChildToViz);

//this code adds a child element to the viz div. the div will have a rectangle with a random pixelated height 

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?
//in the console

function drawIrisData() {
  window
    .fetch("iris_json.json")
    .then(data => data.json())
    .then(data => {
      console.log(data);
    });
}

drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.
