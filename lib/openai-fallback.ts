// This is a fallback implementation using predefined responses
// In a production environment, you would integrate with OpenAI or another provider

export async function generateFallbackResponse(prompt: string): Promise<string> {
  console.log("Using fallback response generator for prompt:", prompt)

  // Wait a moment to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // Simple keyword matching for common legal questions
  const lowerPrompt = prompt.toLowerCase()

  // Tenant rights
  if (lowerPrompt.includes("tenant") || lowerPrompt.includes("landlord") || lowerPrompt.includes("rent")) {
    return `As a tenant, you generally have several important rights:

1. The right to a habitable living space
2. Protection against illegal discrimination
3. The right to privacy and protection against unreasonable entry by the landlord
4. The right to get your security deposit back (minus legitimate deductions)
5. Protection against retaliatory actions by your landlord

However, tenant rights vary significantly by location. For specific advice about your situation, you should consult with a local attorney who specializes in landlord-tenant law.`
  }

  // Divorce
  if (lowerPrompt.includes("divorce") || lowerPrompt.includes("separation") || lowerPrompt.includes("custody")) {
    return `The divorce process typically involves these general steps:

1. Filing a petition for divorce
2. Serving your spouse with divorce papers
3. Negotiating issues like property division, child custody, and support
4. Finalizing the divorce through settlement or court judgment

Divorce laws vary by state, and the process can be complex depending on your circumstances. It's advisable to consult with a family law attorney to understand the specific requirements in your jurisdiction.`
  }

  // Wills and estate planning
  if (
    lowerPrompt.includes("will") ||
    lowerPrompt.includes("estate") ||
    lowerPrompt.includes("inheritance") ||
    lowerPrompt.includes("testament")
  ) {
    return `Creating a will typically involves:

1. Deciding what property to include and who will inherit
2. Choosing an executor to carry out your wishes
3. Selecting a guardian for minor children (if applicable)
4. Signing the will in front of witnesses (requirements vary by state)
5. Storing the will in a safe place and informing key people of its location

While simple wills can sometimes be created using online templates, consulting with an estate planning attorney is recommended, especially for complex situations or larger estates.`
  }

  // Car accidents
  if (
    lowerPrompt.includes("accident") ||
    lowerPrompt.includes("car crash") ||
    lowerPrompt.includes("collision") ||
    lowerPrompt.includes("insurance claim")
  ) {
    return `After a car accident, you should:

1. Ensure safety and call for medical help if needed
2. Report the accident to police
3. Exchange information with other drivers (insurance, contact info)
4. Document the scene with photos and notes
5. Notify your insurance company
6. Seek medical attention, even for minor injuries
7. Consider consulting with a personal injury attorney before accepting any settlement

The specific requirements for reporting accidents vary by state, so be sure to check your local laws.`
  }

  // Business formation
  if (
    lowerPrompt.includes("business") ||
    lowerPrompt.includes("company") ||
    lowerPrompt.includes("startup") ||
    lowerPrompt.includes("llc") ||
    lowerPrompt.includes("corporation")
  ) {
    return `Starting a small business typically involves:

1. Conducting market research and creating a business plan
2. Choosing a business structure (LLC, corporation, etc.)
3. Registering your business name
4. Obtaining necessary licenses and permits
5. Setting up business banking and accounting systems
6. Understanding tax obligations
7. Getting appropriate insurance

Each state has different requirements for business formation. Consulting with a business attorney and accountant early in the process can help you avoid common pitfalls.`
  }

  // Employment law
  if (
    lowerPrompt.includes("employee") ||
    lowerPrompt.includes("employer") ||
    lowerPrompt.includes("workplace") ||
    lowerPrompt.includes("fired") ||
    lowerPrompt.includes("discrimination") ||
    lowerPrompt.includes("harassment")
  ) {
    return `Employment law covers many aspects of the employer-employee relationship. Key areas include:

1. Workplace discrimination and harassment protections
2. Wage and hour laws (minimum wage, overtime)
3. Family and medical leave
4. Workplace safety regulations
5. Wrongful termination
6. Employment contracts and non-compete agreements

If you believe your employment rights have been violated, consider consulting with an employment attorney who can evaluate your specific situation.`
  }

  // Criminal law
  if (
    lowerPrompt.includes("criminal") ||
    lowerPrompt.includes("arrest") ||
    lowerPrompt.includes("charged") ||
    lowerPrompt.includes("crime") ||
    lowerPrompt.includes("defense")
  ) {
    return `If you're facing criminal charges or have been arrested:

1. Remember you have the right to remain silent
2. Ask to speak with an attorney immediately
3. Don't make any statements to police without your attorney present
4. Gather information about your case, but don't discuss it with others
5. Attend all court appearances

Criminal charges can have serious consequences. It's crucial to work with an experienced criminal defense attorney who can protect your rights throughout the legal process.`
  }

  // Immigration
  if (
    lowerPrompt.includes("immigration") ||
    lowerPrompt.includes("visa") ||
    lowerPrompt.includes("citizenship") ||
    lowerPrompt.includes("green card") ||
    lowerPrompt.includes("deportation")
  ) {
    return `Immigration law is complex and frequently changes. Common immigration pathways include:

1. Family-based immigration
2. Employment-based immigration
3. Humanitarian programs (asylum, refugee status)
4. Diversity visa lottery
5. Naturalization (becoming a U.S. citizen)

Immigration processes often involve extensive paperwork, strict deadlines, and specific requirements. Working with an immigration attorney can help navigate these complexities and improve your chances of a successful outcome.`
  }

  // Intellectual property
  if (
    lowerPrompt.includes("copyright") ||
    lowerPrompt.includes("trademark") ||
    lowerPrompt.includes("patent") ||
    lowerPrompt.includes("intellectual property") ||
    lowerPrompt.includes("ip")
  ) {
    return `Intellectual property (IP) law protects creative works and innovations:

1. Copyright: Protects original creative works (writing, music, art, software)
2. Trademark: Protects brands, logos, and slogans that identify products or services
3. Patent: Protects inventions and new technologies
4. Trade Secret: Protects confidential business information

The process for securing IP protection varies by type. For example, copyright exists automatically upon creation, while patents require a detailed application process. An IP attorney can help determine the best protection strategy for your specific situation.`
  }

  // Default response for other questions
  return `Thank you for your question about "${prompt}".

While I'd like to provide specific legal information, I can only offer general guidance on common legal topics. For accurate legal advice tailored to your situation, I recommend:

1. Consulting with a qualified attorney who specializes in this area of law
2. Checking resources from your state or local bar association
3. Visiting legal aid websites for general information

Remember that legal advice should be tailored to your specific situation and jurisdiction, as laws vary significantly by location.`
}
