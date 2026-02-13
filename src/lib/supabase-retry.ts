// AbortError 재시도 헬퍼 함수 (최적화: 빠른 재시도, 최소 지연)
export async function retryOnAbortError<T>(
  fn: () => Promise<T>,
  maxRetries: number = 1,
  delay: number = 100
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      
      // AbortError인 경우에만 재시도
      const isAbortError = 
        error &&
        typeof error === 'object' &&
        ('name' in error && error.name === 'AbortError' ||
         'message' in error && typeof error.message === 'string' && 
         (error.message.includes('aborted') || error.message.includes('AbortError')));
      
      if (isAbortError && attempt < maxRetries) {
        // 매우 짧은 지연 후 재시도 (100ms)
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // AbortError가 아니거나 재시도 횟수를 초과한 경우 에러 throw
      throw error;
    }
  }
  
  throw lastError;
}
