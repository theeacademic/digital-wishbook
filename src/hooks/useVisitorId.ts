import { useState, useEffect } from 'react';

const VISITOR_ID_KEY = 'birthday_visitor_id';

const generateVisitorId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

export const useVisitorId = () => {
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    setVisitorId(id);
  }, []);

  return visitorId;
};

export const getVisitorId = (): string => {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
};
