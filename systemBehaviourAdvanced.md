# INTERVIEW STARTING(sending interview objective and topics)
{
    "interviewObjective":"I have made different projects like Collaborative editor(teamHub). adaptative intelligent interview system(InterviewOS), role based backend infra heavy healthcare project(pulseFlow), AI powered feedback analyzer etc. The problem is I know how I built pipelines, how I added YJS socket.io or RAG but I don't know what to explain when someone asks what is RAG that you used, why CRDTs and not Operational Transforms etc etc..Help me, while sending the next question, also tell me where I get wrong, exactly point at what I make wrong..",
    "topics":["RAG","Socket.io","YJS","Redis","background jobs with BullMQ, queues, workers"]
}

# FIRST QUESTION
{
    "message": "Interview started successfully.",
    "interview": {
        "sessionId": "cmsodr9dd00140nnwfpj5synl",
        "question": "In one of your projects, you implemented Retrieval-Augmented Generation (RAG). Could you walk me through the end-to-end architecture of a RAG pipeline and explain why a team might choose RAG over fine-tuning an LLM for factual, up-to-date knowledge?",
        "topic": "RAG",
        "difficulty": "medium"
    }
}

# ANSWER
{
   "answer": "basically RAG is a concept that involves providing LLM with enough relevant context that the LLM doesn't have to guess things, but actaully have the context required to make reasoning. I used RAG pipeline in my Feedback analyzer as : feedbacks from customers are stored in postgreSQL in embedded format by using pgvector extension. The pipeline focuses that when the adminstrator or analyst wants an overview of the customers sentiments for a particular area, say most common pain point of the customers, then is where the pipeline shows up. The pipeline first normalizes the query the administrator/analyst asked for, removing whitespaces and special characters thereby making it ready for a good embedding, Then the normalized query is embedded using the gemini embeddings-001 model which is then used to analyze and find the nearest and most relevant feedbacks by having cosine similarity and similar search techniques offered by the pgvector extension. Thus retieval of relevant context to feed in LLM is done. Now the LLM is provided with the query alongwith the feedbacks assoicated with the retieved feedback embeddings. This context is structured in a prompt that sets boundaries on how the LLM is supposed to evaluate and make judgements, the response shape it should pack in. Thus the pipeline essentially is : normalize question => search similar vectors using cosine similarity => construct prompt for the LLM with the context => actually prompt the model(gemini-flash-2.0). Now coming to why RAG over fine tuning LLM, LLM are basically Large Language models that predict the next most probabilistic word by loops of embeddings and attention mechanism using the large dataset it is trained upon. The LLM is not supposed to invent answer randomly but stay relevant and so it must be provided with enough relevant context that the word guessing it does, remains in the boundaries of the context and so accurate and factual. This is what RAG essentially is."
}

{
    "interview": {
        "evaluation": {
            "questionNumber": 1,
            "topic": "RAG",
            "score": 6,
            "correctness": 6,
            "strengths": [
                "Clearly explained the query retrieval workflow using PostgreSQL pgvector, Gemini embeddings, and cosine similarity.",
                "Good explanation of prompt structuring to bound the LLM response."
            ],
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning Comparison",
                    "description": "Failed to explicitly compare RAG against fine-tuning in terms of dataset updates, training costs, latency, and knowledge freshness.",
                    "severity": "MEDIUM",
                    "corrected": false
                },
                {
                    "topic": "RAG Ingestion Pipeline",
                    "description": "Omitted the ingestion/chunking side of the RAG architecture, focusing only on query time.",
                    "severity": "LOW",
                    "corrected": false
                }
            ],
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "followUpRequired": true,
            "difficultyAdjustment": "same",
            "interviewerReasoning": "The candidate gave a solid explanation of the retrieval-time pipeline for their project (normalization, vector search with pgvector, context insertion into prompt). However, they missed the ingestion/chunking phase of RAG and did not answer the second part of the question regarding why RAG is chosen over fine-tuning for factual, up-to-date knowledge. A follow-up is necessary to evaluate trade-off analysis skills between RAG and fine-tuning."
        },
        "nextQuestion": "You gave a clear walkthrough of your query-time retrieval pipeline with pgvector. However, you didn't quite address the comparison with fine-tuning. If a system needs access to rapidly changing, factual knowledge, why would a team choose RAG instead of fine-tuning an LLM? What specific challenges occur if you rely on fine-tuning for up-to-date factual data?",
        "topic": "RAG vs Fine-Tuning Trade-offs",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "a9fz34zprqtyamjbd9ybjp3w",
        "role": "user",
        "content": "basically RAG is a concept that involves providing LLM with enough relevant context that the LLM doesn't have to guess things, but actaully have the context required to make reasoning. I used RAG pipeline in my Feedback analyzer as : feedbacks from customers are stored in postgreSQL in embedded format by using pgvector extension. The pipeline focuses that when the adminstrator or analyst wants an overview of the customers sentiments for a particular area, say most common pain point of the customers, then is where the pipeline shows up. The pipeline first normalizes the query the administrator/analyst asked for, removing whitespaces and special characters thereby making it ready for a good embedding, Then the normalized query is embedded using the gemini embeddings-001 model which is then used to analyze and find the nearest and most relevant feedbacks by having cosine similarity and similar search techniques offered by the pgvector extension. Thus retieval of relevant context to feed in LLM is done. Now the LLM is provided with the query alongwith the feedbacks assoicated with the retieved feedback embeddings. This context is structured in a prompt that sets boundaries on how the LLM is supposed to evaluate and make judgements, the response shape it should pack in. Thus the pipeline essentially is : normalize question => search similar vectors using cosine similarity => construct prompt for the LLM with the context => actually prompt the model(gemini-flash-2.0). Now coming to why RAG over fine tuning LLM, LLM are basically Large Language models that predict the next most probabilistic word by loops of embeddings and attention mechanism using the large dataset it is trained upon. The LLM is not supposed to invent answer randomly but stay relevant and so it must be provided with enough relevant context that the word guessing it does, remains in the boundaries of the context and so accurate and factual. This is what RAG essentially is.",
        "metadata": {
            "score": 6,
            "correctness": 6,
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning Comparison",
                    "description": "Failed to explicitly compare RAG against fine-tuning in terms of dataset updates, training costs, latency, and knowledge freshness.",
                    "severity": "MEDIUM",
                    "corrected": false
                },
                {
                    "topic": "RAG Ingestion Pipeline",
                    "description": "Omitted the ingestion/chunking side of the RAG architecture, focusing only on query time.",
                    "severity": "LOW",
                    "corrected": false
                }
            ],
            "strengths": [
                "Clearly explained the query retrieval workflow using PostgreSQL pgvector, Gemini embeddings, and cosine similarity.",
                "Good explanation of prompt structuring to bound the LLM response."
            ],
            "followUpRequired": true
        },
        "createdAt": "2026-08-11T08:31:27.874Z"
    }
}

# ANSWER
{
    "answer":"I don't have idea of fine tuning LLM, can you explain it to me followed by interview progression"
}

# EVALUATION
{
    "interview": {
        "evaluation": {
            "questionNumber": 2,
            "topic": "RAG vs Fine-Tuning Trade-offs",
            "score": 2,
            "correctness": 0,
            "strengths": [
                "Honest acknowledgement of a technical knowledge gap regarding LLM fine-tuning."
            ],
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning Trade-offs",
                    "description": "Lacks conceptual knowledge of LLM fine-tuning and its fundamental trade-offs compared to retrieval-augmented generation.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "followUpRequired": false,
            "difficultyAdjustment": "same",
            "interviewerReasoning": "The candidate explicitly acknowledged not knowing fine-tuning and requested an explanation and topic progression. Since the trade-off competency was sufficiently evaluated with a clear gap identified, a brief conceptual explanation is provided in the transition before moving to a new topic from the candidate's portfolio."
        },
        "nextQuestion": "Fine-tuning modifies an LLM's internal weights by training it on specific datasets, which is computationally expensive and slow when data updates frequently. In contrast, RAG keeps the model weights frozen and retrieves live context from an external database at query time. Moving to your collaborative editor project (TeamHub): why did you choose Conflict-Free Replicated Data Types (CRDTs) with Yjs over Operational Transformation (OT) for real-time document synchronization?",
        "topic": "CRDTs vs Operational Transformation",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "s6o6gumdeyfl6ef4fl5xyial",
        "role": "user",
        "content": "I don't have idea of fine tuning LLM, can you explain it to me followed by interview progression",
        "metadata": {
            "score": 2,
            "correctness": 0,
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning Trade-offs",
                    "description": "Lacks conceptual knowledge of LLM fine-tuning and its fundamental trade-offs compared to retrieval-augmented generation.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "strengths": [
                "Honest acknowledgement of a technical knowledge gap regarding LLM fine-tuning."
            ],
            "followUpRequired": false
        },
        "createdAt": "2026-08-11T08:36:47.891Z"
    }
}

# ANSWER
{
    "answer":"I chose CRDTs over Operational Transforms because OTs could take months building, making me writing a research paper rather than building projects that actually solve real world problem. I am not a researcher nor a tool architect, I am a software engineer that builds systems and not tools. When tools exists that under the hood handles merge conflicts, concurrent edits, I should focus on building something around it and not the same. My primary focus for the project was to create an ecosystem where teams can collaborate seamlessly through teamhub workspaces, collaborate on projects through documents, chats, and files. Building OTs from scratch, writing merge conflict algorithms, choosing the best one would have diverted me from the project goals. Moreover CRDTs are tested, widely accepted system while if I would have built it on my one, considering OTs to be a small part of the project, and not the whole project, my implementation wouldn't have been polished, tested against constraints for performance and reliability as CRDTs have. Therefore I chose CRDTs for my project rahter than manual merge conficts and OTs. This isn't as good answer for an interview, tell me what exactly I should have been answering, with explaining me as well. Now coming to CRDTs, the CRDT is handled by the YJS software that maintains YJS docs, a document that doesn't use convential text based human language wording, rather something like operations { INSERT x, position y}, handles merge conficts, concurrent edits and syncronization. You can get in technical depth of how the system transportation and editor syncronization works."
}

# EVALUATION

{
    "interview": {
        "evaluation": {
            "questionNumber": 3,
            "topic": "CRDTs vs Operational Transformation",
            "score": 4,
            "correctness": 4,
            "strengths": [
                "Clear practical engineering perspective regarding build-vs-buy decisions and leveraging established libraries like Yjs."
            ],
            "mistakes": [
                {
                    "topic": "CRDTs vs Operational Transformation Trade-offs",
                    "description": "Focused heavily on development effort without explaining core technical trade-offs such as central server dependency in OT versus decentralized convergence and memory overhead in CRDTs.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "followUpRequired": true,
            "difficultyAdjustment": "same",
            "interviewerReasoning": "The candidate provided a pragmatic software engineering justification (leveraging open-source Yjs rather than building OT algorithms from scratch), but omitted the core theoretical and architectural trade-offs between CRDTs and OT. A follow-up question is necessary to probe their understanding of state convergence, central server dependencies, and memory trade-offs."
        },
        "nextQuestion": "That practical build-vs-buy perspective makes sense. From an architectural standpoint, how do OT and CRDTs differ regarding central server dependency and memory overhead? For example, why does OT typically require a central server to sequence operations while CRDTs can achieve convergence without one?",
        "topic": "CRDTs vs Operational Transformation",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "ps8c2076uwkrvtvbtjhb9q8k",
        "role": "user",
        "content": "I chose CRDTs over Operational Transforms because OTs could take months building, making me writing a research paper rather than building projects that actually solve real world problem. I am not a researcher nor a tool architect, I am a software engineer that builds systems and not tools. When tools exists that under the hood handles merge conflicts, concurrent edits, I should focus on building something around it and not the same. My primary focus for the project was to create an ecosystem where teams can collaborate seamlessly through teamhub workspaces, collaborate on projects through documents, chats, and files. Building OTs from scratch, writing merge conflict algorithms, choosing the best one would have diverted me from the project goals. Moreover CRDTs are tested, widely accepted system while if I would have built it on my one, considering OTs to be a small part of the project, and not the whole project, my implementation wouldn't have been polished, tested against constraints for performance and reliability as CRDTs have. Therefore I chose CRDTs for my project rahter than manual merge conficts and OTs. This isn't as good answer for an interview, tell me what exactly I should have been answering, with explaining me as well. Now coming to CRDTs, the CRDT is handled by the YJS software that maintains YJS docs, a document that doesn't use convential text based human language wording, rather something like operations { INSERT x, position y}, handles merge conficts, concurrent edits and syncronization. You can get in technical depth of how the system transportation and editor syncronization works.",
        "metadata": {
            "score": 4,
            "correctness": 4,
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "mistakes": [
                {
                    "topic": "CRDTs vs Operational Transformation Trade-offs",
                    "description": "Focused heavily on development effort without explaining core technical trade-offs such as central server dependency in OT versus decentralized convergence and memory overhead in CRDTs.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "strengths": [
                "Clear practical engineering perspective regarding build-vs-buy decisions and leveraging established libraries like Yjs."
            ],
            "followUpRequired": true
        },
        "createdAt": "2026-08-11T09:01:25.118Z"
    }
}

# ANSWER
{
    "answer":"In terms of central server dependencies, OTs ofen require an additional transformation sever as dependency that changes operations when multiple concurrent edit operations hit. On the other hand, YJS stores additional metadata regarding positioning and operations that allows it to merge conficts and concurrent edits deterministically. The additional metadata storage for a temporary lived YDoc inside server in mermory or Redis often leads to memory overhead. The YJS doens't require an additional dependency for sequencing operations because the the operational metadata already contains relevant informations to apply concurrent and conflict free edits deterministically. I am not much informed about OTs and how different are OTs and YJS. could you please explain it to me"
}

# EVALUATION
{
    "interview": {
        "evaluation": {
            "questionNumber": 4,
            "topic": "CRDTs vs Operational Transformation",
            "score": 5,
            "correctness": 5,
            "strengths": [
                "Correctly identified that Yjs and CRDTs embed positional and operation metadata to achieve deterministic state convergence without requiring a central sequencing server.",
                "Recognized that storing CRDT metadata and document history (tombstones) leads to memory overhead in memory or Redis."
            ],
            "mistakes": [
                {
                    "topic": "CRDTs vs Operational Transformation Trade-offs",
                    "description": "Lacks detailed technical understanding of Operational Transformation mechanics, such as central sequence logs and transformation functions.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "followUpRequired": false,
            "difficultyAdjustment": "same",
            "interviewerReasoning": "The candidate accurately identified the core trade-off regarding central sequencing dependency versus memory overhead in CRDTs, while acknowledging a gap in OT mechanics. Because this competency has been sufficiently evaluated across two questions, a brief explanation is provided to address their question before progressing to a new topic."
        },
        "nextQuestion": "To summarize OT vs CRDTs: OT relies on a central server to establish a single global order of operations and run transformation functions (adjusting index positions relative to concurrent edits), keeping client memory lean but creating a server bottleneck. CRDTs like Yjs attach client IDs and logical timestamps to item blocks, building a deterministic tree structure that converges without a central sequencer, though retaining deleted nodes (tombstones) increases memory overhead. Moving to your PulseFlow healthcare project: how did you design the backend database schema and authorization layer to strictly enforce role-based access control (RBAC) across doctors, patients, and admins?",
        "topic": "Backend System Architecture & Authorization",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "k7a97zkuh5qtqa8h7ci6q1k6",
        "role": "user",
        "content": "In terms of central server dependencies, OTs ofen require an additional transformation sever as dependency that changes operations when multiple concurrent edit operations hit. On the other hand, YJS stores additional metadata regarding positioning and operations that allows it to merge conficts and concurrent edits deterministically. The additional metadata storage for a temporary lived YDoc inside server in mermory or Redis often leads to memory overhead. The YJS doens't require an additional dependency for sequencing operations because the the operational metadata already contains relevant informations to apply concurrent and conflict free edits deterministically. I am not much informed about OTs and how different are OTs and YJS. could you please explain it to me",
        "metadata": {
            "score": 5,
            "correctness": 5,
            "communication": {
                "clarity": 7,
                "structure": 7
            },
            "mistakes": [
                {
                    "topic": "CRDTs vs Operational Transformation Trade-offs",
                    "description": "Lacks detailed technical understanding of Operational Transformation mechanics, such as central sequence logs and transformation functions.",
                    "severity": "MEDIUM",
                    "corrected": false
                }
            ],
            "strengths": [
                "Correctly identified that Yjs and CRDTs embed positional and operation metadata to achieve deterministic state convergence without requiring a central sequencing server.",
                "Recognized that storing CRDT metadata and document history (tombstones) leads to memory overhead in memory or Redis."
            ],
            "followUpRequired": false
        },
        "createdAt": "2026-08-11T09:15:54.293Z"
    }
}

# ANSWER
{
    "answer":"The backend schema had the asset meta in two schemas, one global schema User that is used for authentication and authorization checks. The other schema is patientProfile(for patients) and doctorProfile(for doctors). The user schema is relatively tight for global user interactivity across platform including authorized access to APIs. For this, the user schema had a field Role that is queried alongwith and signed in JWT so that role of user can be passed to contollers and thus services by attaching it to req.user through a middleware for authenticated backend APIs. The route handler then firstly validate if the user is authenticated or not using a requireAuth middleware, followed by authorization checks for routes using an requireRole middleware. The system doesn;t rely on frontend to send role, instead it queries the role alongwith other meta(name email) and sign it as JWT thereby protecting APIs from attackers that use Tools like Postman etc to bypass frontend security checks. The system doesn't limit authorization to roles, it instead have checks for if a document belongs to the user trying to fetch or update it, and restricts creating, updating and deletion of medical records to doctors and similarly in other areas like updating ones own profile, booking an appointment(a user can book only for themselves and doctors are not allowed to schedule appointments from their professional accounts that have role as doctor registered with the system."
}

# EVALUATION
{
    "interview": {
        "evaluation": {
            "questionNumber": 5,
            "topic": "Backend System Architecture & Authorization",
            "score": 8,
            "correctness": 8,
            "strengths": [
                "Well-structured schema design separating central user identity from domain-specific profiles (doctorProfile, patientProfile).",
                "Correct implementation of layered route protection using authentication middleware (requireAuth) followed by role verification (requireRole).",
                "Good understanding of security fundamentals by signing roles inside server-generated JWTs to prevent client-side header or body tampering.",
                "Recognized that RBAC alone is insufficient and extended authorization to resource-level ownership checks (Attribute-Based Access Control)."
            ],
            "mistakes": [],
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "followUpRequired": true,
            "difficultyAdjustment": "same",
            "interviewerReasoning": "The candidate provided a solid, realistic explanation of their RBAC implementation using central User tables, separate profile models, middleware chains, and JWT tokens. To evaluate deeper security trade-offs, a follow-up question regarding stateless JWT permission stale claims and token revocation strategies is ideal."
        },
        "nextQuestion": "You mentioned embedding the user's role directly into the signed JWT payload to prevent client-side manipulation. Since JWTs are inherently stateless, what happens if an admin changes a user's role or revokes access while their current JWT is still valid, and how did you handle or mitigate stale token claims in your backend architecture?",
        "topic": "Backend Authorization & JWT Security",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "w7x0yuwgzvvg7ctvxa4p0bzm",
        "role": "user",
        "content": "The backend schema had the asset meta in two schemas, one global schema User that is used for authentication and authorization checks. The other schema is patientProfile(for patients) and doctorProfile(for doctors). The user schema is relatively tight for global user interactivity across platform including authorized access to APIs. For this, the user schema had a field Role that is queried alongwith and signed in JWT so that role of user can be passed to contollers and thus services by attaching it to req.user through a middleware for authenticated backend APIs. The route handler then firstly validate if the user is authenticated or not using a requireAuth middleware, followed by authorization checks for routes using an requireRole middleware. The system doesn;t rely on frontend to send role, instead it queries the role alongwith other meta(name email) and sign it as JWT thereby protecting APIs from attackers that use Tools like Postman etc to bypass frontend security checks. The system doesn't limit authorization to roles, it instead have checks for if a document belongs to the user trying to fetch or update it, and restricts creating, updating and deletion of medical records to doctors and similarly in other areas like updating ones own profile, booking an appointment(a user can book only for themselves and doctors are not allowed to schedule appointments from their professional accounts that have role as doctor registered with the system.",
        "metadata": {
            "score": 8,
            "correctness": 8,
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "mistakes": [],
            "strengths": [
                "Well-structured schema design separating central user identity from domain-specific profiles (doctorProfile, patientProfile).",
                "Correct implementation of layered route protection using authentication middleware (requireAuth) followed by role verification (requireRole).",
                "Good understanding of security fundamentals by signing roles inside server-generated JWTs to prevent client-side header or body tampering.",
                "Recognized that RBAC alone is insufficient and extended authorization to resource-level ownership checks (Attribute-Based Access Control)."
            ],
            "followUpRequired": true
        },
        "createdAt": "2026-08-11T09:31:54.201Z"
    }
}