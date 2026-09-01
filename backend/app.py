import os
from flask import Flask
from flask_cors import CORS
from strawberry.flask.views import GraphQLView
import strawberry
from dotenv import load_dotenv

# Import db from models (not create new instance)
from models import db, User, Content, Category

# Import resolvers
from resolvers import Query, Mutation

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///cms.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize db with app
db.init_app(app)
CORS(app)

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Welcome to CMS API"

@strawberry.type
class Mutation:
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation)

app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql_view", schema=schema),
)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
