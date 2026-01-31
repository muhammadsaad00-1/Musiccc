"""
Email notification service using Gmail SMTP.

To use this module:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password at: https://myaccount.google.com/apppasswords
3. Set environment variables:
   - EMAIL_SENDER: Your Gmail address
   - EMAIL_PASSWORD: App password (not your regular password)
   - EMAIL_RECIPIENT: Email to receive notifications (can be same as sender)
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Email configuration - these can be overridden by environment variables
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "mr.taah16@gmail.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "ssrcapowrgyohdvi")  # App Password (no spaces)
EMAIL_RECIPIENT = os.getenv("EMAIL_RECIPIENT", "mr.taaha16@gmail.com")  # Where to send notifications



SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


def send_requirement_notification(requirement_data: dict) -> bool:
    """
    Send email notification for a new booking requirement.
    Returns True if successful, False otherwise.
    """
    if not EMAIL_SENDER or not EMAIL_PASSWORD or not EMAIL_RECIPIENT:
        print("Email credentials not configured. Skipping email notification.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🎭 New Booking Request: {requirement_data.get('eventType', 'Event')} in {requirement_data.get('eventLocation', 'Unknown')}"
        msg['From'] = EMAIL_SENDER
        msg['To'] = EMAIL_RECIPIENT
        
        # Format the date nicely
        event_date = requirement_data.get('eventDate', 'Not specified')
        submitted_at = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        # Plain text version
        text_content = f"""
New Booking Request Received!

=== Customer Details ===
Name: {requirement_data.get('name', 'Not provided')}
Email: {requirement_data.get('email', 'Not provided')}
Phone: {requirement_data.get('phone', 'Not provided')}

=== Event Details ===
Event Type: {requirement_data.get('eventType', 'Not specified')}
Event Date: {event_date}
Location: {requirement_data.get('eventLocation', 'Not specified')}

=== Requirements ===
Artist Type: {requirement_data.get('artistType', 'Not specified')}
Budget: {requirement_data.get('budget', 'Not specified')}

=== Additional Notes ===
{requirement_data.get('message', 'No additional notes')}

---
Submitted on: {submitted_at}
        """
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0b; color: #ffffff; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #111113 100%); border-radius: 16px; overflow: hidden; border: 1px solid #333; }}
        .header {{ background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 24px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; color: white; }}
        .content {{ padding: 24px; }}
        .section {{ background: #0a0a0b; border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 1px solid #333; }}
        .section-title {{ color: #f97316; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }}
        .field {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; }}
        .field:last-child {{ border-bottom: none; }}
        .field-label {{ color: #888; font-size: 14px; }}
        .field-value {{ color: #fff; font-weight: 500; font-size: 14px; }}
        .highlight {{ background: linear-gradient(135deg, #f9731620 0%, #ec489920 100%); border: 1px solid #f9731650; }}
        .notes {{ color: #aaa; font-style: italic; line-height: 1.6; }}
        .footer {{ text-align: center; padding: 16px; color: #666; font-size: 12px; border-top: 1px solid #333; }}
        .badge {{ display: inline-block; padding: 4px 12px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; font-size: 12px; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎭 New Booking Request</h1>
        </div>
        <div class="content">
            <div class="section highlight">
                <div class="section-title">📋 Customer Details</div>
                <div class="field">
                    <span class="field-label">Name</span>
                    <span class="field-value">{requirement_data.get('name', 'Not provided')}</span>
                </div>
                <div class="field">
                    <span class="field-label">Email</span>
                    <span class="field-value">{requirement_data.get('email', 'Not provided')}</span>
                </div>
                <div class="field">
                    <span class="field-label">Phone</span>
                    <span class="field-value">{requirement_data.get('phone', 'Not provided')}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🎉 Event Details</div>
                <div class="field">
                    <span class="field-label">Event Type</span>
                    <span class="field-value">{requirement_data.get('eventType', 'Not specified')}</span>
                </div>
                <div class="field">
                    <span class="field-label">Date</span>
                    <span class="field-value">{event_date}</span>
                </div>
                <div class="field">
                    <span class="field-label">Location</span>
                    <span class="field-value">{requirement_data.get('eventLocation', 'Not specified')}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">🎤 Requirements</div>
                <div class="field">
                    <span class="field-label">Artist Type</span>
                    <span class="field-value">{requirement_data.get('artistType', 'Not specified').title()}</span>
                </div>
                <div class="field">
                    <span class="field-label">Budget</span>
                    <span class="field-value">{requirement_data.get('budget', 'Not specified').replace('-', ' - ').replace('k', 'K').upper()}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">📝 Additional Notes</div>
                <p class="notes">{requirement_data.get('message', 'No additional notes provided.')}</p>
            </div>
        </div>
        <div class="footer">
            <span class="badge">NEW REQUEST</span>
            <p>Submitted on {submitted_at}</p>
        </div>
    </div>
</body>
</html>
        """
        
        # Attach parts
        part1 = MIMEText(text_content, 'plain')
        part2 = MIMEText(html_content, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECIPIENT, msg.as_string())
        
        print(f"Email notification sent successfully to {EMAIL_RECIPIENT}")
        return True
        
    except Exception as e:
        print(f"Failed to send email notification: {e}")
        return False
