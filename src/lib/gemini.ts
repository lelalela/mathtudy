export type AiTutorMode = 'guide' | 'full';

const GEMINI_API_KEY_STORAGE = 'mathtudy_gemini_api_key';
const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-3.8-flash';

export function getGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GEMINI_API_KEY_STORAGE);
}

export function setGeminiApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
}

export function removeGeminiApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GEMINI_API_KEY_STORAGE);
}

interface RequestGeminiParams {
  apiKey: string;
  unit: string;
  title: string;
  questionText: string;
  questionLatex: string;
  choices?: string[];
  correctAnswer?: string;
  mode: AiTutorMode;
}

export interface AiTutorResponse {
  text: string;
  modelUsed: string;
}

export async function askGeminiTutor({
  apiKey,
  unit,
  title,
  questionText,
  questionLatex,
  choices,
  correctAnswer,
  mode,
}: RequestGeminiParams): Promise<AiTutorResponse> {
  const isGuide = mode === 'guide';

  const systemInstruction = isGuide
    ? `당신은 수학을 어려워하고 포기하고 싶어하는 학생을 돕는 세상에서 가장 친절하고 따뜻한 1:1 수학 과외 선생님입니다.
[매우 중요한 절대 규칙]
1. 최종 정답(어떤 보기 선지가 답인지, 최종 계산 결과 숫자가 무엇인지)을 절대 스포일러하지 마세요!
2. 학생이 스스로 끝까지 풀어볼 수 있도록 용기를 북돋아 주며 다음 3단계로만 안내하세요:
   - 1단계 [문제 파악]: 이 문제가 실생활이나 쉬운 비유로 무엇을 뜻하는지 1~2줄로 설명
   - 2단계 [첫 단추 꿰기]: 어떤 개념/공식을 떠올려야 하는지, 시작점을 어디로 잡을지 안내
   - 3단계 [길잡이 힌트]: 첫 번째 식을 어떻게 세우면 되는지만 살짝 보여주고, 마지막 계산은 학생에게 맡기기
3. 수식은 화면에서 깨지지 않도록 반드시 KaTeX 형식(인라인은 $...$, 독립 블록은 $$...$$)으로 감싸서 작성하세요.
4. 구어체(~해요, ~해볼까요?)로 다정하게 작성하세요.`
    : `당신은 수학을 어려워하는 학생을 돕는 세상에서 가장 친절하고 상세한 1:1 수학 과외 선생님입니다.
[해설 작성 규칙]
1. 맨 위에 최종 정답이 무엇인지 먼저 명확하게 알려주세요.
2. 학생이 '아! 이래서 이렇게 되는구나'하고 무릎을 칠 수 있도록, 중간 계산(괄호 풀기, 부호 반전, 통분, 약분)을 한 줄도 생략하지 말고 모두 단계별로 풀어서 보여주세요.
3. '왜 이렇게 계산하는지'에 대해 양팔 저울이나 피자 같은 쉬운 비유와 원리를 꼭 덧붙여주세요.
4. 마지막에는 '여기서 많은 학생들이 저지르는 흔한 실수'를 한 줄 짚어주세요.
5. 수식은 반드시 KaTeX 형식(인라인은 $...$, 독립 블록은 $$...$$)으로 감싸서 작성하세요.
6. 친절하고 따뜻한 어투(~해요, ~랍니다)로 작성하세요.`;

  const choicesText = choices && choices.length > 0 ? `선택지: ${choices.join(', ')}` : '';
  const answerContext = !isGuide && correctAnswer ? `\n(참고: 문제의 정답은 ${correctAnswer} 입니다.)` : '';

  const userPrompt = `[단원]: ${unit} > ${title}
[문제 설명]: ${questionText}
[문제 수식]: $$${questionLatex}$$
${choicesText}${answerContext}

위 문제에 대해 ${isGuide ? '정답 스포일러 없이 스스로 풀 수 있게 단계별 길잡이 힌트' : '처음부터 끝까지 생략 없는 상세하고 친절한 풀이'}를 작성해 주세요.`;

  // Helper to make API request to a specific model
  const callModel = async (model: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
      throw new Error('Gemini로부터 응답 내용을 받아오지 못했습니다.');
    }

    return candidate;
  };

  // Try primary model (gemini-3.5-flash-lite) first
  try {
    const text = await callModel(PRIMARY_MODEL);
    return { text, modelUsed: PRIMARY_MODEL };
  } catch (primaryErr) {
    console.warn(`[Gemini] ${PRIMARY_MODEL} 호출 실패, ${FALLBACK_MODEL}로 폴백 시도합니다:`, primaryErr);

    // Fallback to gemini-3.8-flash
    try {
      const text = await callModel(FALLBACK_MODEL);
      return { text, modelUsed: FALLBACK_MODEL };
    } catch (fallbackErr) {
      console.error(`[Gemini] ${FALLBACK_MODEL} 호출도 실패했습니다:`, fallbackErr);
      const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
      throw new Error(`AI 호출 실패: ${msg}`);
    }
  }
}
