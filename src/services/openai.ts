import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = 'asst_tz2fx98J0eqc3oyTchLsHetj';

interface Feedback {
  text: string;
  author: string;
  role: string;
}

export async function generateFeedback(quote: string, author: string): Promise<Feedback[]> {
  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Please provide 4 different feedback responses to this quote: "${quote}" by ${author}. Each feedback should include the author's name and role. The output must be a JSON array with fields: author_name, author_description, comment.`
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Run ${runStatus.status}`);
      }
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const messageContent = lastMessage.content[0];
    if (messageContent.type !== 'text') {
      throw new Error('Unexpected message content type');
    }

    // Parse the JSON response
    let feedbacks: Feedback[] = [];
    try {
      // Estrai la prima occorrenza di un array JSON dalla risposta
      const match = messageContent.text.value.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found in response');
      const json = JSON.parse(match[0]);
      feedbacks = json.map((item: any) => ({
        author: item.author_name,
        role: item.author_description,
        text: item.comment
      }));
    } catch (e) {
      throw new Error('Failed to parse feedback JSON');
    }

    return feedbacks;
  } catch (error) {
    // Silenzio l'errore per evitare log in console
    throw error;
  }
}

function parseFeedbacks(text: string): Feedback[] {
  // Remove any introductory text before the actual feedbacks
  let cleanedText = text.replace(/^Certainly!.*?responses to the.*?\n*/i, '');
  cleanedText = cleanedText.replace(/^Sure!.*?responses to the.*?\n*/i, '');
  cleanedText = cleanedText.replace(/^Here are four.*?responses to the.*?\n*/i, '');
  
  // Split the text into individual feedback entries and remove any empty lines
  const feedbackEntries = cleanedText.split('\n\n')
    .filter(entry => entry.trim())
    // Filter out any entry that non sembra un feedback
    .filter(entry => {
      const firstLine = entry.split('\n')[0];
      return firstLine.includes(',') && firstLine.includes(':');
    })
    // Take only the first 4 feedbacks
    .slice(0, 4);
  
  return feedbackEntries.map(entry => {
    // First line contains the author and role
    const lines = entry.split('\n');
    const [authorLine, ...feedbackLines] = lines;
    
    // Extract author and role from the first line (e.g., "Laura Settebellezze, mentore di consapevolezza:")
    const [author, role] = authorLine.split(',').map(s => s.trim());
    const cleanAuthor = author
      .replace(':', '')
      .replace(/^\d+\.\s*\**/, '') // Remove numbered prefix and asterisks
      .replace(/^['"]|['"]$/g, '') // Remove quotes at start/end if present
      .replace(/\*+/g, '') // Remove all asterisks
      .trim();
    const cleanRole = role
      ?.replace(':', '')
      .replace(/^['"]|['"]$/g, '') // Remove quotes at start/end if present
      .replace(/\*+/g, '') // Remove all asterisks
      .trim() || '';

    // Clean the feedback text: prendi tutto quello che segue la prima riga, anche se non ci sono due righe
    let cleanText = feedbackLines.join(' ').trim();
    // Se il testo è ancora vuoto, prova a prendere tutto dopo i due punti nella riga autore/ruolo
    if (!cleanText) {
      const afterColon = authorLine.split(':').slice(1).join(':').trim();
      if (afterColon) cleanText = afterColon;
    }
    cleanText = cleanText.replace(/^['"]|['"]$/g, '');
    // Rimuovo eventuali frasi introduttive rimaste
    cleanText = cleanText.replace(/^Sure!.*?responses to the.*?$/i, '').replace(/^Certainly!.*?responses to the.*?$/i, '').replace(/^Here are four.*?responses to the.*?$/i, '').trim();

    return {
      author: cleanAuthor,
      role: cleanRole,
      text: cleanText
    };
  });
} 