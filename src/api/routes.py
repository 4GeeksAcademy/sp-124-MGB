"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from sqlalchemy import select
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, BacklogList
from api.utils import generate_sitemap, APIException
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


@api.route('/backlog/<username>', methods=['GET'])
def backlog(username):
    user_id = db.session.execute(
        select(User.id).where(User.username == username)).first()
    backlog = db.session.execute(select(BacklogList).where(
        BacklogList.user_id == user_id)).first()
    response_body = {
        "backlog": list(map(lambda backlog: backlog.serialize(), backlog))
    }

    return jsonify(response_body), 200
