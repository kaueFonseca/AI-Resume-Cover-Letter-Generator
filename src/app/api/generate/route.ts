import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Define the expected shape of the data coming from the frontend
interface RequestBody {
  jobDescription: string;
  currentResume: string;
  tone: string;
}

// Define the shape of a successful response
interface SuccessResponse {
  resume: string;
  coverLetter: string;
}

// Initialize the Gemini AI model
// It's safe to use a non-null assertion (!) here because we expect this to be set in our environment.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("genAI - ", genAI);
console.log("model - ", model);

// Helper function to extract JSON from text
function extractJsonFromText(text: string): SuccessResponse | null {
  try {
    // First, try to parse the entire text as JSON
    return JSON.parse(text);
  } catch (error) {
    console.log(
      "❌ Failed to parse entire text as JSON, trying to extract JSON..."
    );

    // Try to find JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.log("❌ Failed to parse extracted JSON:", jsonMatch[0]);
      }
    }

    // If no JSON found, return null
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log("🔥 API foi chamada! Método: POST");

  try {
    const body = await request.json();
    console.log("📥 Body:", body);

    // Type assertion for the request body
    const { jobDescription, currentResume, tone } = body as RequestBody;
    console.log("📥 Request body recebido:", body);

    if (!jobDescription || !currentResume || !tone) {
      return NextResponse.json(
        { error: "Please fill out all fields." },
        { status: 400 }
      );
    }

    const prompt = `
      <PROMPT_START>
      
      <PERSONA>
      You are "CareerCraft AI," a world-class career coach and professional resume writer. Your expertise lies in meticulously analyzing job descriptions and candidate histories to create perfectly tailored application documents. You are an expert in Applicant Tracking Systems (ATS) optimization, persuasive writing, and storytelling. Your goal is to make the candidate the most compelling applicant for the role.
      </PERSONA>

      <CONTEXT>
      You will be provided with a job description, a candidate's current resume, and a desired tone. Your task is to generate two distinct documents: a completely rewritten, tailored resume and a compelling, personalized cover letter. The final output must be a single, valid JSON object.
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

      **Primary Directive: Language**
      First, detect the primary language used in the <JOB_DESCRIPTION> and <CURRENT_RESUME>. The entire final output (both the "resume" and "coverLetter" JSON values) MUST be written in that same detected language. For example, if the inputs are in Brazilian Portuguese, the output must also be in Brazilian Portuguese. All instructions below should be executed in the context of this detected language.


      **Part 1: Analysis & Keyword Extraction**
      1.  Deeply analyze the <JOB_DESCRIPTION> to identify the top 5-7 core requirements, skills (hard and soft), and keywords. Note the company's values or mission if mentioned.
      2.  Review the <CURRENT_RESUME> to understand the candidate's experience, skills, and past achievements.

      **Part 2: Tailored Resume Generation**
      1.  **Contact Information, Education, Certifications:** Retain these sections from the <CURRENT_RESUME> but ensure formatting is clean and professional.
      2.  **Professional Summary:** Write a new, powerful 3-4 sentence summary. It must be tailored directly to the target role, immediately highlighting the candidate's value proposition by blending their top skills and experience with the key requirements from the <JOB_DESCRIPTION>.
      3.  **Skills Section:** Create a "Skills" section that prioritizes keywords identified during your analysis. Categorize them if appropriate (e.g., "Technical Skills," "Languages," "Software").
      4.  **Professional Experience:** This is the most critical section.
          * For each relevant position from the <CURRENT_RESUME>, rewrite the bullet points to directly address the responsibilities and qualifications in the <JOB_DESCRIPTION>.
          * Start every bullet point with a strong action verb (e.g., "Orchestrated," "Engineered," "Accelerated," "Quantified").
          * Integrate the keywords you extracted naturally into these bullet points.
          * Quantify achievements wherever possible using metrics, percentages, or dollar amounts (e.g., "Increased efficiency by 15%," "Managed a $500k project budget"). Focus on results and impact, not just duties.
          * Ensure the most relevant experience is emphasized and detailed.

      **Part 3: Compelling Cover Letter Generation**
      1.  **Format:** Structure the cover letter into 3-4 concise paragraphs. It must be engaging and professional, reflecting the specified <TONE>.
      2.  **Opening (Paragraph 1):** State the specific job title being applied for and where it was seen. Start with a compelling hook that immediately grabs the reader's attention and expresses genuine enthusiasm for the role and the company.
      3.  **Body (Paragraphs 2-3):** Do NOT simply list skills from the resume. Instead, create a narrative. Select 2-3 key requirements from the <JOB_DESCRIPTION> and connect them to specific, quantifiable achievements from the candidate's experience. Tell a brief story about how they successfully applied those skills to solve a problem or achieve a result. This demonstrates proof of their ability.
      4.  **Closing (Final Paragraph):** Reiterate strong interest in the company and the role. Confidently state how their contributions can benefit the company. Include a clear call to action, such as "I am eager to discuss how my experience in [Specific Skill] can help your team achieve its goals."

      **Part 4: Final Output**
      1.  Format both the resume and cover letter content using Markdown for clarity (e.g., using '*' for bullet points, '**' for bolding headers).
      2.  Enclose the final output in a single, valid JSON object as specified below. Do not include any text, explanations, or formatting outside of the JSON structure.
      </INSTRUCTIONS>

      <OUTPUT_FORMAT>
      {
        "resume": "Your full tailored resume content, formatted with Markdown, goes here.",
        "coverLetter": "Your full compelling cover letter content, formatted with Markdown, goes here."
      }
      </OUTPUT_FORMAT>

      <PROMPT_END>
`;
    console.log("📝 Prompt enviado para Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("📤 Gemini response object:", response);
    console.log("📤 Gemini raw text length:", text.length);
    console.log(
      "📤 Gemini raw text (first 500 chars):",
      text.substring(0, 500)
    );
    console.log(
      "📤 Gemini raw text (last 500 chars):",
      text.substring(text.length - 500)
    );

    // Try to extract JSON from the response
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

    // Validate the parsed JSON has the required fields
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

    console.log("✅ Successfully parsed JSON:", {
      resumeLength: parsedJson.resume.length,
      coverLetterLength: parsedJson.coverLetter.length,
    });

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
