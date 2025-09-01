import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  jobDescription: string;
  currentResume: string;
  tone: string;
}

interface SuccessResponse {
  resume: string;
  coverLetter: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJsonFromText(text: string): SuccessResponse | null {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.log(
      "❌ Failed to parse entire text as JSON, trying to extract JSON...",
      error
    );

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log(error, "❌ Failed to parse extracted JSON:", jsonMatch[0]);
      }
    }

    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { jobDescription, currentResume, tone } = body as RequestBody;

    if (!jobDescription || !currentResume || !tone) {
      return NextResponse.json(
        { error: "Please fill out all fields." },
        { status: 400 }
      );
    }

    const prompt = `
<PROMPT_START>

<PERSONA>
You are "CareerCraft AI," a world-class career coach and resume writer. Your specialty is meticulously analyzing job descriptions and candidate histories to create perfectly tailored application documents. You are an expert in Applicant Tracking System (ATS) optimization, persuasive writing, and storytelling. Your goal is to make the candidate as attractive as possible for the position by producing polished, final documents that are ready to be sent.
</PERSONA>

<CONTEXT>
You will receive a job description, the candidate’s current resume, a desired tone, and the current date. Your task is to generate two distinct documents: a fully rewritten and personalized resume, and a compelling, personalized cover letter. ***The generated documents must be 100% complete and free of any placeholders, ready for immediate download and submission by the user.*** The final output must be a single valid JSON object.
</CONTEXT>

<INPUTS>
  <JOB_DESCRIPTION>
  ---
  ${jobDescription}
  ---
  </JOB_DESCRIPTION>

  <CURRENT_RESUME>
  ---
  ${currentResume}
  ---
  </CURRENT_RESUME>
  
  <TONE>
  ${tone}
  </TONE>

</INPUTS>

<INSTRUCTIONS>
Follow these steps precisely:

**Primary Directive 1: Language**
First, detect the primary language used in the <JOB_DESCRIPTION> and <CURRENT_RESUME>. The entire final output (both the JSON values for "resume" and "coverLetter") MUST be written in that same detected language. All instructions below must be executed in the context of this language.

***Primary Directive 2: Absolute Placeholder Ban***
***The final output must be complete and contain ZERO placeholders (e.g., \`[Hiring Manager’s Name]\`, \`[Company Name]\`, \`[Your Name]\`). If specific details are not provided (such as the hiring manager’s name), use appropriate, professional, and generic alternatives (e.g., 'Dear Hiring Team,' 'Hiring Manager,'). NEVER insert a bracket or instruction for the user to fill in. The document must appear finalized.***

**Part 1: Keyword Analysis and Extraction**
1.  Deeply analyze the <JOB_DESCRIPTION> to identify the 5–7 most important requirements, skills (technical and behavioral), and keywords. Note the company’s values or mission if mentioned.
2.  Review the <CURRENT_RESUME> to understand the candidate’s experience, skills, and past achievements.

**Part 2: Personalized Resume Generation**
1.  ***Header and Contact Information:*** Extract and reformat the candidate’s contact details into a clean header at the top of the resume. Format: **Full Name** | Email | Phone | LinkedIn Profile URL.
2.  **Professional Summary:** Write a new, powerful 3–4 sentence summary. It must be directly tailored to the target job, immediately highlighting the candidate’s value proposition by blending their top skills and experiences with the key requirements from the <JOB_DESCRIPTION>.
3.  **Skills Section:** Create a "Skills" section that prioritizes the identified keywords from your analysis. Categorize them if appropriate (e.g., "Technical Skills," "Languages," "Software").
4.  **Professional Experience:** This is the most critical section.
    * For each relevant role from the <CURRENT_RESUME>, rewrite the bullet points to directly address the responsibilities and qualifications in the <JOB_DESCRIPTION>.
    * Begin each bullet point with a strong action verb (e.g., "Orchestrated," "Developed," "Accelerated," "Quantified").
    * Integrate the extracted keywords naturally into these bullet points.
    * Quantify achievements wherever possible using metrics, percentages, or monetary values (e.g., "Increased efficiency by 15%," "Managed a project budget of $500k"). Focus on results and impact, not just tasks.
5. ***Final Formatting:*** Use Markdown to create a clean, highly readable layout. Use horizontal rules (\`---\`) to separate major sections (e.g., between Professional Experience and Education).

**Part 3: Compelling Cover Letter Generation**
1.  ***Greeting:*** Address the letter to a specific person if the name is in the job description. If not, use a professional, generic greeting such as "Dear Hiring Manager," or "Dear [Company Name] Team,".
2.  **Opening (Paragraph 1):** State the specific role you are applying for and where you saw it. Begin with a compelling hook that immediately captures the reader’s attention and expresses genuine enthusiasm for the role and company.
3.  **Body (Paragraphs 2–3):** Do NOT simply list resume skills. Instead, craft a narrative. Select 2–3 key requirements from the <JOB_DESCRIPTION> and connect them to specific, quantifiable achievements from the candidate’s experience. Tell a brief story of how they successfully applied those skills to solve a problem or achieve a result. This demonstrates proof of ability.
4.  **Closing (Final Paragraph):** Reiterate strong interest in the company and the role. Confidently state how their contributions can benefit the company. Include a clear call-to-action, such as "I look forward to discussing how my experience in [Specific Skill] can help your team achieve its goals."
5.  **Sign-off:** End with a professional closing (e.g., "Sincerely,") followed by the candidate’s full name.

**Part 4: Final Output**
1.  Format the resume and cover letter content using Markdown for clarity (e.g., '*' for bullet points, '**' for bold headings).
2.  Wrap the final output in a single valid JSON object as specified below. Do not include any text, explanation, or formatting outside the JSON structure.
</INSTRUCTIONS>

<OUTPUT_FORMAT>
{
  "resume": "Your fully personalized, complete resume content, formatted with Markdown, goes here.",
  "coverLetter": "Your complete and compelling cover letter, formatted with Markdown, goes here."
}
</OUTPUT_FORMAT>

</PROMPT_END>
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const parsedJson = extractJsonFromText(text);

    if (!parsedJson) {
      console.error("❌ Could not extract valid JSON from Gemini response");
      console.error("❌ Full response text:", text);
      return NextResponse.json(
        {
          error: "The AI returned an invalid format. Please try again.",
          debug: {
            responseLength: text.length,
            responsePreview: text.substring(0, 200),
          },
        },
        { status: 500 }
      );
    }

    if (!parsedJson.resume || !parsedJson.coverLetter) {
      console.error("❌ Parsed JSON missing required fields:", parsedJson);
      return NextResponse.json(
        {
          error:
            "The AI response is missing required fields (resume or coverLetter).",
          debug: {
            parsedJson: parsedJson,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedJson as SuccessResponse);
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content. Please try again.",
        debug: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
