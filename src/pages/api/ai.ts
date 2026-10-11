import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from './_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Error: Method not allowed' });
  }

  // 1. STRICT ENV VALIDATION
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("AI ERROR: GROQ_API_KEY environment variable is missing.");
    return res.status(500).json({ reply: 'Error: GROQ_API_KEY environment variable is missing.' });
  }

  const { message, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: 'Error: A valid message string is required.' });
  }
  
  if (context !== 'web' && context !== 'social') {
    return res.status(400).json({ reply: 'Error: Invalid context provided.' });
  }

  try {
    // 2. FETCH STRICTLY FROM NEONDB BASED ON CONTEXT
    const lowerMessage = message.toLowerCase();
    const needsContact = ['contact', 'reach', 'social', 'instagram', 'github', 'linkedin', 'phone', 'email', 'number', 'call', 'whatsapp'].some(word => lowerMessage.includes(word));

    let projects: any[] = [];
    let social: any[] = [];
    
    if (context === 'web') {
      projects = await sql`
        SELECT title, description, project_link 
        FROM web_projects 
        WHERE is_published = true AND (category = 'web' OR category IS NULL OR category = '')
      `;
    } else if (context === 'social') {
      projects = await sql`
        SELECT title, description, project_link 
        FROM web_projects 
        WHERE is_published = true AND category = 'social'
      `;
    }

    if (needsContact) {
      social = await sql`SELECT name, url FROM social_links WHERE is_published = true AND is_deleted = false`;
    }

    // 3. BUILD CLEAN SHORT CONTEXT
    let systemContext = '';
    
    if (context === 'web') {
      systemContext = `
You are Shofar-X AI Assistant.

Your job is to answer questions about Shofar-X's Website Development services and the specific web projects listed below.
If the user asks about a particular project from the list, provide the details.

IMPORTANT FORMATTING RULES:
- Use bullet points and short paragraphs.
- DO NOT use markdown tables.
- Keep answers very brief, clean, and conversational.

Do NOT mention social media or personal portfolio.

If data not available:
Say "This information is not available yet."

--- SHOFAR-X CONTACT INFO ---
${needsContact && social.length > 0 ? social.map(s => `- ${s.name}: ${s.url}`).join('\n') : ''}

--- SHOFAR-X WEB PROJECTS ---

${projects.length > 0 ? projects.map(p => `- ${p.title}: ${p.description || 'No description'}. (Link: ${p.project_link || 'N/A'})`).join('\n') : 'No projects available.'}
      `;
    } else if (context === 'social') {
      systemContext = `
You are Shofar-X AI Assistant.

Your job is to answer questions about Shofar-X's Social Media Marketing services and the specific SMM case studies listed below.
If the user asks about a particular campaign or case study, provide the details.

IMPORTANT FORMATTING RULES:
- Use bullet points and short paragraphs.
- DO NOT use markdown tables.
- Keep answers very brief, clean, and conversational.

Do NOT mention website development.

If data not available:
Say "This information is not available yet."

--- SHOFAR-X CONTACT INFO ---
${needsContact && social.length > 0 ? social.map(s => `- ${s.name}: ${s.url}`).join('\n') : ''}

--- SHOFAR-X SMM CASE STUDIES ---

${projects.length > 0 ? projects.map(p => `- ${p.title}: ${p.description || 'No description'}. (Link: ${p.project_link || 'N/A'})`).join('\n') : 'No case studies available.'}
      `;
    }

    // 4. MODEL SELECTION
    const model = (process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim();
    if (!model) {
      throw new Error("GROQ_MODEL is missing or invalid");
    }

    // 5. CALL GROQ
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemContext.trim() },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.warn("Groq API notice:", errorText);
      return res.status(200).json({ reply: getSmartFallbackReply(message, context, projects, social) });
    }

    const data = await groqResponse.json();
    const reply = (data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning || '').trim();

    if (!reply) {
      return res.status(200).json({ reply: getSmartFallbackReply(message, context, projects, social) });
    }

    return res.status(200).json({ reply });

  } catch (err: unknown) {
    console.error("AI ERROR:", err);
    return res.status(200).json({ reply: getSmartFallbackReply(message, context, [], []) });
  }
}

function getSmartFallbackReply(message: string, context: 'web' | 'social', projects: any[], _social: any[]): string {
  const m = message.toLowerCase();

  // Contact / Reach out
  if (['contact', 'reach', 'email', 'phone', 'call', 'talk', 'hire', 'whatsapp', 'instagram', 'message'].some(w => m.includes(w))) {
    return "You can get in touch with our team through the contact form below or reach us directly at info@shofarx.com. We'd love to discuss your project!";
  }

  // Projects / Portfolio / Work
  if (['project', 'work', 'portfolio', 'case', 'built', 'examples'].some(w => m.includes(w))) {
    if (context === 'web') {
      const sample = projects.length > 0 
        ? projects.slice(0, 3).map(p => `• **${p.title}**: ${p.description || 'Custom web solution.'}`).join('\n')
        : '• **PRIZZ0**: Mobile grocery & delivery application platform.\n• **GoodsGaadi**: Commercial vehicle discovery marketplace.\n• **TETCYEE**: High-converting e-commerce footwear platform.';
      return `Here are some of our featured Web Development projects:\n\n${sample}\n\nYou can see our complete work in the Projects section above!`;
    } else {
      const sample = projects.length > 0 
        ? projects.slice(0, 3).map(p => `• **${p.title}**: ${p.description || 'Targeted growth campaign.'}`).join('\n')
        : '• **ComplaintBox**: Community promotion & audience engagement.\n• **GoodsGaadi**: Organic video reach & commercial vehicle promotion.\n• **Royal Collection**: Fashion apparel campaign and reels.';
      return `Here are some of our highlighted Social Media & Video campaigns:\n\n${sample}\n\nExplore our case studies in the portfolio section!`;
    }
  }

  // Services / What do you do
  if (['service', 'offer', 'what do you do', 'help', 'feature', 'build', 'create'].some(w => m.includes(w))) {
    if (context === 'web') {
      return "At Shofar-X Web Development, we engineer high-converting landing pages, full-scale custom web applications, e-commerce stores, and high-performance digital systems designed to help your brand dominate.";
    } else {
      return "At Shofar-X Social Media, we specialize in viral short-form video production (Reels/TikTok), end-to-end social media growth, property showcase promotions, and paid ad acquisition.";
    }
  }

  // Pricing / Cost
  if (['price', 'pricing', 'cost', 'quote', 'rate', 'budget'].some(w => m.includes(w))) {
    return "Our pricing depends on the scale and specific requirements of your project. Check out our packages in the pricing section or request a custom quote using the contact form below!";
  }

  // Default greeting / overview
  return context === 'web'
    ? "Hello! I am the Shofar-X Web Concierge. I can answer questions about our web development projects, technologies, and services. What would you like to know?"
    : "Hello! I am the Shofar-X Social Concierge. I can tell you about our video production, brand campaigns, and growth strategies. How can I help you today?";
}


