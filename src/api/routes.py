"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from sqlalchemy import delete, select, update
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


@api.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    username = request.json.get("username")
    if not email or not password or not username:
        return jsonify({"msg": "Missing data"}), 400

    existing_email = db.session.execute(
        select(User).where(User.email == email)).scalars().first()

    if existing_email:
        return jsonify({"msg": "El email ya está registrado"}), 409

    new_user = User(
        email=email,
        password=password,
        username=username,
        is_active=False,
        is_admin=False
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "msg": "Added user correctly"
    }), 201


@api.route('/games', methods=['GET', 'POST', 'DELETE', 'PUT'])
def games():
    match request.method:
        case "GET":
            games = db.session.execute(select(Games)).scalars().all()
            response_body = {
                "games": list(map(lambda games: games.serialize(), games))
            }
        case "POST":
            name = request.json.get("name")
            description = request.json.get("description")
            genres = request.json.get("genres")
            publisher = request.json.get("publisher")
            developer = request.json.get("developer")
            release = request.json.get("release")
            cover_link = request.json.get("coverlink")

            new_game = Games(
                name=name,
                description=description,
                genres=genres,
                publisher=publisher,
                developer=developer,
                release_date=release,
                cover_link=cover_link
            )

            db.session.add(new_game)
            db.session.commit()

            response_body = {
                "msg": "Game added successfull."
            }
        case "PUT":
            game = db.session.execute(select(Games).where(
                Games.name == request.json.get("name", None))).scalars().first()

            if not game:
                return jsonify({"msg": "Game not found"}), 404

            case = list(request.json.keys())
            data = request.json.get(case[1])
            match case[1]:
                case "name":
                    db.session.execute(update(Games).where(
                        Games.name == game.name).values(name=data))
                    db.session.commit()
                case "description":
                    db.session.execute(update(Games).where(
                        Games.description == game.description).values(description=data))
                    db.session.commit()
                case "genres":
                    db.session.execute(update(Games).where(
                        Games.genres == game.genres).values(genres=data))
                    db.session.commit()
                case "developer":
                    db.session.execute(update(Games).where(
                        Games.developer == game.developer).values(developer=data))
                    db.session.commit()
                case "publisher":
                    db.session.execute(update(Games).where(
                        Games.publisher == game.publisher).values(publisher=data))
                    db.session.commit()
                case "release":
                    db.session.execute(update(Games).where(
                        Games.release_date == game.release_date).values(release_date=data))
                    db.session.commit()
                case "cover_link":
                    db.session.execute(update(Games).where(
                        Games.cover_link == game.cover_link).values(cover_link=data))
                    db.session.commit()

            response_body = {
                "msg": "Account details moddified correctly"
            }, 200
        case "DELETE":
            game = db.session.execute(select(Games).where(
                Games.name == request.json.get("name", None))).scalars().first()

            if not game:
                return jsonify({"msg": "Game not found"}), 404

            db.session.execute(delete(Games).where(Games.name == game.name))
            db.session.commit()
            response_body = {
                "msg": "Game deleted suscessfully"
            }, 200

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
