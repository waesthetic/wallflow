import { Resend } from 'resend'
import { escapeHtml } from './sanitize'

export async function sendEmail({ to, subject, html, replyTo }: {
  to: string,
  subject: string,
  html: string,
  replyTo?: string
}) {
  const config = useRuntimeConfig()
  const resend = new Resend(config.resendApiKey as string)

  await resend.emails.send({
    from: config.emailFrom as string,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  })
}

export function emailVerificationHTML(verifyUrl: string, name: string | null) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="margin:0 0 8px;">Confirm your email</h2>
        <p style="color:#6b7280;margin:0 0 24px;">
          ${name ? `Hello, ${escapeHtml(name)}! ` : ''}The link is valid for 15 minutes.
        </p>
        <div style="text-align:center;margin:0 0 24px;">
          <a href="${verifyUrl}"
            style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">
            Confirm email
          </a>
        </div>
        <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
          If you haven’t registered, please ignore this email.
        </p>
      </div>
    `
}

export function passwordResetHTML(resetUrl: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;">Reset Password</h2>
      <p style="color:#6b7280;margin:0 0 24px;">
        The link is valid for 15 minutes. It becomes invalid after use.
      </p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${resetUrl}"
          style="display:inline-block;background:#18181b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">
          Reset Password
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
        If you did not request a password reset, please ignore this email.
      </p>
    </div>
  `
}

export function oauthAccountHTML() {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;">Sign in to Wallflow</h2>
      <p style="color:#6b7280;margin:0 0 24px;">
        We received a password reset request for this email. However, your account was created using Google or GitHub — it doesn't have a password.
      </p>
      <p style="color:#6b7280;margin:0 0 24px;">
        Please sign in using the same provider you used to register.
      </p>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `
}

export function contactMessageHTML(name: string, email: string, message: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;">New contact message</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Message:</b></p>
      <p>${escapeHtml(message)}</p>
    </div>
  `
}

export function accountDeletionHTML(deleteUrl: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="margin:0 0 8px;">Delete Account</h2>
      <p style="color:#6b7280;margin:0 0 24px;">
        We received a request to permanently delete your Wallflow account. The link is valid for 15 minutes.
      </p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${deleteUrl}"
          style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:500;">
          Delete My Account
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;">
        If you did not request this, please ignore this email. Your account will not be deleted.
      </p>
    </div>
  `
}