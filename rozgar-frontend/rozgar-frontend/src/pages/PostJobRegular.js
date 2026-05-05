import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* PostJobRegular now redirects to the dashboard which has the full post job form built-in */
export default function PostJobRegular() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/dashboard/regular'); }, [navigate]);
  return null;
}
