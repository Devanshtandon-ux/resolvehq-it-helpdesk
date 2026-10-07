import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthenticatedRequest } from '../middleware/auth';

export const aiRouter = Router();

// Initialize Gemini client with proper user-agent header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. General IT Copilot Chat
aiRouter.post('/chat', async (req: AuthenticatedRequest, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...(Array.isArray(history)
            ? history.slice(-6).map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(h.text || h.content || '') }],
              }))
            : []),
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction:
            'You are ResolveHQ AI Copilot, a senior IT Systems and Help Desk engineer. You assist employees with troubleshooting software, hardware, networks, VPN, credentials, and devices. Provide clear, step-by-step diagnostic checklists with markdown formatting. If the problem requires physical intervention or administrative elevation, politely recommend submitting a ticket.',
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || 'I analyzed your request, but could not produce a response.',
        poweredBy: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini chat error, using expert fallback:', err?.message || err);
    }
  }

  // Graceful rule-based intelligent fallback if API key is not present or offline
  const lower = message.toLowerCase();
  let fallbackReply = `**Resolution Checklist for your request:**\n\n1. **Verify Connectivity**: Confirm that your device is connected to the primary corporate network (or VPN).\n2. **Check Authentication**: Ensure SSO session tokens are refreshed or clear your browser cache.\n3. **Restart Service**: If an application or peripheral is frozen, perform a graceful process restart.\n4. **Escalate**: If the issue persists, click **"+ New Ticket"** in the sidebar so an IT engineer can assist directly.`;

  if (lower.includes('vpn') || lower.includes('network') || lower.includes('wifi') || lower.includes('internet')) {
    fallbackReply = `**Network & VPN Diagnostic Guide:**\n\n1. Check your connection to the corporate Wi-Fi or home router.\n2. Disconnect and reconnect your GlobalProtect / OpenVPN client.\n3. Ensure your local DNS resolution is operational: run \`dscacheutil -flushcache\` (macOS) or \`ipconfig /flushdns\` (Windows).\n4. If handshake fails with error 403/timeout, submit an IT ticket with your IP address.`;
  } else if (lower.includes('password') || lower.includes('login') || lower.includes('sso') || lower.includes('mfa') || lower.includes('2fa')) {
    fallbackReply = `**Identity & Access Resolution:**\n\n1. Visit the company Okta/Google Workspace SSO portal directly.\n2. Verify that your authenticator app time is synchronized.\n3. Clear cookies for the identity provider domain.\n4. If your account is locked out after multiple attempts, submit an **Access** category ticket for rapid reset.`;
  } else if (lower.includes('monitor') || lower.includes('display') || lower.includes('screen') || lower.includes('macbook')) {
    fallbackReply = `**Hardware & Display Troubleshooting:**\n\n1. Unplug the USB-C / Thunderbolt dock and reconnect firmly.\n2. In System Settings > Displays, toggle resolution to Default, then back to 4K.\n3. Test the cable on an alternate port.\n4. If hardware damage is suspected, request an IT hardware swap.`;
  }

  res.json({
    reply: fallbackReply,
    poweredBy: 'resolvehq-expert-engine',
  });
});

// 2. Incident Root Cause Analysis & Diagnostic Suggestions for Tickets
aiRouter.post('/diagnose', async (req: AuthenticatedRequest, res) => {
  const { title, description, category, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Ticket title is required' });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze this IT Help Desk incident:
Title: ${title}
Category: ${category || 'General'}
Priority: ${priority || 'Normal'}
Description: ${description || 'No description provided'}

Provide a structured technical analysis.`,
        config: {
          systemInstruction:
            'You are ResolveHQ Incident Intelligence AI. Analyze the IT ticket and return a JSON object with properties: "summary" (string), "probableCause" (string), "steps" (array of 3-4 strings for agent/user resolution), "recommendedReply" (professional message draft to the ticket requester), and "estimatedMinutes" (number). Respond strictly in valid JSON format.',
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        diagnostic: {
          summary: parsed.summary || `Technical triage for "${title}"`,
          probableCause: parsed.probableCause || 'Environmental or configuration anomaly',
          steps: Array.isArray(parsed.steps) ? parsed.steps : ['Verify device logs', 'Check dependency health', 'Validate credentials'],
          recommendedReply: parsed.recommendedReply || `Hello, we are investigating your report regarding "${title}". Please stand by while we verify telemetry.`,
          estimatedMinutes: parsed.estimatedMinutes || 25,
        },
        poweredBy: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini diagnosis error, using expert rule engine:', err?.message || err);
    }
  }

  // Fallback intelligent diagnostic
  res.json({
    diagnostic: {
      summary: `Automated assessment for ${category || 'IT'} incident: ${title}`,
      probableCause: `Configuration drift or temporary service latency in ${category || 'target subsystem'}`,
      steps: [
        'Review recent deployment change logs and audit records',
        'Verify service daemon uptime and local system logs',
        'Execute standard connectivity check and credential re-issuance',
        'Confirm resolution with ticket author',
      ],
      recommendedReply: `Hi there, our IT engineering team has reviewed your ticket regarding "${title}". We have begun diagnostics and will keep you posted on progress.`,
      estimatedMinutes: priority === 'urgent' ? 15 : priority === 'high' ? 30 : 60,
    },
    poweredBy: 'resolvehq-expert-engine',
  });
});

// 3. AI Enhance & Categorize for Ticket Creation
aiRouter.post('/enhance-ticket', async (req: AuthenticatedRequest, res) => {
  const { rawText } = req.body;

  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'rawText is required' });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Given this user report for an IT helpdesk: "${rawText}"
Format and optimize it for a professional IT ticket.`,
        config: {
          systemInstruction:
            'You are ResolveHQ IT intake assistant. Return a JSON object with: "title" (concise, clear technical headline, max 60 chars), "description" (well-structured with observed behavior and steps to reproduce), "category" (must be one of: "hardware", "software", "network", "access", "security", "other"), "priority" (must be one of: "urgent", "high", "medium", "low"), and "reasoning" (brief 1-sentence why this priority/category was selected). Respond strictly in valid JSON format.',
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        enhanced: {
          title: parsed.title || rawText.slice(0, 50),
          description: parsed.description || rawText,
          category: parsed.category || 'software',
          priority: parsed.priority || 'medium',
          reasoning: parsed.reasoning || 'Categorized based on incident text keywords.',
        },
        poweredBy: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini enhance ticket error, fallback:', err?.message || err);
    }
  }

  // Fallback heuristic classification
  const lower = rawText.toLowerCase();
  let category = 'software';
  let priority = 'medium';

  if (lower.includes('macbook') || lower.includes('monitor') || lower.includes('keyboard') || lower.includes('charger') || lower.includes('laptop')) {
    category = 'hardware';
  } else if (lower.includes('wifi') || lower.includes('vpn') || lower.includes('network') || lower.includes('dns') || lower.includes('internet')) {
    category = 'network';
  } else if (lower.includes('permission') || lower.includes('password') || lower.includes('login') || lower.includes('access') || lower.includes('okta')) {
    category = 'access';
  } else if (lower.includes('breach') || lower.includes('phishing') || lower.includes('malware') || lower.includes('hack') || lower.includes('leak')) {
    category = 'security';
    priority = 'urgent';
  }

  if (lower.includes('urgent') || lower.includes('down') || lower.includes('critical') || lower.includes('outage') || lower.includes('broken')) {
    priority = 'urgent';
  } else if (lower.includes('slow') || lower.includes('error') || lower.includes('cannot work')) {
    priority = 'high';
  }

  res.json({
    enhanced: {
      title: rawText.length > 50 ? `${rawText.slice(0, 47)}...` : rawText,
      description: `User reported issue:\n${rawText}\n\nTroubleshooting requested from IT support team.`,
      category,
      priority,
      reasoning: `Auto-detected ${category} category based on report content.`,
    },
    poweredBy: 'resolvehq-expert-engine',
  });
});
