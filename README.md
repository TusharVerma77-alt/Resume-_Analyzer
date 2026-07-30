# LLM ATS Resume Analyzer

A modular, extensible, and visually modern **LLM-Powered ATS Resume Analyzer & Job Matcher** application built with React, TypeScript, Vite, TailwindCSS, and multi-provider LLM integrations (Google Gemini, OpenAI GPT-4o, and local deterministic ATS engine).

---

## Extensibility & Natural Language Modifications Prompt

The codebase is built according to the following extensibility prompt:

---

### Extensibility & Natural Language Modifications

The codebase must be designed to be modular, maintainable, and easily extensible. Future changes should require minimal code modifications. Organize the project into reusable components, services, utility functions, configuration files, and separate company/role keyword databases.

The application should make it easy to add or modify:

* Companies and their ATS keyword weightings
* Job roles and skill requirements
* ATS scoring rules and weights
* Resume analysis prompts
* Dashboard widgets and visualizations
* UI themes, layouts, and animations
* Supported file formats
* LLM providers (OpenAI, Gemini, Claude, etc.)
* Additional resume sections and analytics

The project should be structured so that future requests can be described in plain English and implemented without major refactoring. Examples include:

* "Add a circular ATS score gauge."
* "Add JP Morgan and Deloitte to the company list."
* "Support multiple resume uploads for comparison."
* "Add resume version history."
* "Show keyword match percentages by section."
* "Generate interview questions based on the resume."
* "Export the report as PDF."
* "Add LinkedIn profile analysis."
* "Support multiple languages."
* "Add recruiter mode."
* "Integrate GitHub profile analysis."
* "Add resume-to-job description comparison."
* "Display missing ATS keywords grouped by category."
* "Add authentication using Clerk or Auth.js."
* "Store analysis history in a database."

The implementation should prioritize clean architecture, reusable components, strong typing with TypeScript, and comprehensive documentation so that new features can be added quickly by simply describing the desired functionality in plain English.

---

## Key Features

- **Circular ATS Score Gauge & Grade System**: S, A, B, C, D, F grading based on custom company weights.
- **Company ATS Database**: Pre-configured keyword categories and scoring weights for tech & finance giants (Google, JP Morgan, Deloitte, Amazon, Microsoft).
- **Resume vs Job Description Side-by-Side Comparison**: Direct keyword extraction from raw JD text and overlap matching.
- **Missing Keywords Grouped by Category**: Visual priority chips highlighting exact tech & domain gaps.
- **Tailored Interview Preparation**: AI-generated technical/behavioral interview questions based on resume gaps.
- **Offline & Multi-LLM Engine**: Multi-provider support (Google Gemini, OpenAI, and local fallback ATS Scorer).
- **Audit Report Exporting**: Download detailed text audit reports.

---

## Local Development & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TusharVerma77-alt/Resume-_Analyzer.git
   cd Resume-_Analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```
