const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "AIzaSyCO7vPere2D1laCK44W3UT3uSaWJ642-AA"

export async function generateLegalResponse(prompt: string): Promise<string> {
  try {
    console.log("Sending request to Gemini API with prompt:", prompt.substring(0, 50) + "...")

    // Using the correct model name and adding detailed logging
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a legal assistant providing helpful information about law-related questions. 
                  Provide accurate, concise, and helpful information. 
                  If you're unsure about something, acknowledge the limitations of your knowledge.
                  
                  User question: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    console.log("API response status:", response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("API response not OK:", response.status, response.statusText, errorData)

      // Fall back to a predefined response for common legal questions
      return getFallbackResponse(prompt)
    }

    const data = await response.json()
    console.log("Received response from Gemini API:", JSON.stringify(data).substring(0, 200) + "...")

    if (data.candidates && data.candidates.length > 0 && data.candidates[0]?.content?.parts?.length > 0) {
      return data.candidates[0].content.parts[0].text || "No text content found in the response."
    } else if (data.promptFeedback?.blockReason) {
      console.warn("Response blocked:", data.promptFeedback.blockReason)
      return getFallbackResponse(prompt)
    } else {
      console.error("Unexpected API response structure:", JSON.stringify(data).substring(0, 500))
      return getFallbackResponse(prompt)
    }
  } catch (error) {
    console.error("Error generating legal response:", error)
    return getFallbackResponse(prompt)
  }
}

// Provide fallback responses for common legal questions
function getFallbackResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes("tenant") || lowerPrompt.includes("landlord") || lowerPrompt.includes("rent")) {
    return `As a tenant, you generally have several important rights:

1. The right to a habitable living space
2. Protection against illegal discrimination
3. The right to privacy and protection against unreasonable entry by the landlord
4. The right to get your security deposit back (minus legitimate deductions)
5. Protection against retaliatory actions by your landlord

Specific tenant rights vary by location, so it's important to check your local and state laws for more detailed information.`
  }

  if (lowerPrompt.includes("divorce")) {
    return `The general process for filing for divorce typically involves:

1. Meeting residency requirements in your state
2. Filing a petition for divorce with your local court
3. Serving divorce papers to your spouse
4. Negotiating or litigating issues like property division, child custody, and support
5. Finalizing the divorce through a settlement agreement or court judgment

Divorce laws vary significantly by state, so consulting with a family law attorney in your area is highly recommended.`
  }

  if (lowerPrompt.includes("will") || lowerPrompt.includes("estate")) {
    return `Creating a will typically involves these steps:

1. Decide what property to include and who will receive it
2. Choose an executor to manage your estate
3. Select guardians for any minor children
4. Write the will (either with an attorney, online service, or on your own)
5. Sign the will in front of witnesses (usually 2-3 depending on state law)
6. Store the will in a safe place and inform your executor of its location

For complex estates or specific concerns, consulting with an estate planning attorney is recommended.`
  }

  if (lowerPrompt.includes("accident") || lowerPrompt.includes("car crash")) {
    return `After a car accident, you should:

1. Ensure safety and call for medical help if needed
2. Report the accident to police
3. Exchange information with other drivers (insurance, contact info, license plates)
4. Document the scene with photos and notes
5. Notify your insurance company
6. Seek medical attention even if injuries seem minor
7. Consider consulting with a personal injury attorney before accepting any settlement

Time limits for filing claims vary by state, so acting promptly is important.`
  }

  if (lowerPrompt.includes("business") || lowerPrompt.includes("company") || lowerPrompt.includes("startup")) {
    return `Starting a small business typically involves:

1. Researching your business idea and creating a business plan
2. Choosing a business structure (sole proprietorship, LLC, corporation, etc.)
3. Registering your business name and obtaining necessary licenses and permits
4. Getting an EIN (Employer Identification Number) from the IRS
5. Opening business bank accounts and setting up accounting systems
6. Obtaining necessary insurance
7. Setting up your physical or online presence

Requirements vary by location and industry, so check with local, state, and federal agencies for specific requirements.`
  }

  // Default fallback response
  return `I apologize, but I'm currently unable to access my knowledge base for specific legal information on this topic. 

Here are some general suggestions:

1. Consult with a qualified attorney who specializes in this area of law
2. Check government websites for official information
3. Contact legal aid organizations if you need affordable legal assistance
4. Look for reputable legal information websites like FindLaw or Nolo

Remember that legal situations are often complex and can vary significantly based on jurisdiction and specific circumstances.`
}
