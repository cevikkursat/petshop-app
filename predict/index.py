import cv2 as cv2
import numpy as np
from keras.models import load_model
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/predict', methods=['POST'])
def post_data():
    request_data = request.get_json()
    fileName = request_data['fileName']
    
    images = []
    img = cv2.imread("../backend/images/predictImage/{}".format(fileName))
    img = cv2.resize(img, (224, 224))
    image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    images.append(image)
    images = np.array(images, 'float32')
    images /= 255
    images = images.reshape(images.shape[0], 224, 224, 3)
    images = images.astype('float32')
    predictions = model.predict(images, verbose=0)
    classes = np.argmax(predictions, axis=1)
    predictedClasses = classes[0]
    response = {
        'status': "true",
        'class': str(predictedClasses),
    }
    return jsonify(response)

if __name__ == '__main__':
    global model
    model = load_model("./model/DenseNet201_dense1024drop04sigmoid_dense512drop03relu_dense256drop02sigmoid_200epoch_SGD.h5")
    app.run(debug=True, port=8080)

