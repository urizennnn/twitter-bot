import { TwitterApi } from 'twitter-api-v2'
import util from 'util'
import { Request, Response } from 'express'

declare module 'express-session' {
	interface SessionData {
		codeVerifier: string;
		state: string;
	}
}

const client = new TwitterApi({
	clientId: process.env.TWITTER_CLIENT_ID as string,
	clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
})

export async function getTweets(req: Request, res: Response) {
	try {
		const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
			"http://localhost:3000/callback",
			{
				scope: ['tweet.read', 'users.read', 'offline.access', 'tweet.write'],
				state: 'my-state'
			}
		);
		console.log('Generated URL:', url);
		console.log('Code Verifier:', codeVerifier);
		console.log('State:', state);

		req.session.codeVerifier = codeVerifier;
		req.session.state = state;

		res.redirect(url);
	} catch (error) {
		console.error('Error in getTweets:', error);
		res.status(500).send('Authentication error');
	}
}

export async function handleCallback(req: Request, res: Response) {
	try {
		const { state, code } = req.query;
		console.log(`${code}`);
		const storedState = req.session.state;
		const codeVerifier = req.session.codeVerifier;

		if (!codeVerifier || !state || !storedState || !code) {
			return res.status(400).send('You denied the app or your session expired!');
		}
		if (state !== storedState) {
			return res.status(400).send('Stored tokens didnt match!');
		}

		const {
			client: loggedClient,
			accessToken,
			refreshToken
		} = await client.loginWithOAuth2({
			code: code as string,
			codeVerifier,
			redirectUri: 'http://localhost:3000/callback'
		});

		// Here you can use loggedClient to make authenticated requests
		// For example:
		const user = await loggedClient.v2.me();

		res.json({ message: 'Authentication successful!', user });
	} catch (error) {
		console.error(util.inspect(error, { depth: null }));
		res.status(500).send('Authentication error');
	}
}
