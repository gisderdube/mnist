from flask import Flask
from flask import request
from fastai.vision import *
import os

app = Flask(__name__)

learn_path = Path(os.path.realpath('./server/learn'))
tmp_path = Path(os.path.realpath('./tmp'))


learn = load_learner(learn_path, 'model.pkl')
learn.load('stage-1')
defaults.device = torch.device('cpu')


def classify_image(img_path):
    img = open_image(img_path)
    pred_class, pred_idx, outputs = learn.predict(img)
    return {"class": str(pred_class), "probability": float(outputs[int(pred_idx)])}


@app.route('/classify')
def classify():
    filename = request.args.get('filename', '')
    img_path = str(tmp_path) + '/' + filename
    return classify_image(img_path)
