# Henka Convert — Privacy Policy & Trust Model

**Tagline:** Convert anything, locally. Your data is your own.

At Henka Convert, privacy is not an afterthought; it is the core architectural principle. This document outlines how your data is handled across different tiers of the application.

## Core Principle
**What can be processed locally, stays local.** We only use a server when the conversion task is too resource-intensive or technically infeasible to run inside a web browser.

---

## Data Handling by Tier

### Tier A — 100% Local (Anonymous)
*Applies to: Image conversions, basic PDF manipulation, CSV/JSON, ZIP, basic OCR, and basic DOCX reading.*

- **Zero Server Contact:** Your files never leave your device. The conversion is performed entirely within your web browser using WebAssembly (WASM) and JavaScript.
- **No Analytics on Content:** We do not track the contents of your files, their names, or the results of the conversion.
- **Verifiable:** You can verify this behavior by inspecting your browser's network tab or using the app entirely offline after the initial load.

### Tier B — Server-Assisted (Anonymous)
*Applies to: Heavy document conversions (DOCX/PPTX to PDF), Video transcoding, RAR creation, CAD formats, advanced OCR.*

- **Explicit Consent:** Before a Tier B conversion begins, the application will explicitly inform you that the file needs to be uploaded to our server for processing.
- **Ephemeral Storage Only:** Files uploaded to the server are written to an ephemeral, temporary directory (`internal/storage/ephemeral`).
- **Immediate Deletion:** As soon as the conversion is complete and the result is streamed back to you, both the original file and the converted result are immediately and permanently deleted from the server.
- **No Persistent Storage:** We do not keep backups, logs, or hashes of your file contents.
- **Rate Limiting:** To prevent abuse, we use IP addresses or anonymous session tokens to enforce rate limits. This data is not tied to your identity.

### Tier C — Authenticated Features (Optional)
*Applies to: Users who choose to create an account for advanced features like batch processing, priority queue, or saved history.*

- **Opt-In Only:** Account creation is strictly optional. All Tier A and Tier B features remain available to anonymous users.
- **Data Stored:** If you create an account, we store your login credentials (securely hashed) and, if you explicitly opt-in, a history of your conversions for your convenience.
- **Control:** You have full control over your saved history and can delete it or your entire account at any time.

---

## Open Source and Self-Hosting
Trust is built on transparency. The entire Henka Convert stack (both frontend and backend) is open source. 
- You can inspect the source code to verify that our privacy claims are true.
- If your organization has strict compliance requirements, you can self-host the entire application (using our Docker containers) to ensure data never leaves your internal network.
