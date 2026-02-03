"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from sqlalchemy import delete, update, select
from sqlalchemy import delete, update, select
from api.utils import APIException, generate_sitemap
from api.models import BacklogList, User, db
from api.models import BacklogList, User, db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager
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


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email, password=password).first()

    pw_hash = bcrypt.generate_password_hash(password)
    if user and bcrypt.check_password_hash(pw_hash, user.password):
        access_token = create_access_token(identity=user.email)
        return jsonify({"token": access_token, "email": user.email})

    return jsonify({"msg": "Invalid credentials"}), 401


@app.route('/profiles/settings', methods=['PUT', 'DELETE'])
def profile_handle():
    user = db.session.execute(select(User).where(
        User.username == request.json.get("username", None))).scalars().first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if request.method == "PUT":
        case = list(request.json.keys())
        data = request.json.get(case[1])
        match case[1]:
            case "email":
                db.session.execute(update(User).where(
                    User.email == user.email).values(email=data))
                db.session.commit()
            case "password":
                db.session.execute(update(User).where(
                    User.password == user.password).values(password=data))
                db.session.commit()
            case "username":
                db.session.execute(update(User).where(
                    User.username == user.username).values(username=data))
                db.session.commit()

        return jsonify({
            "msg": "Account details moddified correctly"
        }), 200
    else:
        db.session.execute(delete(User).where(User.username == user.username))
        db.session.commit()
        return jsonify({
            "msg": "Account deleted suscessfully"
        }), 200


@app.route('/backlog', methods=['POST', 'PUT', 'DELETE'])
@jwt_required()
def backlog():
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
        }), 200


@ app.route('/backlog', methods=['POST', 'PUT', 'DELETE'])
@ jwt_required()
        def backlog():
        current_user_identity = get_jwt_identity()
        user = db.session.execute(select(User).where(
        User.email == current_user_identity)).first()

        if not user:
        return jsonify({"msg": "User not found"}), 404

        match request.method:
        case "POST":
        game_id = request.json.get(game_id)
            user_id= request.json.get(user_id)
            existing_game= db.session.query.select(
                (BacklogList).where(BacklogList.game_id == game_id and BacklogList.user_id == user_id)).first()
            if existing_game:
                return jsonify({"msg": "Game already in backlog of user"}), 409

            new_backlog_entry= BacklogList(
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
            game_id= request.json.get(game_id)
            user_id= request.json.get(user_id)
            change= request.json.get(change)
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
                    rating= request.json.get(rating)
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
