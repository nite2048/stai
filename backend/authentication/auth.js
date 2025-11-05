import express from "express";
import dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
import { getPrismaUserByGithubAuth, getPrismaUserByGoogleAuth } from "../database/db.js";

//TODO use env files for redirect uri shit

dotenv.config({quiet : true});
const router = express.Router();

router.get('/status', async (_req, res) => {
     res.send("Working").status(200)
});

router.get('/github', (_req, res) => {
	const redirectUri = 'http://localhost:3000/auth/github/callback';
	const clientId = process.env.GITHUB_CLIENT_ID;

	const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

	res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
	const code = req.query.code;

	const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
	})
     .then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
     });

	const accessToken = tokenRes.access_token;

	const userRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
	}).then(data => data.json());


	const user = await getPrismaUserByGithubAuth(userRes)
	const payload = { githubId : user.githubId };
     const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET)
     res.redirect(`http://localhost:5173/redirect?token=${token}`);
});


router.get('/google', (req, res) => {
	const redirectUri = 'http://localhost:3000/auth/google/callback';
	const clientId = process.env.GOOGLE_CLIENT_ID;

	const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=offline&prompt=consent`;
	res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
	const code = req.query.code;
	const redirectUri = 'http://localhost:3000/auth/google/callback';

	try {
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
               method: 'POST',
               headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
               body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    code,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
               }),
          }).then((r) => r.json());

     const accessToken = tokenRes.access_token;

     const profileRes = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          { headers: { Authorization: `Bearer ${accessToken}` } }
     ).then((r) => r.json());

     const user = await getPrismaUserByGoogleAuth(profileRes)
	const payload = { googleId : user.googleId };
     const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET)
     res.redirect(`http://localhost:5173/redirect?token=${token}`);

	} catch (err) {
          console.error('Google OAuth Error:', err);
          res.send('Google login failed');
     }
});

export default router
