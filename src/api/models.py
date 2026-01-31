from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Float, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_admin: Mapped[bool] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    user_id_reviews: Mapped[List["Reviews",]
                            ] = relationship(back_populates="user")
    user_id_backlog: Mapped[List["BacklogList"]
                            ] = relationship(back_populates="user")
    user_id_suggestions: Mapped[List["Suggestions"]
                                ] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Reviews(db.Model):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    review_text: Mapped[str] = mapped_column(String(), nullable=False)
    game_id: Mapped[int] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="user_id_reviews")

    def serialize(self):
        return {
            "id": self.id,
            "review_text": self.review_text,
            "game_id": self.game_id,
            "user_id": self.user_id
        }


class BacklogList(db.Model):
    __tablename__ = "backloglist"
    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(nullable=False)
    rating: Mapped[float] = mapped_column(Float(), nullable=True)
    status: Mapped[str] = mapped_column(String(), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="user_id_backlog")

    def serialize(self):
        return {
            "id": self.id,
            "game_id": self.game_id,
            "rating": self.rating,
            "status": self.status,
            "user_id": self.user_id
        }


class Suggestions(db.Model):
    __tablename__ = "suggestions"
    id: Mapped[int] = mapped_column(primary_key=True)
    suggestion: Mapped[str] = mapped_column(String(), nullable=False)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship(back_populates="user_id_suggestions")

    def serialize(self):
        return {
            "id": self.id,
            "suggestion": self.suggestion,
            "user_id": self.user_id
        }
