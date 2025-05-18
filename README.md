# ZvertexAGI

ZvertexAGI is an AI-powered job application platform that auto-applies to tech jobs for users, leveraging ZOHA (formerly ZGPT) Prompt Engineering and Llama 3.1. It supports OTP verification, real-time job fetching, resume parsing, and automated job applications every 30 minutes. The platform is inspired by TechFetch and integrates with https://www.zvertex.com/.

## Features
1. **User Authentication**: OTP-based signup/login with email verification.
2. **Subscription Plans**:
   - **Student**: 1 resume, 10 submissions/day.
   - **Recruiter**: 5 resumes, 50 submissions/day.
   - **Business**: 10 resumes, 100 submissions/day, up to 3 recruiter accounts.
3. **AI Job Matching**: Matches jobs using Adzuna and Indeed APIs based on resume skills.
4. **ZOHA Copilot**: AI-driven career advice in English and Telugu.
5. **Resume Parsing**: Server-side parsing of PDF/DOCX files using pdf-parse and mammoth.
6. **Automated Applications**: Applies to jobs every 30 minutes using Puppeteer.
7. **Job Tracker**: Tracks application history with Excel export.
8. **Daily Emails**: Summarizes daily applications.
9. **TechFetch-Inspired UI**: Professional landing page with sidebar navigation.
10. **Scalable Deployment**: Backend on Render, frontend on Netlify.
11. **Health Checks**: Keep-alive endpoint to prevent Render sleep.
12. **Multi-Language Support**: English and Telugu for ZOHA interactions.
13. **Contact Us**: Email-based inquiry form.
14. **Forgot/Reset Password**: Secure password recovery.
15. **Interview FAQs**: Resources for interview preparation.
16. **AI Projects**: Showcases AI-driven career tools.
17. **Prompt Engineering**: Optimized prompts for Llama 3.1.
18. **Agenetic AI**: Intelligent job matching agents.

## Project Structure