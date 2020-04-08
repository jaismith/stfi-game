#!flask/bin/python 3.7

# IMPORTS ---

import os
import namegenerator
from firebase_admin import firestore, credentials, initialize_app
from flask import Flask, jsonify, request, Response
from random import randint, shuffle

# SETUP ---

app = Flask(__name__)

# initialize firebase ap
cred = credentials.ApplicationDefault()
initialize_app(cred, {
  'projectId': 'stfi-game',
})

# get db ref
db = firestore.client()

# ENDPOINTS ---

@app.route('/api/devices/<identifier>', methods = ['GET'])
@app.route('/api/devices', methods = ['POST'])
def devices(identifier = None):
    if request.method == 'GET':
        # query db
        doc = db.collection('devices').document(identifier)

        # load query response
        device = doc.get().to_dict()

        if device is None:
            return Response(status=404)
        else:
            return jsonify(device)

    elif request.method == 'POST':
        # create new device
        device = {
            'agent': request.headers.get('User-Agent', 'unknown'),
            'name': request.args.get('name', namegenerator.gen())
        }

        # add device to db collection
        (_, doc) = db.collection('devices').add(device)

        return jsonify({'uuid': doc.id}), 200

@app.route('/api/games/<identifier>', methods = ['GET', 'PUT'])
@app.route('/api/games', methods = ['POST'])
def games(identifier = None):
    if request.method == 'GET' or request.method == 'PUT':
        # query db
        doc = db.collection('games').document(identifier)

        # load query response
        game = doc.get().to_dict()

        if game is None:
            return Response(status=404)

        # short circuit for GET
        if request.method == 'GET':
           return jsonify(game)

        # short circuit for already started game
        if game['status'] != 'not started':
            return jsonify({'message': 'Game is not accepting new players :('}), 403

        # get device uuid
        device_uuid = request.args.get('device')
        if device_uuid is None:
            return Response(status=400)

        # only add if device isn't in game
        if device_uuid not in game['devices']:
            doc.update({
                'devices': firestore.ArrayUnion([device_uuid])
            })

        return Response(status=200)

    elif request.method == 'POST':
        # get current device uuid
        device_uuid = request.args.get('device')
        if device_uuid is None:
            return Response(status=400)

        # load stfi deck info
        deck_info = db.collection('decks').document('stfi').get().to_dict()
        deck = list(range(1, deck_info['size']))
        shuffle(deck)

        # create new game
        game = {
            'owner': device_uuid,
            'pin': randint(100000, 999999),
            'devices': [device_uuid],
            'sequence': [],
            'deck': deck,
            'position': 0,
            'turn': 0,
            'status': 'not started'
        }

        # add game to games collection
        (_, doc) = db.collection('games').add(game)

        return jsonify({'uuid': doc.id, 'pin': game['pin']})

@app.route('/api/games/<identifier>/start', methods = ['GET'])
def start(identifier):
    # get game doc from db
    game_doc = db.collection('games').document(identifier)

    # load game
    game = game_doc.get().to_dict()

    # make sure owner is requesting, otherwise deny
    device_uuid = request.args.get('device')
    if device_uuid != game['owner']:
        return jsonify({'message': 'Only the owner can start the game!'}), 403

    # randomize sequence
    game['sequence'] = game['devices']
    shuffle(game['sequence'])

    # set status
    game['status'] = 'in progress'

    # update in db
    game_doc.update({
        'sequence': game['sequence'],
        'status': game['status']
    })

    return Response(status=200)

@app.route('/api/games/<identifier>/draw', methods = ['GET'])
def draw(identifier):
    # get game doc from db
    game_doc = db.collection('games').document(identifier)

    # load data
    game = game_doc.get().to_dict()

    # ensure game is in progress
    if game['status'] != 'in progress':
        return({'message': 'This game is not in progress!'}), 403

    # check for correct turn
    device_uuid = request.args.get('device', 'unknown')
    if game['sequence'][game['turn']] != device_uuid:
        return jsonify({'message': 'It is not your turn!'}), 403

    # get card and end game if deck finished
    card = game['deck'][game['position']]
    if game['position'] + 1 >= len(game['deck']):
        game['status'] = 'complete'

    turn_rollback = False
    if game['turn'] >= len(game['sequence']) - 1:
        turn_rollback = True
    
    # update db
    game_doc.update({
        'turn': 0 if turn_rollback else firestore.Increment(1),
        'position': firestore.Increment(1)
    })

    return jsonify({'card': card})

# DEVELOPMENT SERVER ---

if __name__ == '__main__':
	app.run(host = '127.0.0.1', port = 8080, debug = True)
