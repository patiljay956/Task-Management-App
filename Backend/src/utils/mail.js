import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task manager",
            link: "https://mailgen.js/",
        },
    });

    // Generate email content (HTML & plain text)

    var emailHTML = mailGenerator.generate(options.mailGenContent);
    var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mail = {
        from: '"Task Manager" <taskmanager@example.email>',
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHTML,
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("email failed", error);
    }
};

export const emailVerificationMailGenerator = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Task Manager! We're excited to have you on board. ",
            action: {
                instructions:
                    "To get started with Task Manager, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Confirm your account, verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

export const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "we got a request to reset your password. ",
            action: {
                instructions: "To change your password click the button:",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};
