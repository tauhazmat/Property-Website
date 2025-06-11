import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    // Here you would typically integrate with an email service like:
    // - SendGrid
    // - Nodemailer
    // - Resend
    // - EmailJS

    // For now, we'll simulate sending an email
    console.log("Contact form submission:", {
      to: "tauhazmat@gmail.com",
      from: email,
      subject: `Contact Form: ${subject}`,
      message: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
    })

    // In a real implementation, you would send the email here
    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: "tauhazmat@gmail.com",
      from: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    */

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 })
  }
}
