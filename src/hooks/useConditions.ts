import { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import type { Condition } from '../types/book';

interface UseConditionsResult {
  conditions: Condition[];
  error: string;
}

/** Fetches the list of selectable book conditions once on mount. */
export const useConditions = (): UseConditionsResult => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    bookService.getConditions().then(
      (data) => {
        if (active) setConditions(data);
      },
      () => {
        if (active) setError('Could not load book conditions. Please try again later.');
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return { conditions, error };
};
