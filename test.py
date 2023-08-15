"""
TESTING K MODEL
"""
import cv2
import numpy as np
from keras.models import load_model

# Set the desired image size
image_height = 64
image_width = 64
num_channels = 3

# Load the trained model
model = load_model("trainedK_model.h5")

# Load a foggy image for testing
foggy_image_path = "Fog/Fog/foggy-001.jpg"
foggy_image = cv2.imread(foggy_image_path)

# Resize the foggy image to the desired size
foggy_image = cv2.resize(foggy_image, (image_width, image_height))

# Preprocess the foggy image
foggy_image = foggy_image.astype('float32') / 255.0
foggy_image = np.expand_dims(foggy_image, axis=0)

# Use the model to predict the clear image
clear_image = model.predict(foggy_image)

# Rescale the pixel values to the original range
clear_image = clear_image * 255.0
clear_image = clear_image.astype('uint8')

# Reshape the clear image
clear_image = np.squeeze(clear_image, axis=0)

# Display the clear image
cv2.imshow("Clear Image", clear_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

