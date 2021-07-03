export class CreateSeriesDto {
  name: string;
  name_cn: string | null;
  description: string | null;
  air_date: Date | null;
  episodes: number | null;
}
