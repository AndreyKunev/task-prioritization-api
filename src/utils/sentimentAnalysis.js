import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const analyzeSentiment = async (text) => {
	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [
				{
					role: 'system',
					content:
						'Analyze the sentiment of the following text and provide a numerical score from -1 to 1. -1 is very negative, 0 is neutral, 1 is very positive. Precision of the score should be up to two decimals places.',
				},
				{ role: 'user', content: text },
			],
			temperature: 0,
		});

		return response.choices[0].message.content.trim();
	} catch (error) {
		console.error('Error analyzing sentiment:', error);
		return 'Unknown';
	}
};
