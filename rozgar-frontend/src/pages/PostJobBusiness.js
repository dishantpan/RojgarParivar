import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostJobBusiness() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to business dashboard since the form is built into it
    navigate('/dashboard/business');
  }, [navigate]);

  return (
    <div style={{minHeight:'100vh',background:'#F8F9FA',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <p style={{fontFamily:'DM Sans, sans-serif', color:'#415A77'}}>Redirecting to Business Dashboard...</p>
    </div>
  );
}
