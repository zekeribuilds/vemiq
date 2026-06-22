export const AI_PROMPTS = {
  // Stage 1: Log Cleaning
  cleanLogs: (logs: string) => `
You are an academic writing assistant. Clean and structure the following weekly log entries.

Original logs:
${logs}

Instructions:
1. Convert broken English to proper academic English
2. Remove slang and informal language
3. Structure the content with clear technical descriptions
4. Maintain the original meaning and key activities
5. Output as a structured JSON array with: week_number, title, cleaned_description

Output:
`,

  // Stage 2: Context Extraction
  extractContext: (logs: string) => `
You are a technical documentation specialist. Extract key engineering context from these weekly logs.

Weekly logs:
${logs}

Extract and output as JSON:
{
  "tools_used": ["tool1", "tool2"],
  "engineering_processes": ["process1", "process2"],
  "company_info": "brief company description",
  "technical_operations": ["operation1", "operation2"],
  "skills_learned": ["skill1", "skill2"]
}

Output:
`,

  // Stage 3: Section Generation
  introduction: (studentInfo: any, companyInfo: string) => `
You are an academic report writer. Write Chapter 1: Introduction for a ${studentInfo.reportType} report.

Student Information:
- Name: ${studentInfo.fullName}
- Department: ${studentInfo.department}
- University: ${studentInfo.university}
- Company: ${studentInfo.companyName}
- Duration: ${studentInfo.duration}

Company Context:
${companyInfo}

Instructions:
1. Write in formal academic tone
2. Include background of industrial training
3. State objectives of the training
4. Mention the company and department
5. Use Times New Roman, 12pt style formatting in mind
6. Length: 500-700 words

Output:
`,

  companyOverview: (companyName: string, context: string) => `
You are an academic report writer. Write Chapter 2: Company Overview.

Company: ${companyName}
Context: ${context}

Instructions:
1. Write in formal academic tone
2. Include company history and background
3. Describe organizational structure
4. Mention departments and functions
5. Length: 600-800 words

Output:
`,

  activities: (logs: string) => `
You are an academic report writer. Write Chapter 3: Activities Performed based on weekly logs.

Weekly Logs:
${logs}

Instructions:
1. Write in formal academic tone
2. Organize activities chronologically or by department
3. Describe technical work done
4. Include tools and technologies used
5. Length: 800-1000 words

Output:
`,

  challenges: (logs: string) => `
You are an academic report writer. Write Chapter 4: Challenges and Solutions.

Weekly Logs:
${logs}

Instructions:
1. Write in formal academic tone
2. Identify key challenges faced
3. Describe solutions implemented
4. Include lessons learned
5. Length: 500-700 words

Output:
`,

  conclusion: (studentInfo: any, duration: string) => `
You are an academic report writer. Write Chapter 5: Conclusion and Recommendations.

Student: ${studentInfo.fullName}
Duration: ${duration}

Instructions:
1. Write in formal academic tone
2. Summarize the training experience
3. Highlight key achievements
4. Provide recommendations for future students
5. Length: 400-600 words

Output:
`,

  // Stage 4: Editing Prompts
  rewrite: (content: string) => `
Rewrite the following content to improve clarity and flow while maintaining the original meaning:

${content}

Output:
`,

  expand: (content: string) => `
Expand the following content with more detail and examples:

${content}

Output:
`,

  shorten: (content: string) => `
Shorten the following content while maintaining key information:

${content}

Output:
`,

  formalize: (content: string) => `
Convert the following content to formal academic tone:

${content}

Output:
`,

  improveGrammar: (content: string) => `
Improve the grammar and punctuation of the following content:

${content}

Output:
`,
};
