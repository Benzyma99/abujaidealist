import os

import resend
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
MAIL_FROM = os.getenv("MAIL_FROM", "onboarding@resend.dev")

if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured.")

resend.api_key = RESEND_API_KEY


def send_email(to_email: str, subject: str, body: str):
    resend.Emails.send({
        "from": MAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "text": body,
    })