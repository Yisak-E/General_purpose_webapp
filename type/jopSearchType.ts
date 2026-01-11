export interface JSearchJob {
  // Employer
  employer_name: string | null;
  employer_logo?: string | null;
  employer_website?: string | null;
  employer_company_type?: string | null;
  employer_linkedin?: string | null;

  // Job identity
  job_id: string;
  job_title: string;
  job_publisher?: string | null;
  job_employment_type?: string | null;

  // Apply info
  job_apply_link?: string | null;
  job_apply_is_direct?: boolean | null;
  job_apply_quality_score?: number | null;

  apply_options?: Array<{
    publisher?: string | null;
    apply_link?: string | null;
    is_direct?: boolean | null;
  }>;

  // Job content
  job_description?: string | null;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  } | null;

  job_benefits?: string[] | null;

  // Location
  job_city?: string | null;
  job_state?: string | null;
  job_country?: string | null;
  job_latitude?: number | null;
  job_longitude?: number | null;

  // Dates
  job_posted_at_timestamp?: number | null;
  job_posted_at_datetime_utc?: string | null;

  // Salary
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;

  // Requirements
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number | null;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  } | null;

  job_required_skills?: string[] | null;

  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_certification?: boolean;
    high_school?: boolean;
    associates_degree?: boolean;
    bachelors_degree?: boolean;
    degree_mentioned?: boolean;
    degree_preferred?: boolean;
  } | null;

  // Misc
  job_google_link?: string | null;
  job_offer_expiration_datetime_utc?: string | null;
  job_offer_expiration_timestamp?: number | null;
}



export interface JopSearchType {
    name: string;
    skill: string[] | string;
    location: string;
    date_posted?: string| "anytime";
    country: string;
}