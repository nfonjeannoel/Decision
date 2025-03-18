import OpenAI from 'openai';

// Initialize the OpenAI client
// IMPORTANT: The API key should be stored in an environment variable, not hardcoded
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This should be set in .env.local file
  dangerouslyAllowBrowser: false, // Only use this client server-side
});

// Function to refine decision title and description
export async function refineDecision(title: string, description: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users refine their decision frameworks. Your task is to take their initial title and description and improve them for clarity, focus, and completeness."
        },
        {
          role: "user", 
          content: `I'm making a decision with the following information:
                   Title: ${title}
                   Description: ${description}
                   
                   Please refine both the title and description to be more clear, concise, and focused.
                   Return a JSON object with a refined title and description.
                   Format: {title: string, description: string}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"title": "", "description": ""}');
  } catch (error) {
    console.error('Error refining decision:', error);
    // Return the original title and description if the API call fails
    return { title, description };
  }
}

// Function to get factor suggestions based on decision type
export async function getSuggestedFactors(decisionType: string, customDescription?: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users make better decisions. Your task is to suggest relevant factors they should consider for their specific decision type."
        },
        {
          role: "user", 
          content: `I'm trying to make a ${decisionType} decision${customDescription ? `: ${customDescription}` : ''}. 
                   What are the most important factors I should consider? 
                   Please return a JSON array of 6-8 factors, each with a name, description, and suggested weight (1-5).
                   Format: [{id: string, name: string, description: string, weight: number}]`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"factors": []}').factors;
  } catch (error) {
    console.error('Error getting factor suggestions:', error);
    // Return some default factors if the API call fails
    return [];
  }
}

// Function to analyze options against factors
export async function analyzeOptions(decision: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users analyze their decision options. Provide insightful analysis based on their factors and options."
        },
        {
          role: "user",
          content: `I'm deciding between these options: ${JSON.stringify(decision.options)}
                   Based on these factors: ${JSON.stringify(decision.factors)}
                   Please provide a brief analysis of the strengths and weaknesses of each option.
                   Return a JSON object with insights for each option.
                   Format: {insights: {optionId: {strengths: string[], weaknesses: string[], recommendation: string}}}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"insights": {}}').insights;
  } catch (error) {
    console.error('Error analyzing options:', error);
    return {};
  }
}

// Function to generate personalized decision explanations
export async function generateExplanation(decision: any, topOption: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users understand their decisions. Provide clear, thoughtful explanations for their decision outcomes."
        },
        {
          role: "user",
          content: `Based on my decision data: ${JSON.stringify(decision)}
                   The top recommended option is: ${JSON.stringify(topOption)}
                   Please explain in 2-3 paragraphs why this option is recommended based on my priorities.
                   Also include 1-2 considerations or potential drawbacks to be mindful of.`
        }
      ],
      temperature: 0.7,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating explanation:', error);
    return '';
  }
}

// Function to suggest optimal weights for factors
export async function suggestFactorWeights(title: string, description: string, factors: any[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users determine the appropriate weights for decision factors. Your task is to analyze their decision context and the factors they've identified, then suggest appropriate weights (1-5) for each factor."
        },
        {
          role: "user", 
          content: `I'm making a decision with the following information:
                   Title: ${title}
                   Description: ${description}
                   Factors: ${JSON.stringify(factors)}
                   
                   Please suggest appropriate weights (1-5) for each factor based on its likely importance to this specific decision.
                   Return a JSON array of factors with updated weights.
                   Format: {factors: [{id: string, name: string, weight: number}]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"factors": []}');
  } catch (error) {
    console.error('Error suggesting factor weights:', error);
    // Return the original factors if the API call fails
    return { factors: factors.map(f => ({ id: f.id, name: f.name, weight: f.weight })) };
  }
}

// Function to suggest ratings for options
export async function suggestOptionRatings(title: string, description: string, factors: any[], options: any[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users evaluate their options against factors. Your task is to analyze the decision context and suggest plausible ratings (1-5) for each option against each factor."
        },
        {
          role: "user", 
          content: `I'm making a decision with the following information:
                   Title: ${title}
                   Description: ${description}
                   Factors: ${JSON.stringify(factors)}
                   Options: ${JSON.stringify(options)}
                   
                   Please suggest plausible ratings (1-5) for each option against each factor.
                   For each rating, 1 is poor and 5 is excellent.
                   Return a JSON object with options that include ratings for each factor.
                   Format: {options: [{id: string, name: string, ratings: {factorId: number}}]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"options": []}');
  } catch (error) {
    console.error('Error suggesting option ratings:', error);
    // Return the original options if the API call fails
    return { options };
  }
}

// Function to suggest a single new factor that is not already in the list
export async function suggestNewFactor(decisionType: string, description: string, title: string, existingFactors: string[] = []) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users identify important factors for their decision. Your task is to suggest ONE new factor that they haven't already considered."
        },
        {
          role: "user", 
          content: `I'm making a ${decisionType} decision:
                   Title: ${title}
                   Description: ${description}
                   
                   I've already considered these factors:
                   ${existingFactors.join(', ')}
                   
                   Please suggest ONE new important factor I should consider that's not in my list.
                   Return a JSON object with a single factor including name, description, and suggested weight (1-5).
                   Format: {factor: {name: string, description: string, weight: number}}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"factor": null}');
  } catch (error) {
    console.error('Error suggesting new factor:', error);
    return { factor: null };
  }
}

// Function to suggest new option names based on decision context
export async function suggestOptions(title: string, description: string, factors: any[], count: number = 2) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping users generate relevant options for their decision. Your task is to suggest specific, contextually appropriate options based on the decision details."
        },
        {
          role: "user", 
          content: `I'm making a decision with the following information:
                   Title: ${title}
                   Description: ${description}
                   Factors I'm considering: ${JSON.stringify(factors)}
                   
                   Please suggest ${count} specific, realistic options that are directly relevant to my decision context.
                   Give each option a clear, descriptive name that reflects a real choice I might consider.
                   Return a JSON array of options with names only.
                   Format: {options: [{name: string}]}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });
    
    return JSON.parse(response.choices[0].message.content || '{"options": []}');
  } catch (error) {
    console.error('Error suggesting options:', error);
    // Return empty options array if the API call fails
    return { options: [] };
  }
} 