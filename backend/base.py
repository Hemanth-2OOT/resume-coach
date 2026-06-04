from sqlalchemy.orm import declarative_base

# Single shared Base — ALL models must import from here.
# Never call declarative_base() in individual model files.
Base = declarative_base()