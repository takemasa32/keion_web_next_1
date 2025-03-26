export interface AudioSample {
  id: string;
  name: string;
  category: string;
  file: string;
  color: string;
  description?: string;
  tags?: string[];
  duration?: number; // 秒単位
}

export type SampleCategory = {
  id: string;
  name: string;
  description?: string;
  color: string;
  samples: AudioSample[];
};
