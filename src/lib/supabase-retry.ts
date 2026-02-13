// AbortError 재시도 헬퍼 함수
export async function retryOnAbortError<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 500
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      
      // AbortError인 경우에만 재시도
      if (
        error &&
        typeof error === 'object' &&
        ('name' in error && error.name === 'AbortError' ||
         'message' in error && typeof error.message === 'string' && error.message.includes('aborted'))
      ) {
        if (attempt < maxRetries) {
          // 짧은 지연 후 재시도
          await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
          continue;
        }
      }
      
      // AbortError가 아니거나 재시도 횟수를 초과한 경우 에러 throw
      throw error;
    }
  }
  
  throw lastError;
}
