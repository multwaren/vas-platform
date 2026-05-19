# VAS Platform

Modern VAS (Value Added Services) management platform developed with:

- Frontend: Next.js
- Backend: Spring Boot
- Database: Oracle SQL
- Containerization: Docker

This project provides a full-stack infrastructure for managing telecom/VAS services, subscriber operations, reporting, and service purchase/cancel workflows.

---

# Project Architecture

```text
vas_case_study/
│
├── database/
│   ├── schema.sql
│   ├── sequences.sql
│   └── produce.sql
│
├── vas-fronted/
│   ├── app/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── vas-platform-backend/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
└── Dockercompose.yml
