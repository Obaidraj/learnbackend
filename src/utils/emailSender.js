import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, text) => {
    try {
        // Create a transporter object
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use other services (Yahoo, Outlook, etc.)
            auth: {
                user: process.env.NODE_MAILER_EMAIL, // Your email address
                pass: process.env.NODE_MAILER_PASSWORD, // Your email password (use app-specific password if needed)
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL, // Sender address
            to: email, // Recipient email
            subject: subject, // Email subject
            text: text, // Email body
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
