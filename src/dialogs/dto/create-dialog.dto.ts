export class CreateDialogDto {
  content: string;
  begin: number;
  end: number;
  filename?: string;
  episode?: number;
  series: number;
}
