import { NextResponse } from 'next/server';
import { getResend, getFromEmail } from '@/lib/resend';
import { CONTACT_EMAIL } from '@/lib/contact';

/**
 * Envoie un message de contact (page /contact et formulaire d'inscription
 * du Comité d'Entreprise sur /ce) vers la boîte mail de la biscuiterie
 * via Resend.
 *
 * Nécessite la variable d'environnement `RESEND_API_KEY`
 * (voir GUIDE_DEPLOIEMENT.md, Étape 6).
 */
export async function POST(request: Request) {
  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "L'envoi de messages n'est pas encore configuré sur ce site (clé Resend manquante)." },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; phone?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { name, email, phone, subject, message } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Nom, email et message sont requis.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: getFromEmail(),
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: subject || `Nouveau message de ${name} via le site Louvat Box`,
      text: [
        message,
        '',
        '---',
        `Nom : ${name}`,
        `Email : ${email}`,
        phone ? `Téléphone : ${phone}` : null,
      ]
        .filter((line): line is string => Boolean(line))
        .join('\n'),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Erreur Resend (envoi message de contact) :', err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message. Merci de réessayer." },
      { status: 500 }
    );
  }
}
