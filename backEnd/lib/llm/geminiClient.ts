import { ApiError } from "@/lib/errors/apiError";

type GeminiGenerateContentRequest = {
  contents: Array<{
    role?: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : undefined;
}

function baseUrl(): string {
  return env("GEMINI_API_BASE_URL") ?? "https://generativelanguage.googleapis.com/v1beta";
}

function modelName(): string {
  return env("GEMINI_MODEL") ?? "gemini-1.5-flash";
}

export function hasGeminiKey(): boolean {
  return Boolean(env("GEMINI_API_KEY"));
}

function extractText(resp: GeminiGenerateContentResponse): string {
  const text =
    resp.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") ?? "";
  return text;
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

export async function geminiGenerateJson<TJson>(prompt: string, opts?: { timeoutMs?: number }): Promise<TJson> {
  const apiKey = env("GEMINI_API_KEY");
  if (!apiKey) {
    throw new ApiError("INTERNAL_SERVER_ERROR", "Gemini API key is not configured.", 500);
  }

  const timeoutMs = opts?.timeoutMs ?? 3500;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const reqBody: GeminiGenerateContentRequest = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 512
      }
    };

    const url = `${baseUrl()}/models/${encodeURIComponent(modelName())}:generateContent`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(reqBody),
      signal: ctrl.signal
    });

    const json = (await resp.json().catch(() => null)) as GeminiGenerateContentResponse | null;
    if (!resp.ok) {
      // Do not leak upstream details; keep demo-safe.
      throw new ApiError("ANALYSIS_FAILED", "Analysis phrasing service returned an error.", 500);
    }
    if (!json) {
      throw new ApiError("ANALYSIS_FAILED", "Analysis phrasing service returned an invalid response.", 500);
    }

    const text = extractText(json);
    const raw = extractFirstJsonObject(text);
    if (!raw) {
      throw new ApiError("ANALYSIS_FAILED", "Analysis phrasing service did not return JSON.", 500);
    }

    return JSON.parse(raw) as TJson;
  } finally {
    clearTimeout(timer);
  }
}

