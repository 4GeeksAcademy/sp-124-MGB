"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from sqlalchemy import select
from flask import request, jsonify, Blueprint
from api.models import db, User, BacklogList, Games
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/users', methods=['GET'])
def users():
    users = db.session.execute(select(User)).scalars().all()
    response_body = {
        "users": list(map(lambda users: users.serialize(), users))
    }

    return jsonify(response_body), 200


@api.route('/games', methods=['GET'])
def games():
    games = db.session.execute(select(Games)).scalars().all()
    response_body = {
        "games": list(map(lambda games: games.serialize(), games))
    }

    return jsonify(response_body), 200


@api.route('/backlog/<username>', methods=['GET'])
def backlog(username):
    user_id = db.session.execute(
        select(User.id).where(User.username == username)).scalar()
    backlog = db.session.execute(select(BacklogList).where(
        BacklogList.user_id == user_id)).scalars().all()
    games_info = []
    for i in backlog:
        games_info.add(db.session.execute(
            select(Games).where(Games.id == i.game_id)))
    response_body = {
        "backlog": list(map(lambda backlog: backlog.serialize(), backlog)),
        "games": list(map(lambda games_info: games_info.serialize(), games_info))
    }

    return jsonify(response_body), 200
