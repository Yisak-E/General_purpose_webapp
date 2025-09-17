from flask_api import FlaskAPI
from flask import request, jsonify
import json
import os
from flask_cors import CORS
import uuid



app = FlaskAPI(__name__)
CORS(app, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
DATA_FILE = 'data.json'

def read_json():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def write_json(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/items', methods=['GET'])
def get_items():
    return read_json()

@app.route('/api/items', methods=['POST'])
def add_item():
    new_item = request.get_json()

    new_item['id'] = str(uuid.uuid4())

    data = read_json()
    data.append(new_item)
    write_json(data)
    return {"message": "Item added", "item": new_item}, 201

@app.route('/api/items/<string:item_id>', methods=['PUT'])
def update_item(item_id):
    updated = request.data
    data = read_json()
    for i, item in enumerate(data):
        if item.get("id") == item_id:
            data[i] = updated
            write_json(data)
            return {"message": "Item updated", "item": updated}
    return {"error": "Item not found"}, 404


if __name__ == '__main__':
    app.run(debug=True)