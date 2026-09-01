import strawberry
from typing import List, Optional
from datetime import datetime
from models import User, Content, Category, db
import bcrypt
import jwt
import os

@strawberry.type
class UserType:
    id: str
    username: str
    email: str
    is_admin: bool
    created_at: str

@strawberry.type
class CategoryType:
    id: str
    name: str
    slug: str
    description: Optional[str]
    created_at: str

@strawberry.type
class ContentType:
    id: str
    title: str
    slug: str
    description: Optional[str]
    body: str
    status: str
    author_id: str
    category_id: Optional[str]
    created_at: str
    updated_at: str
    published_at: Optional[str]

@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Welcome to CMS GraphQL API"
    
    @strawberry.field
    def get_contents(self, status: Optional[str] = None) -> List[ContentType]:
        query = Content.query
        if status:
            query = query.filter_by(status=status)
        contents = query.all()
        return [
            ContentType(
                id=c.id,
                title=c.title,
                slug=c.slug,
                description=c.description,
                body=c.body,
                status=c.status,
                author_id=c.author_id,
                category_id=c.category_id,
                created_at=c.created_at.isoformat(),
                updated_at=c.updated_at.isoformat(),
                published_at=c.published_at.isoformat() if c.published_at else None
            )
            for c in contents
        ]
    
    @strawberry.field
    def get_content(self, id: str) -> Optional[ContentType]:
        content = Content.query.get(id)
        if content:
            return ContentType(
                id=content.id,
                title=content.title,
                slug=content.slug,
                description=content.description,
                body=content.body,
                status=content.status,
                author_id=content.author_id,
                category_id=content.category_id,
                created_at=content.created_at.isoformat(),
                updated_at=content.updated_at.isoformat(),
                published_at=content.published_at.isoformat() if content.published_at else None
            )
        return None
    
    @strawberry.field
    def get_categories(self) -> List[CategoryType]:
        categories = Category.query.all()
        return [
            CategoryType(
                id=cat.id,
                name=cat.name,
                slug=cat.slug,
                description=cat.description,
                created_at=cat.created_at.isoformat()
            )
            for cat in categories
        ]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def signup(self, username: str, email: str, password: str) -> UserType:
        if User.query.filter_by(email=email).first():
            raise Exception("Email already registered")
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username=username, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        
        return UserType(
            id=user.id,
            username=user.username,
            email=user.email,
            is_admin=user.is_admin,
            created_at=user.created_at.isoformat()
        )
    
    @strawberry.mutation
    def login(self, email: str, password: str) -> str:
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            raise Exception("Invalid credentials")
        
        token = jwt.encode(
            {'user_id': user.id, 'email': user.email},
            os.getenv('JWT_SECRET', 'dev-secret'),
            algorithm=os.getenv('JWT_ALGORITHM', 'HS256')
        )
        return token
    
    @strawberry.mutation
    def create_content(self, title: str, slug: str, body: str, author_id: str, 
                      description: Optional[str] = None, category_id: Optional[str] = None) -> ContentType:
        content = Content(
            title=title,
            slug=slug,
            description=description,
            body=body,
            author_id=author_id,
            category_id=category_id,
            status='draft'
        )
        db.session.add(content)
        db.session.commit()
        
        return ContentType(
            id=content.id,
            title=content.title,
            slug=content.slug,
            description=content.description,
            body=content.body,
            status=content.status,
            author_id=content.author_id,
            category_id=content.category_id,
            created_at=content.created_at.isoformat(),
            updated_at=content.updated_at.isoformat(),
            published_at=content.published_at.isoformat() if content.published_at else None
        )
    
    @strawberry.mutation
    def update_content(self, id: str, title: Optional[str] = None, body: Optional[str] = None, 
                      status: Optional[str] = None) -> ContentType:
        content = Content.query.get(id)
        if not content:
            raise Exception("Content not found")
        
        if title:
            content.title = title
        if body:
            content.body = body
        if status:
            content.status = status
            if status == 'published':
                content.published_at = datetime.utcnow()
        
        content.updated_at = datetime.utcnow()
        db.session.commit()
        
        return ContentType(
            id=content.id,
            title=content.title,
            slug=content.slug,
            description=content.description,
            body=content.body,
            status=content.status,
            author_id=content.author_id,
            category_id=content.category_id,
            created_at=content.created_at.isoformat(),
            updated_at=content.updated_at.isoformat(),
            published_at=content.published_at.isoformat() if content.published_at else None
        )
    
    @strawberry.mutation
    def delete_content(self, id: str) -> bool:
        content = Content.query.get(id)
        if not content:
            raise Exception("Content not found")
        db.session.delete(content)
        db.session.commit()
        return True
