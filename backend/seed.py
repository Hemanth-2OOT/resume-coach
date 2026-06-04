from sqlalchemy.orm import Session
from models.user import User
from security import hash_password
from database import SessionLocal, engine


def seed_admin(db: Session):
    """Create default admin user if it doesn't exist."""
    admin_email = "admin@example.com"
    admin_password = "admin123"

    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print(f"Admin user '{admin_email}' already exists.")
        return

    # Create default admin
    hashed_pwd = hash_password(admin_password)
    admin_user = User(
        email=admin_email,
        password_hash=hashed_pwd,
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    print(f"Created default admin user: {admin_email}")


def init_db():
    """Initialize database and create default admin."""
    from models import Base

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create default admin
    db = SessionLocal()
    try:
        seed_admin(db)
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
