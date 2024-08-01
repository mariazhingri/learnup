export interface LibrosResponse {
  reading_log_entries: {
    work: {
      title: string;
      author_names: string[];
      first_publish_year: number;
      cover_id?: number;
    };
    logged_date: string;
  }[];
}
