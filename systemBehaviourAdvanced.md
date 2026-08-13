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
        "question": "In your resume, you mentioned building AI-powered platforms using Retrieval-Augmented Generation (RAG). Could you explain the core components of a RAG pipeline and why vector retrieval is used before passing context to an LLM?",
        "topic": "RAG",
        "difficulty": "medium"
    }
}

# ANSWER and EVALUATION
{
   "answer": "A RAG pipeline usually starts with the user's question, then we create an embedding for the question and use that to search a vector database for similar documents or chunks. Those chunks are then given to the LLM along with the original question so it can generate a more grounded answer. The reason for vector retrieval is that the LLM itself doesn't have our private application data, so we retriev the relevant information first. I think the important part is that the retrieved documents are effectively use to fine-tune the LLM for that particular question, so the model can learn the retrieved context befor generating the response."
}

{
    "interview": {
        "evaluation": {
            "questionNumber": 1,
            "topic": "RAG",
            "score": 6,
            "correctness": 6,
            "strengths": [
                "Correctly articulated the end-to-end pipeline of embedding queries, vector store searching, and grounding LLM prompts with retrieved chunks",
                "Understood the purpose of vector retrieval for fetching relevant application context"
            ],
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning",
                    "description": "Claimed that retrieved documents fine-tune the LLM for each query, confusing in-context prompt injection with model parameter fine-tuning.",
                    "severity": "HIGH",
                    "corrected": false
                }
            ],
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "followUpRequired": true,
            "difficultyAdjustment": "same",
            "feedback": "You clearly explained the step-by-step flow of embedding questions, searching vector databases, and supplying context chunks to the LLM. However, RAG does not fine-tune the LLM. Fine-tuning permanently updates the model's internal parameter weights, whereas RAG injects retrieved context directly into the prompt within the LLM's context window without changing any weights.",
            "interviewerReasoning": "The candidate has a solid high-level operational understanding of RAG pipelines, but holds a critical misconception regarding fine-tuning vs context window retrieval. A follow-up question is required to evaluate their understanding of context windows and weight updates."
        },
        "nextQuestion": "You mentioned that retrieved documents fine-tune the LLM for a specific query. How does passing context into a prompt differ from fine-tuning a model, and what role does the context window play?",
        "topic": "RAG",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "uzpnxrglzt9w1uddw9ojbasm",
        "role": "user",
        "content": "A RAG pipeline usually starts with the user's question, then we create an embedding for the question and use that to search a vector database for similar documents or chunks. Those chunks are then given to the LLM along with the original question so it can generate a more grounded answer. The reason for vector retrieval is that the LLM itself doesn't have our private application data, so we retrieve the relevant information first. I think the important part is that the retrieved documents are effectively used to fine-tune the LLM for that particular question, so the model can learn the retrieved context before generating the response.",
        "metadata": {
            "score": 6,
            "correctness": 6,
            "communication": {
                "clarity": 8,
                "structure": 8
            },
            "mistakes": [
                {
                    "topic": "RAG vs Fine-Tuning",
                    "description": "Claimed that retrieved documents fine-tune the LLM for each query, confusing in-context prompt injection with model parameter fine-tuning.",
                    "severity": "HIGH",
                    "corrected": false
                }
            ],
            "strengths": [
                "Correctly articulated the end-to-end pipeline of embedding queries, vector store searching, and grounding LLM prompts with retrieved chunks",
                "Understood the purpose of vector retrieval for fetching relevant application context"
            ],
            "feedback": "You clearly explained the step-by-step flow of embedding questions, searching vector databases, and supplying context chunks to the LLM. However, RAG does not fine-tune the LLM. Fine-tuning permanently updates the model's internal parameter weights, whereas RAG injects retrieved context directly into the prompt within the LLM's context window without changing any weights.",
            "followUpRequired": true
        },
        "createdAt": "2026-08-13T15:39:07.596Z"
    }
}

=> interview turn evaluation
{
  evaluation: {
    questionNumber: 1,
    topic: 'RAG',
    score: 6,
    correctness: 6,
    strengths: [
      'Correctly articulated the end-to-end pipeline of embedding queries, vector store searching, and grounding LLM prompts with retrieved chunks',
      'Understood the purpose of vector retrieval for fetching relevant application context'
    ],
    mistakes: [ [Object] ],
    communication: { clarity: 8, structure: 8 },
    followUpRequired: true,
    difficultyAdjustment: 'same',
    feedback: "You clearly explained the step-by-step flow of embedding questions, searching vector databases, and supplying context chunks to the LLM. However, RAG does not fine-tune the LLM. Fine-tuning permanently updates the model's internal parameter weights, whereas RAG injects retrieved context directly into the prompt within the LLM's context window without changing any weights.",
    interviewerReasoning: 'The candidate has a solid high-level operational understanding of RAG pipelines, but holds a critical misconception regarding fine-tuning vs context window retrieval. A follow-up question is required to evaluate their understanding of context windows and weight updates.'
  },
  nextQuestion: {
    questionType: 'FOLLOW_UP',
    question: 'You mentioned that retrieved documents fine-tune the LLM for a specific query. How does passing context into a prompt differ from fine-tuning a model, and what role does the context window play?',
    topic: 'RAG',
    difficulty: 'medium',
    expectedCompetencies: [
      'Context window limitations of LLMs',
      'Distinction between RAG context insertion and Fine-Tuning'
    ]
  }
}

=> advanced interview state
{
  sessionId: 'cmsrojpmb00120nqofbibjisc',
  interviewPlan: {
    role: 'Full-Stack & AI Engineer',
    difficulty: 'medium',
    estimatedQuestions: 10,
    topics: [
      'RAG',
      'Socket.io',
      'YJS',
      'Redis',
      'background jobs with BullMQ, queues, workers'
    ]
  },
  currentQuestion: {
    questionType: 'FOLLOW_UP',
    question: 'You mentioned that retrieved documents fine-tune the LLM for a specific query. How does passing context into a prompt differ from fine-tuning a model, and what role does the context window play?',
    topic: 'RAG',
    difficulty: 'medium',
    expectedCompetencies: [
      'Context window limitations of LLMs',
      'Distinction between RAG context insertion and Fine-Tuning'
    ]
  },
  questionNumber: 2,
  currentTopic: 'RAG',
  difficulty: 'medium',
  runtimeObservations: {
    repeatedMistakes: [ [Object] ],
    correctedMistakes: [],
    hintsGiven: 0,
    topicsCovered: [ 'RAG' ],
    skippedQuestions: 0
  },
  startedAt: '2026-08-13T15:35:32.969Z',
  expiresAt: '2026-08-13T17:35:32.969Z'
}

# ANSWER and EVALUATION
{
    "answer":"RAG doesn't fine-tune the model. The retrieved chunks are added to the prompt as context for that particular request, so the model parameters aren't changed. The context window limits how much of that retrieved information, along with the conversation and instructions, can be processed in one request. Fine-tuning is different because it changes the model's weights through training data rather than just providing information at inference time."
}

{
    "interview": {
        "evaluation": {
            "questionNumber": 2,
            "topic": "RAG",
            "score": 10,
            "correctness": 10,
            "strengths": [
                "Correctly differentiated RAG context insertion at inference from parameter fine-tuning during training",
                "Accurately explained that context windows bound the prompt payload, including conversation history and retrieved context"
            ],
            "mistakes": [],
            "communication": {
                "clarity": 10,
                "structure": 10
            },
            "followUpRequired": false,
            "difficultyAdjustment": "same",
            "feedback": "You completely corrected your previous explanation. You accurately highlighted that RAG inserts retrieved context into the prompt within the context window limits at inference time without modifying model weights, whereas fine-tuning alters model parameters through training.",
            "interviewerReasoning": "The candidate answered the follow-up question perfectly, demonstrating a clear understanding of the distinction between in-context learning/RAG and model fine-tuning, as well as the role of the context window. The previous misconception has been resolved."
        },
        "nextQuestion": "In your collaborative editor project TeamHub, you used Yjs. Why did you opt for Conflict-free Replicated Data Types (CRDTs) over Operational Transformation (OT), and how do CRDTs achieve eventual consistency in real-time applications?",
        "topic": "CRDTs vs OT",
        "difficulty": "medium"
    },
    "evaluatedAnswer": {
        "id": "mom79gnb2g9apr8nlrboz7j7",
        "role": "user",
        "content": "RAG doesn't fine-tune the model. The retrieved chunks are added to the prompt as context for that particular request, so the model parameters aren't changed. The context window limits how much of that retrieved information, along with the conversation and instructions, can be processed in one request. Fine-tuning is different because it changes the model's weights through training data rather than just providing information at inference time.",
        "metadata": {
            "score": 10,
            "correctness": 10,
            "communication": {
                "clarity": 10,
                "structure": 10
            },
            "mistakes": [],
            "strengths": [
                "Correctly differentiated RAG context insertion at inference from parameter fine-tuning during training",
                "Accurately explained that context windows bound the prompt payload, including conversation history and retrieved context"
            ],
            "feedback": "You completely corrected your previous explanation. You accurately highlighted that RAG inserts retrieved context into the prompt within the context window limits at inference time without modifying model weights, whereas fine-tuning alters model parameters through training.",
            "followUpRequired": false
        },
        "createdAt": "2026-08-13T15:45:42.824Z"
    }
}

=> interview turn evaluation
{
  evaluation: {
    questionNumber: 2,
    topic: 'RAG',
    score: 10,
    correctness: 10,
    strengths: [
      'Correctly differentiated RAG context insertion at inference from parameter fine-tuning during training',
      'Accurately explained that context windows bound the prompt payload, including conversation history and retrieved context'
    ],
    mistakes: [],
    communication: { clarity: 10, structure: 10 },
    followUpRequired: false,
    difficultyAdjustment: 'same',
    feedback: 'You completely corrected your previous explanation. You accurately highlighted that RAG inserts retrieved context into the prompt within the context window limits at inference time without modifying model weights, whereas fine-tuning alters model parameters through training.',
    interviewerReasoning: 'The candidate answered the follow-up question perfectly, demonstrating a clear understanding of the distinction between in-context learning/RAG and model fine-tuning, as well as the role of the context window. The previous misconception has been resolved.'
  },
  nextQuestion: {
    questionType: 'NEW_QUESTION',
    question: 'In your collaborative editor project TeamHub, you used Yjs. Why did you opt for Conflict-free Replicated Data Types (CRDTs) over Operational Transformation (OT), and how do CRDTs achieve eventual consistency in real-time applications?',
    topic: 'CRDTs vs OT',
    difficulty: 'medium',
    expectedCompetencies: [
      'Understanding CRDT state-based vs operation-based convergence',
      'Trade-offs between OT and CRDTs in real-time collaboration',
      'Decentralized vs centralized concurrency control'
    ]
  }
}

=> advanced interview state
{
  sessionId: 'cmsrojpmb00120nqofbibjisc',
  interviewPlan: {
    role: 'Full-Stack & AI Engineer',
    difficulty: 'medium',
    estimatedQuestions: 10,
    topics: [
      'RAG',
      'Socket.io',
      'YJS',
      'Redis',
      'background jobs with BullMQ, queues, workers'
    ]
  },
  currentQuestion: {
    questionType: 'NEW_QUESTION',
    question: 'In your collaborative editor project TeamHub, you used Yjs. Why did you opt for Conflict-free Replicated Data Types (CRDTs) over Operational Transformation (OT), and how do CRDTs achieve eventual consistency in real-time applications?',
    topic: 'CRDTs vs OT',
    difficulty: 'medium',
    expectedCompetencies: [
      'Understanding CRDT state-based vs operation-based convergence',
      'Trade-offs between OT and CRDTs in real-time collaboration',
      'Decentralized vs centralized concurrency control'
    ]
  },
  questionNumber: 3,
  currentTopic: 'CRDTs vs OT',
  difficulty: 'medium',
  runtimeObservations: {
    repeatedMistakes: [ [Object] ],
    correctedMistakes: [],
    hintsGiven: 0,
    topicsCovered: [ 'RAG' ],
    skippedQuestions: 0
  },
  startedAt: '2026-08-13T15:35:32.969Z',
  expiresAt: '2026-08-13T17:35:32.969Z'
}