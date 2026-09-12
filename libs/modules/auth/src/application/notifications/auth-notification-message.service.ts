/**
 * Builds provider-neutral SMS and email messages for auth verification flows.
 * Used backward by AuthWorkflowService; connects forward to the future notification provider
 * without coupling auth to an SMS gateway, email vendor, or notification database.
 */
import { Injectable } from '@nestjs/common';

export type AuthNotificationChannel = 'sms' | 'email';

export interface AuthOtpNotificationMessage {
  channel: AuthNotificationChannel;
  destination: string;
  purpose: string;
  challengeId: string;
  expiresAt: Date;
  templateKey: string;
  subject?: string;
  text: string;
  html?: string;
}

/**
 * Keeps all auth message wording in one place so registration, login, and recovery stay consistent.
 */
@Injectable()
export class AuthNotificationMessageService {
  public buildOtpMessage(input: {
    channel: AuthNotificationChannel;
    destination: string;
    purpose: string;
    challengeId: string;
    code: string;
    expiresAt: Date;
  }): AuthOtpNotificationMessage {
    const expiresInMinutes = Math.max(
      1,
      Math.ceil((input.expiresAt.getTime() - Date.now()) / 60000),
    );
    const templateKey = this.templateKey(input.channel, input.purpose);

    if (input.channel === 'sms') {
      return {
        channel: input.channel,
        destination: input.destination,
        purpose: input.purpose,
        challengeId: input.challengeId,
        expiresAt: input.expiresAt,
        templateKey,
        text: this.smsText(input.purpose, input.code, expiresInMinutes),
      };
    }

    const subject = this.emailSubject(input.purpose);
    const text = this.emailText(input.purpose, input.code, expiresInMinutes);
    return {
      channel: input.channel,
      destination: input.destination,
      purpose: input.purpose,
      challengeId: input.challengeId,
      expiresAt: input.expiresAt,
      templateKey,
      subject,
      text,
      html: this.emailHtml(subject, input.code, expiresInMinutes),
    };
  }

  private templateKey(channel: AuthNotificationChannel, purpose: string): string {
    const knownPurpose = [
      'login_phone',
      'registration_phone',
      'password_reset_phone',
      'verify_email',
      'password_reset_email',
    ].includes(purpose);
    return `${channel}.${knownPurpose ? purpose : 'generic_otp'}`;
  }

  private smsText(purpose: string, code: string, expiresInMinutes: number): string {
    const action =
      purpose === 'login_phone'
        ? 'log in'
        : purpose === 'registration_phone'
          ? 'complete your registration'
          : 'reset your password';
    return `Healthcare Platform: Use ${code} to ${action}. This code expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'}. Do not share it with anyone.`;
  }

  private emailSubject(purpose: string): string {
    return purpose === 'verify_email'
      ? 'Verify your Healthcare Platform email address'
      : 'Reset your Healthcare Platform password';
  }

  private emailText(purpose: string, code: string, expiresInMinutes: number): string {
    const intro =
      purpose === 'verify_email'
        ? 'Use the verification code below to verify your Healthcare Platform email address.'
        : 'Use the verification code below to continue resetting your Healthcare Platform password.';
    return `Hello,\n\n${intro}\n\nVerification code: ${code}\n\nThis code expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? '' : 's'}. Do not share this code with anyone. If you did not request this, you can safely ignore this email.\n\nRegards,\nHealthcare Platform Security Team`;
  }

  private emailHtml(subject: string, code: string, expiresInMinutes: number): string {
    const safeSubject = this.escapeHtml(subject);
    const safeCode = this.escapeHtml(code);
    const minuteLabel = `minute${expiresInMinutes === 1 ? '' : 's'}`;
    return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937"><h2>${safeSubject}</h2><p>Use the verification code below to continue your request.</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${safeCode}</p><p>This code expires in ${expiresInMinutes} ${minuteLabel}. Do not share this code with anyone.</p><p>If you did not request this, you can safely ignore this email.</p><p>Regards,<br>Healthcare Platform Security Team</p></div>`;
  }

  private escapeHtml(value: string): string {
    return value.replace(
      /[&<>'"]/g,
      (character) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ??
        character,
    );
  }
}
