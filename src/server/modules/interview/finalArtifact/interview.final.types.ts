export interface TechnicalScores {
    dataStructures: number;

    algorithms: number;

    backend: number;

    databases: number;

    systemDesign: number;

    problemSolving: number;
}

export interface CommunicationScores {
    clarity: number;

    structure: number;

    conciseness: number;
}

export interface Strength {
    topic: string;

    description: string;
}

export interface Weakness {
    topic: string;

    description: string;

    severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface Mistake {
    topic: string;

    description: string;

    severity: "LOW" | "MEDIUM" | "HIGH";

    corrected: boolean;
}

export interface EvaluationArtifact {

    overallScore: number;

    technicalScore: number;

    communicationScore: number;

    technical: TechnicalScores;

    communication: CommunicationScores;

    strengths: Strength[];

    weaknesses: Weakness[];

    mistakes: Mistake[];

    behaviouralObservations: string[];

    recommendations: string[];

    interviewSummary: string;
}