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
    console.log("❌ Failed to parse entire text as JSON, trying to extract JSON...");
    
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
      As an expert career coach and professional resume writer, your task is to generate two documents based on the provided information: a tailored resume and a compelling cover letter.

      The tone of both documents should be: ${tone}.

      **Provided Job Description:**
      ---
      ${jobDescription}
      ---

      **Provided Current Resume:**
      ---
      ${currentResume}
      ---

      **Instructions:**
      1.  **Tailored Resume:** Analyze the job description for key skills, qualifications, and responsibilities. Rewrite the "Experience" section of the current resume to highlight how the candidate's skills and achievements match these requirements. Use strong action verbs and quantify achievements where possible. The summary should be a powerful, short paragraph tailored specifically for this role.
      2.  **Cover Letter:** Write a concise and engaging cover letter (around 3-4 paragraphs). It should directly address the requirements in the job description and connect them to the candidate's experience from the resume. Do not just repeat the resume.

      **IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any other text, explanations, or formatting outside the JSON.**

      **Output Format:**
      {
        "resume": "Your tailored resume content here",
        "coverLetter": "Your cover letter content here"
      }
    `;
    console.log("📝 Prompt enviado para Gemini:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("📤 Gemini response object:", response);
    console.log("📤 Gemini raw text length:", text.length);
    console.log("📤 Gemini raw text (first 500 chars):", text.substring(0, 500));
    console.log("📤 Gemini raw text (last 500 chars):", text.substring(text.length - 500));

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
            responsePreview: text.substring(0, 200)
          }
        },
        { status: 500 }
      );
    }

    // Validate the parsed JSON has the required fields
    if (!parsedJson.resume || !parsedJson.coverLetter) {
      console.error("❌ Parsed JSON missing required fields:", parsedJson);
      return NextResponse.json(
        {
          error: "The AI response is missing required fields (resume or coverLetter).",
          debug: {
            parsedJson: parsedJson
          }
        },
        { status: 500 }
      );
    }

    console.log("✅ Successfully parsed JSON:", {
      resumeLength: parsedJson.resume.length,
      coverLetterLength: parsedJson.coverLetter.length
    });

    return NextResponse.json(parsedJson as SuccessResponse);
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content. Please try again.",
        debug: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
