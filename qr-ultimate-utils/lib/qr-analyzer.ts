export type QRType = "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";

export interface QRAnalysis {
  type: QRType;
  displayName: string;
  icon: string;
  data: Record<string, any>;
  rawContent: string;
}

export function analyzeQRCode(content: string): QRAnalysis {
  // URL detection
  if (content.startsWith("http://") || content.startsWith("https://")) {
    return {
      type: "url",
      displayName: "رابط ويب",
      icon: "🌐",
      data: {
        url: content,
        domain: extractDomain(content),
      },
      rawContent: content,
    };
  }

  // WiFi detection
  if (content.startsWith("WIFI:")) {
    const wifiData = parseWiFi(content);
    return {
      type: "wifi",
      displayName: "شبكة WiFi",
      icon: "📶",
      data: wifiData,
      rawContent: content,
    };
  }

  // vCard detection
  if (content.startsWith("BEGIN:VCARD")) {
    const vcardData = parseVCard(content);
    return {
      type: "vcard",
      displayName: "جهة اتصال",
      icon: "👤",
      data: vcardData,
      rawContent: content,
    };
  }

  // Email detection
  if (content.startsWith("mailto:")) {
    const emailData = parseEmail(content);
    return {
      type: "email",
      displayName: "بريد إلكتروني",
      icon: "📧",
      data: emailData,
      rawContent: content,
    };
  }

  // Phone detection
  if (content.startsWith("tel:")) {
    const phoneNumber = content.replace("tel:", "");
    return {
      type: "phone",
      displayName: "رقم هاتف",
      icon: "📞",
      data: {
        phoneNumber: phoneNumber,
      },
      rawContent: content,
    };
  }

  // SMS detection
  if (content.startsWith("smsto:")) {
    const smsData = parseSMS(content);
    return {
      type: "sms",
      displayName: "رسالة نصية",
      icon: "💬",
      data: smsData,
      rawContent: content,
    };
  }

  // Default to text
  return {
    type: "text",
    displayName: "نص",
    icon: "📝",
    data: {
      text: content,
    },
    rawContent: content,
  };
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

function parseWiFi(content: string): Record<string, any> {
  const data: Record<string, any> = {};
  const params = content.replace("WIFI:", "").split(";");

  params.forEach((param) => {
    const [key, value] = param.split(":");
    if (key === "S") data.ssid = value;
    if (key === "P") data.password = value;
    if (key === "T") data.security = value;
    if (key === "H") data.hidden = value === "true";
  });

  return data;
}

function parseVCard(content: string): Record<string, any> {
  const data: Record<string, any> = {};
  const lines = content.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("FN:")) data.name = line.replace("FN:", "");
    if (line.startsWith("TEL:")) data.phone = line.replace("TEL:", "");
    if (line.startsWith("EMAIL:")) data.email = line.replace("EMAIL:", "");
    if (line.startsWith("ORG:")) data.organization = line.replace("ORG:", "");
    if (line.startsWith("ADR:")) data.address = line.replace("ADR:", "");
  });

  return data;
}

function parseEmail(content: string): Record<string, any> {
  const data: Record<string, any> = {};
  const emailContent = content.replace("mailto:", "");
  const [email, params] = emailContent.split("?");

  data.to = email;

  if (params) {
    const searchParams = new URLSearchParams(params);
    data.subject = searchParams.get("subject") || "";
    data.body = searchParams.get("body") || "";
  }

  return data;
}

function parseSMS(content: string): Record<string, any> {
  const data: Record<string, any> = {};
  const smsContent = content.replace("smsto:", "");
  const [number, message] = smsContent.split(":");

  data.number = number;
  data.message = message || "";

  return data;
}

export function formatQRData(analysis: QRAnalysis): string[] {
  const lines: string[] = [];

  switch (analysis.type) {
    case "url":
      lines.push(`الرابط: ${analysis.data.url}`);
      lines.push(`النطاق: ${analysis.data.domain}`);
      break;
    case "wifi":
      lines.push(`اسم الشبكة: ${analysis.data.ssid}`);
      lines.push(`نوع الأمان: ${analysis.data.security || "مفتوح"}`);
      if (analysis.data.password) {
        lines.push(`كلمة المرور: ${analysis.data.password}`);
      }
      break;
    case "vcard":
      if (analysis.data.name) lines.push(`الاسم: ${analysis.data.name}`);
      if (analysis.data.phone) lines.push(`الهاتف: ${analysis.data.phone}`);
      if (analysis.data.email) lines.push(`البريد: ${analysis.data.email}`);
      if (analysis.data.organization) lines.push(`المؤسسة: ${analysis.data.organization}`);
      break;
    case "email":
      lines.push(`إلى: ${analysis.data.to}`);
      if (analysis.data.subject) lines.push(`الموضوع: ${analysis.data.subject}`);
      if (analysis.data.body) lines.push(`الرسالة: ${analysis.data.body}`);
      break;
    case "phone":
      lines.push(`الهاتف: ${analysis.data.phoneNumber}`);
      break;
    case "sms":
      lines.push(`الرقم: ${analysis.data.number}`);
      if (analysis.data.message) lines.push(`الرسالة: ${analysis.data.message}`);
      break;
    case "text":
      lines.push(analysis.data.text);
      break;
  }

  return lines;
}
