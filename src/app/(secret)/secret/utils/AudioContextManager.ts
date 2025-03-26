/**
 * AudioContextManagerは、アプリケーション全体でAudioContextを共有するためのシングルトンクラスです。
 * AudioContextの作成と管理を一元化し、リソースの効率的な使用を促進します。
 */
class AudioContextManager {
  private static instance: AudioContextManager;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  // 音声ファイルのバッファをキャッシュ
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  private constructor() {}

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  /**
   * AudioContextを取得または作成します
   */
  public getContext(): AudioContext {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.createNodes();
      } catch (err) {
        console.error("AudioContextの作成に失敗しました", err);
        throw err;
      }
    } else if (this.audioContext.state === "closed") {
      // コンテキストが閉じていた場合は再作成
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.createNodes();
      } catch (err) {
        console.error("AudioContextの再作成に失敗しました", err);
        throw err;
      }
    }

    return this.audioContext;
  }

  /**
   * 必要なオーディオノードを作成します
   */
  private createNodes(): void {
    if (!this.audioContext) return;

    // アナライザーノードを作成
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 256;
    this.analyzer.smoothingTimeConstant = 0.8;

    // ゲインノードを作成
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1.0;

    // ノードを接続
    this.gainNode.connect(this.analyzer);
    this.analyzer.connect(this.audioContext.destination);
  }

  /**
   * 音声ファイルをロードしてバッファを返す
   */
  public async loadAudioFile(url: string): Promise<AudioBuffer> {
    // キャッシュをチェック
    if (this.audioBuffers.has(url)) {
      return this.audioBuffers.get(url)!;
    }

    try {
      const ctx = this.getContext();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch sound file: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // キャッシュに保存
      this.audioBuffers.set(url, audioBuffer);

      return audioBuffer;
    } catch (error) {
      console.error("音声ファイルのロードエラー:", error);
      throw error;
    }
  }

  /**
   * アナライザーノードを取得します
   */
  public getAnalyser(): AnalyserNode | null {
    if (!this.analyzer && this.audioContext) {
      this.createNodes();
    }
    return this.analyzer;
  }

  /**
   * ゲインノードを取得します
   */
  public getGainNode(): GainNode | null {
    if (!this.gainNode && this.audioContext) {
      this.createNodes();
    }
    return this.gainNode;
  }

  /**
   * 音量を設定します
   */
  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = volume;
    }
  }

  /**
   * オーディオソースをアナライザーとスピーカーに接続します
   */
  public connectSource(source: AudioNode): void {
    if (this.gainNode) {
      source.connect(this.gainNode);
    } else if (this.audioContext) {
      source.connect(this.audioContext.destination);
    }
  }

  /**
   * リソースをクリーンアップします
   */
  public cleanup(): void {
    this.audioBuffers.clear();
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch((err) => {
        console.error("AudioContextのクローズに失敗しました", err);
      });
      this.audioContext = null;
      this.analyzer = null;
      this.gainNode = null;
    }
  }
}

export default AudioContextManager;
