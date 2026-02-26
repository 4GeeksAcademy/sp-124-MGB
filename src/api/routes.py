"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import delete, desc, select, update
from flask import request, jsonify, Blueprint
from api.models import Reviews, Suggestions, db, User, BacklogList, Games
from flask_cors import CORS
from flask_bcrypt import Bcrypt, check_password_hash


# appending a path
api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()


@api.route('/users', methods=['GET'])
@jwt_required()
def users():
    current_user_identity = get_jwt_identity()
    if (db.session.execute(select(User.is_admin).where(User.email == current_user_identity))):
        users = db.session.execute(select(User)).scalars().all()
        response_body = {
            "users": list(map(lambda users: users.serialize(), users))
        }
        return jsonify(response_body), 200

    return jsonify({"msg": "haha nice try"}), 401


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

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        email=email,
        password=pw_hash,
        username=username,
        is_active=True,
        is_admin=False
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "msg": "Added user correctly"
    }), 201


@api.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = db.session.execute(select(User).where(
        User.username == username)).scalar_one_or_none()

    if user and check_password_hash(user.password.encode('utf-8'), password.encode('utf-8')):
        access_token = create_access_token(
            identity=user.email, additional_claims={"role": user.is_admin, "email": user.email})
        return jsonify({"token": access_token, "role": user.is_admin, "email": user.email})

    return jsonify({"msg": "Invalid credentials"}), 401


@api.route('/profiles/settings', methods=['PUT', 'DELETE'])
@jwt_required()
def profile_handle():
    current_user_identity = get_jwt_identity()
    user_requesting = db.session.execute(select(User).where(
        User.email == current_user_identity)).scalar()
    user_to_modify = db.session.execute(select(User).where(
        User.username == request.json.get("username"))).scalar()
    if not user_requesting or not user_to_modify:
        return jsonify({"msg": "User not found"}), 404

    if (user_requesting.is_admin or user_requesting.email == user_to_modify.email):
        match request.method:
            case "PUT":
                case = list(request.json.keys())
                data = request.json.get(case[1])
                match case[1]:
                    case "email":
                        db.session.execute(update(User).where(
                            User.email == user_to_modify.email).values(email=data))
                        db.session.commit()
                    case "password":
                        db.session.execute(update(User).where(
                            User.password == user_to_modify.password).values(password=data))
                        db.session.commit()
                    case "username":
                        db.session.execute(update(User).where(
                            User.username == user_to_modify.username).values(username=data))
                        db.session.commit()

                return jsonify({
                    "msg": "Account details moddified correctly"
                }), 200
            case "DELETE":
                db.session.execute(delete(User).where(
                    User.username == user_to_modify.username))
                db.session.commit()

                return jsonify({
                    "msg": "Account deleted suscessfully"
                }), 200


@api.route('/games', methods=['GET'])
def games():
    games = db.session.execute(select(Games).order_by(
        Games.name)).scalars().all()
    response_body = {
        "games": list(map(lambda games: games.serialize(), games))
    }

    return jsonify(response_body), 200


@api.route('/games', methods=['POST', 'DELETE', 'PUT'])
@jwt_required()
def games_handle():
    current_user_identity = get_jwt_identity()
    user_requesting = db.session.execute(select(User).where(
        User.email == current_user_identity)).scalar()
    response_body = {"msg": "Not enough permissions"}, 401
    if (user_requesting.is_admin):
        match request.method:
            case "POST":
                name = request.json.get("name")
                description = request.json.get("description")
                genres = request.json.get("genres")
                publisher = request.json.get("publisher")
                developer = request.json.get("developer")
                release = request.json.get("release")
                cover_link = request.json.get("cover_link")

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
                game_id = request.json.get("game_id"),
                game = db.session.execute(select(Games).where(
                    Games.id == game_id)).scalars().first()

                if not game:
                    return jsonify({"msg": "Game not found"}), 404

                data = request.json.get("dataToFetch")
                match request.json.get("casee"):
                    case "name":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(name=data))
                        db.session.commit()
                    case "description":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(description=data))
                        db.session.commit()
                    case "genres":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(genres=data))
                        db.session.commit()
                    case "developer":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(developer=data))
                        db.session.commit()
                    case "publisher":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(publisher=data))
                        db.session.commit()
                    case "release":
                        print("a")
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(release_date=data))
                        db.session.commit()
                    case "cover_link":
                        db.session.execute(update(Games).where(
                            Games.id == game_id).values(cover_link=data))
                        db.session.commit()

                response_body = {
                    "msg": "Account details moddified correctly"
                }, 200
            case "DELETE":
                game = db.session.execute(select(Games).where(
                    Games.id == request.json.get("game_id", None))).scalars().first()

                if not game:
                    return jsonify({"msg": "Game not found"}), 404
                db.session.execute(
                    delete(Reviews).where(Reviews.game_id == game.id))
                db.session.execute(
                    delete(BacklogList).where(BacklogList.game_id == game.id))
                db.session.execute(
                    delete(Games).where(Games.id == game.id))
                db.session.commit()
                response_body = {
                    "msg": "Game deleted suscessfully"
                }, 200

    return jsonify(response_body), 200


@api.route('/games/<name>/<int:game_id>', methods=['GET'])
def game_details(name, game_id):
    games = db.session.execute(
        select(Games).where(Games.id == game_id)).scalar()
    response_body = {
        "game": games.serialize()
    }

    return jsonify(response_body), 200


@api.route('/backlog', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def backlog_handle():
    current_user_identity = get_jwt_identity()
    user = db.session.execute(select(User).where(
        User.email == current_user_identity)).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    match request.method:
        case "POST":
            game_id = request.json.get("game_id")
            existing_game = db.session.execute(select(BacklogList).where(
                BacklogList.game_id == game_id).where(BacklogList.user_id == user.id)).first()
            if existing_game:
                return jsonify({"msg": "Game already in backlog of user"}), 409

            new_backlog_entry = BacklogList(
                game_id=game_id,
                status="Not started",
                user_id=user.id,
            )
            db.session.add(new_backlog_entry)
            db.session.commit()

            return jsonify({
                "msg": "Game added succesfully to the user's backlog."
            }), 200
        case "PUT":
            backlog_id = request.json.get("edit")
            statusGame = request.json.get("statusGame")
            rating = request.json.get("rating")
            print(statusGame)
            db.session.execute(update(BacklogList).where(
                BacklogList.id == backlog_id).values(status=statusGame, rating=rating))
            db.session.commit()
            return jsonify({
                "msg": "Game status succesfully edited from backlog of user."
            }), 200
        case "DELETE":
            db.session.execute(delete(BacklogList).where(
                BacklogList.user_id == user.id).where(BacklogList.game_id == BacklogList.game_id))
            db.session.commit()
            return jsonify({
                "msg": "Game deleted suscessfully from backlog of user."
            }), 200


@api.route('/backlog/<username>', methods=['GET'])
def backlog(username):
    user_id = db.session.execute(
        select(User.id).where(User.username == username)).scalar()
    backlog = db.session.execute(select(BacklogList).where(
        BacklogList.user_id == user_id)).scalars().all()
    games_info = []

    for i in backlog:
        games_info.append(db.session.execute(
            select(Games).where(Games.id == i.game_id)).scalar())

    games_info = list(
        map(lambda games_info: games_info.serialize(), games_info))
    backlog = list(map(lambda backlog: backlog.serialize(), backlog))
    games_info = sorted(games_info, key=lambda x: x["name"])
    backlog_ordered = []

    for i in games_info:
        for j in backlog:
            if i["id"] == j["game_id"]:
                backlog_ordered.append(j)

    response_body = {
        "backlog": backlog_ordered,
        "games": games_info
    }

    return jsonify(response_body), 200


@api.route('/backlog/<int:id>', methods=['GET'])
def rating_handle(id):
    ratings = db.session.execute(select(BacklogList.rating).where(
        BacklogList.game_id == id)).scalars().all()
    rating = 0
    emptyRating = 0

    if not ratings[0]:
        response_body = {
            "msg": "No ratings for this game"
        }, 400
        return jsonify()

    for i in ratings:
        if i != None:
            rating += i
        else:
            emptyRating += 1

    rating = rating / (len(ratings) - emptyRating)

    response_body = {
        "rating": rating,
    }

    return jsonify(response_body), 200


@api.route('/reviews', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def reviews_handle():
    current_user_identity = get_jwt_identity()
    user = db.session.execute(select(User).where(
        User.email == current_user_identity)).scalars().first()
    game_id = request.json.get("game_id")
    existing_game = db.session.execute(
        select(Games).where(Games.id == game_id)).scalars().first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    match request.method:
        case "POST":
            review = request.json.get("review")
            existing_review = db.session.execute(select(Reviews).where(
                Reviews.user_id == user.id).where(Reviews.game_id == game_id)).scalars().first()
            if not existing_game or existing_review:
                return jsonify({"msg": "Game does not exist or review already exists"}), 401

            new_review = Reviews(
                game_id=game_id,
                review_text=request.json.get("review"),
                user_id=user.id,
            )
            db.session.add(new_review)
            db.session.commit()

            return jsonify({
                "msg": "Review added succesfully to the game."
            }), 200
        case "PUT":
            review = request.json.get("review")
            db.session.execute(update(Reviews).where(
                Reviews.user_id == user.id).where(Reviews.game_id == game_id).values(review_text=review))
            db.session.commit()
            return jsonify({
                "msg": "Game review succesfully edited."
            }), 200
        case "DELETE":
            db.session.execute(delete(Reviews).where(
                Reviews.id == request.json.get("id")))
            db.session.commit()
            return jsonify({
                "msg": "Review deleted suscessfully from game."
            }), 200


@api.route('/reviews/<int:id>', methods=['GET'])
def reviews(id):
    users = []
    reviews = db.session.execute(select(Reviews).where(
        Reviews.game_id == id)).scalars().all()
    for i in reviews:
        users.append(db.session.execute(select(User).where(
            User.id == i.user_id)).scalar())
    response_body = {
        "reviews": list(map(lambda reviews: reviews.serialize(), reviews)),
        "users": list(map(lambda users: users.serialize(), users))
    }

    return jsonify(response_body), 200


@api.route('/reviews/<user_email>/<int:game_id>', methods=['GET'])
def user_review_check(user_email, game_id):
    user_id = db.session.execute(select(User.id).where(
        User.email == user_email)).scalars().first()
    existing_review = db.session.execute(select(Reviews).where(
        Reviews.user_id == user_id).where(Reviews.game_id == game_id)).scalar_one_or_none()
    response_body = {
        "msg": False,
        "review": "",
        "id": None
    }

    if existing_review:
        response_body = {
            "msg": True,
            "review": existing_review.review_text,
            "id": existing_review.id
        }

    return jsonify(response_body), 200


@api.route('/suggestions', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def suggestions():
    current_user_identity = get_jwt_identity()
    user = db.session.execute(select(User).where(
        User.email == current_user_identity)).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    match request.method:
        case "GET":
            if not user.is_admin:
                return jsonify({"msg": "Nice try"}), 409

            suggestions = db.session.execute(
                select(Suggestions)).scalars().all()
            return jsonify({"suggestions": list(map(lambda suggestions: suggestions.serialize(), suggestions))})

        case "POST":
            new_suggestion = Suggestions(
                suggestion=request.json.get("suggestion"),
                user_id=user.id,
            )
            db.session.add(new_suggestion)
            db.session.commit()

            return jsonify({
                "msg": "Suggestion added succesfully."
            }), 200
        case "DELETE":
            if not user.is_admin:
                return jsonify({"msg": "Nice try"}), 409
            db.session.execute(delete(Suggestions).where(
                Suggestions.id == request.json.get("suggestion_id")))
            db.session.commit()
            return jsonify({
                "msg": "Suggestions deleted suscessfully."
            }), 200
