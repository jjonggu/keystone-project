export type NoticeType = "event" | "maintenance" | "newTheme";

export interface Notice {
  id: number;
  title: string;
  content: string;
  noticeType: NoticeType;
  noticeDate: string;
}