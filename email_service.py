from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "pricepulse@example.com")

def send_email(to_email: str, subject: str, body: str) -> bool:
    """
    Send an email using SendGrid.
    
    Args:
        to_email (str): Recipient email address
        subject (str): Email subject
        body (str): Email body
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    if not SENDGRID_API_KEY:
        logger.error("SendGrid API key not found")
        return False
        
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body
        )
        
        response = sg.send(message)
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False 