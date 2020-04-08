#!flask/bin/python 3.7

# IMPORTS ---

import os
import uuid
import firebase_admin
from flask import Flask, jsonify, request, Response

# SETUP ---

app = Flask(__name__)

GOOGLE_CLOUD_PROJECT = os.environ.get('GOOGLE_CLOUD_PROJECT')

# initialize firebase ap
cred = firebase_admin.credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
    'projectId': GOOGLE_CLOUD_PROJECT,
})

# get db ref
db = firebase_admin.firestore.client()

# ENDPOINTS ---

@app.route('/api/devices/<uuid>', methods = ['GET', 'POST'])
def devices(uuid = None):
    if request.method == 'GET':
        # query db
        data = db.collection('devices').document(uuid)

        # load query response
        devices = data.get().to_dict()

        if len(devices) > 0:
            return jsonify(devices), 200
        else:
            return Response(status=404)

    elif request.method == 'POST':
        # create new device
        device = {
            'uuid': uuid.uuid4(),
            'agent': request.headers.get('User-Agent', 'unknown')
        }

        # add device to db collection
        db.collection('devices').add(device)

        return jsonify({'uuid': device['uuid']}), 200
