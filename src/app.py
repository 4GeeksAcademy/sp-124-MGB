"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt, check_password_hash
from sqlalchemy import delete, update, select
from api.utils import APIException, generate_sitemap
from api.models import BacklogList, Games, User, db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False
bcrypt = Bcrypt(app)

CORS(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_KEY")
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/users', methods=['GET'])
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


@app.route("/signup", methods=["POST"])
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
        is_admin=True
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "msg": "Added user correctly"
    }), 201


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password.encode('utf-8'), password.encode('utf-8')):
        access_token = create_access_token(identity=user.email)
        return jsonify({"token": access_token, "email": user.email})

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/profiles/settings', methods=['PUT', 'DELETE'])
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


@app.route('/games', methods=['POST', 'DELETE', 'PUT'])
@jwt_required()
def games_handle():
    match request.method:
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


@app.route('/backlog', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def backlog_auth_req():
    current_user_identity = get_jwt_identity()
    user = db.session.execute(select(User).where(
        User.email == current_user_identity)).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    match request.method:
        case "POST":
            game_id = request.json.get(game_id)
            user_id = request.json.get(user_id)
            existing_game = db.session.query.select(
                (BacklogList).where(BacklogList.game_id == game_id and BacklogList.user_id == user_id)).first()
            if existing_game:
                return jsonify({"msg": "Game already in backlog of user"}), 409

            new_backlog_entry = BacklogList(
                game_id=game_id,
                status="Not started",
                user_id=user_id,
            )
            db.session.add(new_backlog_entry)
            db.session.commit()

            return jsonify({
                "msg": "Game added succesfully to the user's backlog."
            }), 200
        case "PUT":
            game_id = request.json.get(game_id)
            user_id = request.json.get(user_id)
            change = request.json.get(change)
            match change:
                case "status":
                    status = request.json.get(status)
                    db.session.execute(update(BacklogList).where(
                        BacklogList.user_id == user_id and BacklogList.game_id == game_id).values(status=status))
                    db.session.commit()
                    return jsonify({
                        "msg": "Game status succesfully edited from backlog of user."
                    }), 200
                case "rating":
                    rating = request.json.get(rating)
                    db.session.execute(update(BacklogList).where(
                        BacklogList.user_id == user_id and BacklogList.game_id == game_id).values(rating=rating))
                    db.session.commit()
                    return jsonify({
                        "msg": "Game rating succesfully edited from backlog of user."
                    }), 200
        case "DELETE":
            db.session.execute(delete(BacklogList).where(
                BacklogList.user_id == user_id and BacklogList.game_id == BacklogList.game_id))
            db.session.commit()
            return jsonify({
                "msg": "Game deleted suscessfully from backlog of user."
            }), 200


    # this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
