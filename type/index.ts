type Feature = {
    title: string;
    image: string;
    description: string;
    icon: string;
    category: string;
};



export type { Feature };

type NavFeatures = {
    title: string;
    image: string;
    description: string;
    navigateTo: string;
    icon: string;
    category: string;
}

export type { NavFeatures };

export interface Note {
  id: string;
  title: string;
  content: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontColor: string;
  backgroundColor: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type QuizType = "mcq" | "fill" | "drag";

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer?: string;
  items?: string[];
}

export interface Quiz {
  title: string;
  type: QuizType;
  questions: QuizQuestion[];
}


export interface Moodpost {
    id: string;
    feeling: string;
    postedAt: Date;
    message: string;
} 

