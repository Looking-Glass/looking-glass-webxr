export declare function LookingGlassMediaController(screenshotbutton: HTMLButtonElement): Promise<void>;
declare const resolveWhenIdle: {
    request: ((callback: IdleRequestCallback, options?: IdleRequestOptions | undefined) => number) & typeof requestIdleCallback;
    cancel: ((handle: number) => void) & typeof cancelIdleCallback;
    promise: (num: any) => Promise<unknown>;
};
export { resolveWhenIdle };
