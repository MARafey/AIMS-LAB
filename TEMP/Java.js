// Get references to HTML elements
const uploadForm = document.getElementById('upload-form');
const uploadInput = document.getElementById('upload-input');
const submitButton = document.getElementById('submit-button');
const imageContainer = document.getElementById('image-container');
const defoggingContainer = document.getElementById('defogging-container');
const processedContainer = document.getElementById('processed-container');

// Prevent the default form submission behavior
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
});

// Listen for file input change event
uploadInput.addEventListener('change', handleFileUpload);

// Listen for submit button click event
submitButton.addEventListener('click', processImages);

// Handle file upload event
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    displayImages(files);
}

// Display the uploaded images in the image container
function displayImages(files) {
    imageContainer.innerHTML = '';
    files.forEach((file) => {
        const reader = new FileReader();

        // When the file reader finishes loading the file
        reader.onload = function (event) {
            const image = document.createElement('img');
            image.src = event.target.result;
            image.style.maxWidth = '200px';
            image.style.margin = '10px';
            imageContainer.appendChild(image);
        };

        // Read the file as data URL
        reader.readAsDataURL(file);
    });
}

// // Process an image using the model
// function processImage(image) {
//     return new Promise((resolve) => {
//         // Create a new image element to hold the processed image
//         const processedImage = new Image();
//         // Load the model
//         tf.loadLayersModel('foggy_to_clear_model_10K.h5').then((model) => {
            
//             const inputImage = tf.browser.fromPixels(image);
//             const preprocessedImage = preprocessImage(inputImage);

//             // Process the image using the model
//             const outputImage = model.predict(preprocessedImage);

//             // Postprocess the image
//             const postprocessedImage = postprocessImage(outputImage);

//             // Set the processed image as the source for the new image element
//             processedImage.onload = () => {
//                 resolve(processedImage);
//             };
//             processedImage.src = postprocessedImage;
//         });
//     });
// }

// // Process the uploaded images
// async function processImages() {
//     defoggingContainer.innerHTML = '';
//     processedContainer.innerHTML = '';
//     console.log('Processing images...');

//     // Get all the displayed images
//     const images = Array.from(imageContainer.getElementsByTagName('img'));

//     for (const image of images) {
//         const defoggingResult = document.createElement('div');
//         const inputImageElement = document.createElement('img');
//         inputImageElement.src = image.src;
//         defoggingResult.appendChild(inputImageElement);
//         defoggingContainer.appendChild(defoggingResult);

//         // Perform image processing using the model
//         const processedImage = await processImage(image);

//         const processedResult = document.createElement('div');
//         const processedImageElement = document.createElement('img');
//         processedImageElement.src = processedImage.src;
//         processedResult.appendChild(processedImageElement);
//         processedContainer.appendChild(processedResult);
//     }

//     // Clear the image container after processing
//     imageContainer.innerHTML = '';
// }

// Process an image using the model
function processImage(image) {
  return new Promise((resolve) => {
    // Load the model
    tf.loadLayersModel('foggy_to_clear_model_10K.h5').then((model) => {
      const inputImage = tf.browser.fromPixels(image);
      const preprocessedImage = preprocessImage(inputImage);

      // Process the image using the model
      const outputImage = model.predict(preprocessedImage);

      // Postprocess the image
      const postprocessedImage = postprocessImage(outputImage);

      resolve(postprocessedImage);
    });
  });
}

// Process the uploaded images
async function processImages() {
  defoggingContainer.innerHTML = '';
  processedContainer.innerHTML = '';
  // Get all the displayed images
  const images = Array.from(imageContainer.getElementsByTagName('img'));

  for (const image of images) {
    const defoggingResult = document.createElement('div');
    const inputImageElement = document.createElement('img');
    inputImageElement.src = image.src;
    //defoggingResult.appendChild(inputImageElement);
    //defoggingContainer.appendChild(defoggingResult);

    // Perform image processing using the model
    const processedImageSrc = await processImage(image);

    const processedResult = document.createElement('div');
    const processedImageElement = document.createElement('img');
    processedImageElement.src = processedImageSrc;
    processedResult.appendChild(processedImageElement);
    processedContainer.appendChild(processedResult);
  }

  // Clear the image container after processing
  imageContainer.innerHTML = '';
}


// Preprocess the input image for the model
function preprocessImage(inputImage) {
    // Normalize the pixel values to the range of [0, 1]
    const normalizedImage = inputImage.div(255);

    // Expand the dimensions to match the model's input shape
    const preprocessedImage = normalizedImage.expandDims();

    return preprocessedImage;
}

// Postprocess the output image from the model
function postprocessImage(outputImage) {
    // Convert the output tensor to a regular array
    const outputData = Array.from(outputImage.dataSync());

    // Reshape the array to the original image shape
    const reshapedData = reshapeData(outputData, outputImage.shape);

    // Convert the reshaped data array to a data URL
    const processedDataURL = arrayToDataURL(reshapedData.data, reshapedData.width, reshapedData.height);

    return processedDataURL;
}

// Convert an array of pixel values to a data URL
function arrayToDataURL(data, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const imageData = context.createImageData(width, height);
    for (let i = 0; i < data.length; i++) {
        imageData.data[i] = data[i];
    }

    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
}

// Reshape the output data to the original image shape
function reshapeData(data, shape) {
    const reshapedData = {
        width: shape[1],
        height: shape[2],
        data: [],
    };

    for (let i = 0; i < data.length; i++) {
        reshapedData.data.push(Math.round(data[i] * 255));
    }

    return reshapedData;
}
