export async function sendEmail(env, msg) {
  if (!env.SENDGRID_API_KEY) {
    console.log('SENDGRID_API_KEY not set; skipping email send:', msg.subject, '->', msg.to);
    return;
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: msg.to }] }],
      from: { email: msg.from },
      subject: msg.subject,
      content: [{ type: 'text/html', value: msg.html }]
    })
  });

  if (!res.ok) {
    console.error('SendGrid send failed', res.status, await res.text());
  }
}
