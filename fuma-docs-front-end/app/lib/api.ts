export interface DocItem {
  id: string;
  content: string; // filename.mdx
}

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Fetch all available documents from the backend
 */
export const getDocsList = async (): Promise<DocItem[]> => {
  try {
    const response = await fetch('/llm-response/getall');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch docs list: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching docs list:', error);
    throw new Error('Failed to fetch documents list');
  }
};

/**
 * Fetch a specific document by ID from the backend
 */
export const getDocById = async (id: string): Promise<string> => {
  try {
    const response = await fetch(`/llm-response/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Document not found');
      }
      throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
    }
    
    const mdxContent = await response.text();
    return mdxContent;
  } catch (error) {
    console.error(`Error fetching doc ${id}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch document');
  }
};

/**
 * Check if the backend is available
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('/llm-response/getall', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};
